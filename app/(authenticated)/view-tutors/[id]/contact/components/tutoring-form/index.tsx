"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { tutoringFormSchema } from "./schema";
import FormHeader from "./form-header";
import SubjectLevelSelect from "./subject-level-select";
import MessageInput from "./message-input";
import MeetingScheduler from "./meeting-scheduler";
import FrequencySelect from "./frequency-select";
import SubmitButton from "./submit-button";
import InfoCard from "./info-card";
import FAQSection from "./faq-section";
import { submitTutoringRequest } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { GetTutorWithGroupedServicesQueryResponse } from "@/lib/queries/GetTutorWithGroupedServicesQuery";

export default function TutoringForm({
  tutor,
}: {
  tutor: GetTutorWithGroupedServicesQueryResponse;
}) {
  const [subjectOpen, setSubjectOpen] = useState(false);
  const router = useRouter();
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
          tutorId: tutor.id,
          levelId: undefined,
          message: "",
          meetingDate: undefined,
          meetingTime: undefined,
          frequency: "undecided",
        },
      },
      actionProps: {
        onSuccess: () => {
          toast({
            title: `🎉 Booking request sent to ${tutor.name}`,
            description: `We've notified ${tutor.name} of your interest. Check your messages for their response.`,
            variant: "success",
          });

          router.replace(`/messages`);
        },
        onError: ({ error }) => {
          toast({
            title: "Error",
            description: error.serverError,
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
            <input type="hidden" name="tutorId" value={tutor.id} />
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
