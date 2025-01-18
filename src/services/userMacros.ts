import { supabase } from '@/lib/supabase'
import type { UserMacros } from '@/types/macros'

export async function getUserMacros(userId: string): Promise<UserMacros | null> {
  const { data: macros, error } = await supabase
    .from("user_macros")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return macros;
}

export async function saveUserMacros(userId: string, macros: Omit<UserMacros, 'user_id' | 'last_updated'>) {
  // First check if user has existing macros
  const { data: existingMacros } = await supabase
    .from("user_macros")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const macrosData = {
    ...macros,
    user_id: userId,
    last_updated: new Date().toISOString()
  };

  if (existingMacros) {
    // Update existing record
    const { error: updateError } = await supabase
      .from("user_macros")
      .update(macrosData)
      .eq("user_id", userId);

    if (updateError) throw updateError;
  } else {
    // Insert new record
    const { error: insertError } = await supabase
      .from("user_macros")
      .insert([macrosData]);

    if (insertError) throw insertError;
  }
}