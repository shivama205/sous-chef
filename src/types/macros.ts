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
  user_inputs?: UserInputs;
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