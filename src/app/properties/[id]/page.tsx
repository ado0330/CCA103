"use client";

import { use, useState } from "react";
import { usePropertyStore } from "@/stores/property-store";
import { useApplicationStore } from "@/stores/application-store";
import { useUserStore } from "@/stores/user-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  BedDouble,
  ArrowLeft,
  CheckCircle,
  Send,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  usePropertyStore((s) => s.properties);
  const getPropertyById = usePropertyStore((s) => s.getPropertyById);
  const property = getPropertyById(id);
  const { currentUser, currentRole, getUserById } = useUserStore();
  const { submitApplication, getApplicationsByApplicant } = useApplicationStore();

  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!property) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Property not found</h2>
        <Link href="/properties">
          <Button variant="outline" className="mt-4">
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  const landlord = getUserById(property.landlordId);
  const myApplications = getApplicationsByApplicant(currentUser.id);
  const hasApplied = myApplications.some((a) => a.propertyId === property.id);

  const handleApply = () => {
    submitApplication({
      propertyId: property.id,
      applicantId: currentUser.id,
      roommateIds: [],
      documents: ["student_id.pdf"],
      message,
    });
    setDialogOpen(false);
    setMessage("");
    toast.success("Application submitted!", {
      description: "Your rental application has been sent to the landlord.",
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Properties
      </Link>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
          <Image
            src={property.images[selectedImage]}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        {property.images.length > 1 && (
          <div className="grid grid-cols-2 gap-2 h-64 md:h-80 lg:h-96">
            {property.images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedImage === i
                    ? "ring-2 ring-primary"
                    : "hover:opacity-80"
                }`}
                onClick={() => setSelectedImage(i)}
              >
                <Image
                  src={img}
                  alt={`${property.title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {property.title}
                </h1>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {property.address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  RM {property.monthlyRent}
                </p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
            </div>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">About this property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Property Details */}
          <Card className="border-border/50">
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <BedDouble className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Rooms</p>
                  <p className="font-semibold">
                    {property.availableRooms}/{property.totalRooms}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/50">
                  <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-semibold">{property.distanceToUSM}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-accent/50 text-center">
                <Badge
                  className="capitalize"
                  variant="secondary"
                >
                  {property.propertyType}
                </Badge>
              </div>

              {/* Apply Button */}
              {currentRole === "student" && (
                <>
                  {hasApplied ? (
                    <Button disabled className="w-full h-12">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Already Applied
                    </Button>
                  ) : property.availableRooms > 0 ? (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger
                        render={
                          <Button className="w-full h-12 text-base gap-2" />
                        }
                      >
                        <Send className="h-4 w-4" />
                        Apply Now
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply for {property.title}</DialogTitle>
                          <DialogDescription>
                            Send a message to the landlord with your application.
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          placeholder="Introduce yourself and why you'd be a great tenant..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleApply}>Submit Application</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button disabled variant="secondary" className="w-full h-12">
                      No Rooms Available
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Landlord Info */}
          {landlord && (
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{landlord.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {landlord.verified ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 text-emerald-600 border-emerald-200 bg-emerald-50"
                        >
                          <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 text-amber-600 border-amber-200 bg-amber-50"
                        >
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
