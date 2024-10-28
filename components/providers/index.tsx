"use client";

import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: Readonly<React.ReactNode>;
}

export default function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
