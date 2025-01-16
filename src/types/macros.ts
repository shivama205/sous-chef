export interface UserMacros {
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  last_updated: string;
}

export interface GroceryList {
  id: string;
  user_id: string;
  meal_plan_id: string;
  items: {
    id: string;
    name: string;
    category: string;
    checked: boolean;
    quantity?: string;
  }[];
  created_at: string;
}