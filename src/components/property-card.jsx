import Image from "next/image";
import { ArrowUpRight, BedDouble, Bath, Ruler, MapPin, Sparkles } from "lucide-react";
import { matchLabel } from "@/lib/matching";

const money = (value) => `AED ${value.toLocaleString("en-AE")}`;

export default function PropertyCard({ property, onView }) {
  return (
    <article className="property-card">
      <div className="property-image">
        <Image src={property.image} alt={`${property.title}, ${property.location}`} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" className="property-image-content" />
        <span className="image-badge">{property.status}</span>
        {property.featured && <span className="featured-mark" aria-label="Featured demo property"><Sparkles size={14} /></span>}
      </div>
      <div className="property-body">
        <p className="property-location"><MapPin size={12} />{property.location}</p>
        <div className="property-title-row"><h3 className="property-title">{property.title}</h3><strong className="property-price">{money(property.price)}</strong></div>
        <div className="property-specs">
          <span><BedDouble size={13} />{property.bedrooms} beds</span><span><Bath size={13} />{property.bathrooms} baths</span><span><Ruler size={13} />{property.size.toLocaleString()} sq ft</span>
        </div>
        <p className="property-description">{property.description}</p>
        <div className="card-footer">
          {property.matchScore != null ? <span className="match-score">{property.matchScore}% {matchLabel(property.matchScore)}</span> : <span className="match-score">HOD demo selection</span>}
          <button type="button" className="card-view" onClick={() => onView(property)}>View Property <ArrowUpRight size={14} /></button>
        </div>
      </div>
    </article>
  );
}
