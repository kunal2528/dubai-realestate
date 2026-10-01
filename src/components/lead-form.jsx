"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function LeadForm({ property, requirements, onSubmitLead }) {
  const [submittedName, setSubmittedName] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    if (!/^[+\d\s().-]{7,20}$/.test(values.phone)) {
      setError("Enter a valid WhatsApp number, including the country code.");
      return;
    }
    const lead = {
      name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(),
      preferredContactMethod: values.contactMethod, buyingPurpose: values.buyingPurpose,
      propertyId: property.id, propertyName: property.title, budget: requirements?.budgetMax ?? requirements?.budgetMin ?? null,
      location: property.location, purpose: requirements?.purpose ?? values.buyingPurpose,
      timestamp: new Date().toISOString(),
    };
    onSubmitLead(lead);
    setSubmittedName(lead.name);
    setError("");
  }

  if (submittedName) return <div className="success-state" role="status"><Check size={25} /><h4>Thank you, {submittedName}.</h4><p>An HOD property consultant can follow up with you regarding {property.title}.</p></div>;

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="field"><label htmlFor="lead-name">Full name</label><input id="lead-name" name="name" autoComplete="name" required maxLength={100} /></div>
      <div className="field"><label htmlFor="lead-phone">WhatsApp number</label><input id="lead-phone" name="phone" type="tel" autoComplete="tel" placeholder="+971 50 000 0000" required /></div>
      <div className="field"><label htmlFor="lead-email">Email address</label><input id="lead-email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="lead-contact">Preferred contact</label><select id="lead-contact" name="contactMethod"><option>WhatsApp</option><option>Phone call</option><option>Email</option></select></div>
      <div className="field"><label htmlFor="lead-purpose">Buying purpose</label><select id="lead-purpose" name="buyingPurpose"><option>Investment</option><option>Family home</option><option>Personal use</option><option>First property</option></select></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button lead-submit" type="submit">Request Consultation</button>
    </form>
  );
}
