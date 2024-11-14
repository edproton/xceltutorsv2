import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface ActionState {
  isExecuting: boolean;
}

interface SubmitButtonProps {
  action: ActionState;
}

export default function SubmitButton({ action }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full sm:w-auto"
      disabled={action.isExecuting}
    >
      {action.isExecuting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
