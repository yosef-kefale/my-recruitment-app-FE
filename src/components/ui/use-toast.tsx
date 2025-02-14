"use client";

import * as React from "react";
import { ToastProvider, ToastViewport, useToast as useRadixToast } from "@/components/ui/toast";

export function useToast() {
  return useRadixToast();
}

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  );
}
