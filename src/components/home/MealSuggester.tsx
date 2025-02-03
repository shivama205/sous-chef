import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StandardButton } from "@/components/ui/StandardButton";
import { Loader2, Utensils, Heart, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CuisineSelector } from "@/components/preferences/CuisineSelector";
import { Cuisine } from "@/types/preferences";

const moods = [
  { value: "happy", label: "On Cloud Nine! 🌟" },
  { value: "energetic", label: "Ready to Conquer! 💪" },
  { value: "tired", label: "Need a Pick-me-up 😴" },
  { value: "stressed", label: "Comfort Food Please! 🫂" },
  { value: "adventurous", label: "Feeling Wild! 🌶️" },
  { value: "healthy", label: "Health Kick Mode 🥗" },
];

export function MealSuggester() {
  const [mood, setMood] = useState<string>("");
  const [cuisinePreferences, setCuisinePreferences] = useState<Cuisine[]>([]);
  const [craving, setCraving] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/suggest-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood,
          cuisinePreferences,
          craving,
        }),
      });

      if (!response.ok) throw new Error("Failed to get suggestion");

      const data = await response.json();
      toast({
        title: "Yummy suggestion incoming! 🎉",
        description: data.suggestion,
      });
    } catch (error) {
      console.error("Error suggesting meal:", error);
      toast({
        title: "Oops! Our chef is having a moment 👨‍🍳",
        description: "Please try again in a bit!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Utensils className="w-6 h-6" />
            Let's Find Your Perfect Meal!
          </h3>
          <p className="text-muted-foreground">
            Tell us how you're feeling, and we'll whip up something special! ✨
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Smile className="w-4 h-4 text-primary" />
              What's Your Mood Today?
            </label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick your vibe..." />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Any Specific Cravings?
            </label>
            <Input
              placeholder="Something spicy? Sweet? Crispy?"
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <CuisineSelector
              cuisinePreferences={cuisinePreferences}
              setCuisinePreferences={setCuisinePreferences}
            />
          </div>

          <StandardButton
            onClick={handleSuggest}
            disabled={isLoading}
            size="lg"
            className="w-full font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cooking up a suggestion...
              </>
            ) : (
              "Surprise Me! 🎲"
            )}
          </StandardButton>
        </div>
      </motion.div>
    </Card>
  );
}