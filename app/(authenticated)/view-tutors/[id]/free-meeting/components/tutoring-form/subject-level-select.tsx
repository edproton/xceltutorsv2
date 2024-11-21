import { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { TutoringFormData } from "./schema";
import { useState } from "react";
import { GetTutorWithGroupedServicesQueryResponse } from "@/lib/queries/GetTutorWithGroupedServicesQuery";

interface SubjectLevelSelectProps {
  control: Control<TutoringFormData>;
  errors: FieldErrors<TutoringFormData>;
  tutor: GetTutorWithGroupedServicesQueryResponse;
  subjectOpen: boolean;
  setSubjectOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SubjectLevelSelect({
  control,
  errors,
  tutor,
  subjectOpen,
  setSubjectOpen,
}: SubjectLevelSelectProps) {
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState<string>("");
  return (
    <div className="space-y-2">
      <Label htmlFor="levelId">
        Subject and level <span className="text-red-500">*</span>
      </Label>
      <Controller
        name="levelId"
        control={control}
        render={({ field }) => (
          <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={subjectOpen}
                className={`w-full justify-between ${
                  errors.levelId ? "border-red-500" : ""
                }`}
              >
                {selectedSubjectLevel || "Select subject and level"}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] p-0"
              style={{
                width: "var(--radix-popover-trigger-width)",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <Command>
                <CommandInput placeholder="Search subject or level" />
                <CommandEmpty>No subject or level found.</CommandEmpty>
                {tutor.subjects.map((subject) => (
                  <CommandGroup key={subject.name} heading={subject.name}>
                    {subject.levels.map((level) => (
                      <CommandItem
                        key={`${subject.name}-${level.id}`}
                        value={`${subject.name}-${level.name}`}
                        onSelect={() => {
                          field.onChange(level.id);
                          setSelectedSubjectLevel(
                            `${subject.name} - ${level.name}`
                          );
                          setSubjectOpen(false);
                        }}
                      >
                        <span>{level.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      {errors.levelId && (
        <p className="text-red-500 text-sm mt-1">
          {errors.levelId.message || "Please select a subject and level"}
        </p>
      )}
    </div>
  );
}
