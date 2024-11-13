"use client";

import { useState, useEffect, useRef } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Shield,
  Heart,
  Info,
  Sun,
  Moon,
  Clock,
  MessageCircle,
  X,
  GraduationCap,
  MapPin,
  Menu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TutorWithAvailabilityAndServices } from "../tutors-repository";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@/components/ui/skeleton";

const weekdayIndexMap = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export default function ViewTutorsByIdPageContent({
  tutor: { name, avatar, metadata, availabilities, services },
}: {
  tutor: TutorWithAvailabilityAndServices;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnimationComplete, setAnimationComplete] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(false);
  const [aboutHeight, setAboutHeight] = useState("auto");
  const [sessionsHeight, setSessionsHeight] = useState("auto");
  const aboutRef = useRef<HTMLParagraphElement>(null);
  const sessionsRef = useRef<HTMLParagraphElement>(null);
  const [isAboutOverflowing, setIsAboutOverflowing] = useState(false);
  const [isSessionsOverflowing, setIsSessionsOverflowing] = useState(false);

  useEffect(() => {
    if (aboutRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(aboutRef.current).lineHeight
      );
      const maxHeight = lineHeight * 2; // 2 lines
      setIsAboutOverflowing(aboutRef.current.scrollHeight > maxHeight);
    }

    if (sessionsRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(sessionsRef.current).lineHeight
      );
      const maxHeight = lineHeight * 2; // 2 lines
      setIsSessionsOverflowing(sessionsRef.current.scrollHeight > maxHeight);
    }
  }, []);

  useEffect(() => {
    if (aboutRef.current) {
      setAboutHeight(aboutRef.current.scrollHeight + "px");
    }
    if (sessionsRef.current) {
      setSessionsHeight(sessionsRef.current.scrollHeight + "px");
    }
  }, []);

  const toggleAbout = () => setIsAboutExpanded(!isAboutExpanded);
  const toggleSessions = () => setIsSessionsExpanded(!isSessionsExpanded);

  useEffect(() => {
    setAnimationComplete(true);
  }, []);

  const staggeredFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.15,
        duration: 0.25,
        ease: "easeOut",
      },
    }),
  };

  // Initialize the table data structure
  const tableData = [
    {
      time: "Pre 12pm",
      icon: <Sun className="h-4 w-4 text-amber-500" />,
      slots: Array(7).fill(0),
    },
    {
      time: "12 - 5pm",
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      slots: Array(7).fill(0),
    },
    {
      time: "After 5pm",
      icon: <Moon className="h-4 w-4 text-indigo-500" />,
      slots: Array(7).fill(0),
    },
  ];

  // Map the availabilities to the table data
  availabilities.forEach(({ morning, afternoon, evening, weekday }) => {
    const index = weekdayIndexMap[weekday as keyof typeof weekdayIndexMap];

    if (index !== undefined) {
      if (morning) tableData[0].slots[index] = 1;
      if (afternoon) tableData[1].slots[index] = 1;
      if (evening) tableData[2].slots[index] = 1;
    }
  });

  const Sidebar = () => (
    <div className="space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4 hide-scrollbar">
      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">
              Get in touch with {name.split(" ")[0]}
            </h3>
            <p className="text-sm text-muted-foreground">
              Have a chat with {name.split(" ")[0]} and see how (and when!) they
              can help
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold transition-all duration-200 transform hover:scale-105"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Get in touch
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start a conversation with Angel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full hover:bg-primary/5 transition-colors duration-200 ${
                    isBookmarked ? "text-primary" : ""
                  }`}
                  size="lg"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  {isBookmarked ? (
                    <Heart className="mr-2 h-4 w-4 fill-primary" />
                  ) : (
                    <Heart className="mr-2 h-4 w-4" />
                  )}
                  {isBookmarked ? "Saved" : "Save profile"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isBookmarked
                    ? "Remove from saved profiles"
                    : "Save this profile for later"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Tutor Impact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-center text-center">
            <Star className="w-8 h-8 text-primary mb-2" />
            <span className="text-2xl font-bold">{metadata.reviews}</span>
            <span className="text-sm text-muted-foreground">
              Received reviews
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-primary mb-2" />
            <span className="text-2xl font-bold">
              {metadata.completedLessons}
            </span>
            <span className="text-sm text-muted-foreground">
              Lessons completed
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-32 w-32 rounded-lg border-4 border-background shadow-xl">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="rounded-none">
                  <Skeleton className="h-full w-full" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>{metadata.degree}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{metadata.university}</span>
                    </div>
                  </div>
                </div>
                <Badge className="text-lg font-semibold px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200">
                  {Math.min(...services.map((s) => s.price)) ===
                  Math.max(...services.map((s) => s.price))
                    ? `£${Math.min(...services.map((s) => s.price))}/hr`
                    : `£${Math.min(
                        ...services.map((s) => s.price)
                      )} - £${Math.max(...services.map((s) => s.price))}/hr`}
                </Badge>
              </div>
            </div>
            {/* About Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About me</h2>
              <div className="relative">
                <motion.div
                  animate={{ height: isAboutExpanded ? aboutHeight : "3em" }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden"
                >
                  <p
                    ref={aboutRef}
                    className={`text-muted-foreground ${
                      isAboutExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {metadata.bio.full}
                  </p>
                </motion.div>
                {isAboutOverflowing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 hover:bg-primary/10 transition-colors duration-200"
                    onClick={toggleAbout}
                  >
                    {isAboutExpanded ? (
                      <>
                        Show less <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* About Sessions Section */}
            {metadata.bio.session && metadata.bio.session.length > 10 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About my sessions</h2>
                <div className="relative">
                  <motion.div
                    animate={{
                      height: isSessionsExpanded ? sessionsHeight : "3em",
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    <p
                      ref={sessionsRef}
                      className={`text-muted-foreground ${
                        isSessionsExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {metadata.bio.session}
                    </p>
                  </motion.div>
                  {isSessionsOverflowing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 hover:bg-primary/10 transition-colors duration-200"
                      onClick={toggleSessions}
                    >
                      {isSessionsExpanded ? (
                        <>
                          Show less <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Verification Badges */}
            <motion.div
              initial="hidden"
              animate={isAnimationComplete ? "visible" : "hidden"}
              className="flex flex-wrap gap-4"
            >
              <motion.div variants={staggeredFadeIn} custom={0}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors duration-200"
                    >
                      <BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-800 dark:text-emerald-200">
                        Verified Tutor
                      </span>
                      <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-lg mb-2">
                      Interviewed and Approved
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We carefully select tutors from top UK universities,
                      evaluating their expertise, communication, and teaching
                      skills. Only the crème de la crème are chosen to join our
                      team.
                    </p>
                  </PopoverContent>
                </Popover>
              </motion.div>

              <motion.div variants={staggeredFadeIn} custom={1}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200"
                    >
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-800 dark:text-blue-200">
                        DBS Checked
                      </span>
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-lg mb-2">
                      Enhanced DBS check
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {`DBS check completed. The Disclosure and Barring Service (DBS) helps employers make safer recruitment decisions and prevents unsuitable people from working with vulnerable groups, including children.`}
                    </p>
                  </PopoverContent>
                </Popover>
              </motion.div>
            </motion.div>
            {/* Subjects Offered Section */}
            <motion.div
              variants={staggeredFadeIn}
              custom={2}
              initial="hidden"
              animate={isAnimationComplete ? "visible" : "hidden"}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Subjects offered</h2>
              <div className="overflow-x-auto rounded-lg border border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((subject, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-primary/5 transition-colors duration-200"
                      >
                        <TableCell>{subject.subject}</TableCell>
                        <TableCell>{subject.level}</TableCell>
                        <TableCell>£{subject.price}/hr</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
            {/* General Availability Section */}
            <motion.div
              variants={staggeredFadeIn}
              custom={3}
              initial="hidden"
              animate={isAnimationComplete ? "visible" : "hidden"}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">General Availability</h2>
              <div className="overflow-x-auto rounded-lg border border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[140px]"></TableHead>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <TableHead
                            key={day}
                            className="text-center font-semibold"
                          >
                            {day}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow
                        key={row.time}
                        className="hover:bg-primary/5 transition-colors duration-200"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {row.icon}
                            {row.time}
                          </div>
                        </TableCell>
                        {row.slots.map((available, i) => (
                          <TableCell key={i} className="text-center">
                            {available ? (
                              <BadgeCheck className="h-4 w-4 mx-auto text-emerald-500" />
                            ) : (
                              <X className="h-4 w-4 mx-auto text-gray-300" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>

            {/* Qualifications Section */}
            <motion.div
              variants={staggeredFadeIn}
              custom={4}
              initial="hidden"
              animate={isAnimationComplete ? "visible" : "hidden"}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Qualifications</h2>
              <div className="overflow-x-auto rounded-lg border border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metadata.grades.map((qual, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-primary/5 transition-colors duration-200"
                      >
                        <TableCell>{qual.subject}</TableCell>
                        <TableCell>{qual.level}</TableCell>
                        <TableCell>{qual.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-20 z-40 space-y-6">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block">
                <Sidebar />
              </div>

              {/* Mobile Sidebar Toggle */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
                    >
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[300px] sm:w-[400px] overflow-y-auto"
                  >
                    <VisuallyHidden.Root>
                      <SheetTitle>Tutor Information Sidebar</SheetTitle>
                    </VisuallyHidden.Root>
                    <Sidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
