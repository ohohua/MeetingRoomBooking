import { useEffect, useState } from "react";

export enum Theme {
  DARK = "dark",

  LIGHT = "light",
}
const THEME_MODE = "theme_mode";
function useDark() {
  const [dark, setDark] = useState(false);

  function initTheme() {
    const isDarkMode =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const cacheTheme = (localStorage.getItem(THEME_MODE) as Theme) || null;
    if (!cacheTheme && isDarkMode) {
      setTheme(true);
      return;
    }
  }
  function setTheme(state: boolean) {
    setDark(state);
    // document.documentElement.classList.toggle(Theme.DARK, state);
    document.documentElement.setAttribute("data-mode", state ? Theme.DARK : Theme.LIGHT);
    localStorage.setItem(THEME_MODE, state ? Theme.DARK : Theme.LIGHT);
  }

  function toggle() {
    setTheme(!dark);
  }
  useEffect(() => {
    initTheme();
  }, []);

  return {
    dark,
    toggle,
  };
}

export default useDark;
