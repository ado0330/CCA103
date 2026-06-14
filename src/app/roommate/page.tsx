"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/user-store";
import { useRoommateStore } from "@/stores/roommate-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  UserPlus,
  Settings,
  Sparkles,
  Moon,
  Sun,
  BookOpen,
  Users,
  Cigarette,
  DollarSign,
  Sparkle,
  CheckCircle,
  X,
  Send,
} from "lucide-react";
import { MatchScore } from "@/lib/matching-engine";
import { RoommatePreference } from "@/types";
import { toast } from "sonner";

export default function RoommatePage() {
  const { currentUser, getUserById } = useUserStore();
  const {
    preferences,
    matchResults,
    setPreference,
    generateMatches,
    sendMatchRequest,
    acceptMatch,
    rejectMatch,
    getPreferenceByStudent,
    getIncomingRequests,
  } = useRoommateStore();

  const myPreference = getPreferenceByStudent(currentUser.id);
  const incomingRequests = getIncomingRequests(currentUser.id);
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [connectDialog, setConnectDialog] = useState<string | null>(null);

  // Preference form state
  const [budgetMin, setBudgetMin] = useState(myPreference?.budgetMin || 300);
  const [budgetMax, setBudgetMax] = useState(myPreference?.budgetMax || 600);
  const [cleanliness, setCleanliness] = useState(myPreference?.cleanliness || 3);
  const [sleepSchedule, setSleepSchedule] = useState<"early" | "late">(
    myPreference?.sleepSchedule || "early"
  );
  const [studyHabit, setStudyHabit] = useState<"quiet" | "social">(
    myPreference?.studyHabit || "quiet"
  );
  const [smoking, setSmoking] = useState(myPreference?.smoking || false);
  const [bio, setBio] = useState(myPreference?.bio || "");

  useEffect(() => {
    if (myPreference) {
      const newMatches = generateMatches(currentUser.id);
      setMatches(newMatches);
    }
  }, [myPreference, currentUser.id, generateMatches, preferences]);

  const handleSavePreference = () => {
    const pref: RoommatePreference = {
      id: myPreference?.id || `pref${Date.now()}`,
      studentId: currentUser.id,
      budgetMin,
      budgetMax,
      cleanliness,
      sleepSchedule,
      studyHabit,
      smoking,
      bio,
    };
    setPreference(pref);
    toast.success("Preferences saved!", {
      description: "Your roommate preferences have been updated.",
    });
  };

  const handleConnect = (targetId: string, score: number, breakdown: MatchScore["breakdown"]) => {
    sendMatchRequest(currentUser.id, targetId, score, breakdown);
    setConnectDialog(null);
    toast.success("Request sent!", {
      description: "Your roommate request has been sent.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const alreadyRequested = (targetId: string) =>
    matchResults.some(
      (m) =>
        (m.requesterId === currentUser.id && m.targetId === targetId) ||
        (m.targetId === currentUser.id && m.requesterId === targetId)
    );

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Roommate Matching 💫
        </h1>
        <p className="text-muted-foreground mt-1">
          Find your perfect roommate based on lifestyle compatibility.
        </p>
      </div>

      <Tabs defaultValue={myPreference ? "matches" : "preferences"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="matches" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Requests
            {incomingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {incomingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Your Lifestyle Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Budget Range (RM)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Cleanliness */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sparkle className="h-4 w-4 text-primary" />
                  Cleanliness Level: {cleanliness}/5
                </Label>
                <Slider
                  value={[cleanliness]}
                  onValueChange={(v) => setCleanliness(Array.isArray(v) ? v[0] : v)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Relaxed</span>
                  <span>Very Tidy</span>
                </div>
              </div>

              {/* Sleep Schedule */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  {sleepSchedule === "early" ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-indigo-500" />
                  )}
                  Sleep Schedule
                </Label>
                <Select
                  value={sleepSchedule}
                  onValueChange={(v) => setSleepSchedule(v as "early" | "late")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early">Early Bird (Before 11 PM)</SelectItem>
                    <SelectItem value="late">Night Owl (After 11 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Study Habit */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Study Style
                </Label>
                <Select
                  value={studyHabit}
                  onValueChange={(v) => setStudyHabit(v as "quiet" | "social")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiet">Quiet & Focused</SelectItem>
                    <SelectItem value="social">Social & Collaborative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Smoking */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Cigarette className="h-4 w-4 text-muted-foreground" />
                  Smoker
                </Label>
                <Switch checked={smoking} onCheckedChange={setSmoking} />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label>About You</Label>
                <Textarea
                  placeholder="Tell potential roommates about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSavePreference} className="w-full h-11">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          {!myPreference ? (
            <Card className="border-border/50">
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <h3 className="font-semibold">Set your preferences first</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to the Preferences tab to set your lifestyle preferences.
                </p>
              </CardContent>
            </Card>
          ) : matches.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <h3 className="font-semibold">No matches found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We couldn&apos;t find any compatible roommates yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => {
                const targetUser = getUserById(match.targetId);
                const targetPref = getPreferenceByStudent(match.targetId);
                if (!targetUser) return null;

                return (
                  <Card
                    key={match.targetId}
                    className="border-border/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 ring-2 ring-border">
                          <AvatarImage src={targetUser.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {targetUser.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{targetUser.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {targetUser.university}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`font-bold text-sm px-2.5 ${getScoreColor(match.score)}`}
                            >
                              {match.score}%
                            </Badge>
                          </div>

                          {targetPref?.bio && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {targetPref.bio}
                            </p>
                          )}

                          {/* Score Breakdown */}
                          <div className="mt-3 space-y-1.5">
                            {[
                              { label: "Budget", value: match.breakdown.budget, max: 40 },
                              { label: "Cleanliness", value: match.breakdown.cleanliness, max: 25 },
                              { label: "Sleep", value: match.breakdown.sleepSchedule, max: 15 },
                              { label: "Study", value: match.breakdown.studyHabit, max: 10 },
                              { label: "Smoking", value: match.breakdown.smoking, max: 10 },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground w-16">
                                  {item.label}
                                </span>
                                <div className="flex-1 h-1.5 rounded-full bg-accent overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{
                                      width: `${(item.value / item.max) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[10px] font-medium w-8 text-right">
                                  {item.value}/{item.max}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Connect Button */}
                          <div className="mt-4">
                            {alreadyRequested(match.targetId) ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled
                                className="w-full"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Connected
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full gap-1"
                                onClick={() => setConnectDialog(match.targetId)}
                              >
                                <Send className="h-4 w-4" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          {incomingRequests.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <h3 className="font-semibold">No incoming requests</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When someone sends you a roommate request, it will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((request) => {
                const requester = getUserById(request.requesterId);
                if (!requester) return null;

                return (
                  <Card key={request.id} className="border-border/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={requester.avatar} />
                          <AvatarFallback>
                            {requester.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{requester.name}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getScoreColor(request.compatibilityScore)}`}
                          >
                            {request.compatibilityScore}% match
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            rejectMatch(request.id);
                            toast.info("Request declined");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            acceptMatch(request.id);
                            toast.success("Request accepted! 🎉");
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Connect Dialog */}
      <Dialog
        open={!!connectDialog}
        onOpenChange={(open) => !open && setConnectDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Roommate Request</DialogTitle>
            <DialogDescription>
              Would you like to connect with this potential roommate?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (connectDialog) {
                  const match = matches.find((m) => m.targetId === connectDialog);
                  if (match) {
                    handleConnect(connectDialog, match.score, match.breakdown);
                  }
                }
              }}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
