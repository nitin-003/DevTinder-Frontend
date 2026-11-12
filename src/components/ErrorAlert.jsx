import React from "react";

// Inline error message. Renders nothing when there is no message.
const ErrorAlert = ({ message, onDismiss, className = "" }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 mt-px" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <span className="flex-1 break-words">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
