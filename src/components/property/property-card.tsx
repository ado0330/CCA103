"use client";

import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Wifi, Car, Snowflake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  Parking: <Car className="h-3 w-3" />,
  "Air-Con": <Snowflake className="h-3 w-3" />,
};

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card
        className={cn(
          "group overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 cursor-pointer",
          className
        )}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/95 text-foreground font-bold text-sm px-3 py-1 shadow-lg backdrop-blur-sm">
              RM {property.monthlyRent}
              <span className="text-xs font-normal text-muted-foreground ml-1">/mo</span>
            </Badge>
          </div>

          {/* Property Type */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm capitalize"
            >
              {property.propertyType}
            </Badge>
          </div>

          {/* Availability */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={property.availableRooms > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {property.availableRooms > 0
                ? `${property.availableRooms} room${property.availableRooms > 1 ? "s" : ""} left`
                : "Full"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
              {property.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </p>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5">
            {property.amenities.slice(0, 4).map((amenity) => (
              <Badge
                key={amenity}
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-normal gap-1"
              >
                {amenityIcons[amenity] || null}
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 4 && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-normal"
              >
                +{property.amenities.length - 4}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BedDouble className="h-3 w-3" />
              {property.totalRooms} rooms total
            </span>
            <span className="text-xs text-muted-foreground">
              📍 {property.distanceToUSM} to USM
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
