import React from "react";

// Full-section error with a retry button, for when a page can't load its data.
const ErrorState = ({ title = "Something went wrong", message, onRetry, fullScreen = false }) => (
  <div className={`text-center px-4 ${fullScreen ? "min-h-screen flex flex-col items-center justify-center" : "my-20"}`}>
    <p className="text-6xl mb-4">⚠️</p>
    <h1 className="text-2xl font-bold">{title}</h1>
    {message && <p className="mt-2 text-base-content/60 max-w-md mx-auto">{message}</p>}
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn btn-primary mt-6">
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
