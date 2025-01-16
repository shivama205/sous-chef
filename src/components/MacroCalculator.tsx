import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Calculator, Save } from "lucide-react";
import type { UserMacros, MacroResults } from "@/types/macros";
import { ChevronDown } from "lucide-react";

interface MacroCalculatorProps {
  onSaveMacros?: (macros: MacroResults) => void;
}

export function MacroCalculator({ onSaveMacros }: MacroCalculatorProps) {
  const [age, setAge] = useState(() => localStorage.getItem('macro_calc_age') || "");
  const [weight, setWeight] = useState(() => localStorage.getItem('macro_calc_weight') || "");
  const [height, setHeight] = useState(() => localStorage.getItem('macro_calc_height') || "");
  const [gender, setGender] = useState<"male" | "female">(() => 
    (localStorage.getItem('macro_calc_gender') as "male" | "female") || "male"
  );
  const [activityLevel, setActivityLevel] = useState(() => 
    localStorage.getItem('macro_calc_activity') || "moderate"
  );
  const [goal, setGoal] = useState(() => localStorage.getItem('macro_calc_goal') || "maintain");
  const [showPerMealTargets, setShowPerMealTargets] = useState(false);
  const [results, setResults] = useState<MacroResults | null>(null);
  const [savedMacros, setSavedMacros] = useState<UserMacros | null>(null);

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('macro_calc_age', age);
    localStorage.setItem('macro_calc_weight', weight);
    localStorage.setItem('macro_calc_height', height);
    localStorage.setItem('macro_calc_gender', gender);
    localStorage.setItem('macro_calc_activity', activityLevel);
    localStorage.setItem('macro_calc_goal', goal);
  }, [age, weight, height, gender, activityLevel, goal]);

  useEffect(() => {
    loadSavedMacros();
  }, []);

  const loadSavedMacros = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('user_macros')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Error loading saved macros:', error);
      return;
    }

    if (data) {
      setSavedMacros(data);
      setResults({
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat
      });
    }
  };

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const calculateMacros = () => {
    if (!age || !weight || !height) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // BMR calculation using Mifflin-St Jeor Equation
    let bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age);
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
        tdee *= 0.85; // 15% deficit
        break;
      case "gain":
        tdee *= 1.15; // 15% surplus
        break;
    }

    const newResults = {
      calories: Math.round(tdee),
      protein: Math.round(parseFloat(weight) * 2), // 2g per kg bodyweight
      carbs: Math.round((tdee * 0.4) / 4), // 40% of calories from carbs
      fat: Math.round((tdee * 0.3) / 9), // 30% of calories from fat
    };

    // Save to localStorage
    localStorage.setItem('calculated_macros', JSON.stringify(newResults));
    
    // Animate out old results if they exist
    if (results) {
      const element = document.querySelector('.macro-results');
      if (element) {
        element.classList.add('fade-out');
        setTimeout(() => {
          setResults(newResults);
          element.classList.remove('fade-out');
          element.classList.add('fade-in');
          setTimeout(() => {
            element.classList.remove('fade-in');
          }, 500);
        }, 300);
      } else {
        setResults(newResults);
      }
    } else {
      setResults(newResults);
    }

    // After calculation, scroll to results
    setTimeout(() => {
      scrollToElement('macro-results');
    }, 100);
  };

  // Load calculated macros from localStorage on mount
  useEffect(() => {
    const savedCalculatedMacros = localStorage.getItem('calculated_macros');
    if (savedCalculatedMacros) {
      setResults(JSON.parse(savedCalculatedMacros));
    }
  }, []);

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

    // Check if user already has macros saved
    const { data: existingMacros } = await supabase
      .from('user_macros')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    const macroData = {
      user_id: session.user.id,
      calories: results.calories,
      protein: results.protein,
      carbs: results.carbs,
      fat: results.fat,
      last_updated: new Date().toISOString(),
      // Save user inputs
      user_inputs: {
        age,
        weight,
        height,
        gender,
        activity_level: activityLevel,
        goal
      }
    };

    let error;
    if (existingMacros) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_macros')
        .update(macroData)
        .eq('id', existingMacros.id);
      error = updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_macros')
        .insert([macroData]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving macros:', error);
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
      setSavedMacros(existingMacros ? { ...existingMacros, ...macroData } : macroData);
      
      // Trigger save animation and callback
      const element = document.querySelector('.macro-results');
      if (element) {
        element.classList.add('save-flash');
        setTimeout(() => {
          element.classList.remove('save-flash');
          onSaveMacros?.(results);
          // After saving, trigger scroll to preferences form
          scrollToElement('preferences-form');
        }, 600);
      } else {
        onSaveMacros?.(results);
        scrollToElement('preferences-form');
      }
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-6">
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

        <div id="macro-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div id="macro-results" className="space-y-4 macro-results">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary">
                  {showPerMealTargets ? "Your Per Meal Targets:" : "Your Daily Targets:"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPerMealTargets(!showPerMealTargets)}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {showPerMealTargets ? "Show Daily Totals" : "Show Per Meal"}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showPerMealTargets ? "rotate-180" : ""}`} />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {showPerMealTargets ? "Calories per Meal" : "Daily Calories"}
                  </p>
                  <p className="text-xl font-semibold">
                    {showPerMealTargets ? Math.round(results.calories / 5) : results.calories}
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {showPerMealTargets ? "Protein per Meal" : "Daily Protein"}
                  </p>
                  <p className="text-xl font-semibold">
                    {showPerMealTargets ? Math.round(results.protein / 5) : results.protein}g
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {showPerMealTargets ? "Carbs per Meal" : "Daily Carbs"}
                  </p>
                  <p className="text-xl font-semibold">
                    {showPerMealTargets ? Math.round(results.carbs / 5) : results.carbs}g
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {showPerMealTargets ? "Fat per Meal" : "Daily Fat"}
                  </p>
                  <p className="text-xl font-semibold">
                    {showPerMealTargets ? Math.round(results.fat / 5) : results.fat}g
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button onClick={saveMacros} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Results
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <style>{`
        @keyframes saveFlash {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.02);
            filter: brightness(1.1);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }

        .save-flash {
          animation: saveFlash 0.6s ease-in-out;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </Card>
  );
}