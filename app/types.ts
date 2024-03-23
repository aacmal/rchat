import type { Session, SupabaseClient } from "@supabase/supabase-js";

export type OutletContext = {
  supabase: SupabaseClient;
  session: Session;
  conversations: Conversation[];
};

export interface Message {
  id: number;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  conversation_id: string;
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
