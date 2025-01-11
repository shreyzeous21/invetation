"use server";

import { createClient } from "@/utils/supabase/server";


export async function deleteRSVP(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("rsvps")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting RSVP:", error);
    return { success: false, message: "Failed to delete RSVP" };
  }

  return { success: true };
}
