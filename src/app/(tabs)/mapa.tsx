// Mapa (ref 4) — pontos de pessoas/rolês próximos + cards no rodapé.
// TODO(backend): coordenadas reais + visualização nativa (expo-maps / react-native-maps).

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mockProfiles } from '../../data/profiles';
import { colors, spacing } from '../../theme';

const PINS = [
  { id: 'p1', x: 0.28, y: 0.32, emoji: '☕', label: 'Marina' },
  { id: 'p2', x: 0.64, y: 0.24, emoji: '⛰️', label: 'Rafa' },
  { id: 'p3', x: 0.48, y: 0.52, emoji: '🎪', label: 'Bia' },
  { id: 'p4', x: 0.74, y: 0.6, emoji: '🎲', label: 'João' },
  { id: 'p5', x: 0.2, y: 0.66, emoji: '📚', label: 'Sofia' },
];

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const mapHeight = height * 0.56;
  const mapWidth = width - spacing.lg * 2;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Centralizar na minha localização"
          style={styles.locate}
        >
          <Ionicons name="locate" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={[styles.map, { height: mapHeight }]}>
        <LinearGradient
          colors={['#160D24', '#0F0819', '#1A1025']}
          style={StyleSheet.absoluteFill}
        />

        {/* Grade sutil simulando ruas */}
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLine, { top: ((i + 1) * mapHeight) / 8 }]} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: ((i + 1) * mapWidth) / 8 }]} />
        ))}

        {/* Raio "perto de você" */}
        <View
          style={[
            styles.radius,
            {
              width: width * 0.5,
              height: width * 0.5,
              left: mapWidth / 2 - (width * 0.5) / 2,
              top: mapHeight * 0.44 - (width * 0.5) / 2,
            },
          ]}
        />

        {PINS.map((pin, index) => (
          <Animated.View
            key={pin.id}
            entering={FadeInUp.delay(120 * index).duration(320)}
            style={[styles.pin, { left: pin.x * mapWidth - 22, top: pin.y * mapHeight - 22 }]}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.pinCircle}
            >
              <Text style={styles.pinEmoji}>{pin.emoji}</Text>
            </LinearGradient>
            <Text style={styles.pinLabel}>{pin.label}</Text>
          </Animated.View>
        ))}

        <View style={[styles.me, { left: mapWidth / 2 - 12, top: mapHeight * 0.44 - 12 }]}>
          <View style={styles.meDot} />
        </View>
      </View>

      <Text style={styles.section}>Perto de você</Text>

      {mockProfiles.slice(0, 3).map((person, index) => (
        <Animated.View
          key={person.id}
          entering={FadeInUp.delay(80 * index).duration(300)}
          style={styles.row}
        >
          <LinearGradient colors={person.gradient} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{person.emoji}</Text>
          </LinearGradient>

          <View style={styles.rowBody}>
            <Text style={styles.rowName}>
              {person.name}, {person.age}
            </Text>
            <Text style={styles.rowMeta}>
              📍 {person.distanceM} m · {person.city}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ver ${person.name} no Descobrir`}
            style={styles.rowAction}
          >
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0617',
    paddingHorizontal: spacing.lg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    letterSpacing: -0.8,
  },

  locate: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#1A1025',
    borderWidth: 1,
    borderColor: '#3B284A',
  },

  map: {
    marginTop: spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.22)',
  },

  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(149, 106, 250, 0.07)',
  },

  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(149, 106, 250, 0.07)',
  },

  radius: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.3)',
    backgroundColor: 'rgba(149, 106, 250, 0.06)',
  },

  pin: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },

  pinCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
  },

  pinEmoji: {
    fontSize: 18,
  },

  pinLabel: {
    color: '#E9E2F2',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    backgroundColor: 'rgba(8, 4, 15, 0.75)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },

  me: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(75, 93, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 93, 255, 0.6)',
  },

  meDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4B5DFF',
  },

  section: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.3,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#150D21',
    borderWidth: 1,
    borderColor: '#2C1C3D',
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarEmoji: {
    fontSize: 20,
  },

  rowBody: {
    flex: 1,
    gap: 2,
  },

  rowName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },

  rowMeta: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  rowAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(149, 106, 250, 0.12)',
  },
});
