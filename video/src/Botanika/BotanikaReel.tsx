import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { BRAND } from "./constants";

export const botanikaReelSchema = z.object({
  brandName: z.string(),
  tagline: z.string(),
  url: z.string(),
  green: z.string(),
  indigo: z.string(),
});

type Props = z.infer<typeof botanikaReelSchema>;

const FONT =
  '"Helvetica Neue", Helvetica, Arial, "Segoe UI", system-ui, sans-serif';

const PILLARS = [
  { seal: "seals/natural.svg", label: "Natural", desc: "Fórmulas de origem natural" },
  { seal: "seals/testado.svg", label: "Testado", desc: "Segurança comprovada" },
  { seal: "seals/rastreavel.svg", label: "Rastreável", desc: "Origem transparente" },
];

// Soft botanical backdrop: brand mist with two brand-tinted glows.
const Backdrop: React.FC<{ green: string; indigo: string }> = ({
  green,
  indigo,
}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 180], [0, 60]);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.mist }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${20 + drift / 6}% 15%, ${green}33, transparent 45%),
            radial-gradient(circle at 85% ${80 - drift / 8}%, ${indigo}2e, transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 1 — animated wordmark reveal.
const Intro: React.FC<Props> = ({ brandName, tagline, green, indigo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [40, 0]);
  const leafScale = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const lineW = interpolate(frame, [16, 34], [0, 220], {
    extrapolateRight: "clamp",
  });
  const taglineOpacity = interpolate(frame, [24, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: enter,
      }}
    >
      <div style={{ transform: `translateY(${y}px)`, textAlign: "center" }}>
        <div
          style={{
            transform: `scale(${leafScale})`,
            width: 128,
            height: 128,
            margin: "0 auto 36px",
          }}
        >
          <Leaf green={green} indigo={indigo} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 108,
            letterSpacing: "0.14em",
            color: BRAND.ink,
            textTransform: "uppercase",
          }}
        >
          {brandName}
        </div>
        <div
          style={{
            height: 6,
            width: lineW,
            background: green,
            borderRadius: 3,
            margin: "28px auto",
          }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 40,
            color: indigo,
            opacity: taglineOpacity,
            letterSpacing: "0.02em",
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2 — the three brand pillars, each with its real seal icon.
const Pillars: React.FC<Props> = ({ indigo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: 80 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 56, width: "100%" }}>
        {PILLARS.map((p, i) => {
          const local = frame - i * 8;
          const s = spring({ frame: local, fps, config: { damping: 18, stiffness: 90 } });
          const x = interpolate(s, [0, 1], [-120, 0]);
          return (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                opacity: s,
                transform: `translateX(${x}px)`,
                background: BRAND.white,
                borderRadius: 32,
                padding: "36px 44px",
                boxShadow: "0 24px 60px rgba(50,60,145,0.12)",
              }}
            >
              <Img src={staticFile(p.seal)} style={{ width: 108, height: 108 }} />
              <div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 56,
                    color: BRAND.ink,
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 500,
                    fontSize: 34,
                    color: indigo,
                    marginTop: 6,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3 — call to action.
const CallToAction: React.FC<Props> = ({ url, green, indigo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const pulse = 1 + 0.02 * Math.sin(frame / 6);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: enter,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 64,
            color: BRAND.ink,
            marginBottom: 48,
          }}
        >
          Descubra a Botanika
        </div>
        <div
          style={{
            display: "inline-block",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 42,
            color: BRAND.white,
            background: green,
            padding: "28px 64px",
            borderRadius: 999,
            letterSpacing: "0.02em",
            transform: `scale(${pulse})`,
            boxShadow: `0 20px 50px ${indigo}40`,
          }}
        >
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Leaf: React.FC<{ green: string; indigo: string }> = ({ green, indigo }) => (
  <svg viewBox="0 0 96 96" width="100%" height="100%" fill="none">
    <circle cx="48" cy="48" r="48" fill={green} opacity={0.14} />
    <path
      d="M48 78C40 62 40 40 66 22C60 48 60 66 48 78Z"
      fill={green}
    />
    <path
      d="M48 78C56 62 56 40 30 22C36 48 36 66 48 78Z"
      fill={indigo}
    />
    <path d="M48 78V40" stroke={BRAND.white} strokeWidth={3} strokeLinecap="round" />
  </svg>
);

export const BotanikaReel: React.FC<Props> = (props) => {
  return (
    <AbsoluteFill>
      <Backdrop green={props.green} indigo={props.indigo} />
      <Sequence durationInFrames={62}>
        <Intro {...props} />
      </Sequence>
      <Sequence from={62} durationInFrames={70}>
        <Pillars {...props} />
      </Sequence>
      <Sequence from={132}>
        <CallToAction {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};
