import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Save, Download, Plus, Trash2 } from "lucide-react";
import type { MealPlan } from "@/types/mealPlan";
import { trackFeatureUsage } from "@/utils/analytics";
import { LoadingOverlay } from "./LoadingOverlay";
import { generateGroceryList, createGroceryList, getGroceryList } from "@/services/groceryList";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  quantity?: string;
  notes?: string;
}

interface Props {
  mealPlan: MealPlan;
}

export function GroceryList({ mealPlan }: Props) {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Other");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchExistingList = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: existingList } = await supabase
          .from('grocery_lists')
          .select('*')
          .eq('meal_plan_id', mealPlan.id)
          .single();

        if (existingList) {
          const list = await getGroceryList(existingList.id);
          setGroceryItems(list.items);
        }
      } catch (error) {
        console.error('Error fetching existing grocery list:', error);
      }
    };

    fetchExistingList();
  }, [mealPlan.id]);

  const generateGroceryListItems = async () => {
    setIsLoading(true);
    try {
      const items = await generateGroceryList(mealPlan);
      setGroceryItems(items);
      await trackFeatureUsage("grocery_list_generated");
      toast({
        title: "Success",
        description: "Grocery list generated successfully!",
      });
    } catch (error) {
      console.error('Error generating grocery list:', error);
      toast({
        title: "Error",
        description: "Failed to generate grocery list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveGroceryList = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Create an account to save your grocery lists!",
        variant: "destructive",
      });
      return;
    }

    try {
      await createGroceryList(mealPlan.id, groceryItems);
      await trackFeatureUsage("grocery_list_saved");
      toast({
        title: "Success",
        description: "Your grocery list has been saved!",
      });
    } catch (error) {
      console.error('Error saving grocery list:', error);
      toast({
        title: "Error",
        description: "Failed to save grocery list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadGroceryList = () => {
    const text = groceryItems
      .map(item => `${item.name}${item.quantity ? ` - ${item.quantity}` : ''}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addCustomItem = async () => {
    if (!newItemName.trim()) return;

    const newItem: GroceryItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQuantity,
      checked: false,
    };

    setGroceryItems(prev => [...prev, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemCategory("Other");
    setShowAddForm(false);
  };

  const toggleItemCheck = async (itemId: string) => {
    setGroceryItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (itemId: string) => {
    setGroceryItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-2xl p-4">
      <LoadingOverlay 
        isLoading={isLoading}
        messages={[
          { message: "Analyzing meal plan...", submessage: "Extracting ingredients" },
          { message: "Generating list...", submessage: "Organizing items by category" },
          { message: "Almost done...", submessage: "Finalizing your grocery list" }
        ]}
      />
      
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
              onClick={generateGroceryListItems}
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
          <>
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
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center justify-between gap-2 bg-white/50 p-2 rounded-lg"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              id={item.id}
                              checked={item.checked}
                              onCheckedChange={() => toggleItemCheck(item.id)}
                            />
                            <label
                              htmlFor={item.id}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                item.checked ? 'line-through text-muted-foreground' : ''
                              }`}
                            >
                              {item.name}
                              {item.quantity && ` - ${item.quantity}`}
                            </label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t">
              <AnimatePresence>
                {showAddForm ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Item name"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                      />
                      <Input
                        placeholder="Quantity (optional)"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addCustomItem} className="flex-1">
                        Add Item
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Item
                  </Button>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Click "Generate List" to create your grocery list based on the meal plan
          </div>
        )}
      </motion.div>
    </Card>
  );
}