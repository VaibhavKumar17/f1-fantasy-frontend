"use client";

import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport, ToastProvider } from "@/components/ui/toast";

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
      {/* The individual <Toast /> instances are rendered by consumers using the toast primitives/hooks. */}
      <Toast>
        <div className="flex flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastClose />
      </Toast>
    </ToastProvider>
  );
}

