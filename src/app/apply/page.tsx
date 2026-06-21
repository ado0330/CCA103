"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { useApplicationStore } from "@/stores/application-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  FileText,
  User,
  MapPin,
  DollarSign,
  Upload,
  CheckCircle,
  ArrowLeft,
  Send,
  Phone,
  Mail,
  Calendar,
  Users,
  Shield,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Suspense } from "react";

export default function TenancyApplicationFormPage() {
  return (
    <Suspense>
      <TenancyApplicationFormContent />
    </Suspense>
  );
}

function TenancyApplicationFormContent() {
  const searchParams = useSearchParams();
  const propertyIdFromUrl = searchParams.get("propertyId") || "";

  const { currentUser } = useUserStore();
  usePropertyStore((s) => s.properties);
  const getApprovedProperties = usePropertyStore(
    (s) => s.getApprovedProperties
  );
  const getUserById = useUserStore((s) => s.getUserById);
  const { submitApplication } = useApplicationStore();

  const approvedProperties = getApprovedProperties();

  // Form state
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyIdFromUrl);
  const [fullName, setFullName] = useState(currentUser.name);
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [moveInDate, setMoveInDate] = useState("");
  const [rentalDuration, setRentalDuration] = useState("12");
  const [occupants, setOccupants] = useState("1");
  const [personalStatement, setPersonalStatement] = useState("");
  const [hasStudentIdDoc, setHasStudentIdDoc] = useState(false);
  const [hasOfferLetter, setHasOfferLetter] = useState(false);
  const [hasAdditionalDoc, setHasAdditionalDoc] = useState(false);
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedProperty = approvedProperties.find(
    (p) => p.id === selectedPropertyId
  );
  const landlord = selectedProperty
    ? getUserById(selectedProperty.landlordId)
    : null;

  const handleSubmit = () => {
    if (!selectedPropertyId) {
      toast.error("Please select a property");
      return;
    }
    if (!fullName || !studentId || !email || !phone) {
      toast.error("Please fill in all applicant information");
      return;
    }
    if (!moveInDate) {
      toast.error("Please select a preferred move-in date");
      return;
    }
    if (!agreeDeclaration) {
      toast.error("Please confirm the declaration");
      return;
    }

    const documents: string[] = [];
    if (hasStudentIdDoc) documents.push("student_id.pdf");
    if (hasOfferLetter) documents.push("offer_letter.pdf");
    if (hasAdditionalDoc) documents.push("additional_doc.pdf");

    submitApplication({
      propertyId: selectedPropertyId,
      applicantId: currentUser.id,
      roommateIds: [],
      documents,
      message: personalStatement || undefined,
    });

    setSubmitted(true);
    toast.success("Application submitted successfully! 🎉");
  };

  // ---- SUCCESS STATE ----
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-scale-in">
        <Card className="border-border/50 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold">Application Submitted!</h1>
            <p className="text-emerald-100 mt-2">
              Your tenancy application has been sent to the landlord.
            </p>
          </div>
          <CardContent className="p-6 space-y-4">
            {selectedProperty && (
              <div className="p-4 rounded-xl bg-accent/30 space-y-1">
                <p className="font-semibold">{selectedProperty.title}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedProperty.address}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Link href="/applications" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  View My Applications
                </Button>
              </Link>
              <Link href="/properties" className="flex-1">
                <Button className="w-full gap-2">
                  <Building className="h-4 w-4" />
                  Browse Properties
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- FORM ----
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up pb-8">
      {/* Header */}
      <div>
        <Link
          href={propertyIdFromUrl ? `/properties/${propertyIdFromUrl}` : "/properties"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {propertyIdFromUrl ? "Back to Property Details" : "Back to Properties"}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Tenancy Application Form 📝
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete this form to submit your rental application.
        </p>
      </div>

      {/* ===== Section 1: Property Information (Read Only) ===== */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5 text-primary" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!propertyIdFromUrl && (
            <div className="space-y-2">
              <Label>Select Property <span className="text-destructive">*</span></Label>
              <Select
                value={selectedPropertyId}
                onValueChange={(v) => setSelectedPropertyId(v || "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a property to apply for" />
                </SelectTrigger>
                <SelectContent>
                  {approvedProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title} — RM {property.monthlyRent}/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedProperty && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-accent/30 border border-border/30">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Property Name</p>
                <p className="text-sm font-medium">{selectedProperty.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  {selectedProperty.address}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Monthly Rent</p>
                <p className="text-sm font-semibold text-primary flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  RM {selectedProperty.monthlyRent}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Landlord Name</p>
                <p className="text-sm font-medium">
                  {landlord?.name || "—"}
                  {landlord?.verified && (
                    <Badge
                      variant="outline"
                      className="ml-2 text-[10px] px-1.5 py-0 text-emerald-600 border-emerald-200 bg-emerald-50"
                    >
                      Verified
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Section 2: Applicant Information ===== */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Applicant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Ahmad Rizal bin Abdullah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId" className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                Student ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="studentId"
                placeholder="e.g. 162345"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                USM Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. ahmad@student.usm.my"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="e.g. +60 12-345 6789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Section 3: Application Details ===== */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Preferred Move-in Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Rental Duration
              </Label>
              <Select
                value={rentalDuration}
                onValueChange={(v) => setRentalDuration(v || "12")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                Number of Occupants
              </Label>
              <Select
                value={occupants}
                onValueChange={(v) => setOccupants(v || "1")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 person</SelectItem>
                  <SelectItem value="2">2 persons</SelectItem>
                  <SelectItem value="3">3 persons</SelectItem>
                  <SelectItem value="4">4 persons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalStatement">Personal Statement</Label>
            <Textarea
              id="personalStatement"
              placeholder="Tell the landlord about yourself... e.g. I am a third-year Computer Science student looking for accommodation near USM. I am responsible, tidy, and respectful of shared living spaces."
              rows={4}
              value={personalStatement}
              onChange={(e) => setPersonalStatement(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== Section 4: Supporting Documents ===== */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5 text-primary" />
            Supporting Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              checked: hasStudentIdDoc,
              setter: setHasStudentIdDoc,
              label: "Student ID Card",
              fileName: "student_id.pdf",
            },
            {
              checked: hasOfferLetter,
              setter: setHasOfferLetter,
              label: "USM Offer Letter",
              fileName: "offer_letter.pdf",
            },
            {
              checked: hasAdditionalDoc,
              setter: setHasAdditionalDoc,
              label: "Additional Supporting Document (Optional)",
              fileName: "additional_doc.pdf",
            },
          ].map((doc) => (
            <div
              key={doc.label}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                doc.checked
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-accent/20 border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    doc.checked
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-accent text-muted-foreground"
                  }`}
                >
                  {doc.checked ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{doc.label}</p>
                  {doc.checked && (
                    <p className="text-xs text-emerald-600">{doc.fileName}</p>
                  )}
                </div>
              </div>
              <Button
                variant={doc.checked ? "outline" : "secondary"}
                size="sm"
                onClick={() => doc.setter(!doc.checked)}
                className={
                  doc.checked
                    ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    : ""
                }
              >
                {doc.checked ? "Uploaded ✓" : "Upload"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ===== Section 5: Declaration ===== */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Declaration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              agreeDeclaration
                ? "bg-primary/5 border-primary/20"
                : "bg-accent/20 border-border/50"
            }`}
          >
            <input
              type="checkbox"
              checked={agreeDeclaration}
              onChange={(e) => setAgreeDeclaration(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-[var(--color-primary)]"
            />
            <span className="text-sm leading-relaxed">
              I confirm that all submitted information is accurate and I
              understand that providing false information may result in the
              rejection of my application.{" "}
              <span className="text-destructive">*</span>
            </span>
          </label>
        </CardContent>
      </Card>

      {/* ===== Buttons ===== */}
      <div className="flex items-center justify-end gap-3">
        <Link href="/properties">
          <Button variant="outline" className="gap-2">
            Cancel
          </Button>
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={!agreeDeclaration}
          className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 shadow-md px-6"
        >
          <Send className="h-4 w-4" />
          Submit Application
        </Button>
      </div>
    </div>
  );
}
