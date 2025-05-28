import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, intention } = await req.json();

    const { error } = await supabase.from("intentions").insert([
      { name, email, intention }
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}