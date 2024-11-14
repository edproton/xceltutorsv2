"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogComponentProps = {
  params: Record<string, string>;
  onClose: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

type DialogComponent = React.ComponentType<DialogComponentProps>;

interface CallbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callbackName: string;
  params: Record<string, string>;
}

const dialogCache = new Map<string, DialogComponent>();
const CLOSE_DELAY_MS = 200;

export function CallbackDialog({
  isOpen,
  onClose,
  callbackName,
  params,
}: CallbackDialogProps) {
  const [title, setTitle] = useState("");
  const [DialogComponent, setDialogComponent] =
    useState<DialogComponent | null>(null);
  const prevIsOpenRef = useRef(isOpen);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (prevIsOpenRef.current) {
        // Add a delay for the close animation
        closeTimeoutRef.current = setTimeout(() => {
          setTitle("");
          setDialogComponent(null);
        }, CLOSE_DELAY_MS);
      }
      prevIsOpenRef.current = false;
      return;
    }

    prevIsOpenRef.current = true;

    const loadComponent = async () => {
      if (dialogCache.has(callbackName)) {
        setDialogComponent(() => dialogCache.get(callbackName)!);
        return;
      }

      try {
        const { default: Component } = (await import(
          `@/components/dialogs/${callbackName}`
        )) as { default: DialogComponent };
        dialogCache.set(callbackName, Component);
        setDialogComponent(() => Component);
      } catch (error) {
        console.error(`Failed to load dialog: ${callbackName}`, error);
        setDialogComponent(() => ErrorDialogComponent);
      }
    };

    loadComponent();

    // Clear the timeout if the component unmounts
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen, callbackName]);

  if (!DialogComponent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogComponent
          params={params}
          onClose={onClose}
          setTitle={setTitle}
        />
      </DialogContent>
    </Dialog>
  );
}

const ErrorDialogComponent: DialogComponent = ({ onClose, setTitle }) => {
  useEffect(() => {
    setTitle("Error");
  }, [setTitle]);

  return (
    <div role="alert" className="text-red-500">
      <h2 className="text-lg font-semibold">Error: Failed to load dialog</h2>
      <button onClick={onClose} className="mt-2">
        Close
      </button>
    </div>
  );
};
