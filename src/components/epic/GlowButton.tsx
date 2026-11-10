// Botão de ação com brilho e pulso tático (haptics) — ação principal de cada etapa.

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { colors, radii } from '../../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING = { damping: 18, stiffness: 260 } as const;

type GlowButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function GlowButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: GlowButtonProps) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
    onPress?.();
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.97, SPRING);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING);
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryGlow : styles.ghost,
        styles.gradientClip,
        disabled && styles.disabled,
        pressStyle,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        >
          <Text style={[styles.label, textStyle]}>{label}</Text>
        </LinearGradient>
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: radii.pill,
  },

  gradientClip: {
    overflow: 'hidden',
  },

  primaryGlow: {
    boxShadow: '0 10px 30px rgba(149, 106, 250, 0.42)',
  },

  ghost: {
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    backgroundColor: 'rgba(18, 8, 31, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  disabled: {
    opacity: 0.45,
  },
});
