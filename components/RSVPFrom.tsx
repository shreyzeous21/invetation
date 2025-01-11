"use client";

import { useState } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Mail,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { strings } from "./string";
import { submitRSVP } from "@/app/actions/RSVPSubmit";
import { motion } from "framer-motion";

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accompany, setAccompany] = useState<string | null>(null);
  const [attendance, setAttendance] = useState("yes");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("accompany", accompany || "0");
    formData.append("attendance", attendance);

    setIsLoading(true);
    const result = await submitRSVP(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: strings.thankYouMessage,
      });
      // Reset form
      setName("");
      setEmail("");
      setAccompany(null);
      setAttendance("yes");
      setErrors({});
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
      if (result.error) {
        if (result.error.code === "23505") {
          setErrors({ email: "Email already exists" });
        }
      }
    }
    setIsLoading(false);
  };

  const openGoogleMaps = () => {
    const encodedLocation = encodeURIComponent(strings.eventLocation);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto my-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {strings.title}
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {strings.description}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 mb-8">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              {strings.eventDateLabel}
            </Label>
            <Calendar
              mode="single"
              selected={new Date(strings.eventDate)}
              className="rounded-xl border-2 border-purple-100 dark:border-gray-700 p-4"
              fromDate={new Date(strings.eventDate)}
              toDate={new Date(strings.eventDate)}
              defaultMonth={new Date(strings.eventDate)}
              ISOWeek
            />
          </div>

          <div className="space-y-4 flex flex-col justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={openGoogleMaps}
              className="w-full h-12 text-lg hover:scale-105 transition-transform bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              <MapPin className="mr-2" />
              {strings.viewOnMapButton}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                <User className="inline-block w-4 h-4 mr-2" />
                {strings.nameLabel}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                <Mail className="inline-block w-4 h-4 mr-2" />
                {strings.emailLabel}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accompany" className="text-sm font-medium">
              <Users className="inline-block w-4 h-4 mr-2" />
              {strings.accompanyLabel}
            </Label>
            <Input
              id="accompany"
              type="number"
              min="0"
              value={accompany || ""}
              onChange={(e) => setAccompany(e.target.value)}
              className="h-12 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">{strings.rsvpLabel}</Label>
            <RadioGroup
              value={attendance}
              onValueChange={setAttendance}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2 bg-purple-50 dark:bg-gray-700 p-4 rounded-lg flex-1">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">{strings.yesOption}</Label>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 dark:bg-gray-700 p-4 rounded-lg flex-1">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">{strings.noOption}</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-white"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                ⭐
              </motion.div>
            ) : null}
            {isLoading ? "Sending..." : strings.submitButton}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
