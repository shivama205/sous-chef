import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserMacros } from "@/types/macros";

interface MacroCalculatorProps {
  onSaveMacros: (macros: UserMacros) => void;
  isLoading?: boolean;
}

interface InputError {
  age?: string;
  weight?: string;
  height?: string;
}

const activityLevels = {
  sedentary: { label: "Sedentary", description: "Little or no exercise, desk job" },
  light: { label: "Light Activity", description: "Light exercise 1-3 days/week" },
  moderate: { label: "Moderate Activity", description: "Moderate exercise 3-5 days/week" },
  active: { label: "Very Active", description: "Heavy exercise 6-7 days/week" },
  veryActive: { label: "Extremely Active", description: "Very heavy exercise, physical job, training 2x/day" }
};

const goals = {
  lose: { label: "Lose Weight", description: "500 calorie deficit per day" },
  maintain: { label: "Maintain Weight", description: "Maintain current weight" },
  gain: { label: "Gain Weight", description: "500 calorie surplus per day" }
};

export function MacroCalculator({ onSaveMacros, isLoading = false }: MacroCalculatorProps) {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [goal, setGoal] = useState("maintain");
  const [errors, setErrors] = useState<InputError>({});
  const [calculatedMacros, setCalculatedMacros] = useState<UserMacros | null>(null);

  const validateInputs = (): boolean => {
    const newErrors: InputError = {};
    
    if (!age || parseInt(age) < 15 || parseInt(age) > 100) {
      newErrors.age = "Age must be between 15 and 100";
    }
    
    if (!weight || parseFloat(weight) < 30 || parseFloat(weight) > 300) {
      newErrors.weight = "Weight must be between 30 and 300 kg";
    }
    
    if (!height || parseFloat(height) < 100 || parseFloat(height) > 250) {
      newErrors.height = "Height must be between 100 and 250 cm";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMacros = () => {
    if (!validateInputs()) return;

    // Basic BMR calculation using Mifflin-St Jeor Equation
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseInt(age);

    let bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    // Activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Adjust based on goal
    const goalAdjustments = {
      lose: -500,
      maintain: 0,
      gain: 500
    };

    const targetCalories = Math.round(tdee + goalAdjustments[goal as keyof typeof goalAdjustments]);

    // Calculate macros
    const protein = Math.round(weightInKg * 2); // 2g per kg of bodyweight
    const fat = Math.round((targetCalories * 0.25) / 9); // 25% of calories from fat
    const carbs = Math.round((targetCalories - (protein * 4 + fat * 9)) / 4); // Remaining calories from carbs

    const macros: UserMacros = {
      user_id: "", // This will be set by the parent component
      calories: targetCalories,
      protein,
      carbs,
      fat,
      last_updated: new Date().toISOString(),
      age: ageInYears,
      weight: weightInKg,
      height: heightInCm,
      gender,
      activity_level: activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive',
      fitness_goal: goal as 'lose' | 'maintain' | 'gain',
      user_inputs: {
        age,
        weight,
        height,
        gender,
        activityLevel,
        goal
      }
    };

    setCalculatedMacros(macros);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMacros();
  };

  const handleSave = () => {
    if (calculatedMacros) {
      onSaveMacros(calculatedMacros);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {!calculatedMacros ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Age Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your age (15-100 years)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="15"
                  max="100"
                  disabled={isLoading}
                  className={errors.age ? "border-destructive" : ""}
                />
                {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your weight in kilograms (30-300 kg)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  disabled={isLoading}
                  className={errors.weight ? "border-destructive" : ""}
                />
                {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
              </div>

              {/* Height Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your height in centimeters (100-250 cm)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                  min="100"
                  max="250"
                  disabled={isLoading}
                  className={errors.height ? "border-destructive" : ""}
                />
                {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value as "male" | "female")}
                  className="flex gap-4"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Activity Level Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select your typical activity level</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select 
                  value={activityLevel} 
                  onValueChange={setActivityLevel}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLevels).map(([value, { label, description }]) => (
                      <SelectItem key={value} value={value}>
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">{description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Goal Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select your fitness goal</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select 
                  value={goal} 
                  onValueChange={setGoal}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(goals).map(([value, { label, description }]) => (
                      <SelectItem key={value} value={value}>
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">{description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Calculate Macros'
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Daily Calories</p>
                <p className="text-xl font-semibold text-primary">{calculatedMacros.calories}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-xl font-semibold text-primary">{calculatedMacros.protein}g</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-xl font-semibold text-primary">{calculatedMacros.carbs}g</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="text-xl font-semibold text-primary">{calculatedMacros.fat}g</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setCalculatedMacros(null)}
              >
                Recalculate
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Macros'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}