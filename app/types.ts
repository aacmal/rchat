import type { Session, SupabaseClient } from "@supabase/supabase-js";

export type OutletContext = {
  supabase: SupabaseClient;
  session: Session;
  appURL: string;
};

export interface Message {
  id: number;
  content: string;
  sender: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  profiles: {
    id: string;
    photo_url: string;
    full_name: string;
    email: string;
  }[];
}
