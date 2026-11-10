// Momentos — rolês rápidos (ref "Momentos e Intenções").
// Você cria o rolê, os usuários de teste aparecem nele e entram/saem.
// Tudo gravado no SQLite local. Acessado pelo Perfil → Modo teste.
// TODO(backend): momentos reais com opt-in por localização e notificações.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../components/epic/Chip';
import { GlowButton } from '../components/epic/GlowButton';
import {
  addMember,
  createMoment,
  deleteMoment,
  listMomentsWithMembers,
  listUsers,
  listUsersNotIn,
  removeMember,
  setMemberJoined,
  type MomentWithMembers,
  type Person,
} from '../db/queries';
import { colors, radii, spacing } from '../theme';

const WHEN_OPTIONS = ['Agora', 'Em 1 hora', 'Hoje à noite', 'Amanhã'];
const EMOJI_OPTIONS = ['☕', '🎬', '🥾', '🎲', '🍻', '🎧', '🏋️', '💬', '🐾', '🍜'];

export default function MomentosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [moments, setMoments] = useState<MomentWithMembers[]>([]);
  const [users, setUsers] = useState<Person[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', place: '', whenLabel: 'Agora', emoji: '☕' });
  const [formError, setFormError] = useState<string | null>(null);
  const [addFor, setAddFor] = useState<string | null>(null);
  const [addList, setAddList] = useState<Person[]>([]);

  const load = useCallback(async () => {
    try {
      const [momentRows, userRows] = await Promise.all([
        listMomentsWithMembers(),
        listUsers(),
      ]);
      setMoments(momentRows);
      setUsers(userRows);
    } catch {
      // Banco indisponível: mantém a tela utilizável.
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function handleCreate() {
    if (draft.title.trim() === '') {
      setFormError('Dê um nome para o rolê.');
      return;
    }
    if (draft.place.trim() === '') {
      setFormError('Informe onde será.');
      return;
    }

    createMoment({
      title: draft.title.trim(),
      place: draft.place.trim(),
      whenLabel: draft.whenLabel,
      emoji: draft.emoji,
    })
      .then(() => {
        setCreateOpen(false);
        setFormError(null);
        setDraft({ title: '', place: '', whenLabel: 'Agora', emoji: '☕' });
        return load();
      })
      .catch(() => {});
  }

  function handleDelete(momentId: string) {
    deleteMoment(momentId)
      .then(load)
      .catch(() => {});
  }

  function handleToggle(moment: MomentWithMembers, userId: string, joined: boolean) {
    setMemberJoined(moment.id, userId, joined)
      .then(load)
      .catch(() => {});
  }

  function handleRemove(momentId: string, userId: string) {
    removeMember(momentId, userId)
      .then(load)
      .catch(() => {});
  }

  function openAdd(momentId: string) {
    setAddFor(momentId);
    listUsersNotIn(momentId)
      .then(setAddList)
      .catch(() => setAddList([]));
  }

  function handleAdd(userId: string) {
    if (!addFor) return;
    addMember(addFor, userId)
      .then(() => listUsersNotIn(addFor))
      .then(setAddList)
      .catch(() => {});
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerBody}>
          <Text style={styles.title}>Momentos</Text>
          <Text style={styles.subtitle}>Rolês rápidos — quem está afim agora</Text>
        </View>

        <Pressable
          onPress={() => setCreateOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Criar momento"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {users.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={styles.emptyTitle}>Crie usuários de teste primeiro</Text>
            <Text style={styles.emptyText}>
              Os momentos precisam de pessoas para entrar e sair. Crie no Perfil → Modo teste.
            </Text>
            <GlowButton
              label="Ir para o Perfil"
              style={styles.emptyButton}
              onPress={() => router.push('/perfil')}
            />
          </View>
        ) : moments.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>⚡</Text>
            <Text style={styles.emptyTitle}>Nenhum momento agora</Text>
            <Text style={styles.emptyText}>
              Crie um rolê rápido (café, cinema, trilha…) e veja quem dos seus usuários de teste
              entra.
            </Text>
            <GlowButton
              label="Criar momento"
              style={styles.emptyButton}
              onPress={() => setCreateOpen(true)}
            />
          </View>
        ) : (
          moments.map((moment, index) => {
            const joined = moment.members.filter((member) => member.joined).length;

            return (
              <Animated.View
                key={moment.id}
                entering={FadeInDown.delay(70 * index).duration(300)}
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardEmoji}
                  >
                    <Text style={styles.cardEmojiText}>{moment.emoji}</Text>
                  </LinearGradient>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {moment.title}
                    </Text>
                    <Text style={styles.cardMeta} numberOfLines={1}>
                      📍 {moment.place} · ⏰ {moment.whenLabel}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleDelete(moment.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir momento ${moment.title}`}
                    style={({ pressed }) => [styles.cardAction, pressed && styles.pressed]}
                  >
                    <Ionicons name="trash-outline" size={17} color={colors.danger} />
                  </Pressable>
                </View>

                <View style={styles.cardDivider} />

                <Text style={styles.memberCount}>
                  {joined} no rolê · {moment.members.length} convidado(s)
                </Text>

                {moment.members.length === 0 ? (
                  <Text style={styles.noMembers}>
                    Ninguém aqui ainda — adicione pessoas de teste.
                  </Text>
                ) : (
                  moment.members.map((member) => (
                    <View key={member.user.id} style={styles.memberRow}>
                      <LinearGradient
                        colors={member.user.gradient}
                        style={styles.memberAvatar}
                      >
                        <Text style={styles.memberEmoji}>{member.user.emoji}</Text>
                      </LinearGradient>

                      <View style={styles.memberBody}>
                        <Text style={styles.memberName} numberOfLines={1}>
                          {member.user.name}
                        </Text>
                        <Text style={styles.memberMeta}>
                          {member.joined ? 'confirmou presença' : 'convocado'}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() =>
                          handleToggle(moment, member.user.id, !member.joined)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={
                          member.joined
                            ? `Marcar que ${member.user.name} saiu`
                            : `Marcar que ${member.user.name} entrou`
                        }
                        style={({ pressed }) => [
                          member.joined ? styles.joinActive : styles.join,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.joinText,
                            member.joined && styles.joinTextActive,
                          ]}
                        >
                          {member.joined ? 'Saiu' : 'Entrou'}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleRemove(moment.id, member.user.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Remover ${member.user.name} do momento`}
                        style={({ pressed }) => [styles.memberRemove, pressed && styles.pressed]}
                      >
                        <Ionicons name="close" size={15} color="#7C6E91" />
                      </Pressable>
                    </View>
                  ))
                )}

                <Pressable
                  onPress={() => openAdd(moment.id)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.addRow, pressed && styles.pressed]}
                >
                  <Ionicons name="person-add-outline" size={16} color={colors.primary} />
                  <Text style={styles.addText}>Adicionar pessoas</Text>
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      {/* Criar momento */}
      <Modal visible={createOpen} transparent animationType="fade" onRequestClose={() => setCreateOpen(false)}>
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(140)}
          style={styles.backdrop}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setCreateOpen(false)}
            accessibilityLabel="Fechar"
          />

          <Animated.View entering={SlideInDown.duration(240)} style={styles.sheet}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>Criar momento</Text>

            <Text style={styles.label}>O que rolê?</Text>
            <TextInput
              value={draft.title}
              onChangeText={(value) => setDraft((d) => ({ ...d, title: value }))}
              placeholder="Ex.: Café agora no Centro"
              placeholderTextColor="#756881"
              style={styles.input}
            />

            <Text style={styles.label}>Onde</Text>
            <TextInput
              value={draft.place}
              onChangeText={(value) => setDraft((d) => ({ ...d, place: value }))}
              placeholder="Ex.: Centro, SP"
              placeholderTextColor="#756881"
              style={styles.input}
            />

            <Text style={styles.label}>Quando</Text>
            <View style={styles.chipWrap}>
              {WHEN_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={draft.whenLabel === option}
                  onPress={() => setDraft((d) => ({ ...d, whenLabel: option }))}
                />
              ))}
            </View>

            <Text style={styles.label}>Ícone</Text>
            <View style={styles.chipWrap}>
              {EMOJI_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => setDraft((d) => ({ ...d, emoji }))}
                  accessibilityRole="button"
                  accessibilityLabel={`Ícone ${emoji}`}
                  style={[styles.emoji, draft.emoji === emoji && styles.emojiActive]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            {formError ? <Text style={styles.error}>{formError}</Text> : null}

            <View style={styles.footer}>
              <GlowButton
                label="Cancelar"
                variant="ghost"
                style={styles.footerButton}
                onPress={() => {
                  setCreateOpen(false);
                  setFormError(null);
                }}
              />
              <GlowButton
                label="Criar"
                style={styles.footerButton}
                onPress={handleCreate}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Adicionar pessoas ao momento */}
      <Modal visible={addFor !== null} transparent animationType="fade" onRequestClose={() => setAddFor(null)}>
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(140)}
          style={styles.backdrop}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAddFor(null)}
            accessibilityLabel="Fechar"
          />

          <Animated.View entering={SlideInDown.duration(240)} style={styles.sheet}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>Adicionar pessoas</Text>
            <Text style={styles.sheetHint}>
              Somente usuários de teste ainda não convidados.
            </Text>

            {addList.length === 0 ? (
              <Text style={styles.noMembers}>Todos os seus usuários já estão neste momento.</Text>
            ) : (
              addList.map((person) => (
                <Pressable
                  key={person.id}
                  onPress={() => handleAdd(person.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Adicionar ${person.name}`}
                  style={({ pressed }) => [styles.pickRow, pressed && styles.pressed]}
                >
                  <LinearGradient colors={person.gradient} style={styles.memberAvatar}>
                    <Text style={styles.memberEmoji}>{person.emoji}</Text>
                  </LinearGradient>
                  <View style={styles.memberBody}>
                    <Text style={styles.memberName}>{person.name}</Text>
                    <Text style={styles.memberMeta}>{person.city}</Text>
                  </View>
                  <Ionicons name="add-circle" size={22} color={colors.primary} />
                </Pressable>
              ))
            )}

            <GlowButton
              label="Fechar"
              variant="ghost"
              style={styles.footerButtonFull}
              onPress={() => setAddFor(null)}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
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
    gap: 10,
  },

  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1025',
    borderWidth: 1,
    borderColor: '#3B284A',
  },

  headerBody: {
    flex: 1,
    gap: 1,
  },

  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    letterSpacing: -0.7,
  },

  subtitle: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    boxShadow: '0 8px 20px rgba(149, 106, 250, 0.45)',
  },

  list: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  card: {
    backgroundColor: '#150D21',
    borderWidth: 1,
    borderColor: '#2C1C3D',
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: 12,
    gap: 10,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  cardEmoji: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardEmojiText: {
    fontSize: 20,
  },

  cardBody: {
    flex: 1,
    gap: 2,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },

  cardMeta: {
    color: '#A495B8',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },

  cardAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 129, 0.1)',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#241734',
  },

  memberCount: {
    color: colors.primary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11.5,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  noMembers: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    lineHeight: 18,
  },

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#2C1C3D',
    borderRadius: 14,
    padding: 8,
  },

  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  memberEmoji: {
    fontSize: 17,
  },

  memberBody: {
    flex: 1,
    gap: 1,
  },

  memberName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },

  memberMeta: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  join: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#3B284A',
    backgroundColor: '#2A1743',
  },

  joinActive: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(85, 214, 169, 0.5)',
    backgroundColor: 'rgba(85, 214, 169, 0.16)',
  },

  joinText: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },

  joinTextActive: {
    color: '#55D6A9',
  },

  memberRemove: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#241734',
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(149, 106, 250, 0.5)',
    backgroundColor: 'rgba(149, 106, 250, 0.08)',
  },

  addText: {
    color: colors.primary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
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
    paddingHorizontal: spacing.xl,
  },

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
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
    maxHeight: '88%',
  },

  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B284A',
    marginBottom: spacing.sm,
  },

  sheetTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 19,
    letterSpacing: -0.3,
  },

  sheetHint: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
    marginBottom: spacing.xs,
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
    marginTop: spacing.md,
  },

  footerButton: {
    flex: 1,
  },

  footerButtonFull: {
    marginTop: spacing.md,
  },

  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#3B284A',
    borderRadius: 14,
    padding: 8,
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
