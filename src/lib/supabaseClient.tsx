import { createClient } from "@supabase/supabase-js";
import { SubmitRequest } from "../components/CreateEntry";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_PUBLISHABLE_KEY } from "../config/env";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const getCategories = async () => {
  const { data, error } = await supabase.schema("oscars_2026").from("categories").select();
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export async function submitEntry({ name, pin, selections }: SubmitRequest) {

  const url = `${SUPABASE_URL}/functions/v1/submit_entry`;
  const selectionsArray = selections.map(({nominee, categoryId}) => ({ nominee, category_id: categoryId }));

  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }) as HeadersInit,
    body: JSON.stringify({
      name,
      pin,
      selections: selectionsArray,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Submit failed");
  return json; // { ok: true, userId: "..." }
}

export async function getLeaderboard() {

  const url = `${SUPABASE_URL}/functions/v1/get-leaderboard`;

  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }) as HeadersInit,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Submit failed");
  console.log("Leaderboard data:", json);
  return json; // { ok: true, userId: "..." }
}