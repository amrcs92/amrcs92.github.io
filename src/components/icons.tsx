import type { ReactNode } from "react";

function Svg({ children, flip }: { children: ReactNode; flip?: boolean }) {
  return (
    <svg className={flip ? "ic flip" : "ic"} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export const ArrowIcon = () => <Svg flip><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const ExternalIcon = () => <Svg flip><path d="M7 17 17 7M8 7h9v9" /></Svg>;
export const DownloadIcon = () => <Svg><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Svg>;
export const MailIcon = () => <Svg><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>;
export const CodeIcon = () => <Svg><path d="m8 8-4 4 4 4M16 8l4 4-4 4" /></Svg>;
export const PersonIcon = () => <Svg><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></Svg>;
export const SunIcon = () => <Svg><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>;
export const MoonIcon = () => <Svg><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></Svg>;
export const ChevronIcon = () => <Svg flip><path d="m9 6 6 6-6 6" /></Svg>;
export const CloseIcon = () => <Svg><path d="M6 6l12 12M18 6 6 18" /></Svg>;
