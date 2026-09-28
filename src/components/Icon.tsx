import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "crescent"
  | "home"
  | "book"
  | "beads"
  | "mosque"
  | "compass"
  | "star"
  | "heart"
  | "heart-filled"
  | "logout"
  | "sunrise"
  | "moon"
  | "sun"
  | "bed"
  | "check"
  | "reset"
  | "flame"
  | "location"
  | "arrow-right"
  | "chevron-left"
  | "settings"
  | "trash"
  | "share"
  | "minus"
  | "plus"
  | "kaaba"
  | "info"
  | "clock";

/** Directional icons that should be mirrored when the UI is right-to-left. */
const MIRRORED: readonly IconName[] = ["arrow-right", "chevron-left"];

const paths: Record<IconName, ReactNode> = {
  crescent: (
    <path
      fill="currentColor"
      d="M14.5 2.5a9.5 9.5 0 1 0 7 15.9A8 8 0 0 1 14.5 2.5Zm5.2 2.1.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9.9-2Z"
    />
  ),
  home: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 11.5 12 4l9 7.5M5.5 9.8V20h4.8v-5.5h3.4V20h4.8V9.8"
    />
  ),
  book: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.5c-1.8-1.6-4.6-2-8-1.5v13.5c3.4-.5 6.2-.1 8 1.5 1.8-1.6 4.6-2 8-1.5V5c-3.4-.5-6.2-.1-8 1.5Zm0 0V20"
    />
  ),
  beads: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="4.5" r="1.8" />
      <circle cx="17.8" cy="7.5" r="1.8" />
      <circle cx="19.2" cy="13.5" r="1.8" />
      <circle cx="15.5" cy="18.3" r="1.8" />
      <circle cx="8.5" cy="18.3" r="1.8" />
      <circle cx="4.8" cy="13.5" r="1.8" />
      <circle cx="6.2" cy="7.5" r="1.8" />
      <path d="M12 20.2v2" />
    </g>
  ),
  mosque: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 20v-7M20 20v-7M4 13h16M2 20h20M7 13c0-3 2.2-4.5 5-7 2.8 2.5 5 4 5 7M12 3v3M8.5 20v-3.5a3.5 3.5 0 0 1 7 0V20"
    />
  ),
  compass: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </g>
  ),
  star: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="m12 3 2.2 5.4 5.8.5-4.4 3.8 1.3 5.7L12 15.4l-4.9 3 1.3-5.7L4 8.9l5.8-.5L12 3Z"
    />
  ),
  heart: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.3Z"
    />
  ),
  "heart-filled": (
    <path
      fill="currentColor"
      d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.3Z"
    />
  ),
  logout: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"
    />
  ),
  sunrise: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 18h18M5 21h14M7 15a5 5 0 0 1 10 0M12 3v4M4.5 8.5l2 2M19.5 8.5l-2 2M2 13h2M20 13h2"
    />
  ),
  moon: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"
    />
  ),
  sun: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7" />
    </g>
  ),
  bed: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M3 18v1M21 18v1M6 9V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V9"
    />
  ),
  check: (
    <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
  ),
  reset: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5"
    />
  ),
  flame: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="M12 22c4 0 7-2.8 7-6.6 0-3.6-2.4-5.6-3.6-8.4-.4 1.4-1.2 2.4-2.4 3-.3-3-1.7-5.4-4-7-.1 3.2-1.6 5-3 7C4.9 11.6 5 13.6 5 15.4 5 19.2 8 22 12 22Zm0 0c-1.8 0-3-1.3-3-3 0-1.9 1.6-2.7 3-5 1.4 2.3 3 3.1 3 5 0 1.7-1.2 3-3 3Z"
    />
  ),
  location: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </g>
  ),
  "arrow-right": (
    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
  ),
  "chevron-left": (
    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m15 5-7 7 7 7" />
  ),
  settings: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </g>
  ),
  trash: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7h16M9 7V4h6v3M6.5 7l.8 12.2A1.5 1.5 0 0 0 8.8 20.5h6.4a1.5 1.5 0 0 0 1.5-1.3L17.5 7M10 11v6M14 11v6"
    />
  ),
  share: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v12M8 7l4-4 4 4M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"
    />
  ),
  minus: <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 12h12" />,
  plus: <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 6v12M6 12h12" />,
  kaaba: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="M4 8.5 12 4l8 4.5v9L12 22l-8-4.5v-9ZM4 8.5l8 4.5 8-4.5M12 13v9M4 11l8 4.5 8-4.5"
    />
  ),
  info: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.5" />
    </g>
  ),
  clock: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </g>
  ),
};

export function Icon({ name, className, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  // Directional icons are flipped in right-to-left layouts.
  const entry = Object.entries(paths).find(([k]) => k === name);
  const content: ReactNode = entry?.[1] ?? null;
  if (!content) return null;
  const resolved = MIRRORED.includes(name) ? `icon-mirror ${className ?? ""}`.trim() : className;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={resolved} {...props}>
      {content}
    </svg>
  );
}
