// Descobrir (ref 3) — toggle "Perto de você / Todos", filtros funcionais e deck com swipe.

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../../components/epic/Chip';
import { GlowButton } from '../../components/epic/GlowButton';
import { FilterSheet, type DiscoverFilters } from '../../components/descobrir/FilterSheet';
import { SwipeDeck, type SwipeDirection } from '../../components/descobrir/SwipeDeck';
import { mockProfiles } from '../../data/profiles';
import { colors, spacing } from '../../theme';

export default function DescobrirScreen() {
  const insets = useSafeAreaInsets();

  const [scope, setScope] = useState<'perto' | 'todos'>('perto');
  const [filters, setFilters] = useState<DiscoverFilters>({
    maxDistanceKm: null,
    age: 'all',
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(
    () =>
      mockProfiles.filter((person) => {
        if (scope === 'perto' && person.distanceM > 3000) return false;
        if (filters.maxDistanceKm !== null && person.distanceM > filters.maxDistanceKm * 1000) {
          return false;
        }
        if (filters.age === '18-25' && !(person.age >= 18 && person.age <= 25)) return false;
        if (filters.age === '26-35' && !(person.age >= 26 && person.age <= 35)) return false;
        if (filters.age === '36+' && person.age < 36) return false;
        return true;
      }),
    [scope, filters],
  );

  const hasActiveFilters = filters.maxDistanceKm !== null || filters.age !== 'all';
  const deckKey = `${scope}-${filters.maxDistanceKm}-${filters.age}-${nonce}`;

  function handleDecide(direction: SwipeDirection, person: { name: string }) {
    if (direction === 'right') {
      setToast(`Conexão com ${person.name} salva 💜 — ela aparece no Chat quando responder`);
    } else if (direction === 'up') {
      setToast(`⭐ ${person.name} salvo nos favoritos`);
    } else {
      setToast(null);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Descobrir</Text>

        <Pressable
          onPress={() => setSheetOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir filtros de busca"
          style={styles.filterButton}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={hasActiveFilters ? colors.primary : '#C9B8DA'}
          />
          {hasActiveFilters ? <View style={styles.filterDot} /> : null}
        </Pressable>
      </View>

      <View style={styles.toggles}>
        <Chip
          label="Perto de você"
          selected={scope === 'perto'}
          onPress={() => setScope('perto')}
        />
        <Chip label="Todos" selected={scope === 'todos'} onPress={() => setScope('todos')} />
      </View>

      <View style={styles.deckArea}>
        <SwipeDeck
          key={deckKey}
          profiles={filtered}
          onDecide={handleDecide}
          empty={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>✨</Text>
              <Text style={styles.emptyTitle}>Você viu todo mundo por aqui</Text>
              <Text style={styles.emptyText}>
                Amplie os filtros ou volte mais tarde — pessoas novas chegam toda hora.
              </Text>
              <GlowButton
                label="Recarregar descoberta"
                onPress={() => setNonce((n) => n + 1)}
                style={styles.emptyButton}
              />
            </View>
          }
        />

        {toast ? (
          <Animated.View
            key={toast}
            entering={FadeInDown.duration(220)}
            exiting={FadeOut.duration(200)}
            style={styles.toast}
          >
            <Text style={styles.toastText}>{toast}</Text>
          </Animated.View>
        ) : null}
      </View>

      <FilterSheet
        visible={sheetOpen}
        initial={filters}
        onApply={(next) => {
          setFilters(next);
          setSheetOpen(false);
          setNonce((n) => n + 1);
        }}
        onClose={() => setSheetOpen(false)}
      />
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

  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#1A1025',
    borderWidth: 1,
    borderColor: '#3B284A',
  },

  filterDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  toggles: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },

  deckArea: {
    flex: 1,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
  },

  emptyEmoji: {
    fontSize: 34,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
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
    marginTop: spacing.md,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
  },

  toast: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 4,
    backgroundColor: 'rgba(33, 19, 51, 0.97)',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  toastText: {
    color: '#E9E2F2',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    textAlign: 'center',
  },
});
