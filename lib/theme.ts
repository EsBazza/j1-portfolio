export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/** Browser-chrome color per theme; matches --bg in globals.css. */
export const THEME_COLORS: Record<Theme, string> = {
  dark: "#0d0d0b",
  light: "#f4f2eb",
};

/**
 * Runs in <head> before first paint: marks JS as available (reveal styles key
 * off the `js` class) and applies a stored theme choice without a flash.
 */
export const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){d.dataset.theme=t;if(t==="light")document.addEventListener("DOMContentLoaded",function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="${THEME_COLORS.light}"})}}catch(e){}})();`;
