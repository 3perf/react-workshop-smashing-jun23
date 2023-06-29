import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import { memo } from "react";
import { DarkModeContext } from "../DarkModeContext";
import "./index.css";
import { useContextSelector } from "use-context-selector";

function DarkModeSwitcher() {
  const mode = useContextSelector(DarkModeContext, (context) => context.mode);
  const setMode = useContextSelector(
    DarkModeContext,
    (context) => context.setMode
  );

  // “Let’s use useContextSelector from now on!”

  return (
    <div className="theme-switcher">
      <ToggleButtonGroup
        size="small"
        value={mode}
        exclusive
        onChange={(_e, value) => setMode(value)}
        aria-label="text alignment"
      >
        <ToggleButton value="light">
          <WbSunnyIcon />
        </ToggleButton>
        <ToggleButton value="dark">
          <Brightness2Icon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default memo(DarkModeSwitcher);
