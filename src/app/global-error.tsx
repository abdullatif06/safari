"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary — catches errors in the root layout itself. It renders
 * its own <html>/<body> because the layout (and its providers/fonts) failed,
 * so we can't rely on PageShell, i18n, or Tailwind classes being applied.
 * Kept dependency-free with inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF6EF",
          color: "#211B17",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "440px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "#D2603A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "30px",
            }}
          >
            ☀️
          </div>
          <h1 style={{ fontSize: "30px", fontWeight: 700, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6B5F54", fontSize: "16px", lineHeight: 1.6, margin: "0 0 28px" }}>
            An unexpected error stopped the page from loading. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#D2603A",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "24px", fontSize: "12px", color: "#9A8E80", fontFamily: "monospace" }}>
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
