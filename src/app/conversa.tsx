// Conversa do grupo de evento (ref 5, adaptada para grupo).
// Só existe porque o evento nasceu/foi confirmado — não há conversa individual.
// TODO(backend): mensagens reais com realtime + envio persistido em `messages`.

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mockGroups, type ChatMessage } from '../data/groups';
import { colors, spacing } from '../theme';

function now() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export default function ConversaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const group = mockGroups.find((item) => item.id === id);
  const [messages, setMessages] = useState<ChatMessage[]>(group?.messages ?? []);
  const [draft, setDraft] = useState('');

  if (!group) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.emptyEmoji}>🤔</Text>
        <Text style={styles.emptyTitle}>Grupo não encontrado</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  function handleSend() {
    const text = draft.trim();
    if (text === '') return;

    setMessages((current) => [
      ...current,
      { id: `local-${current.length}`, author: 'Você', text, time: now(), mine: true },
    ]);
    setDraft('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>

        <LinearGradient colors={group.gradient} style={styles.headerAvatar}>
          <Text style={styles.headerEmoji}>{group.emoji}</Text>
        </LinearGradient>

        <View style={styles.headerBody}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.headerMeta}>
            {group.members} membros · {group.online} online
          </Text>
        </View>
      </View>

      <View style={styles.groupNote}>
        <Ionicons name="information-circle-outline" size={14} color="#A495B8" />
        <Text style={styles.groupNoteText}>
          Grupo criado a partir do evento — aqui só rolê, sem conversa individual.
        </Text>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.bubbleRow, message.mine && styles.bubbleRowMine]}
          >
            {!message.mine ? <Text style={styles.author}>{message.author}</Text> : null}

            <View style={[styles.bubble, message.mine ? styles.bubbleMine : styles.bubbleOther]}>
              <Text style={[styles.bubbleText, message.mine && styles.bubbleTextMine]}>
                {message.text}
              </Text>
              <Text style={[styles.bubbleTime, message.mine && styles.bubbleTimeMine]}>
                {message.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={`Mensagem para o grupo ${group.name}…`}
          placeholderTextColor="#756881"
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={handleSend}
          disabled={draft.trim() === ''}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensagem"
          style={({ pressed }) => [
            styles.send,
            draft.trim() === '' && styles.sendDisabled,
            pressed && styles.sendPressed,
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendGradient}
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: '#0D0617',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  emptyEmoji: {
    fontSize: 34,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },

  backLink: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3B284A',
    backgroundColor: '#150D21',
  },

  backLinkText: {
    color: '#C9B8DA',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: '#120A1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C1C3D',
  },

  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerEmoji: {
    fontSize: 18,
  },

  headerBody: {
    flex: 1,
    gap: 1,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15.5,
  },

  headerMeta: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11.5,
  },

  groupNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#150D21',
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#241734',
  },

  groupNoteText: {
    color: '#A495B8',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    flexShrink: 1,
  },

  messages: {
    padding: spacing.md,
    gap: 12,
  },

  bubbleRow: {
    alignItems: 'flex-start',
    gap: 3,
  },

  bubbleRowMine: {
    alignItems: 'flex-end',
  },

  author: {
    color: '#A495B8',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    marginLeft: 6,
  },

  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 3,
  },

  bubbleOther: {
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#2C1C3D',
    borderTopLeftRadius: 6,
  },

  bubbleMine: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 6,
  },

  bubbleText: {
    color: '#E9E2F2',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },

  bubbleTextMine: {
    color: '#FFFFFF',
  },

  bubbleTime: {
    color: '#7C6E91',
    fontFamily: 'Poppins_400Regular',
    fontSize: 9.5,
    alignSelf: 'flex-end',
  },

  bubbleTimeMine: {
    color: 'rgba(255, 255, 255, 0.75)',
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: '#120A1E',
    borderTopWidth: 1,
    borderTopColor: '#2C1C3D',
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#3B284A',
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },

  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },

  sendDisabled: {
    opacity: 0.45,
  },

  sendPressed: {
    transform: [{ scale: 0.94 }],
  },

  sendGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
