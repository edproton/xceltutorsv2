// components/AvailabilityEditor.tsx
"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateAction } from "./actions";
import { useAction } from "next-safe-action/hooks";
import { getTimezoneLabel } from "@/lib/timezone";
import { GroupedAvailability } from "./types";
import { toast } from "@/hooks/use-toast";

interface AvailabilityEditorProps {
  initialData: GroupedAvailability;
  country: number;
}

export function AvailabilityEditor({
  initialData,
  country,
}: AvailabilityEditorProps) {
  const [value, setValue] = useState(JSON.stringify(initialData, null, 2));
  const [error, setError] = useState<string | null>(null);

  const { status, executeAsync } = useAction(updateAction, {
    onError: ({ error }) => {
      console.log(error);
      toast({
        title: JSON.stringify(error.validationErrors),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedData = JSON.parse(value);
      await executeAsync({
        availability: parsedData,
        countryIsoNum: country,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Your timezone: {getTimezoneLabel(country)}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Times will be automatically converted to UTC when saved
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-mono min-h-[400px]"
          placeholder="Enter your availability data as JSON..."
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={status === "executing"}>
          {status === "executing" ? "Updating..." : "Update Availability"}
        </Button>
      </form>
    </div>
  );
}
