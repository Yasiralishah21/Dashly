"use client";

import React, { createContext, useContext, useState } from "react";

// Whether the sidebar is open (matters on mobile; on desktop it's always visible).
interface SidebarContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) return { open: false, setOpen: () => {}, toggle: () => {} };
  return ctx;
}
