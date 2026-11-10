// Descobrir por rolês e intenções — ref 3 (toggle "Perto de você / Todos") +
// "Momentos e Intenções" da ref 11/12: primeiro o que você quer fazer hoje,
// depois quem está afim da mesma coisa. Sem swipe e sem coração.

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../../components/epic/Chip';
import { GlowButton } from '../../components/epic/GlowButton';
import { FilterSheet, type DiscoverFilters } from '../../components/descobrir/FilterSheet';
import { IntentCard } from '../../components/descobrir/IntentCard';
import { RolePicker, type RoleOption } from '../../components/descobrir/RolePicker';
import { mockEvents } from '../../data/events';
import { mockGroups } from '../../data/groups';
import { intents } from '../../data/intents';
import { me } from '../../data/me';
import { listUsers, type Person } from '../../db/queries';
import { colors, spacing } from '../../theme';

type PickerState = {
  mode: 'invite' | 'group';
  person: Person;
};

export default function DescobrirScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [people, setPeople] = useState<Person[]>([]);
  const [scope, setScope] = useState<'perto' | 'todos'>('perto');
  const [intentId, setIntentId] = useState(intents[0].id);
  const [filters, setFilters] = useState<DiscoverFilters>({
    maxDistanceKm: null,
    age: 'all',
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Recarrega ao voltar para a aba (usuários criados no Perfil aparecem aqui).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      listUsers()
        .then((rows) => {
          if (active) setPeople(rows);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, []),
  );

  const intent = intents.find((item) => item.id === intentId) ?? intents[0];
  const phrase = intent.label.charAt(0).toLowerCase() + intent.label.slice(1);

  const results = useMemo(
    () =>
      people.filter((person) => {
        if (!person.wantsToday.includes(intentId)) return false;
        if (scope === 'perto' && person.distanceM > 3000) return false;
        if (filters.maxDistanceKm !== null && person.distanceM > filters.maxDistanceKm * 1000) {
          return false;
        }
        if (filters.age === '18-25' && !(person.age >= 18 && person.age <= 25)) return false;
        if (filters.age === '26-35' && !(person.age >= 26 && person.age <= 35)) return false;
        if (filters.age === '36+' && person.age < 36) return false;
        return true;
      }),
    [intentId, scope, filters, people],
  );

  const hasActiveFilters = filters.maxDistanceKm !== null || filters.age !== 'all';

  // Meus eventos e os grupos deles — fonte única das ações do card.
  const myEvents = mockEvents.filter((event) => event.mine);
  const myEventIds = new Set(myEvents.map((event) => event.id));
  const myGroups = mockGroups.filter((group) => myEventIds.has(group.eventId));

  const pickerOptions: RoleOption[] =
    picker === null
      ? []
      : picker.mode === 'invite'
        ? myEvents.map((event) => ({
            id: event.id,
            emoji: event.emoji,
            title: event.title,
            meta: `${event.date.day} ${event.date.month} · ${event.place}`,
            gradient: event.gradient,
          }))
        : myGroups.map((group) => ({
            id: group.id,
            emoji: group.emoji,
            title: group.name,
            meta: `${group.members} membros · ${group.online} online`,
            gradient: group.gradient,
          }));

  function sharedWith(person: Person) {
    return person.interests.filter((interest) => me.interests.includes(interest));
  }

  function clearFilters() {
    setFilters({ maxDistanceKm: null, age: 'all' });
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Descobrir</Text>

        <Pressable
          onPress={() => setSheetOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir filtros de busca"
          style={styles.filterButton}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={hasActiveFilters ? colors.primary : '#C9B8DA'}
          />
          {hasActiveFilters ? <View style={styles.filterDot} /> : null}
        </Pressable>
      </View>

      <View style={styles.toggles}>
        <Chip
          label="Perto de você"
          selected={scope === 'perto'}
          onPress={() => setScope('perto')}
        />
        <Chip label="Todos" selected={scope === 'todos'} onPress={() => setScope('todos')} />
      </View>

      <Text style={styles.sectionLabel}>O que você quer fazer hoje?</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.intentRow}
        style={styles.intentScroll}
      >
        {intents.map((item) => (
          <Chip
            key={item.id}
            label={`${item.emoji} ${item.label}`}
            selected={item.id === intentId}
            onPress={() => setIntentId(item.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Gente afim de {phrase}</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>
              {results.length} {results.length === 1 ? 'pessoa' : 'pessoas'}
            </Text>
          </View>
        </View>

        {results.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{people.length === 0 ? '👥' : '🗓️'}</Text>
            {people.length === 0 ? (
              <>
                <Text style={styles.emptyTitle}>Nenhum usuário de teste ainda</Text>
                <Text style={styles.emptyText}>
                  Crie pessoas no Modo teste do Perfil e elas aparecem aqui para você
                  descobrir por rolês e intenções.
                </Text>
                <GlowButton
                  label="Criar usuário de teste"
                  onPress={() => router.push('/perfil')}
                  style={styles.emptyButton}
                />
              </>
            ) : (
              <>
                <Text style={styles.emptyTitle}>Ninguém afim de {phrase} por aqui</Text>
                <Text style={styles.emptyText}>
                  Escolha outro rolê acima ou amplie os filtros — combos novos aparecem o
                  tempo todo.
                </Text>
                {hasActiveFilters ? (
                  <GlowButton
                    label="Limpar filtros"
                    variant="ghost"
                    onPress={clearFilters}
                    style={styles.emptyButton}
                  />
                ) : null}
              </>
            )}
          </View>
        ) : (
          results.map((person, index) => (
            <Animated.View
              key={person.id}
              entering={FadeInDown.delay(70 * index).duration(300)}
              exiting={FadeOut.duration(180)}
            >
              <IntentCard
                person={person}
                phrase={phrase}
                shared={sharedWith(person)}
                onInvite={() => setPicker({ mode: 'invite', person })}
                onAddGroup={() => setPicker({ mode: 'group', person })}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>

      <RolePicker
        visible={picker !== null}
        mode={picker?.mode ?? 'invite'}
        personName={picker?.person.name ?? ''}
        options={pickerOptions}
        onSelect={(option) => {
          if (!picker) return;
          if (picker.mode === 'invite') {
            setToast(
              `🎉 Convite enviado para ${picker.person.name} — o grupo ${option.title} nasce quando ela confirmar`,
            );
          } else {
            setToast(`👥 ${picker.person.name} foi adicionada ao grupo ${option.title}`);
          }
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />

      <FilterSheet
        visible={sheetOpen}
        initial={filters}
        onApply={(next) => {
          setFilters(next);
          setSheetOpen(false);
        }}
        onClose={() => setSheetOpen(false)}
      />

      {toast ? (
        <Animated.View
          key={toast}
          entering={FadeInDown.duration(220)}
          exiting={FadeOut.duration(200)}
          style={[styles.toast, { pointerEvents: 'none' }]}
        >
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
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

  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#1A1025',
    borderWidth: 1,
    borderColor: '#3B284A',
  },

  filterDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  toggles: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },

  sectionLabel: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.2,
    marginBottom: spacing.sm,
  },

  intentScroll: {
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.md,
  },

  intentRow: {
    gap: 8,
    paddingHorizontal: spacing.lg,
  },

  list: {
    paddingBottom: spacing.xl,
  },

  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: spacing.sm,
  },

  resultsTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },

  countPill: {
    backgroundColor: '#1F1331',
    borderWidth: 1,
    borderColor: '#3B284A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  countText: {
    color: '#A495B8',
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },

  empty: {
    alignItems: 'center',
    gap: 8,
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

  emptyButton: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },

  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.md,
    backgroundColor: 'rgba(33, 19, 51, 0.97)',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  toastText: {
    color: '#E9E2F2',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    textAlign: 'center',
  },
});
