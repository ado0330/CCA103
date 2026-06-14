"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { Property } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Home,
  MapPin,
  BedDouble,
  Pencil,
  Trash2,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function LandlordPropertiesPage() {
  const { currentUser } = useUserStore();
  const {
    getPropertiesByLandlord,
    addProperty,
    updateProperty,
    deleteProperty,
  } = usePropertyStore();

  const myProperties = getPropertiesByLandlord(currentUser.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [totalRooms, setTotalRooms] = useState(1);
  const [availableRooms, setAvailableRooms] = useState(1);
  const [propertyType, setPropertyType] = useState<Property["propertyType"]>("apartment");
  const [distanceToUSM, setDistanceToUSM] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAddress("");
    setMonthlyRent(0);
    setTotalRooms(1);
    setAvailableRooms(1);
    setPropertyType("apartment");
    setDistanceToUSM("");
    setAmenitiesInput("");
    setEditingProperty(null);
  };

  const openEdit = (property: Property) => {
    setEditingProperty(property);
    setTitle(property.title);
    setDescription(property.description);
    setAddress(property.address);
    setMonthlyRent(property.monthlyRent);
    setTotalRooms(property.totalRooms);
    setAvailableRooms(property.availableRooms);
    setPropertyType(property.propertyType);
    setDistanceToUSM(property.distanceToUSM);
    setAmenitiesInput(property.amenities.join(", "));
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const amenities = amenitiesInput
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    if (editingProperty) {
      updateProperty(editingProperty.id, {
        title,
        description,
        address,
        monthlyRent,
        totalRooms,
        availableRooms,
        propertyType,
        distanceToUSM,
        amenities,
      });
      toast.success("Property updated!");
    } else {
      addProperty({
        landlordId: currentUser.id,
        title,
        description,
        address,
        monthlyRent,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop",
        ],
        amenities,
        totalRooms,
        availableRooms,
        propertyType,
        distanceToUSM,
        status: "pending",
      });
      toast.success("Property created!", {
        description: "Your property is pending admin approval.",
      });
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteProperty(id);
    toast.info("Property removed.");
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Properties 🏘️
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings.
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger
            render={
              <Button className="gap-2" />
            }
          >
            <Plus className="h-4 w-4" />
            Add Property
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? "Edit Property" : "Add New Property"}
              </DialogTitle>
              <DialogDescription>
                {editingProperty
                  ? "Update your property details."
                  : "Fill in the details for your new listing."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Sunny Heights Apartment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your property..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Rent (RM)</Label>
                  <Input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={propertyType}
                    onValueChange={(v) =>
                      setPropertyType(v as Property["propertyType"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Total Rooms</Label>
                  <Input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available</Label>
                  <Input
                    type="number"
                    value={availableRooms}
                    onChange={(e) => setAvailableRooms(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Distance to USM</Label>
                  <Input
                    placeholder="e.g. 1.5 km"
                    value={distanceToUSM}
                    onChange={(e) => setDistanceToUSM(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amenities (comma-separated)</Label>
                <Input
                  placeholder="WiFi, Air-Con, Parking"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingProperty ? "Update" : "Create"} Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {myProperties.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="text-center py-16">
            <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold">No properties yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first property to start receiving applications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProperties.map((property) => (
            <Card
              key={property.id}
              className="border-border/50 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-36">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      property.status === "approved"
                        ? "default"
                        : property.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {property.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {property.address}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-primary" />
                    RM {property.monthlyRent}/mo
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5 text-primary" />
                    {property.availableRooms}/{property.totalRooms} rooms
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => openEdit(property)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive gap-1"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
