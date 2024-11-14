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
import { Tutor } from "./types";

interface DemoBookingConfirmationPageContentProps {
  tutor: Tutor;
}

export default function DemoBookingConfirmationPageContent({
  tutor,
}: DemoBookingConfirmationPageContentProps) {
  const meetingDate = "[TBD] Monday, 12th July at 3:00 PM";

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-center lg:justify-start">
                <div className="relative h-24 w-24 sm:h-32 sm:w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Send className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-[wiggle_2s_ease-in-out_infinite]" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/20 animate-ping" />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                  Message sent
                </h1>
                <p className="mt-2 text-lg sm:text-xl text-muted-foreground">
                  Your message has been sent to {tutor.name}.
                </p>
                <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                  While you wait to hear back, we recommend messaging up to 5
                  tutors to increase your chances of finding the right match.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                asChild
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/view-tutors">Back to tutors</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <Card className="w-full max-w-sm mx-auto mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Image
                  src={tutor.avatar}
                  alt={tutor.name}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-primary"
                />
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {tutor.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">Tutor</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Meeting Request</p>
                  <p className="text-sm text-muted-foreground">{meetingDate}</p>
                </div>
                <Button variant="outline" size="icon" className="text-primary">
                  <Calendar className="h-4 w-4" />
                  <span className="sr-only">Calendar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary">FAQs</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {`What if I don't get a response?`}
                </AccordionTrigger>
                <AccordionContent>
                  {`If you haven't heard back within 24 hours, we recommend
                  reaching out to other tutors or contacting our support team
                  for assistance.`}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What happens in a free meeting?
                </AccordionTrigger>
                <AccordionContent>
                  {`In the free meeting, you'll discuss your learning goals, the
                  tutor's teaching approach, and determine if you're a good
                  match. It's a chance to ask questions and get to know each
                  other.`}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Where does the free meeting happen?
                </AccordionTrigger>
                <AccordionContent>
                  {`The free meeting takes place online via video call. You'll
                  receive a link to join the meeting before your scheduled time.`}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
