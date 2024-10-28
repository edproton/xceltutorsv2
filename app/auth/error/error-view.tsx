import React from "react";
import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ErrorType =
  | "missing_params"
  | "missing_verifier"
  | "auth_failed"
  | "default";

interface ErrorMessage {
  title: string;
  description: string;
}

const errorMessages: Record<ErrorType, ErrorMessage> = {
  missing_params: {
    title: "Invalid Request",
    description:
      "The authentication request is missing required parameters. Please try again.",
  },
  missing_verifier: {
    title: "Authentication Error",
    description:
      "The verification code is missing or expired. Please start the authentication process again.",
  },
  auth_failed: {
    title: "Authentication Failed",
    description:
      "We couldn't authenticate you at this time. Please try again or contact support if the problem persists.",
  },
  default: {
    title: "Something went wrong",
    description:
      "An unexpected error occurred. Please try again or contact support if the problem persists.",
  },
};

interface ErrorViewProps {
  errorCode?: string;
  className?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  errorCode = "default",
  className = "",
}) => {
  const error = errorMessages[errorCode as ErrorType] || errorMessages.default;

  return (
    <div
      className={`min-h-[50vh] flex items-center justify-center p-4 ${className}`}
    >
      <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="animate-bounce">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <CardTitle>{error.title}</CardTitle>
          </div>
          <CardDescription>Error code: {errorCode}</CardDescription>
        </CardHeader>

        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              {error.description}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button
              variant="default"
              asChild
              className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            >
              <div>
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </div>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorView;
