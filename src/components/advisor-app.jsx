"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Bot, Building2, CircleHelp, Filter, LoaderCircle, Menu, RotateCcw, Sparkles, X } from "lucide-react";
import { properties } from "@/data/properties";
import { findMatches } from "@/lib/matching";
import PropertyCard from "@/components/property-card";
import PropertyDetail from "@/components/property-detail";

const examples = [
  { label: "Investment", query: "I have AED 2M and want a 2-bedroom apartment in Dubai Marina for investment." },
  { label: "Family Home", query: "I want a family villa under AED 4M." },
  { label: "Luxury", query: "Show me luxury properties in Downtown Dubai." },
  { label: "Off-Plan", query: "I want an off-plan investment property." },
  { label: "Rental Income", query: "I have AED 1.5M and want good rental income." },
  { label: "First Property", query: "I'm looking for my first property in Dubai." },
];

const questions = [
  "What can I buy with AED 1.5M?",
  "Show me investment properties in Dubai Marina.",
  "I want a family villa under AED 4M.",
  "Which areas are good for rental income?",
  "I want an off-plan property with a flexible payment plan.",
];
const money = (value) => `AED ${value.toLocaleString("en-AE")}`;

function Header({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Properties", "properties"], ["Buy", "buy"], ["Rent", "rent"],
    ["Off-Plan", "off-plan"], ["Investment", "investment"],
  ];
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="HOD Real Estates home" onClick={(event) => { event.preventDefault(); onNavigate("home"); }}>
        <span className="brand-mark">H</span><span className="brand-copy"><span className="brand-name">HOD REAL ESTATES</span><span className="brand-locale">Dubai · UAE</span></span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">{links.map(([label, destination]) => <a key={destination} href={destination === "properties" ? "#featured" : "#advisor"} onClick={(event) => { event.preventDefault(); onNavigate(destination); }}>{label}</a>)}</nav>
      <a className="header-action" href="#advisor" onClick={(event) => { event.preventDefault(); setMenuOpen(false); onNavigate("buy"); }}><Sparkles size={15} /> AI Property Advisor</a>
      <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
      {menuOpen && <nav className="mobile-menu" id="mobile-navigation" aria-label="Mobile navigation">{links.map(([label, destination]) => <a key={destination} href={destination === "properties" ? "#featured" : "#advisor"} onClick={(event) => { event.preventDefault(); setMenuOpen(false); onNavigate(destination); }}>{label}</a>)}</nav>}
    </header>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><strong>HOD REAL ESTATES</strong><span>Dubai, UAE</span></div><nav className="footer-nav" aria-label="Footer navigation"><a href="#featured">Properties</a><a href="#about">About</a><a href="#advisor">Contact</a></nav><span className="footer-note">AI Property Advisor · Concept Demo</span></div></footer>;
}

function Thinking({ stage }) {
  return <span className="thinking"><span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span>{stage}</span>;
}

function RequirementChips({ requirements }) {
  const items = [
    ["Budget", requirements.budgetMax ? `Up to ${money(requirements.budgetMax)}` : requirements.budgetMin ? `From ${money(requirements.budgetMin)}` : null],
    ["Bedrooms", requirements.bedrooms ? `${requirements.bedrooms}` : null],
    ["Location", requirements.location], ["Property", requirements.propertyType], ["Purpose", requirements.purpose], ["Status", requirements.readyOrOffPlan],
  ].filter(([, value]) => value);
  if (!items.length) return <div className="requirements"><span className="requirement">Preferences <strong>Flexible search</strong></span></div>;
  return <div className="requirements">{items.map(([label, value]) => <span key={label} className="requirement">{label}<strong>{value}</strong></span>)}</div>;
}

function Filters({ values, onChange, sort, onSort }) {
  const options = {
    location: [...new Set(properties.map((item) => item.location))].sort(),
    type: ["Apartment", "Villa", "Penthouse"],
    bedrooms: ["1", "2", "3", "4"],
    status: ["Ready", "Off-Plan"],
    budget: ["1500000", "3000000", "5000000", "10000000"],
  };
  const select = (key, label, list, format = (item) => item) => (
    <select className="filter-select" aria-label={label} value={values[key]} onChange={(event) => onChange(key, event.target.value)}>
      <option value="">{label}</option>{list.map((item) => <option key={item} value={item}>{format(item)}</option>)}
    </select>
  );
  return <div className="filters"><span className="filters-label"><Filter size={13} /> Refine results</span>
    <select className="filter-select" aria-label="Sort properties" value={sort} onChange={(event) => onSort(event.target.value)}><option value="match">Best Match</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="yield">Rental Yield</option></select>
    {select("location", "Location", options.location)}{select("type", "Property Type", options.type)}{select("bedrooms", "Bedrooms", options.bedrooms, (value) => `${value} bedrooms`)}{select("budget", "Maximum Budget", options.budget, (value) => `≤ ${money(Number(value))}`)}{select("status", "Status", options.status)}
  </div>;
}

function Landing({ query, setQuery, onSubmit, onView, loading, stage, error, notice }) {
  function submit(event) { event.preventDefault(); onSubmit(query); }
  return <>
    <main id="top">
      <section className="hero" id="advisor">
        <div className="hero-image"><Image className="hero-photo" src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=90" alt="Dubai skyline at golden hour" fill sizes="100vw" preload /></div>
        <div className="hero-content">
          <p className="eyebrow">HOD AI PROPERTY ADVISOR</p>
          <h1>Your next Dubai property,<br /><em>discovered intelligently.</em></h1>
          <p className="hero-copy">Find a Dubai property that fits your goals. Tell us your budget, location and goals. Our AI advisor will help you discover properties that match what you&apos;re looking for.</p>
          <form className="advisor-form" onSubmit={submit}>
            <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. I have AED 2M and want a 2-bedroom apartment in Dubai Marina for investment..." aria-label="Describe the property you are looking for" maxLength={1200} />
            <div className="advisor-form-bottom"><span className="input-assist"><Bot size={14} /> Your personal property advisor</span><button className="primary-button" type="submit" disabled={loading}>{loading ? <LoaderCircle size={15} className="spin" /> : <Sparkles size={15} />}{loading ? "Working" : "Find My Properties"}<ArrowRight size={14} /></button></div>
          </form>
          {error && <p className="mode-note" role="alert"><CircleHelp size={15} />{error}</p>}
          {notice && <p className="mode-note"><CircleHelp size={15} />{notice}</p>}
          {loading && <p className="mode-note" role="status"><Thinking stage={stage} /></p>}
          <div className="quick-start"><span className="quick-label">Explore by intention</span>{examples.map((example) => <button key={example.label} className="quick-chip" type="button" onClick={() => onSubmit(example.query)} disabled={loading}>{example.label}</button>)}</div>
        </div>
        <span className="demo-caption">Demo experience · Illustrative inventory</span>
      </section>
      <section className="section-wrap" id="about">
        <div className="intro-band"><div><p className="section-kicker">A more considered search</p><h2>Property advice,<br />shaped around you.</h2></div><p className="intro-copy">A good property search starts with what matters to you. Share a budget, a neighbourhood, or a long-term goal and explore a shortlist drawn from our demonstration inventory.</p></div>
        <div className="quick-questions" aria-label="Example property questions">{questions.map((question) => <button className="question-button" key={question} type="button" onClick={() => onSubmit(question)} disabled={loading}><span>{question}</span><ArrowUpRight size={15} /></button>)}</div>
      </section>
      <section className="section-wrap landing-listings" id="featured"><div className="listings-head"><div><p className="section-kicker">A glimpse of the collection</p><h2 className="section-heading">Dubai, by design.</h2><p>Illustrative listings across the city. Not actual HOD listings.</p></div><a className="text-link" href="#advisor">Find your match <ArrowRight size={14} /></a></div><div className="property-grid">{properties.filter((item) => item.featured).slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} onView={onView} />)}</div></section>
    </main>
  </>;
}

function Results({ search, onReset, onView, onSubmitLead }) {
  const [sort, setSort] = useState("match");
  const [filters, setFilters] = useState({ location: "", type: "", bedrooms: "", budget: "", status: "" });
  const matches = useMemo(() => {
    const requirements = {
      ...search.requirements,
      location: filters.location || search.requirements.location,
      propertyType: filters.type || search.requirements.propertyType,
      bedrooms: filters.bedrooms ? Number(filters.bedrooms) : search.requirements.bedrooms,
      readyOrOffPlan: filters.status || search.requirements.readyOrOffPlan,
      budgetMax: filters.budget ? Math.min(search.requirements.budgetMax || Infinity, Number(filters.budget)) : search.requirements.budgetMax,
    };
    let items = findMatches(requirements);
    if (sort === "low") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "high") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "yield") items = [...items].sort((a, b) => b.rentalYield - a.rentalYield);
    return items;
  }, [search.requirements, filters, sort]);
  function changeFilter(key, value) { setFilters((current) => ({ ...current, [key]: value })); }
  const summary = search.summary || "Based on your stated preferences.";
  return <main className="advisor-page"><div className="section-wrap">
    <div className="advisor-top"><div><p className="section-kicker">HOD AI Property Advisor · Demo</p><h1>Your property shortlist</h1><p className="advisor-subtitle">A considered starting point, matched against illustrative local inventory.</p></div><button className="primary-button new-search-button" type="button" onClick={onReset}><RotateCcw size={15} /> New search</button></div>
    {search.notice && <p className="investment-note" role="status">{search.notice}</p>}
    <div className="conversation-strip"><p><span className="conversation-label">You asked</span>{search.message}</p><p><span className="conversation-label">Your advisor understood</span>{summary}</p></div>
    <RequirementChips requirements={search.requirements} />
    <div className="results-heading"><div><h2>Properties matched to your requirements</h2><p>{summary}</p></div><span className="input-assist"><Building2 size={14} /> {matches.length} demo matches</span></div>
    <Filters values={filters} onChange={changeFilter} sort={sort} onSort={setSort} />
    {matches.length ? <div className="property-grid">{matches.map((property, index) => <div key={property.id} style={{ animationDelay: `${Math.min(index, 5) * 65}ms` }}><PropertyCard property={property} onView={onView} /></div>)}</div> : <div className="empty-results"><CircleHelp size={25} /><h3>{search.matches.length ? "No properties with these filters" : "I couldn't find an exact match in our current demo inventory."}</h3><p>{search.matches.length ? "Clear a filter or adjust your criteria to explore the original shortlist." : "Try increasing your budget, changing the location or considering another property type."}</p><button className="primary-button" type="button" onClick={() => setFilters({ location: "", type: "", bedrooms: "", budget: "", status: "" })}>Clear filters</button></div>}
    <p className="investment-note">Illustrative demo inventory only. Availability, pricing, rental yields and rents are not verified or guaranteed.</p>
  </div></main>;
}

export default function AdvisorApp() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("Understanding your requirements...");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [leads, setLeads] = useState([]);

  async function runSearch(message) {
    const clean = message.trim();
    setQuery(message);
    if (!clean) { setError("Tell us what you're looking for to get started."); return; }
    setError(""); setLoading(true); setSearch(null); setStage("Understanding your requirements...");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setStage("Finding matching properties...");
      const response = await fetch("/api/advisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: clean }), signal: controller.signal });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "We couldn't interpret that request. Please try an example search.");
      setSearch({ ...payload, message: clean });
      setNotice(payload.notice || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      setError(requestError.name === "AbortError" ? "That search took too long. Please try again." : requestError.message || "We couldn't reach the advisor. Check your connection and try again.");
      setNotice("");
    } finally { clearTimeout(timeout); setLoading(false); }
  }

  function submitLead(lead) {
    setLeads((current) => {
      const next = [...current, lead];
      try { window.localStorage.setItem("hod-demo-leads", JSON.stringify(next)); } catch { /* In-memory demo storage remains available. */ }
      return next;
    });
  }

  function reset() { setSearch(null); setQuery(""); setError(""); setNotice(""); }

  function navigate(destination) {
    setSelectedProperty(null);
    reset();
    const suggestedQueries = {
      rent: "I have AED 1.5M and want good rental income.",
      "off-plan": examples[3].query,
      investment: examples[0].query,
    };
    if (suggestedQueries[destination]) setQuery(suggestedQueries[destination]);
    const target = destination === "properties" ? "featured" : destination === "home" ? "top" : "advisor";
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }), 40);
  }

  const searchHandler = (message) => runSearch(message);

  return <><Header onNavigate={navigate} />{search ? <Results search={search} onReset={reset} onView={setSelectedProperty} /> : <Landing query={query} setQuery={setQuery} onSubmit={searchHandler} onView={setSelectedProperty} loading={loading} stage={stage} error={error} notice={notice} />}
    <Footer />
    {selectedProperty && <PropertyDetail property={selectedProperty} requirements={search?.requirements ?? null} onClose={() => setSelectedProperty(null)} onSubmitLead={submitLead} />}
    <span className="sr-only" aria-live="polite">{leads.length ? `${leads.length} consultation request saved in this demo.` : ""}</span>
  </>;
}
