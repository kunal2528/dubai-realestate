import { NextResponse } from "next/server";
import { findMatches } from "@/lib/matching";
import { interpretRequest } from "@/lib/ai";
import { summarizeRequirements } from "@/lib/requirements";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Please send a valid search request." }, { status: 400 }); }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return NextResponse.json({ error: "Tell us what you're looking for to get started." }, { status: 400 });
  if (message.length > 1200) return NextResponse.json({ error: "Please keep your search under 1,200 characters." }, { status: 400 });
  const interpreted = await interpretRequest(message);
  const matches = findMatches(interpreted.requirements);
  return NextResponse.json({ requirements: interpreted.requirements, summary: summarizeRequirements(interpreted.requirements), matches, source: interpreted.source, notice: interpreted.notice });
}
