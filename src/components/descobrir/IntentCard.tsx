// Card de pessoa no Descobrir por rolês e intenções.
// Sem swipe, sem coração, sem conversa individual: o que conecta é a atividade em
// comum, e as ações sempre terminam num GRUPO de evento (regra do produto).
// TODO(backend): foto real (avatar_url), convite e adição reais ao grupo.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Person } from '../../db/queries';
import { colors, spacing } from '../../theme';

type IntentCardProps = {
  person: Person;
  /** Frase da intenção selecionada (ex.: "tomar um café"). */
  phrase: string;
  /** Interesses em comum com o usuário atual. */
  shared: string[];
  /** Abre o seletor dos meus eventos para convidar a pessoa. */
  onInvite: () => void;
  /** Abre o seletor dos meus grupos de evento para adicionar a pessoa. */
  onAddGroup: () => void;
};

const MAX_CHIPS = 5;

export function IntentCard({
  person,
  phrase,
  shared,
  onInvite,
  onAddGroup,
}: IntentCardProps) {
  const hasShared = shared.length > 0;
  const chips = (hasShared ? shared : person.interests).slice(0, MAX_CHIPS);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.avatarWrap}>
          <LinearGradient colors={person.gradient} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{person.emoji}</Text>
          </LinearGradient>
          {person.online ? <View style={styles.online} /> : null}
        </View>

        <View style={styles.identity}>
          <Text style={styles.name}>
            {person.name}, {person.age}
          </Text>
          <Text style={styles.meta}>
            📍 {person.distanceM} m · {person.city}
          </Text>
        </View>

        <View style={styles.wantsPill}>
          <Text style={styles.wantsText} numberOfLines={1}>
            quer {phrase}
          </Text>
        </View>
      </View>

      <Text style={styles.sharedLabel}>
        {hasShared ? 'Vocês curtem juntos' : `Interesses de ${person.name}`}
      </Text>

      <View style={styles.chips}>
        {chips.map((interest) => {
          const isShared = shared.includes(interest);
          return (
            <View key={interest} style={[styles.chip, isShared && styles.chipShared]}>
              <Text style={[styles.chipText, isShared && styles.chipTextShared]}>
                {interest}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.bio} numberOfLines={2}>
        {person.bio}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onAddGroup}
          accessibilityRole="button"
          accessibilityLabel={`Adicionar ${person.name} a um dos meus grupos`}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Ionicons name="people-outline" size={16} color="#C9B8DA" />
          <Text style={styles.secondaryText}>Adicionar ao grupo</Text>
        </Pressable>

        <Pressable
          onPress={onInvite}
          accessibilityRole="button"
          accessibilityLabel={`Chamar ${person.name} para um rolê`}
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryGradient}
          >
            <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
            <Text style={styles.primaryText}>Chamar pra um rolê</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#150D21',
    borderWidth: 1,
    borderColor: '#2C1C3D',
    borderRadius: 20,
    padding: spacing.md,
    gap: 10,
    marginBottom: 10,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatarWrap: {
    width: 50,
    height: 50,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarEmoji: {
    fontSize: 22,
  },

  online: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#55D6A9',
    borderWidth: 2,
    borderColor: '#150D21',
  },

  identity: {
    flex: 1,
    gap: 2,
  },

  name: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },

  meta: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  wantsPill: {
    maxWidth: 116,
    backgroundColor: 'rgba(149, 106, 250, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.45)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  wantsText: {
    color: '#C4A9FF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10.5,
    textAlign: 'center',
  },

  sharedLabel: {
    color: '#A495B8',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  chip: {
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#3B284A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  chipShared: {
    backgroundColor: 'rgba(149, 106, 250, 0.22)',
    borderColor: 'rgba(149, 106, 250, 0.65)',
  },

  chipText: {
    color: '#8F829D',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  chipTextShared: {
    color: '#E9E2F2',
  },

  bio: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },

  secondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#3B284A',
    backgroundColor: '#1F1331',
  },

  secondaryText: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12.5,
  },

  primary: {
    flex: 1.25,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(149, 106, 250, 0.4)',
  },

  primaryGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  primaryText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12.5,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
