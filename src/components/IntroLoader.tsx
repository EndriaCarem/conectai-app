import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  Poppins_500Medium,
  useFonts,
} from '@expo-google-fonts/poppins';

import { colors } from '../theme';

const WORD_HEIGHT = 40;

const words = [
  'pessoas',
  'amizades',
  'rolês',
  'momentos',
  'conexões',
];

type IntroLoaderProps = {
  onFinished?: () => void;
};

export function IntroLoader({ onFinished }: IntroLoaderProps) {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fontsLoaded) return;

    const animations = words.slice(1).map((_, index) =>
      Animated.sequence([
        Animated.delay(450),

        Animated.timing(translateY, {
          toValue: -(index + 1) * WORD_HEIGHT,
          duration: 420,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.sequence([
      ...animations,
      Animated.delay(450),
    ]).start(({ finished }) => {
      if (finished) {
        onFinished?.();
      }
    });
  }, [fontsLoaded, onFinished, translateY]);

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        <Text style={styles.fixedWord}>Conectaí</Text>

        <View style={styles.wordsWindow}>
          <Animated.View
            style={{
              transform: [{ translateY }],
            }}
          >
            {words.map((word) => (
              <Text key={word} style={styles.word}>
                {word}
              </Text>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: WORD_HEIGHT,
  },

  fixedWord: {
    color: '#7C7C7C',
    fontFamily: 'Poppins_500Medium',
    fontSize: 25,
    lineHeight: WORD_HEIGHT,
  },

  wordsWindow: {
    height: WORD_HEIGHT,
    overflow: 'hidden',
    marginLeft: 6,
  },

  word: {
    height: WORD_HEIGHT,
    lineHeight: WORD_HEIGHT,
    color: '#956AFA',
    fontFamily: 'Poppins_500Medium',
    fontSize: 25,
  },
});
