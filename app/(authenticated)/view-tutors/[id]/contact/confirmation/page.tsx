"use client";

import Image from "next/image";
import Link from "next/link";
import { Send, Calendar } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MessageSentProps {
  tutorName: string;
  meetingDate: string;
  profileImage: string;
}

export default function MessageSent({
  tutorName = "James",
  meetingDate = "1 Nov '30, 12:15",
  profileImage = "/placeholder.svg",
}: MessageSentProps) {
  const generateICSFile = () => {
    const [date, time] = meetingDate.split(", ");
    const formattedDate = new Date(`${date} ${time}`)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formattedDate}
DTEND:${formattedDate.replace("T", "T013000")}
SUMMARY:Tutoring Session with ${tutorName}
DESCRIPTION:Your free tutoring session with ${tutorName}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tutoring_session_with_${tutorName
      .toLowerCase()
      .replace(" ", "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-center lg:justify-start">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Send className="h-16 w-16 text-blue-500 animate-send" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-yellow-400 animate-ping" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Message sent
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Your message has been sent to {tutorName}.
                </p>
                <p className="mt-4 text-muted-foreground">
                  While you wait to hear back, we recommend messaging up to 5
                  tutors to increase your chances of finding the right match.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                asChild
                variant="default"
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800"
              >
                <Link href="/view-tutors">Back to tutors</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <Card className="w-full max-w-sm mx-auto mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Image
                  src={profileImage}
                  alt={tutorName}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">{tutorName}</h2>
                  <p className="text-sm text-muted-foreground">Tutor</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Meeting Request</p>
                  <p className="text-sm text-muted-foreground">{meetingDate}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateICSFile}
                  title="Download calendar invite"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="sr-only">Download calendar invite</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">FAQs</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What if I don&apos;t get a response?
                </AccordionTrigger>
                <AccordionContent>
                  If you haven&apos;t heard back within 24 hours, we recommend
                  reaching out to other tutors or contacting our support team
                  for assistance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What happens in a free meeting?
                </AccordionTrigger>
                <AccordionContent>
                  In the free meeting, you&apos;ll discuss your learning goals,
                  the tutor&apos;s teaching approach, and determine if
                  you&apos;re a good match. It&apos;s a chance to ask questions
                  and get to know each other.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Where does the free meeting happen?
                </AccordionTrigger>
                <AccordionContent>
                  The free meeting takes place online via video call.
                  You&apos;ll receive a link to join the meeting before your
                  scheduled time.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes send {
          0% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(10px) translateY(-10px);
          }
          100% {
            transform: translateX(0) translateY(0);
          }
        }
        .animate-send {
          animation: send 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
