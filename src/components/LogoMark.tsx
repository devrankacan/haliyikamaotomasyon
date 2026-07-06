import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export function LogoMark({ size = 64 }: { size?: number }) {
  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24">
        <Path
          d="M12 2C12 2 5 11 5 15.5A7 7 0 0 0 19 15.5C19 11 12 2 12 2Z"
          fill="#ffffff"
        />
        <Path
          d="M8.5 15.5a3.5 3.5 0 0 0 3.5 3.5"
          stroke="#2563eb"
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
});
