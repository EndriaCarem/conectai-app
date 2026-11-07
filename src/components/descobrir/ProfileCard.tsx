// Card de pessoa (ref 3): foto, distância e contador no topo, identidade e chips no rodapé.
// "Foto" = gradiente + emoji como placeholder até o storage de imagens existir.
// TODO(backend): foto real do perfil vindo do storage (avatar_url).

import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { Person } from '../../data/profiles';

type ProfileCardProps = {
  person: Person;
  counter?: string;
};

export function ProfileCard({ person, counter }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={person.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.photo}
      >
        <Text style={styles.watermark}>{person.emoji}</Text>

        <View style={styles.topRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>📍 {person.distanceM} m</Text>
          </View>

          {counter ? (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{counter}</Text>
            </View>
          ) : null}
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(8, 4, 15, 0.55)', 'rgba(8, 4, 15, 0.94)']}
          style={styles.scrim}
        >
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {person.name}, {person.age}
            </Text>
            {person.online ? <View style={styles.onlineBadge} /> : null}
          </View>

          <Text style={styles.place}>📍 {person.city}</Text>

          <View style={styles.chipsRow}>
            {person.interests.slice(0, 6).map((interest) => (
              <View key={interest} style={styles.chip}>
                <Text style={styles.chipText}>{interest}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.bio} numberOfLines={2}>
            {person.bio}
          </Text>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1A1025',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.25)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
  },

  photo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  watermark: {
    fontSize: 120,
    opacity: 0.22,
  },

  topRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  pill: {
    backgroundColor: 'rgba(8, 4, 15, 0.72)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },

  pillText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },

  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 34,
    paddingBottom: 16,
    gap: 6,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  name: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    letterSpacing: -0.6,
  },

  onlineBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#55D6A9',
    boxShadow: '0 0 8px rgba(85, 214, 169, 0.8)',
  },

  place: {
    color: '#D6CBE4',
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },

  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  chipText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  bio: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
});
