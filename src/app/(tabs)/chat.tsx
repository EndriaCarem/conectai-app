// Chat (ref 5) — lista de conversas com busca e não lidas.
// TODO(backend): tabelas `chats`/`chat_members`/`messages` com RLS + realtime.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mockConversations } from '../../data/chats';
import { colors, radii, spacing } from '../../theme';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = mockConversations.filter((chat) =>
    chat.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova conversa"
          style={styles.newButton}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={17} color="#756881" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar conversas…"
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>Nenhuma conversa por aqui</Text>
            <Text style={styles.emptyText}>
              Conecte-se com alguém no Descobrir para começar a puxar assunto.
            </Text>
          </View>
        ) : (
          filtered.map((chat, index) => (
            <Animated.View
              key={chat.id}
              entering={FadeInUp.delay(70 * index).duration(300)}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Conversa com ${chat.name}`}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <View style={styles.avatarWrap}>
                  <LinearGradient colors={chat.gradient} style={styles.avatar}>
                    <Text style={styles.avatarEmoji}>{chat.emoji}</Text>
                  </LinearGradient>
                  {chat.online ? <View style={styles.onlineDot} /> : null}
                </View>

                <View style={styles.rowBody}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {chat.name}
                    </Text>
                    <Text style={styles.rowTime}>{chat.time}</Text>
                  </View>

                  <View style={styles.rowBottom}>
                    <Text
                      style={[styles.rowSnippet, chat.unread > 0 && styles.rowSnippetUnread]}
                      numberOfLines={1}
                    >
                      {chat.snippet}
                    </Text>
                    {chat.unread > 0 ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{chat.unread}</Text>
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

  newButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#1A1025',
    borderWidth: 1,
    borderColor: '#3B284A',
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
    marginBottom: spacing.sm,
  },

  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
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

  onlineDot: {
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

  rowBody: {
    flex: 1,
    gap: 3,
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
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
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
