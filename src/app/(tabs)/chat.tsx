// Chat (ref 5 adaptada) — SÓ grupos de evento. Não existem conversas individuais:
// todo grupo nasce de um evento criado ou confirmado por você.
// TODO(backend): lista vinda de `chats` + `chat_members`, realtime das mensagens.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mockGroups } from '../../data/groups';
import { colors, radii, spacing } from '../../theme';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <View style={styles.groupsPill}>
          <Ionicons name="people" size={13} color={colors.primary} />
          <Text style={styles.groupsPillText}>só grupos</Text>
        </View>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={17} color="#756881" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar grupos…"
          placeholderTextColor="#756881"
          autoCapitalize="none"
          style={styles.searchInput}
        />
        {query !== '' && (
          <Pressable onPress={() => setQuery('')} accessibilityLabel="Limpar busca">
            <Ionicons name="close-circle" size={17} color="#8F829D" />
          </Pressable>
        )}
      </View>

      <Text style={styles.hint}>
        Seus grupos nascem dos eventos que você cria ou confirma.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>Nenhum grupo por aqui</Text>
            <Text style={styles.emptyText}>
              Confirme presença em um evento na aba Eventos e o grupo de conversa é
              criado automaticamente.
            </Text>
          </View>
        ) : (
          filtered.map((group, index) => (
            <Animated.View
              key={group.id}
              entering={FadeInUp.delay(70 * index).duration(300)}
            >
              <Pressable
                onPress={() => router.push({ pathname: '/conversa', params: { id: group.id } })}
                accessibilityRole="button"
                accessibilityLabel={`Abrir grupo ${group.name}`}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <LinearGradient colors={group.gradient} style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{group.emoji}</Text>
                </LinearGradient>

                <View style={styles.rowBody}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {group.name}
                    </Text>
                    <Text style={styles.rowTime}>{group.time}</Text>
                  </View>

                  <Text style={styles.rowMembers}>
                    {group.members} membros · {group.online} online
                  </Text>

                  <View style={styles.rowBottom}>
                    <Text
                      style={[styles.rowSnippet, group.unread > 0 && styles.rowSnippetUnread]}
                      numberOfLines={1}
                    >
                      {group.lastAuthor}: {group.lastMessage}
                    </Text>
                    {group.unread > 0 ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{group.unread}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))
        )}
      </ScrollView>
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

  groupsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(149, 106, 250, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.4)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  groupsPillText: {
    color: '#C4A9FF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radii.md,
    borderColor: '#3B284A',
    backgroundColor: '#150D21',
    borderWidth: 1,
    paddingHorizontal: 14,
    marginTop: spacing.md,
  },

  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },

  hint: {
    color: '#7C6E91',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11.5,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  list: {
    paddingBottom: spacing.xl,
    gap: 6,
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
  },

  rowPressed: {
    backgroundColor: '#1C1230',
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

  rowBody: {
    flex: 1,
    gap: 2,
  },

  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  rowName: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },

  rowTime: {
    color: '#7C6E91',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  rowMembers: {
    color: colors.primary,
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  rowSnippet: {
    flex: 1,
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12.5,
  },

  rowSnippetUnread: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_500Medium',
  },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },

  empty: {
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#150D21',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C1C3D',
    paddingVertical: spacing.lg,
  },

  emptyEmoji: {
    fontSize: 32,
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
});
