// Eventos (ref 6) — "Explorar eventos" com carrossel em destaque + lista.
// TODO(backend): tabela `plans`/`events`, inscrição com confirmação 24h (backlog §9).

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../../components/epic/Chip';
import { GlowButton } from '../../components/epic/GlowButton';
import { mockEvents } from '../../data/events';
import { colors, spacing } from '../../theme';

export default function EventosScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width - spacing.lg * 2, 340);
  const featured = mockEvents[0];
  const rest = mockEvents.slice(1);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <Ionicons name="calendar-outline" size={22} color={colors.primary} />
      </View>

      <View style={styles.toggles}>
        <Chip label="Explorar" selected onPress={() => {}} />
        <Chip label="Inscritos" selected={false} onPress={() => {}} />
      </View>

      {/* Destaque */}
      {featured ? (
        <Animated.View entering={FadeInUp.duration(320)}>
          <LinearGradient
            colors={featured.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.featured, { width: cardWidth }]}
          >
            <View style={styles.dateBadge}>
              <Text style={styles.dateDay}>{featured.date.day}</Text>
              <Text style={styles.dateMonth}>{featured.date.month}</Text>
            </View>

            <Text style={styles.featuredEmoji}>{featured.emoji}</Text>

            <View style={styles.featuredBody}>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredMeta}>
                📍 {featured.place} · {featured.distanceKm} km
              </Text>

              <View style={styles.capacityRow}>
                <View style={styles.capacityTrack}>
                  <View
                    style={[
                      styles.capacityFill,
                      { width: `${Math.round((featured.joined / featured.capacity) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.capacityText}>
                  {featured.joined}/{featured.capacity} lugares
                </Text>
              </View>

              <GlowButton label="Quero ir" style={styles.goButton} />
            </View>
          </LinearGradient>
        </Animated.View>
      ) : null}

      <Text style={styles.section}>Rolês por perto</Text>

      {rest.map((event, index) => (
        <Animated.View
          key={event.id}
          entering={FadeInUp.delay(90 * index).duration(300)}
          style={styles.row}
        >
          <View style={styles.rowDate}>
            <Text style={styles.rowDay}>{event.date.day}</Text>
            <Text style={styles.rowMonth}>{event.date.month}</Text>
          </View>

          <LinearGradient colors={event.gradient} style={styles.rowEmoji}>
            <Text style={styles.rowEmojiText}>{event.emoji}</Text>
          </LinearGradient>

          <View style={styles.rowBody}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <Text style={styles.rowMeta} numberOfLines={1}>
              📍 {event.online ? 'Online' : `${event.place} · ${event.distanceKm} km`}
            </Text>
            <Text style={styles.rowJoined}>
              {event.joined}/{event.capacity} confirmados
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#7C6E91" />
        </Animated.View>
      ))}

      <GlowButton label="Criar evento" variant="ghost" style={styles.createButton} />
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
    paddingBottom: spacing.xl,
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

  toggles: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },

  featured: {
    borderRadius: 24,
    padding: spacing.lg,
    gap: 10,
    boxShadow: '0 14px 34px rgba(0, 0, 0, 0.4)',
  },

  dateBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(8, 4, 15, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },

  dateDay: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    lineHeight: 18,
  },

  dateMonth: {
    color: '#D6CBE4',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  },

  featuredEmoji: {
    fontSize: 46,
  },

  featuredBody: {
    gap: 6,
  },

  featuredTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 19,
    letterSpacing: -0.4,
    paddingRight: 70,
  },

  featuredMeta: {
    color: '#E4DAF0',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },

  capacityRow: {
    gap: 6,
    marginTop: 6,
  },

  capacityTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(8, 4, 15, 0.55)',
    overflow: 'hidden',
  },

  capacityFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  capacityText: {
    color: '#E4DAF0',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  goButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xl,
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

  rowDate: {
    alignItems: 'center',
    backgroundColor: '#1F1331',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3B284A',
  },

  rowDay: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    lineHeight: 16,
  },

  rowMonth: {
    color: '#8F829D',
    fontFamily: 'Poppins_500Medium',
    fontSize: 9,
  },

  rowEmoji: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowEmojiText: {
    fontSize: 20,
  },

  rowBody: {
    flex: 1,
    gap: 2,
  },

  rowTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },

  rowMeta: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  rowJoined: {
    color: colors.primary,
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  createButton: {
    marginTop: spacing.md,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
  },
});
