import { createContext } from "react";
import { useActiveId } from "../lib/hooks";

type ActiveIdContextProviderProps = {
  children: React.ReactNode;
};

type ActiveIdContext = {
  activeId: number | null;
};

export const ActiveIdContext = createContext<ActiveIdContext | null>(null);

export default function ActiveIdContextProvider({
  children,
}: ActiveIdContextProviderProps) {
  const activeId = useActiveId();

  return (
    <ActiveIdContext.Provider
      value={{
        activeId,
      }}
    >
      {children}
    </ActiveIdContext.Provider>
  );
}
