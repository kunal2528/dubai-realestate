"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, MapPin, BedDouble, Bath, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import LeadForm from "@/components/lead-form";

const money = (value) => `AED ${value.toLocaleString("en-AE")}`;

export default function PropertyDetail({ property, requirements, onClose, onSubmitLead }) {
  const gallery = property.gallery?.length ? property.gallery : [property.image];
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", handleKey); };
  }, [onClose]);

  const why = [
    requirements?.bedrooms ? `the ${requirements.bedrooms}-bedroom layout` : null,
    requirements?.purpose ? `your ${requirements.purpose.toLowerCase()} goals` : null,
    requirements?.location ? `your preferred area of ${requirements.location}` : null,
    requirements?.budgetMax && property.price <= requirements.budgetMax ? "your stated budget" : null,
  ].filter(Boolean);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="property-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button type="button" className="modal-close" aria-label="Close property details" onClick={onClose}><X size={19} /></button>
        <div className="detail-gallery">
          <div className="detail-image"><Image key={gallery[photoIndex]} src={gallery[photoIndex]} alt={`${property.title}, photo ${photoIndex + 1}`} fill sizes="(max-width: 640px) 100vw, 980px" priority /></div>
          {gallery.length > 1 && <>
            <button type="button" className="gallery-arrow gallery-previous" aria-label="Previous property photo" onClick={() => setPhotoIndex((index) => (index - 1 + gallery.length) % gallery.length)}><ChevronLeft size={21} /></button>
            <button type="button" className="gallery-arrow gallery-next" aria-label="Next property photo" onClick={() => setPhotoIndex((index) => (index + 1) % gallery.length)}><ChevronRight size={21} /></button>
            <span className="gallery-counter" aria-live="polite">{photoIndex + 1} / {gallery.length}</span>
            <div className="gallery-thumbnails" aria-label="Property photos">{gallery.map((src, index) => <button key={`${src}-${index}`} type="button" className={`gallery-thumbnail${index === photoIndex ? " is-active" : ""}`} aria-label={`Show photo ${index + 1}`} aria-pressed={index === photoIndex} onClick={() => setPhotoIndex(index)}><Image src={src} alt="" fill sizes="88px" /></button>)}</div>
          </>}
        </div>
        <div className="detail-content">
          <div>
            <p className="property-location"><MapPin size={13} />{property.location} · {property.community}</p>
            <h2 className="detail-title" id="detail-title">{property.title}</h2>
            <p className="detail-price">{money(property.price)}</p>
            <p className="detail-description">{property.description}</p>
            <div className="detail-specs">
              <div className="detail-spec"><span>Bedrooms</span><strong><BedDouble size={13} /> {property.bedrooms}</strong></div>
              <div className="detail-spec"><span>Bathrooms</span><strong><Bath size={13} /> {property.bathrooms}</strong></div>
              <div className="detail-spec"><span>Area</span><strong><Ruler size={13} /> {property.size.toLocaleString()} sq ft</strong></div>
              <div className="detail-spec"><span>Status</span><strong>{property.status}</strong></div>
              <div className="detail-spec"><span>Developer</span><strong>{property.developer}</strong></div>
              <div className="detail-spec"><span>Completion</span><strong>{property.completion}</strong></div>
            </div>
            <h3 className="detail-section-title">Amenities</h3>
            <div className="amenity-list">{property.amenities.map((amenity) => <span key={amenity} className="amenity-tag">{amenity}</span>)}</div>
            <h3 className="detail-section-title">Illustrative investment figures</h3>
            <p className="detail-description">Rental yield <strong>{property.rentalYield}%</strong> · Estimated annual rent <strong>{money(property.annualRent)}</strong></p>
            <p className="investment-note">Illustrative investment figures for demonstration purposes only. Not verified market data or a guarantee of future returns.</p>
            <div className="why-box"><h3>Why this matches you</h3><p>{why.length ? `You mentioned ${why.join(", ")}. This demo listing aligns with those details in our mock inventory.` : "This demo listing is one of the closest available options in our mock inventory based on your search."}</p></div>
          </div>
          <aside className="lead-panel"><h3>Interested in this property?</h3><p>Let an HOD property consultant help you with the next step.</p><LeadForm property={property} requirements={requirements} onSubmitLead={onSubmitLead} /></aside>
        </div>
      </section>
    </div>
  );
}
