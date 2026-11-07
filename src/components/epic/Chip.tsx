// Chip selecionável com transição suave de cor, mola no toque e haptics.

import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING = { damping: 15, stiffness: 300 } as const;

type ChipProps = {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, emoji, selected, onPress, style }: ChipProps) {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 160 });
  }, [selected, progress]);

  const selectionStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#1A1025', colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], ['#3B284A', colors.primary]),
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.93, SPRING);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING);
      }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selectionStyle, pressStyle, selected && styles.selectedGlow, style]}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#1A1025',
  },

  selectedGlow: {
    boxShadow: '0 6px 20px rgba(149, 106, 250, 0.45)',
  },

  emoji: {
    fontSize: 15,
  },

  label: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },

  labelSelected: {
    color: '#FFFFFF',
  },
});
