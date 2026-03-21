import { SessionProvider } from "next-auth/react";
import { NextStepProvider } from "nextstepjs";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextStepProvider>
        {children}
      </NextStepProvider>
    </SessionProvider>
  );
}
