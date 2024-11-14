import { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TutoringFormData } from "./schema";

interface FrequencySelectProps {
  control: Control<TutoringFormData>;
}

export default function FrequencySelect({ control }: FrequencySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="frequency">
        Frequency (How often would you like lessons?)
      </Label>
      <Controller
        name="frequency"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="I'll decide later" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="undecided">I'll decide later</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
