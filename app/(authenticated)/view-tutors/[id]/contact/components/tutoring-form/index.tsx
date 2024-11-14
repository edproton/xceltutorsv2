"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "@/hooks/use-toast";
import { tutoringFormSchema } from "./schema";
import FormHeader from "./form-header";
import SubjectLevelSelect from "./subject-level-select";
import MessageInput from "./message-input";
import MeetingScheduler from "./meeting-scheduler";
import FrequencySelect from "./frequency-select";
import SubmitButton from "./submit-button";
import InfoCard from "./info-card";
import FAQSection from "./faq-section";
import { submitTutoringRequest } from "../../actions";
import { TutorInfo } from "../../types";

export default function TutoringForm({ tutor }: { tutor: TutorInfo }) {
  const [subjectOpen, setSubjectOpen] = useState(false);

  const {
    form: {
      control,
      setValue,
      watch,
      formState: { errors },
    },
    action,
    handleSubmitWithAction,
  } = useHookFormAction(
    submitTutoringRequest,
    zodResolver(tutoringFormSchema),
    {
      formProps: {
        defaultValues: {
          levelId: "",
          message: "",
          meetingDate: undefined,
          meetingTime: undefined,
          frequency: "undecided",
        },
      },
      actionProps: {
        onError: () => {
          toast({
            title: "Error",
            description: "An error occurred. Please try again.",
            variant: "destructive",
          });
        },
      },
    }
  );

  const watchedFields = watch();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <FormHeader tutorName={tutor.name} />
          <form className="space-y-8" onSubmit={handleSubmitWithAction}>
            <SubjectLevelSelect
              control={control}
              errors={errors}
              tutor={tutor}
              subjectOpen={subjectOpen}
              setSubjectOpen={setSubjectOpen}
            />
            <MessageInput
              control={control}
              errors={errors}
              tutorName={tutor.name}
            />
            <MeetingScheduler
              control={control}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />
            <FrequencySelect control={control} />
            <SubmitButton action={action} />
          </form>
        </div>
        <div className="hidden space-y-8 lg:col-span-3 lg:block">
          <InfoCard tutor={tutor} watchedFields={watchedFields} />
          <FAQSection />
        </div>
      </div>
    </div>
  );
}
