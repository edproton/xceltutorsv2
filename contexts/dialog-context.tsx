"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type DialogContextType = {
  showDialog: (content: React.ReactNode) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );

  const showDialog = (content: React.ReactNode) => {
    setDialogContent(content);
  };

  const closeDialog = () => {
    setDialogContent(null);
  };

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog }}>
      {children}
      <Dialog open={!!dialogContent} onOpenChange={closeDialog}>
        <DialogContent>{dialogContent}</DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
