import Svg, { Circle, Path, Rect } from "react-native-svg";

type IconProps = { size?: number; color?: string };

const common = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function GridIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={2} {...common} />
      <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={2} {...common} />
      <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={2} {...common} />
      <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function UsersIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} {...common} />
      <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={2} {...common} />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth={2} {...common} />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function PackageIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        stroke={color}
        strokeWidth={2}
        {...common}
      />
      <Path d="m3.3 7 8.7 5 8.7-5" stroke={color} strokeWidth={2} {...common} />
      <Path d="M12 22V12" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function SettingsIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        stroke={color}
        strokeWidth={2}
        {...common}
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function TagIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
        stroke={color}
        strokeWidth={2}
        {...common}
      />
      <Circle cx="7.5" cy="7.5" r="1.2" fill={color} stroke="none" />
    </Svg>
  );
}

export function CashIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth={2} {...common} />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function TruckIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M1 3h15v13H1z" stroke={color} strokeWidth={2} {...common} />
      <Path d="M16 8h4l3 3v5h-7V8Z" stroke={color} strokeWidth={2} {...common} />
      <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth={2} {...common} />
      <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function ChatIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-4.9 7.6 8.5 8.5 0 0 1-9.1-1.05L3 21l1.95-4.5A8.38 8.38 0 0 1 3.5 12.5 8.5 8.5 0 0 1 12 4a8.5 8.5 0 0 1 9 7.5Z"
        stroke={color}
        strokeWidth={2}
        {...common}
      />
    </Svg>
  );
}
