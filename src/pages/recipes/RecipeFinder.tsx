import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { LoginDialog } from "@/components/LoginDialog";
import { MealPlanLoadingOverlay } from "@/components/MealPlanLoadingOverlay";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { 
  Camera, 
  ChefHat, 
  Sparkles, 
  History, 
  Star, 
  Utensils, 
  Scale, 
  Upload, 
  Timer, 
  UtensilsCrossed, 
  ListChecks, 
  Dumbbell 
} from "lucide-react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { useAuth } from "@/hooks/useAuth";
import { useDropzone } from "react-dropzone";
import { UserMacros } from "@/types/macros";
import { trackFeatureUsage } from "@/utils/analytics";
import { Recipe } from "@/types/recipe";
import { findRecipes, saveRecipe, getUserRecipes } from "@/services/recipeFinder";
import { getUserMacros } from "@/services/userMacros";

// ... rest of the file content ... 