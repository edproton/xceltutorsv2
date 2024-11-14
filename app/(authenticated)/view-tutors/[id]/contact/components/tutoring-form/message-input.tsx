import { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TutoringFormData } from "./schema";

interface MessageInputProps {
  control: Control<TutoringFormData>;
  errors: FieldErrors<TutoringFormData>;
  tutorName: string;
}

export default function MessageInput({
  control,
  errors,
  tutorName,
}: MessageInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="message">
        Describe your tutoring needs <span className="text-red-500">*</span>
      </Label>
      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <Textarea
            id="message"
            placeholder={`Let ${tutorName} know what you're looking for (the more detail, the better)`}
            className={`min-h-[120px] ${
              errors.message ? "border-red-500" : ""
            }`}
            {...field}
          />
        )}
      />
      {errors.message && (
        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
      )}
    </div>
  );
}
