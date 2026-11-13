export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/** Stores the home page's 30-second view choice. */
export const BRIEF_STORAGE_KEY = "view";

/** Which hero pet sleeps on the D (see lib/pets.ts). */
export const PET_STORAGE_KEY = "pet";

/** Browser-chrome color per theme; matches --bg in globals.css. */
export const THEME_COLORS: Record<Theme, string> = {
  dark: "#0d0d0b",
  light: "#f4f2eb",
};

/**
 * Runs in <head> before first paint: marks JS as available (reveal styles key
 * off the `js` class) and applies a stored theme choice, the home page's
 * 30-second view and the chosen hero pet, without a flash.
 */
export const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){d.dataset.theme=t;if(t==="light")document.addEventListener("DOMContentLoaded",function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="${THEME_COLORS.light}"})}if(location.pathname==="/"&&localStorage.getItem("${BRIEF_STORAGE_KEY}")==="brief")d.dataset.view="brief";if(localStorage.getItem("${PET_STORAGE_KEY}")==="cat")d.dataset.pet="cat"}catch(e){}})();`;

/** Switches the theme now and remembers the choice. Browser only. */
export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[next]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable (private mode); the switch still applies.
  }
}

/** The theme currently shown. Browser only. */
export const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";
