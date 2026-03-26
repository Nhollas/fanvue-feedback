"use client";

import { createContext, type ReactNode, useContext } from "react";

export function createActionContext<T>(name: string) {
  const Context = createContext<T | null>(null);

  function Provider({ value, children }: { value: T; children: ReactNode }) {
    return <Context value={value}>{children}</Context>;
  }

  function useAction(): T {
    const action = useContext(Context);
    if (!action) {
      throw new Error(`${name} must be used within its provider`);
    }
    return action;
  }

  return [Provider, useAction] as const;
}
