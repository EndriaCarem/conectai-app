// Mapa (ref 4) — pontos das pessoas de teste próximas + lista rolável.
// A tela inteira rola (nada cortado), o mapa tem arte de bairro e o raio
// "perto de você" pulsa. Pins vêm do SQLite local — nenhum dado fictício.
// TODO(backend): coordenadas reais + visualização nativa (expo-maps / react-native-maps).

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listUsers, type Person } from '../../db/queries';
import { colors, spacing } from '../../theme';

/** Ruas horizontais (fração da altura do mapa). */
const H_STREETS = [0.2, 0.48, 0.76];
/** Ruas verticais (fração da largura do mapa). */
const V_STREETS = [0.28, 0.68];

/** Quadras entre as ruas (frações x, y, largura, altura). */
const BLOCKS = [
  { x: 0.04, y: 0.05, w: 0.2, h: 0.12 },
  { x: 0.33, y: 0.05, w: 0.3, h: 0.12 },
  { x: 0.73, y: 0.05, w: 0.23, h: 0.12 },
  { x: 0.04, y: 0.26, w: 0.2, h: 0.17 },
  { x: 0.33, y: 0.26, w: 0.3, h: 0.17 },
  { x: 0.73, y: 0.54, w: 0.23, h: 0.17 },
  { x: 0.04, y: 0.54, w: 0.2, h: 0.17 },
  { x: 0.33, y: 0.82, w: 0.3, h: 0.13 },
  { x: 0.73, y: 0.82, w: 0.23, h: 0.13 },
];

/** Hash determinístico do id → posição estável no mapa. */
function pinPosition(id: string, index: number): { x: number; y: number } {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const a = Math.abs(hash % 1000) / 1000;
  const b = Math.abs((hash >> 11) % 1000) / 1000;
  // Espalha os pins sem sobrepor o centro (onde está "você").
  const jitter = (index % 3) * 0.08;
  return {
    x: Math.min(0.92, Math.max(0.08, a * 0.84 + 0.08 + jitter * 0.1)),
    y: Math.min(0.9, Math.max(0.1, b * 0.72 + 0.12 + jitter * 0.1)),
  };
}

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [people, setPeople] = useState<Person[]>([]);
  const [scanNonce, setScanNonce] = useState(0);

  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2400 }), -1, false);
  }, [pulse]);

  const radarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.45, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.55, 1.5]) }],
  }));

  // Recarrega ao voltar para a aba (usuários criados no Perfil aparecem aqui).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      listUsers()
        .then((rows) => {
          if (active) setPeople(rows);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, []),
  );

  const mapWidth = width - spacing.lg * 2;
  const mapHeight = Math.min(Math.max(height * 0.5, 340), 480);

  const pins = people
    .slice(0, 8)
    .map((person, index) => ({ person, ...pinPosition(person.id, index) }));

  const nearby = [...people].sort((a, b) => a.distanceM - b.distanceM).slice(0, 6);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 90 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mapa</Text>
        <Pressable
          onPress={() => setScanNonce((n) => n + 1)}
          accessibilityRole="button"
          accessibilityLabel="Buscar nesta área"
          style={({ pressed }) => [styles.locate, pressed && styles.pressed]}
        >
          <Ionicons name="search" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={[styles.map, { height: mapHeight }]}>
        <LinearGradient
          colors={['#160D24', '#0F0819', '#1A1025']}
          style={StyleSheet.absoluteFill}
        />

        {/* Quadras */}
        {BLOCKS.map((block, index) => (
          <View
            key={`b${index}`}
            style={[
              styles.block,
              {
                left: block.x * mapWidth,
                top: block.y * mapHeight,
                width: block.w * mapWidth,
                height: block.h * mapHeight,
              },
            ]}
          />
        ))}

        {/* Praça / parque */}
        <View
          style={[
            styles.park,
            {
              left: 0.33 * mapWidth,
              top: 0.26 * mapHeight,
              width: 0.3 * mapWidth,
              height: 0.17 * mapHeight,
            },
          ]}
        >
          <Text style={styles.parkEmoji}>🌳</Text>
        </View>

        {/* Rios */}
        <View
          style={[
            styles.water,
            {
              left: -0.1 * mapWidth,
              bottom: -0.06 * mapHeight,
              width: 1.3 * mapWidth,
              height: 0.14 * mapHeight,
              transform: [{ rotate: '-7deg' }],
            },
          ]}
        />

        {/* Ruas horizontais */}
        {H_STREETS.map((y, index) => (
          <View
            key={`h${index}`}
            style={[styles.streetH, { top: y * mapHeight - 3 }]}
          />
        ))}

        {/* Ruas verticais */}
        {V_STREETS.map((x, index) => (
          <View key={`v${index}`} style={[styles.streetV, { left: x * mapWidth - 3 }]} />
        ))}

        {/* Avenida diagonal */}
        <View
          style={[
            styles.avenue,
            {
              width: mapWidth * 1.5,
              left: -mapWidth * 0.25,
              top: mapHeight * 0.6,
            },
          ]}
        />

        {/* Raio de proximidade + radar pulsando */}
        <View
          style={[
            styles.radius,
            {
              width: mapWidth * 0.56,
              height: mapWidth * 0.56,
              left: mapWidth / 2 - (mapWidth * 0.56) / 2,
              top: mapHeight / 2 - (mapWidth * 0.56) / 2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.radar,
            radarStyle,
            {
              width: mapWidth * 0.56,
              height: mapWidth * 0.56,
              left: mapWidth / 2 - (mapWidth * 0.56) / 2,
              top: mapHeight / 2 - (mapWidth * 0.56) / 2,
            },
          ]}
        />

        {pins.map(({ person, x, y }, index) => {
          const centerX = mapWidth * 0.1 + x * mapWidth * 0.8;
          const centerY = mapHeight * 0.12 + y * mapHeight * 0.74;

          return (
            <Animated.View
              key={`${person.id}-${scanNonce}`}
              entering={FadeInUp.delay(100 * index).duration(320)}
              style={[styles.pin, { left: centerX - 34, top: centerY - 24 }]}
            >
              <LinearGradient
                colors={person.gradient}
                style={styles.pinCircle}
              >
                <Text style={styles.pinEmoji}>{person.emoji}</Text>
              </LinearGradient>
              <Text style={styles.pinLabel} numberOfLines={1}>
                {person.name}
              </Text>
            </Animated.View>
          );
        })}

        <View style={[styles.me, { left: mapWidth / 2 - 14, top: mapHeight / 2 - 14 }]}>
          <View style={styles.meDot} />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Você</Text>
        </View>
      </View>

      <Text style={styles.section}>Perto de você</Text>

      {nearby.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📍</Text>
          <Text style={styles.emptyTitle}>Nenhum usuário no mapa</Text>
          <Text style={styles.emptyText}>
            Crie pessoas no Modo teste do Perfil e elas aparecem aqui na hora.
          </Text>
          <Pressable
            onPress={() => router.push('/perfil')}
            accessibilityRole="button"
            style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emptyButtonGradient}
            >
              <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Criar usuário de teste</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : (
        nearby.map((person, index) => (
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
              onPress={() => router.push('/descobrir')}
              accessibilityRole="button"
              accessibilityLabel={`Ver ${person.name} no Descobrir`}
              style={({ pressed }) => [styles.rowAction, pressed && styles.pressed]}
            >
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </Pressable>
          </Animated.View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0617',
  },

  content: {
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

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  map: {
    marginTop: spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.22)',
    marginBottom: spacing.sm,
  },

  block: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: 'rgba(31, 19, 49, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.08)',
  },

  park: {
    position: 'absolute',
    borderRadius: 14,
    backgroundColor: 'rgba(47, 184, 166, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(47, 184, 166, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  parkEmoji: {
    fontSize: 18,
    opacity: 0.85,
  },

  water: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(75, 93, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(75, 93, 255, 0.28)',
  },

  streetH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(149, 106, 250, 0.1)',
  },

  streetV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(149, 106, 250, 0.1)',
  },

  avenue: {
    position: 'absolute',
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    transform: [{ rotate: '-12deg' }],
  },

  radius: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.3)',
    backgroundColor: 'rgba(149, 106, 250, 0.06)',
  },

  radar: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(149, 106, 250, 0.7)',
  },

  pin: {
    position: 'absolute',
    width: 68,
    alignItems: 'center',
    gap: 3,
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
    maxWidth: 68,
    color: '#E9E2F2',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    backgroundColor: 'rgba(8, 4, 15, 0.78)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },

  me: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(75, 93, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 93, 255, 0.7)',
  },

  meDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4B5DFF',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },

  legend: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(8, 4, 15, 0.78)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5DFF',
  },

  legendText: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10.5,
  },

  section: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.3,
    marginTop: spacing.md,
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

  empty: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#150D21',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C1C3D',
    padding: spacing.lg,
  },

  emptyEmoji: {
    fontSize: 34,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },

  emptyText: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  emptyButton: {
    marginTop: spacing.xs,
    borderRadius: 22,
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(149, 106, 250, 0.4)',
  },

  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },
});
