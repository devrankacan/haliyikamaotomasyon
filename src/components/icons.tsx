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

export function PersonIcon({ size = 22, color = "#ffffff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth={2}
        {...common}
      />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function ContactBookIcon({ size = 22, color = "#0f172a" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth={2} {...common} />
      <Circle cx="12" cy="10" r="2.5" stroke={color} strokeWidth={2} {...common} />
      <Path d="M8 17c0-1.66 1.79-3 4-3s4 1.34 4 3" stroke={color} strokeWidth={2} {...common} />
      <Path d="M4 8h1M4 12h1M4 16h1" stroke={color} strokeWidth={2} {...common} />
    </Svg>
  );
}

export function WhatsAppIcon({ size = 22, color = "#ffffff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12.004 2.003c-5.523 0-10 4.477-10 10 0 1.762.454 3.478 1.317 4.984L2 22l5.13-1.345a9.94 9.94 0 0 0 4.874 1.242h.004c5.522 0 9.999-4.477 9.999-10s-4.477-9.894-9.999-9.894zm5.849 14.208c-.248.694-1.435 1.328-2.006 1.413-.511.077-1.159.109-1.871-.118a13.5 13.5 0 0 1-1.694-.625c-2.98-1.287-4.928-4.29-5.077-4.487-.148-.198-1.213-1.612-1.213-3.074s.768-2.182 1.04-2.479c.272-.298.594-.372.792-.372.198 0 .397.002.57.01.182.01.427-.069.669.51.248.595.842 2.058.917 2.207.075.149.124.322.025.52-.1.199-.15.323-.298.497-.148.174-.312.387-.446.52-.148.148-.302.31-.13.606.173.298.769 1.271 1.653 2.059 1.135 1.012 2.093 1.325 2.39 1.475.297.148.47.124.644-.075.173-.198.743-.867.94-1.164.199-.298.397-.25.67-.15.272.099 1.733.818 2.03.967.297.148.495.223.57.347.075.124.075.719-.173 1.413z"
      />
    </Svg>
  );
}
