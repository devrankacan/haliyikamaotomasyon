import { useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";

import { useThemedStyles } from "@/theme/useThemedStyles";
import type { ThemeColors } from "@/theme/colors";

type Props = {
  letters: string[];
  onSelect: (letter: string) => void;
};

export function AlphabetIndex({ letters, onSelect }: Props) {
  const styles = useThemedStyles(createStyles);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const containerHeightRef = useRef(0);
  const lettersRef = useRef(letters);
  const activeLetterRef = useRef<string | null>(null);
  const onSelectRef = useRef(onSelect);

  lettersRef.current = letters;
  onSelectRef.current = onSelect;

  function letterForY(y: number): string | null {
    const currentLetters = lettersRef.current;
    const height = containerHeightRef.current;
    if (currentLetters.length === 0 || height === 0) return null;
    const rowHeight = height / currentLetters.length;
    const index = Math.min(currentLetters.length - 1, Math.max(0, Math.floor(y / rowHeight)));
    return currentLetters[index];
  }

  function selectFromTouch(localY: number) {
    const letter = letterForY(localY);
    if (letter && letter !== activeLetterRef.current) {
      activeLetterRef.current = letter;
      setActiveLetter(letter);
      onSelectRef.current(letter);
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => selectFromTouch(evt.nativeEvent.locationY),
      onPanResponderMove: (evt) => selectFromTouch(evt.nativeEvent.locationY),
      onPanResponderRelease: () => {
        activeLetterRef.current = null;
        setActiveLetter(null);
      },
      onPanResponderTerminate: () => {
        activeLetterRef.current = null;
        setActiveLetter(null);
      },
    })
  ).current;

  if (letters.length === 0) return null;

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        containerHeightRef.current = e.nativeEvent.layout.height;
      }}
      {...panResponder.panHandlers}
    >
      {letters.map((letter) => (
        <View key={letter} style={styles.item}>
          <Text style={[styles.letter, activeLetter === letter && styles.letterActive]}>{letter}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      right: 2,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 6,
    },
    item: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 10,
    },
    letter: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.primary,
    },
    letterActive: {
      color: "#ffffff",
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 4,
    },
  });
