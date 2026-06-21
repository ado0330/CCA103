"use client";

import { useState } from "react";
import { usePropertyStore, PropertyFilters } from "@/stores/property-store";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters as PropertyFiltersComponent } from "@/components/property/property-filters";
import { Building } from "lucide-react";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  usePropertyStore((s) => s.properties);
  const getFilteredProperties = usePropertyStore((s) => s.getFilteredProperties);
  const filteredProperties = getFilteredProperties(filters);

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Find Your Home 🏠
        </h1>
        <p className="text-muted-foreground mt-1.5 text-[15px]">
          Browse verified properties near USM campus.
        </p>
      </div>

      <PropertyFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={filteredProperties.length}
      />

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold">No properties found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
}
