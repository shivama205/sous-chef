export interface MacroResults {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface UserInputs {
  age: string;
  weight: string;
  height: string;
  gender: "male" | "female";
  activityLevel: string;
  goal: string;
}

export interface UserMacros {
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  last_updated: string;
  // User input fields
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  fitness_goal?: 'lose' | 'maintain' | 'gain';
  // Keep user_inputs for backward compatibility during migration
  user_inputs?: UserInputs;
}

export interface GroceryItem {
  id: string;
  grocery_list_id: string;
  name: string;
  category: string;
  quantity?: string;
  unit?: string;
  checked: boolean;
  notes?: string;
  custom_added: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroceryList {
  id: string;
  user_id: string;
  meal_plan_id: string;
  name: string;
  is_synced_externally: boolean;
  external_service_id?: string;
  created_at: string;
  updated_at: string;
  items?: GroceryItem[]; // For when we join with items
}