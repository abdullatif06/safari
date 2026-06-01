import { ImageResponse } from "next/og";

// Branded social-share card (LinkedIn, WhatsApp, X, Facebook).
// No edge runtime: this lets Next statically generate the PNG at build time
// and serve it cached, instead of rendering on every request.
export const alt = "Saifi — Discover free summer events across Jordan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #211B17 0%, #3A2A1F 55%, #B14A2C 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row — brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "#D2603A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            ☀️
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fff", fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Saifi · صيفي
            </span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <span
            style={{
              color: "#E0A23B",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Summer in Jordan
          </span>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#fff",
              fontSize: "68px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
          >
            <span>Your summer in Jordan,</span>
            <span style={{ color: "#F0A98C" }}>all in one place.</span>
          </span>
        </div>

        {/* Bottom row — value props */}
        <div style={{ display: "flex", gap: "14px" }}>
          {["Always free", "All of Jordan", "Handpicked weekly"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "24px",
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
