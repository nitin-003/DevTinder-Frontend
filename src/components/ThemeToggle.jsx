import React, { useState } from "react";

const getInitialTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

const iconBase =
  "absolute inset-0 m-auto w-5 h-5 transition-all duration-300 ease-out";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // storage unavailable; theme still applies for this session
    }
    setTheme(next);
  };

  return (
    <div className="tooltip tooltip-left" data-tip={label}>
    <button
      type="button"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full border border-base-content/10 bg-base-200 text-base-content/70 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      aria-label={label}
    >
      {/* Sun: shown in dark mode */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${iconBase} text-amber-400 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon: shown in light mode */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${iconBase} ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
    </div>
  );
};

export default ThemeToggle;
