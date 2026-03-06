"use client";

import { Toaster as SonnerToaster, type ToasterProps as SonnerToasterProps } from "sonner";

type ToasterProps = SonnerToasterProps;

export const Toaster = (props: ToasterProps) => {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "border bg-background text-foreground shadow-lg",
          title: "font-semibold",
          description: "text-sm text-muted-foreground",
          actionButton:
            "inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground",
          cancelButton:
            "inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-medium",
        },
      }}
      {...props}
    />
  );
};

