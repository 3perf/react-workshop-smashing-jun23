import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { createContext } from "use-context-selector";

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  console.log("rerendered → X changed");

  const [mode, setMode] = useState("light");

  useEffect(() => {
    document.body.classList.add("theme-" + mode);

    return () => {
      document.body.classList.remove("theme-" + mode);
    };
  }, [mode]);

  // const X = { mode, setMode };
  // const X = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <DarkModeContext.Provider value={{ mode, setMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Context → X
// Component1 → X = useContext(...)
// Component2 → X = useContext(...)
// Component3 → X = useContext(...)
