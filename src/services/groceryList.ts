import { supabase } from '@/lib/supabase'
import type { GroceryList, GroceryItem } from '@/types/macros'
import type { MealPlan } from '@/types/mealPlan'
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function createGroceryList(mealPlanId: string, items: Omit<GroceryItem, 'id' | 'grocery_list_id' | 'created_at' | 'updated_at'>[]) {
  if (!mealPlanId) {
    throw new Error('meal_plan_id is required');
  }

  const { data: list, error: listError } = await supabase
    .from('grocery_lists')
    .insert({
      meal_plan_id: mealPlanId,
      name: 'Shopping List',
      user_id: (await supabase.auth.getSession()).data.session?.user?.id
    })
    .select()
    .single();

  if (listError) {
    console.error('Error creating grocery list:', listError);
    throw new Error('Failed to create grocery list');
  }

  if (!list) {
    throw new Error('Failed to create grocery list - no list returned');
  }

  const { error: itemsError } = await supabase
    .from('grocery_list_items')
    .insert(
      items.map(item => ({
        ...item,
        grocery_list_id: list.id
      }))
    );

  if (itemsError) {
    console.error('Error adding grocery items:', itemsError);
    throw new Error('Failed to add grocery items');
  }

  return list;
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
- Name (required)
- Category (must be one of: Produce, Meat & Seafood, Dairy & Eggs, Pantry, Spices & Seasonings, Frozen, Bakery, Other)
- Quantity (optional, e.g., "2" or "500")
- Unit (optional, e.g., "pieces", "g", "oz", "cups")

Format the response as a JSON array of objects with these properties:
name, category, quantity, unit

Example response:
[
  {
    "name": "Chicken Breast",
    "category": "Meat & Seafood",
    "quantity": "2",
    "unit": "lbs"
  },
  {
    "name": "Spinach",
    "category": "Produce",
    "quantity": "500",
    "unit": "g"
  }
]`;
}

interface GeneratedItem {
  name: string;
  category: string;
  quantity?: string;
  unit?: string;
}

const VALID_CATEGORIES = [
  "Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Pantry",
  "Spices & Seasonings",
  "Frozen",
  "Bakery",
  "Other"
] as const;

export async function generateGroceryList(meals: MealPlan): Promise<Omit<GroceryItem, 'id' | 'grocery_list_id' | 'created_at' | 'updated_at'>[]> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = generateGroceryListPrompt(meals);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || [null, text];
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    
    const data = JSON.parse(jsonString) as GeneratedItem[];

    return data.map((item: GeneratedItem) => ({
      name: item.name.trim(),
      category: VALID_CATEGORIES.includes(item.category as any) ? item.category : "Other",
      quantity: item.quantity && item.unit ? `${item.quantity} ${item.unit}`.trim() : item.quantity?.trim(),
      notes: '',
      checked: false,
      custom_added: false
    }));
  } catch (error) {
    console.error("Error generating grocery list:", error);
    throw new Error('Failed to generate grocery list');
  }
} 