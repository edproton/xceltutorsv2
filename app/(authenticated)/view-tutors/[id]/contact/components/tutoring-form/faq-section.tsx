import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">FAQs</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What should I put in a message?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">A message is a good way to:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                {`Introduce yourself and explain what you're looking for in a
                tutor`}
              </li>
              <li>
                Ask the tutor any questions you have about them, the process, or
                what happens next
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            What happens when I send a tutor a message?
          </AccordionTrigger>
          <AccordionContent>
            The tutor will review your message and respond within 24 hours to
            schedule your free meeting.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What happens in a free meeting?</AccordionTrigger>
          <AccordionContent>
            {`You'll discuss your needs, goals, and how the tutor can help. It's a
            chance to see if you're a good fit.`}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Who are the tutors?</AccordionTrigger>
          <AccordionContent>
            Our tutors are experienced educators who have been carefully
            selected and verified.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
