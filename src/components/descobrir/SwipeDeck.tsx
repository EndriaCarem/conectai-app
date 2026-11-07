// Deck de descoberta com swipe: arraste ou use os botões ✕ / ⭐ / 💜.
// Reanimated v4 (UI thread) + react-native-gesture-handler.

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { Person } from '../../data/profiles';
import { colors } from '../../theme';
import { ProfileCard } from './ProfileCard';

export type SwipeDirection = 'left' | 'right' | 'up';

type SwipeDeckProps = {
  profiles: Person[];
  onDecide: (direction: SwipeDirection, person: Person) => void;
  empty?: ReactNode;
};

const FLY_MS = 300;

export function SwipeDeck({ profiles, onDecide, empty }: SwipeDeckProps) {
  const [index, setIndex] = useState(0);
  // Shared value em vez de ref: evita leitura de ref durante render (react-hooks/refs)
  // e pode ser lida tanto no JS quanto na UI thread.
  const flying = useSharedValue(false);
  const { width, height } = useWindowDimensions();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const current = profiles[index];
  const next = profiles[index + 1];
  const third = profiles[index + 2];

  function commit(direction: SwipeDirection) {
    const person = profiles[index];
    if (person) onDecide(direction, person);
    translateX.value = 0;
    translateY.value = 0;
    setIndex((i) => i + 1);
    flying.value = false;
  }

  function trigger(direction: SwipeDirection) {
    if (flying.value || !current) return;
    flying.value = true;

    if (direction === 'right') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } else if (direction === 'up') {
      Haptics.selectionAsync().catch(() => {});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    const target =
      direction === 'right'
        ? { x: width + 160, y: 0 }
        : direction === 'left'
          ? { x: -width - 160, y: 0 }
          : { x: 0, y: -height - 200 };

    translateX.value = withTiming(target.x, { duration: FLY_MS });
    translateY.value = withTiming(target.y, { duration: FLY_MS }, (finished) => {
      if (finished) runOnJS(commit)(direction);
    });
  }

  const pan = Gesture.Pan()
    .activeOffsetX([-14, 14])
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.35;
    })
    .onEnd((event) => {
      'worklet';
      if (event.translationX > 110) {
        runOnJS(trigger)('right');
      } else if (event.translationX < -110) {
        runOnJS(trigger)('left');
      } else if (event.translationY < -110) {
        runOnJS(trigger)('up');
      } else {
        translateX.value = withSpring(0, { damping: 16, stiffness: 180 });
        translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
      }
    });

  const topCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${translateX.value / 18}deg` },
    ],
  }));

  if (!current) {
    return <View style={styles.fill}>{empty}</View>;
  }

  return (
    <View style={styles.fill}>
      <View style={styles.deck}>
        {third ? (
          <View style={[styles.fill, styles.layerFar]}>
            <ProfileCard person={third} />
          </View>
        ) : null}

        {next ? (
          <View style={[styles.fill, styles.layerNear]}>
            <ProfileCard person={next} />
          </View>
        ) : null}

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.fill, topCardStyle]}>
            <ProfileCard
              person={current}
              counter={`${index + 1}/${profiles.length}`}
            />
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => trigger('left')}
          accessibilityRole="button"
          accessibilityLabel="Pular"
          style={({ pressed }) => [styles.action, styles.skip, pressed && styles.pressed]}
        >
          <Ionicons name="close" size={28} color={colors.danger} />
        </Pressable>

        <Pressable
          onPress={() => trigger('up')}
          accessibilityRole="button"
          accessibilityLabel="Favoritar"
          style={({ pressed }) => [styles.action, styles.star, pressed && styles.pressed]}
        >
          <Ionicons name="star" size={24} color="#FFD166" />
        </Pressable>

        <Pressable
          onPress={() => trigger('right')}
          accessibilityRole="button"
          accessibilityLabel="Conectar"
          style={({ pressed }) => [styles.like, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.likeGradient}
          >
            <Ionicons name="heart" size={30} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },

  deck: {
    flex: 1,
  },

  layerNear: {
    position: 'absolute',
    top: 16,
    left: 14,
    right: 14,
    bottom: 0,
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },

  layerFar: {
    position: 'absolute',
    top: 30,
    left: 26,
    right: 26,
    bottom: 0,
    transform: [{ scale: 0.92 }],
    opacity: 0.6,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
    paddingTop: 18,
  },

  action: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  skip: {
    backgroundColor: '#241433',
    borderColor: 'rgba(255, 107, 129, 0.35)',
  },

  star: {
    backgroundColor: '#241C10',
    borderColor: 'rgba(255, 209, 102, 0.35)',
  },

  like: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    boxShadow: '0 10px 26px rgba(149, 106, 250, 0.55)',
  },

  likeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    transform: [{ scale: 0.93 }],
  },
});
