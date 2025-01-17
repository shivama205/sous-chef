import { supabase } from '@/lib/supabase'
import type { GroceryList, GroceryItem } from '@/types/macros'
import type { MealPlan } from '@/types/mealPlan'

export async function createGroceryList(mealPlanId: string, items: Omit<GroceryItem, 'id' | 'grocery_list_id' | 'created_at' | 'updated_at'>[]) {
  const { data: list, error: listError } = await supabase
    .from('grocery_lists')
    .insert({
      meal_plan_id: mealPlanId,
      name: 'Shopping List'
    })
    .select()
    .single()

  if (listError) throw new Error('Failed to create grocery list')

  const { error: itemsError } = await supabase
    .from('grocery_list_items')
    .insert(
      items.map(item => ({
        ...item,
        grocery_list_id: list.id
      }))
    )

  if (itemsError) throw new Error('Failed to add grocery items')

  return list
}

export async function getGroceryList(listId: string) {
  const { data: list, error: listError } = await supabase
    .from('grocery_lists')
    .select('*')
    .eq('id', listId)
    .single()

  if (listError) throw new Error('Failed to fetch grocery list')

  const { data: items, error: itemsError } = await supabase
    .from('grocery_list_items')
    .select('*')
    .eq('grocery_list_id', listId)
    .order('category', { ascending: true })

  if (itemsError) throw new Error('Failed to fetch grocery items')

  return { ...list, items }
}

export async function updateGroceryItem(itemId: string, updates: Partial<GroceryItem>) {
  const { error } = await supabase
    .from('grocery_list_items')
    .update(updates)
    .eq('id', itemId)

  if (error) throw new Error('Failed to update grocery item')
}

export async function addGroceryItem(listId: string, item: Omit<GroceryItem, 'id' | 'grocery_list_id' | 'created_at' | 'updated_at'>) {
  const { error } = await supabase
    .from('grocery_list_items')
    .insert({
      ...item,
      grocery_list_id: listId,
      custom_added: true
    })

  if (error) throw new Error('Failed to add grocery item')
}

export async function deleteGroceryItem(itemId: string) {
  const { error } = await supabase
    .from('grocery_list_items')
    .delete()
    .eq('id', itemId)

  if (error) throw new Error('Failed to delete grocery item')
}

export function generateGroceryListPrompt(meals: MealPlan) {
  return `Based on these meals, create a comprehensive grocery list organized by categories. For each meal:
${JSON.stringify(meals, null, 2)}

Please generate a list of ingredients needed, organized by category (e.g., Produce, Meat, Dairy, etc.).
For each item include:
- Name
- Category
- Approximate quantity needed
- Unit of measurement where applicable

Format the response as a JSON array of objects with these properties:
name, category, quantity, unit

Categories should be one of: Produce, Meat & Seafood, Dairy & Eggs, Pantry, Spices & Seasonings, Frozen, Bakery, Other`
}

export async function generateGroceryList(meals: MealPlan): Promise<Omit<GroceryItem, 'id' | 'grocery_list_id' | 'created_at' | 'updated_at'>[]> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: generateGroceryListPrompt(meals)
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate grocery list')
  }

  interface GeneratedItem {
    name: string;
    category: string;
    quantity?: string;
    unit?: string;
  }
  
  const data = await response.json()
  
  return data.map((item: GeneratedItem) => ({
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    checked: false,
    notes: '',
    custom_added: false
  }))
} 