const locations = ["Dubai Marina", "Downtown Dubai", "Business Bay", "Jumeirah Village Circle", "Dubai Hills Estate", "Palm Jumeirah", "Dubai Creek Harbour", "Jumeirah", "Arabian Ranches", "Dubai Silicon Oasis"];
const amenityTerms = [["pool", "Swimming Pool"], ["gym", "Gym"], ["garden", "Garden"], ["beach", "Beach Access"], ["parking", "Covered Parking"], ["school", "Schools Nearby"], ["park", "Park Access"], ["balcony", "Balcony"]];

export function emptyRequirements() {
  return { budgetMin: null, budgetMax: null, bedrooms: null, bathrooms: null, location: null, purpose: null, propertyType: null, readyOrOffPlan: null, investmentPreference: null, amenities: [], preferences: [] };
}

function amountValue(rawAmount, unit = "") {
  const number = Number(rawAmount.replaceAll(",", ""));
  if (/^(m|million)$/i.test(unit)) return Math.round(number * 1000000);
  if (/^(k|thousand)$/i.test(unit)) return Math.round(number * 1000);
  return Math.round(number);
}

function parseBudget(text) {
  const range = text.match(/(?:between|from)\s+(?:aed\s*)?([\d,.]+)\s*(m|million|k|thousand)?\s+(?:and|to)\s+(?:aed\s*)?([\d,.]+)\s*(m|million|k|thousand)?/i);
  if (range) return { budgetMin: amountValue(range[1], range[2]), budgetMax: amountValue(range[3], range[4]) };
  const amount = text.match(/(?:aed\s*)?(\d[\d,.]*(?:\.\d+)?)\s*(million|m|thousand|k)\b/i);
  if (amount) {
    const value = amountValue(amount[1], amount[2]);
    if (/\b(?:at least|minimum|from)\b/i.test(text)) return { budgetMin: value, budgetMax: null };
    return { budgetMin: null, budgetMax: value };
  }
  const fullAmount = text.match(/(?:aed\s*)(\d{1,3}(?:,\d{3})+|\d{6,})\b/i);
  return fullAmount ? { budgetMin: null, budgetMax: Number(fullAmount[1].replaceAll(",", "")) } : { budgetMin: null, budgetMax: null };
}

export function parseRequirements(message) {
  const text = message.toLowerCase();
  const result = { ...emptyRequirements(), ...parseBudget(text) };
  const normalized = text.replaceAll("jvc", "jumeirah village circle");
  result.location = locations.find((location) => normalized.includes(location.toLowerCase())) ?? null;
  const bedroom = text.match(/\b(\d+)[-\s]*(?:bed(?:room)?s?|br)\b/i);
  if (bedroom) result.bedrooms = Number(bedroom[1]);
  else if (/\bone[- ]bedroom\b|\b1br\b/i.test(text)) result.bedrooms = 1;
  else if (/\btwo[- ]bedroom\b|\b2br\b/i.test(text)) result.bedrooms = 2;
  else if (/\bthree[- ]bedroom\b|\b3br\b/i.test(text)) result.bedrooms = 3;
  else if (/\bfour[- ]bedroom\b|\b4br\b/i.test(text)) result.bedrooms = 4;
  const bathroom = text.match(/\b(\d+)\s*bath(?:room)?s?\b/i);
  if (bathroom) result.bathrooms = Number(bathroom[1]);
  if (/\bpenthouse\b/i.test(text)) result.propertyType = "Penthouse";
  else if (/\bvilla|townhouse\b/i.test(text)) result.propertyType = "Villa";
  else if (/\bapartment|flat\b/i.test(text)) result.propertyType = "Apartment";
  if (/\boff[- ]plan\b/i.test(text)) result.readyOrOffPlan = "Off-Plan";
  else if (/\bready|completed|move[- ]in\b/i.test(text)) result.readyOrOffPlan = "Ready";
  if (/\binvest|rental income|rental yield|rental potential|rent out\b/i.test(text)) {
    result.purpose = "Investment";
    result.investmentPreference = /yield|rental|income/i.test(text) ? "Rental income" : "Investment";
  } else if (/\bfamily|children|kids\b/i.test(text)) result.purpose = "Family";
  else if (/\bluxury|premium|high[- ]end\b/i.test(text)) result.purpose = "Luxury";
  else if (/\bfirst property|first home\b/i.test(text)) result.purpose = "First Property";
  result.amenities = amenityTerms.filter(([term]) => text.includes(term)).map(([, label]) => label);
  result.preferences = [/family|children|kids/i.test(text) ? "Family-friendly" : null, /luxury|premium|high[- ]end/i.test(text) ? "Luxury" : null, /rental income|rental yield|rental potential/i.test(text) ? "Rental income" : null, /first property|first home/i.test(text) ? "First property" : null].filter(Boolean);
  return result;
}

export function summarizeRequirements(requirements) {
  const parts = [];
  if (requirements.bedrooms) parts.push(`${requirements.bedrooms}-bedroom`);
  if (requirements.propertyType) parts.push(requirements.propertyType.toLowerCase());
  if (requirements.purpose) parts.push(`${requirements.purpose.toLowerCase()} property`);
  if (requirements.location) parts.push(`in ${requirements.location}`);
  if (requirements.budgetMin && requirements.budgetMax) parts.push(`between AED ${requirements.budgetMin.toLocaleString("en-AE")} and AED ${requirements.budgetMax.toLocaleString("en-AE")}`);
  else if (requirements.budgetMax) parts.push(`up to AED ${requirements.budgetMax.toLocaleString("en-AE")}`);
  else if (requirements.budgetMin) parts.push(`from AED ${requirements.budgetMin.toLocaleString("en-AE")}`);
  if (requirements.readyOrOffPlan) parts.push(requirements.readyOrOffPlan.toLowerCase());
  return parts.length ? `You're looking for ${parts.join(" ").replace("property property", "property")}.` : "Here are the closest options in our demo inventory.";
}
