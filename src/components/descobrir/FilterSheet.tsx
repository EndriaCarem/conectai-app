// Filtros de busca funcionais (ref 8): distância e idade filtram o deck de verdade.
// TODO(backend): demais filtros avançados (gênero, estilo de vida, valores) quando o
// ranking determinístico existir (backlog §8).

import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

import { Chip } from '../epic/Chip';
import { GlowButton } from '../epic/GlowButton';
import { colors, radii, spacing } from '../../theme';

export type DiscoverFilters = {
  maxDistanceKm: number | null;
  age: 'all' | '18-25' | '26-35' | '36+';
};

type FilterSheetProps = {
  visible: boolean;
  initial: DiscoverFilters;
  onApply: (filters: DiscoverFilters) => void;
  onClose: () => void;
};

const DISTANCE_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Qualquer', value: null },
  { label: '1 km', value: 1 },
  { label: '3 km', value: 3 },
  { label: '10 km', value: 10 },
];

const AGE_OPTIONS: DiscoverFilters['age'][] = ['all', '18-25', '26-35', '36+'];

const AGE_LABELS: Record<DiscoverFilters['age'], string> = {
  all: 'Qualquer',
  '18-25': '18 - 25',
  '26-35': '26 - 35',
  '36+': '36+',
};

export function FilterSheet({ visible, initial, onApply, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState<DiscoverFilters>(initial);
  const [wasVisible, setWasVisible] = useState(visible);

  // Reset ao abrir: padrão "adjust state during render" do React
  // (alternativa documentada ao useEffect + setState).
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(initial);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(140)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar filtros" />

        <Animated.View entering={SlideInDown.duration(240)} style={styles.sheet}>
          <View style={styles.grabber} />

          <Text style={styles.title}>Filtros de busca</Text>

          <Text style={styles.group}>Localização</Text>
          <View style={styles.chipWrap}>
            {DISTANCE_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={draft.maxDistanceKm === option.value}
                onPress={() =>
                  setDraft((current) => ({ ...current, maxDistanceKm: option.value }))
                }
              />
            ))}
          </View>

          <Text style={styles.group}>Idade</Text>
          <View style={styles.chipWrap}>
            {AGE_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={AGE_LABELS[option]}
                selected={draft.age === option}
                onPress={() => setDraft((current) => ({ ...current, age: option }))}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <GlowButton
              label="Limpar"
              variant="ghost"
              style={styles.footerButton}
              onPress={() => setDraft({ maxDistanceKm: null, age: 'all' })}
            />
            <GlowButton
              label="Aplicar"
              style={styles.footerButton}
              onPress={() => onApply(draft)}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 2, 10, 0.72)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.25)',
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },

  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B284A',
    marginBottom: spacing.sm,
  },

  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginBottom: spacing.xs,
  },

  group: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.4,
    marginTop: spacing.sm,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.lg,
  },

  footerButton: {
    flex: 1,
  },
});
