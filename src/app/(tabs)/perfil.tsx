// Perfil (ref 9) — cartão principal + acessos rápidos (Modo Presença, Segurança,
// Notificações, Conectai Plus...). Itens sem tela própria ainda são futuras fatias;
// aqui apenas indicam o destino previsto no backlog.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../../components/epic/Chip';
import { me } from '../../data/me';
import { colors, spacing } from '../../theme';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  soon?: boolean;
};

const MENU: { section: string; items: MenuItem[] }[] = [
  {
    section: 'Sua experiência',
    items: [
      { icon: 'walk-outline', label: 'Modo Presença', hint: 'Deixe claro que está aberto a conversas', soon: true },
      { icon: 'notifications-outline', label: 'Notificações', soon: true },
      { icon: 'pricetag-outline', label: 'Conectai Plus', hint: 'Recursos premium', soon: true },
    ],
  },
  {
    section: 'Confiança',
    items: [
      { icon: 'shield-checkmark-outline', label: 'Segurança', hint: 'Bloqueio, denúncias e central de confiança', soon: true },
      { icon: 'lock-closed-outline', label: 'Privacidade', hint: 'O que outros veem sobre você', soon: true },
      { icon: 'help-circle-outline', label: 'Ajuda', soon: true },
    ],
  },
];

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Ionicons name="settings-outline" size={22} color="#C9B8DA" />
      </View>

      <Animated.View entering={FadeInUp.duration(320)}>
        <LinearGradient
          colors={['#2A1743', '#180E28']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.avatar}
            >
              <Text style={styles.avatarEmoji}>✨</Text>
            </LinearGradient>
          </View>

          <Text style={styles.name}>Você</Text>
          <Text style={styles.meta}>
            {me.city.split(',')[0]} · {me.age} anos
          </Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Conexões</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Rolês</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Interesses</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
          >
            <Text style={styles.editText}>Editar perfil</Text>
          </Pressable>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.interestsLabel}>Seus interesses</Text>
      <View style={styles.chipWrap}>
        {me.interests.map((interest) => (
          <Chip key={interest} label={interest} selected={false} onPress={() => {}} />
        ))}
        <Chip label="+ editar" selected onPress={() => {}} />
      </View>

      {MENU.map((group, groupIndex) => (
        <Animated.View
          key={group.section}
          entering={FadeInUp.delay(90 * (groupIndex + 1)).duration(300)}
        >
          <Text style={styles.group}>{group.section}</Text>

          <View style={styles.groupCard}>
            {group.items.map((item, index) => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.item,
                  index < group.items.length - 1 && styles.itemBorder,
                  pressed && styles.itemPressed,
                ]}
              >
                <View style={styles.itemIcon}>
                  <Ionicons name={item.icon} size={19} color={colors.primary} />
                </View>

                <View style={styles.itemBody}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.hint ? <Text style={styles.itemHint}>{item.hint}</Text> : null}
                </View>

                {item.soon ? <Text style={styles.soon}>em breve</Text> : null}
                <Ionicons name="chevron-forward" size={17} color="#7C6E91" />
              </Pressable>
            ))}
          </View>
        </Animated.View>
      ))}

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
      >
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>

      <Text style={styles.version}>Conectaí · v0.1.0</Text>
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

  card: {
    marginTop: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.3)',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: 4,
    boxShadow: '0 14px 34px rgba(0, 0, 0, 0.35)',
  },

  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: 'rgba(149, 106, 250, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarEmoji: {
    fontSize: 34,
  },

  name: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    letterSpacing: -0.5,
  },

  meta: {
    color: '#A495B8',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },

  stat: {
    alignItems: 'center',
    gap: 2,
    minWidth: 64,
  },

  statValue: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },

  statLabel: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#3B284A',
  },

  editButton: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: 9,
    backgroundColor: 'rgba(149, 106, 250, 0.14)',
  },

  editText: {
    color: colors.primary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  interestsLabel: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.3,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  group: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.3,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  groupCard: {
    backgroundColor: '#150D21',
    borderWidth: 1,
    borderColor: '#2C1C3D',
    borderRadius: 16,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#241734',
  },

  itemPressed: {
    backgroundColor: '#1C1230',
  },

  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(149, 106, 250, 0.12)',
  },

  itemBody: {
    flex: 1,
    gap: 1,
  },

  itemLabel: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },

  itemHint: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 15,
  },

  soon: {
    color: '#7C6E91',
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    backgroundColor: '#241734',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },

  logout: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 129, 0.35)',
    backgroundColor: 'rgba(255, 107, 129, 0.08)',
  },

  logoutText: {
    color: colors.danger,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },

  version: {
    color: '#5C5170',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});
