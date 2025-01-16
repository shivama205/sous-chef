import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Calculator, Save } from "lucide-react";

interface MacroResults {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [results, setResults] = useState<MacroResults | null>(null);

  const calculateMacros = () => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageYears = parseFloat(age);

    if (!weightKg || !heightCm || !ageYears) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    let tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Adjust based on goal
    switch (goal) {
      case "lose":
        tdee *= 0.8; // 20% deficit
        break;
      case "gain":
        tdee *= 1.2; // 20% surplus
        break;
    }

    const macros: MacroResults = {
      calories: Math.round(tdee),
      protein: Math.round((tdee * 0.3) / 4), // 30% protein
      carbs: Math.round((tdee * 0.4) / 4), // 40% carbs
      fat: Math.round((tdee * 0.3) / 9), // 30% fat
    };

    setResults(macros);
  };

  const saveMacros = async () => {
    if (!results) return;

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Create an account to save your macro goals and get personalized meal plans!",
        action: (
          <Button variant="default" onClick={() => {/* Add sign in logic */}}>
            Sign In
          </Button>
        ),
      });
      return;
    }

    const { error } = await supabase
      .from('user_macros')
      .upsert({
        user_id: session.user.id,
        ...results,
        last_updated: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save macro goals. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your macro goals have been saved!",
      });
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 text-primary">
          <Calculator className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Macro Calculator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="kg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="cm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
                <SelectItem value="light">Light Exercise (1-2 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate Exercise (3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                <SelectItem value="veryActive">Very Active (physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={calculateMacros} className="flex-1">
            Calculate Macros
          </Button>
          {results && (
            <Button onClick={saveMacros} variant="secondary" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Results
            </Button>
          )}
        </div>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 rounded-lg space-y-2"
          >
            <h3 className="font-semibold text-primary">Your Daily Targets:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-xl font-semibold">{results.calories}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-xl font-semibold">{results.protein}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-xl font-semibold">{results.carbs}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="text-xl font-semibold">{results.fat}g</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}