import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ShoppingCart, Save, Download } from "lucide-react";
import type { MealPlan } from "@/types/mealPlan";
import { trackFeatureUsage } from "@/utils/analytics";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  quantity?: string;
}

interface Props {
  mealPlan: MealPlan;
}

export function GroceryList({ mealPlan }: Props) {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const generateGroceryList = async () => {
    const items: GroceryItem[] = [
      { id: "1", name: "Chicken breast", category: "Protein", checked: false, quantity: "500g" },
      { id: "2", name: "Brown rice", category: "Grains", checked: false, quantity: "2 cups" },
      { id: "3", name: "Broccoli", category: "Vegetables", checked: false, quantity: "2 heads" },
    ];
    await trackFeatureUsage("grocery_list_generated", "Generated grocery list");
    setGroceryItems(items);
  };

  const saveGroceryList = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Create an account to save your grocery lists!",
        action: (
          <Button variant="default" onClick={() => {/* Add sign in logic */}}>
            Sign In
          </Button>
        ),
      });
      return;
    }

    const { error } = await supabase
      .from('grocery_lists')
      .insert({
        user_id: session.user.id,
        meal_plan_id: mealPlan.id,
        items: groceryItems,
        created_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save grocery list. Please try again.",
        variant: "destructive",
      });
    } else {
      await trackFeatureUsage("grocery_list_saved", "Saved grocery list");
      toast({
        title: "Success",
        description: "Your grocery list has been saved!",
      });
    }
  };

  const downloadGroceryList = () => {
    const text = groceryItems
      .map(item => `${item.name} - ${item.quantity}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Grocery List</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateGroceryList}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Generate List
            </Button>
            {groceryItems.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveGroceryList}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadGroceryList}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </>
            )}
          </div>
        </div>

        {groceryItems.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
              {Object.entries(
                groceryItems.reduce((acc, item) => {
                  acc[item.category] = [...(acc[item.category] || []), item];
                  return acc;
                }, {} as Record<string, GroceryItem[]>)
              ).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={item.id}
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => {
                            setSelectedItems(prev =>
                              checked
                                ? [...prev, item.id]
                                : prev.filter(id => id !== item.id)
                            );
                          }}
                        />
                        <label
                          htmlFor={item.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.name} - {item.quantity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Click "Generate List" to create your grocery list based on the meal plan
          </div>
        )}
      </motion.div>
    </Card>
  );
}
