import OpenAI from "openai";
import { parseRequirements } from "@/lib/requirements";

const schema = {
  type: "object", additionalProperties: false,
  properties: {
    budgetMin: { type: ["number", "null"] }, budgetMax: { type: ["number", "null"] }, bedrooms: { type: ["number", "null"] }, bathrooms: { type: ["number", "null"] },
    location: { type: ["string", "null"] }, purpose: { type: ["string", "null"] }, propertyType: { type: ["string", "null"] }, readyOrOffPlan: { type: ["string", "null"] }, investmentPreference: { type: ["string", "null"] }, amenities: { type: "array", items: { type: "string" } }, preferences: { type: "array", items: { type: "string" } },
  },
  required: ["budgetMin", "budgetMax", "bedrooms", "bathrooms", "location", "purpose", "propertyType", "readyOrOffPlan", "investmentPreference", "amenities", "preferences"],
};

function validRequirements(value) {
  const scalar = ["budgetMin", "budgetMax", "bedrooms", "bathrooms", "location", "purpose", "propertyType", "readyOrOffPlan", "investmentPreference"];
  return value && typeof value === "object" && !Array.isArray(value)
    && scalar.every((key) => value[key] === null || ["number", "string"].includes(typeof value[key]))
    && Array.isArray(value.amenities) && Array.isArray(value.preferences);
}

export async function interpretRequest(message) {
  const fallback = parseRequirements(message);
  if (!process.env.OPENAI_API_KEY) return { requirements: fallback, source: "demo", notice: "AI mode is currently unavailable. Try one of our example searches." };
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 12000, maxRetries: 0 });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Extract only explicit property search requirements. Never invent missing values; use null or empty arrays. Normalize recognized Dubai locations. Amounts are AED numbers. purpose is Investment, Family, Luxury or First Property; propertyType is Apartment, Villa or Penthouse; readyOrOffPlan is Ready or Off-Plan." },
        { role: "user", content: message },
      ],
      response_format: { type: "json_schema", json_schema: { name: "property_requirements", strict: true, schema } },
    }, { signal: AbortSignal.timeout(13000) });
    const requirements = JSON.parse(response.choices[0]?.message?.content ?? "null");
    if (!validRequirements(requirements)) throw new Error("Invalid requirements response");
    if (fallback.budgetMin !== null || fallback.budgetMax !== null) {
      requirements.budgetMin = fallback.budgetMin;
      requirements.budgetMax = fallback.budgetMax;
    }
    return { requirements, source: "openai", notice: null };
  } catch {
    return { requirements: fallback, source: "demo", notice: "AI interpretation is temporarily unavailable. Showing matches from your request using demo mode." };
  }
}
