// Seletor de rolê/grupo — usado no card de pessoa do Descobrir.
// "Chamar pra um rolê" lista MEUS eventos; "Adicionar ao grupo" lista OS GRUPOS
// dos meus eventos. Não existe conversa individual: tudo termina em grupo de evento.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

import { colors, radii, spacing } from '../../theme';

export type RoleOption = {
  id: string;
  emoji: string;
  title: string;
  meta: string;
  gradient: [string, string];
};

type RolePickerProps = {
  visible: boolean;
  mode: 'invite' | 'group';
  personName: string;
  options: RoleOption[];
  onSelect: (option: RoleOption) => void;
  onClose: () => void;
};

export function RolePicker({
  visible,
  mode,
  personName,
  options,
  onSelect,
  onClose,
}: RolePickerProps) {
  const title =
    mode === 'invite' ? `Chamar ${personName} pra um rolê` : `Adicionar ${personName} ao grupo`;

  const subtitle =
    mode === 'invite'
      ? 'O grupo de chat nasce quando ela confirmar o evento.'
      : 'Todo grupo nasce de um evento — não existe conversa individual.';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(160)}
        exiting={FadeOut.duration(140)}
        style={styles.backdrop}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Fechar"
        />

        <Animated.View entering={SlideInDown.duration(240)} style={styles.sheet}>
          <View style={styles.grabber} />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {options.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🗓️</Text>
              <Text style={styles.emptyTitle}>Você ainda não tem rolês</Text>
              <Text style={styles.emptyText}>
                Crie ou confirme um evento na aba Eventos — o grupo de chat nasce sozinho.
              </Text>
            </View>
          ) : (
            options.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => onSelect(option)}
                accessibilityRole="button"
                accessibilityLabel={option.title}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <LinearGradient colors={option.gradient} style={styles.rowEmoji}>
                  <Text style={styles.rowEmojiText}>{option.emoji}</Text>
                </LinearGradient>

                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {option.title}
                  </Text>
                  <Text style={styles.rowMeta} numberOfLines={1}>
                    {option.meta}
                  </Text>
                </View>

                <Ionicons name="add-circle" size={22} color={colors.primary} />
              </Pressable>
            ))
          )}

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            style={({ pressed }) => [styles.cancel, pressed && styles.cancelPressed]}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
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
    marginBottom: spacing.xs,
  },

  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    letterSpacing: -0.3,
  },

  subtitle: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#3B284A',
    borderRadius: 16,
    padding: 10,
  },

  rowPressed: {
    backgroundColor: '#2A1743',
  },

  rowEmoji: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowEmojiText: {
    fontSize: 19,
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
    fontSize: 11.5,
  },

  empty: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F1331',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3B284A',
    padding: spacing.lg,
  },

  emptyEmoji: {
    fontSize: 28,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    textAlign: 'center',
  },

  emptyText: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
  },

  cancel: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3B284A',
    backgroundColor: '#150D21',
    marginTop: spacing.xs,
  },

  cancelPressed: {
    opacity: 0.8,
  },

  cancelText: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
});
