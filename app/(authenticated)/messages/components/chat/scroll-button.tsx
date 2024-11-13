import { ChevronDown } from "lucide-react";

type ScrollButtonProps = {
  onClick: () => void;
};

export default function ScrollButton({ onClick }: ScrollButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-md mr-4"
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}
