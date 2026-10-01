import { properties } from "@/data/properties";

function scoreProperty(property, requirements) {
  let score = 0;
  let availableScore = 0;
  const withinBudget = (!requirements.budgetMin || property.price >= requirements.budgetMin)
    && (!requirements.budgetMax || property.price <= requirements.budgetMax);
  const criteria = [
    [requirements.budgetMin != null || requirements.budgetMax != null, 30, withinBudget],
    [Boolean(requirements.location), 25, property.location.toLowerCase() === requirements.location?.toLowerCase()],
    [Boolean(requirements.bedrooms), 15, property.bedrooms === requirements.bedrooms],
    [Boolean(requirements.propertyType), 10, property.propertyType.toLowerCase() === requirements.propertyType?.toLowerCase()],
    [Boolean(requirements.purpose), 10, property.purpose.some((item) => item.toLowerCase() === requirements.purpose?.toLowerCase())],
    [Boolean(requirements.readyOrOffPlan), 5, property.status.toLowerCase() === requirements.readyOrOffPlan?.toLowerCase()],
  ];
  for (const [active, weight, matches] of criteria) {
    if (!active) continue;
    availableScore += weight;
    if (matches) score += weight;
  }
  const wanted = [...(requirements.amenities ?? []), ...(requirements.preferences ?? [])];
  if (wanted.length) {
    const available = [...property.amenities, ...property.purpose];
    const matches = wanted.filter((item) => available.some((value) => value.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(value.toLowerCase()))).length;
    availableScore += 5;
    score += Math.round((matches / wanted.length) * 5);
  }
  return availableScore ? Math.round((score / availableScore) * 100) : null;
}

export function findMatches(requirements, limit = properties.length) {
  return properties
    .filter((item) => !requirements.budgetMin || item.price >= requirements.budgetMin)
    .filter((item) => !requirements.budgetMax || item.price <= requirements.budgetMax)
    .filter((item) => !requirements.location || item.location.toLowerCase() === requirements.location.toLowerCase())
    .filter((item) => !requirements.bedrooms || item.bedrooms === requirements.bedrooms)
    .filter((item) => !requirements.propertyType || item.propertyType.toLowerCase() === requirements.propertyType.toLowerCase())
    .filter((item) => !requirements.readyOrOffPlan || item.status.toLowerCase() === requirements.readyOrOffPlan.toLowerCase())
    .map((item) => ({ ...item, matchScore: scoreProperty(item, requirements) }))
    .sort((first, second) => (second.matchScore ?? -1) - (first.matchScore ?? -1) || first.price - second.price)
    .slice(0, limit);
}

export function matchLabel(score) {
  if (score >= 90) return "Excellent Match";
  if (score >= 75) return "Strong Match";
  if (score < 50) return "Alternative";
  return "Good Match";
}
