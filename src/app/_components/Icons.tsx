// Crisp, professional SVG icon set for the ERP
// All icons are 20×20 viewBox, stroke-based (currentColor)

const props = (extra?: string) =>
  `width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" ${extra ?? ""}`;

type IconProps = { size?: number; className?: string; style?: React.CSSProperties };

function Svg({ size = 18, className, style, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      {children}
    </svg>
  );
}

export function IconHome(p: IconProps) { return <Svg {...p}><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/><path d="M9 21V12h6v9"/></Svg>; }
export function IconChart(p: IconProps) { return <Svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Svg>; }
export function IconSprout(p: IconProps) { return <Svg {...p}><path d="M7 20s4-1 4-9"/><path d="M11 11C11 6 15 3 20 4c-1 5-5 8-9 7z"/><path d="M11 11C11 6 7 3 2 4c1 5 5 8 9 7z"/></Svg>; }
export function IconCow(p: IconProps) { return <Svg {...p}><circle cx="12" cy="14" r="6"/><path d="M6 8c-2 0-4 1-4 4"/><path d="M18 8c2 0 4 1 4 4"/><path d="M9 8V5"/><path d="M15 8V5"/><circle cx="10" cy="13" r="1" fill="currentColor"/><circle cx="14" cy="13" r="1" fill="currentColor"/></Svg>; }
export function IconBox(p: IconProps) { return <Svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></Svg>; }
export function IconBread(p: IconProps) { return <Svg {...p}><path d="M6 2a4 4 0 0 0-4 4v1h2a2 2 0 0 1 2 2v2H2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V11h-4V9a2 2 0 0 1 2-2h2V6a4 4 0 0 0-4-4H6z"/></Svg>; }
export function IconCart(p: IconProps) { return <Svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></Svg>; }
export function IconDollar(p: IconProps) { return <Svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Svg>; }
export function IconUsers(p: IconProps) { return <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>; }
export function IconBook(p: IconProps) { return <Svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Svg>; }
export function IconTrendingUp(p: IconProps) { return <Svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>; }
export function IconPiggyBank(p: IconProps) { return <Svg {...p}><path d="M19 5c-1.5 0-2.8.4-3.9 1H8a6 6 0 1 0 0 12h8a4 4 0 0 0 0-8h1a4 4 0 0 0 4-4 1 1 0 0 0-1-1z"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M9 7v2"/><path d="M15 7v2"/></Svg>; }
export function IconTruck(p: IconProps) { return <Svg {...p}><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Svg>; }
export function IconGear(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93L17.66 6.34M12 2v2M4.93 4.93L6.34 6.34M2 12h2M4.93 19.07L6.34 17.66M12 20v2M19.07 19.07L17.66 17.66M20 12h2"/></Svg>; }
export function IconMail(p: IconProps) { return <Svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Svg>; }
export function IconLock(p: IconProps) { return <Svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>; }
export function IconLogOut(p: IconProps) { return <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>; }
export function IconUser(p: IconProps) { return <Svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>; }
export function IconShield(p: IconProps) { return <Svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>; }
export function IconMenu(p: IconProps) { return <Svg {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></Svg>; }
export function IconX(p: IconProps) { return <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>; }
export function IconChevronRight(p: IconProps) { return <Svg {...p}><polyline points="9 18 15 12 9 6"/></Svg>; }
export function IconBuilding(p: IconProps) { return <Svg {...p}><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/></Svg>; }
export function IconHandshake(p: IconProps) { return <Svg {...p}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></Svg>; }
export function IconBarChart(p: IconProps) { return <Svg {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></Svg>; }
export function IconFactory(p: IconProps) { return <Svg {...p}><path d="M3 21h18"/><path d="M3 7v14"/><path d="M3 7l7-4v4l7-4v4l4-4v14H3V7z"/></Svg>; }
export function IconSun(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Svg>; }
export function IconMoon(p: IconProps) { return <Svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Svg>; }
export function IconAlert(p: IconProps) { return <Svg {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Svg>; }
