// Formulário de usuário de teste (criar/editar) — Modo teste do Perfil.
// Grava no SQLite local: nada de dados fictícios pré-escritos.

import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

import { Chip } from '../epic/Chip';
import { GlowButton } from '../epic/GlowButton';
import { interestCategories } from '../../data/interests';
import { intents } from '../../data/intents';
import {
  AVATAR_EMOJIS,
  AVATAR_GRADIENTS,
  type Person,
  type PersonInput,
} from '../../db/queries';
import { colors, radii, spacing } from '../../theme';

type Draft = {
  name: string;
  age: string;
  city: string;
  bio: string;
  emoji: string;
  gradient: [string, string];
  interests: string[];
  wantsToday: string[];
  distanceM: number;
  online: boolean;
};

type TestUserFormProps = {
  visible: boolean;
  initial: Person | null;
  onSave: (input: PersonInput) => void;
  onClose: () => void;
};

const ALL_INTERESTS = interestCategories.flatMap((category) =>
  category.items.map((item) => item.label),
);

const DISTANCES = [
  { label: '300 m', value: 300 },
  { label: '500 m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
];

function emptyDraft(): Draft {
  return {
    name: '',
    age: '25',
    city: '',
    bio: '',
    emoji: AVATAR_EMOJIS[0],
    gradient: AVATAR_GRADIENTS[0],
    interests: [],
    wantsToday: [],
    distanceM: 500,
    online: true,
  };
}

function draftFrom(person: Person | null): Draft {
  if (!person) return emptyDraft();
  return {
    name: person.name,
    age: String(person.age),
    city: person.city,
    bio: person.bio,
    emoji: person.emoji,
    gradient: person.gradient,
    interests: person.interests,
    wantsToday: person.wantsToday,
    distanceM: person.distanceM,
    online: person.online,
  };
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function TestUserForm({ visible, initial, onSave, onClose }: TestUserFormProps) {
  const [draft, setDraft] = useState<Draft>(draftFrom(initial));
  const [wasVisible, setWasVisible] = useState(visible);
  const [error, setError] = useState<string | null>(null);

  // Reset ao abrir — padrão "adjust state during render" do React
  // (alternativa documentada ao useEffect + setState).
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setDraft(draftFrom(initial));
      setError(null);
    }
  }

  function handleSave() {
    const age = Number.parseInt(draft.age, 10);
    if (draft.name.trim() === '') {
      setError('Dê um nome para o usuário de teste.');
      return;
    }
    if (!Number.isFinite(age) || age < 18 || age > 99) {
      setError('Idade precisa ser um número entre 18 e 99.');
      return;
    }
    if (draft.city.trim() === '') {
      setError('Informe o bairro/cidade para ele aparecer no mapa.');
      return;
    }

    onSave({
      id: initial?.id,
      name: draft.name.trim(),
      age,
      city: draft.city.trim(),
      bio: draft.bio.trim(),
      emoji: draft.emoji,
      gradient: draft.gradient,
      interests: draft.interests,
      wantsToday: draft.wantsToday,
      distanceM: draft.distanceM,
      online: draft.online,
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(160)}
        exiting={FadeOut.duration(140)}
        style={styles.backdrop}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />

        <Animated.View entering={SlideInDown.duration(240)} style={styles.sheet}>
          <View style={styles.grabber} />

          <Text style={styles.title}>
            {initial ? 'Editar usuário de teste' : 'Novo usuário de teste'}
          </Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Nome</Text>
            <TextInput
              value={draft.name}
              onChangeText={(value) => setDraft((d) => ({ ...d, name: value }))}
              placeholder="Ex.: Marina"
              placeholderTextColor="#756881"
              style={styles.input}
            />

            <View style={styles.rowPair}>
              <View style={styles.half}>
                <Text style={styles.label}>Idade</Text>
                <TextInput
                  value={draft.age}
                  onChangeText={(value) => setDraft((d) => ({ ...d, age: value }))}
                  keyboardType="number-pad"
                  placeholder="26"
                  placeholderTextColor="#756881"
                  style={styles.input}
                />
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>Bairro / cidade</Text>
                <TextInput
                  value={draft.city}
                  onChangeText={(value) => setDraft((d) => ({ ...d, city: value }))}
                  placeholder="Centro, SP"
                  placeholderTextColor="#756881"
                  style={styles.input}
                />
              </View>
            </View>

            <Text style={styles.label}>Bio</Text>
            <TextInput
              value={draft.bio}
              onChangeText={(value) => setDraft((d) => ({ ...d, bio: value }))}
              placeholder="Um pouco sobre essa pessoa…"
              placeholderTextColor="#756881"
              multiline
              style={[styles.input, styles.textarea]}
            />

            <Text style={styles.label}>Foto (avatar)</Text>
            <View style={styles.chipWrap}>
              {AVATAR_EMOJIS.map((emoji, index) => (
                <Pressable
                  key={emoji}
                  onPress={() =>
                    setDraft((d) => ({
                      ...d,
                      emoji,
                      gradient: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
                    }))
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Avatar ${emoji}`}
                  style={[styles.emoji, draft.emoji === emoji && styles.emojiActive]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Quer fazer hoje (momentos)</Text>
            <View style={styles.chipWrap}>
              {intents.map((intent) => (
                <Chip
                  key={intent.id}
                  label={`${intent.emoji} ${intent.label}`}
                  selected={draft.wantsToday.includes(intent.id)}
                  onPress={() =>
                    setDraft((d) => ({ ...d, wantsToday: toggle(d.wantsToday, intent.id) }))
                  }
                />
              ))}
            </View>

            <Text style={styles.label}>Interesses</Text>
            <View style={styles.chipWrap}>
              {ALL_INTERESTS.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  selected={draft.interests.includes(interest)}
                  onPress={() =>
                    setDraft((d) => ({ ...d, interests: toggle(d.interests, interest) }))
                  }
                />
              ))}
            </View>

            <Text style={styles.label}>Distância de você</Text>
            <View style={styles.chipWrap}>
              {DISTANCES.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={draft.distanceM === option.value}
                  onPress={() => setDraft((d) => ({ ...d, distanceM: option.value }))}
                />
              ))}
            </View>

            <Text style={styles.label}>Status</Text>
            <View style={styles.chipWrap}>
              <Chip
                label="Online agora"
                selected={draft.online}
                onPress={() => setDraft((d) => ({ ...d, online: true }))}
              />
              <Chip
                label="Offline"
                selected={!draft.online}
                onPress={() => setDraft((d) => ({ ...d, online: false }))}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footer}>
            <GlowButton
              label="Cancelar"
              variant="ghost"
              style={styles.footerButton}
              onPress={onClose}
            />
            <GlowButton
              label={initial ? 'Salvar' : 'Criar usuário'}
              style={styles.footerButton}
              onPress={handleSave}
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
    backgroundColor: 'rgba(5, 2, 10, 0.78)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.25)',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '92%',
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
    fontSize: 19,
    letterSpacing: -0.3,
    marginBottom: spacing.sm,
  },

  scroll: {
    maxHeight: 460,
  },

  scrollContent: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },

  label: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12.5,
    letterSpacing: 0.3,
    marginTop: spacing.sm,
  },

  input: {
    minHeight: 46,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#3B284A',
    backgroundColor: '#150D21',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14.5,
  },

  textarea: {
    minHeight: 76,
    textAlignVertical: 'top',
  },

  rowPair: {
    flexDirection: 'row',
    gap: 10,
  },

  half: {
    flex: 1,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.xs,
  },

  emoji: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#3B284A',
  },

  emojiActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  emojiText: {
    fontSize: 19,
  },

  error: {
    color: colors.danger,
    fontFamily: 'Poppins_500Medium',
    fontSize: 12.5,
    marginTop: spacing.sm,
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.sm,
  },

  footerButton: {
    flex: 1,
  },
});
