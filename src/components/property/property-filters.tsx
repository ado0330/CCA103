"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFilters as Filters } from "@/stores/property-store";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const allAmenities = [
  "WiFi",
  "Air-Con",
  "Parking",
  "Pool",
  "Gym",
  "Furnished",
  "Washing Machine",
  "Kitchen",
  "Security",
  "Study Room",
];

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  resultCount: number;
}

export function PropertyFilters({
  filters,
  onFiltersChange,
  resultCount,
}: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (update: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...update });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    updateFilter({ amenities: updated.length > 0 ? updated : undefined });
  };

  const hasFilters =
    filters.minBudget ||
    filters.maxBudget ||
    filters.propertyType ||
    (filters.amenities && filters.amenities.length > 0) ||
    filters.searchQuery;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="property-search"
            placeholder="Search properties, locations..."
            className="pl-10 h-11"
            value={filters.searchQuery || ""}
            onChange={(e) => updateFilter({ searchQuery: e.target.value || undefined })}
          />
        </div>
        <Button
          variant={showAdvanced ? "default" : "outline"}
          size="icon"
          className="h-11 w-11"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 rounded-xl border border-border/50 bg-card space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Min Budget (RM)</Label>
              <Input
                type="number"
                placeholder="e.g. 200"
                value={filters.minBudget || ""}
                onChange={(e) =>
                  updateFilter({
                    minBudget: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Max Budget (RM)</Label>
              <Input
                type="number"
                placeholder="e.g. 800"
                value={filters.maxBudget || ""}
                onChange={(e) =>
                  updateFilter({
                    maxBudget: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Property Type</Label>
              <Select
                value={filters.propertyType || "all"}
                onValueChange={(v) =>
                  updateFilter({ propertyType: !v || v === "all" ? undefined : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amenity Filters */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {allAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={
                    filters.amenities?.includes(amenity) ? "default" : "outline"
                  }
                  className={cn(
                    "cursor-pointer transition-all text-xs",
                    filters.amenities?.includes(amenity)
                      ? "hover:bg-primary/80"
                      : "hover:bg-accent"
                  )}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {resultCount} propert{resultCount !== 1 ? "ies" : "y"} found
        </span>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs gap-1"
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
