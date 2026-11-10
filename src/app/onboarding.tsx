// Onboarding pós-cadastro — épicos 1, 2 e 3 do backlog (MVP).
// Etapas: intenção de amizade -> interesses -> personalidade social -> localização -> confirmação.
// TODO(backend): persistir em `profiles`, `user_interests` e `user_preference_rules` (Supabase/PostgreSQL)
// quando a sessão real existir. Hoje os dados ficam apenas no estado local desta tela.
// Regras respeitadas: nada de filtro rígido automático (§7.2) e pergunta central de intenção (§6).

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';

import { interestCategories } from '../data/interests';
import { Chip } from '../components/epic/Chip';
import Constellation from '../components/epic/Constellation';
import { GlowButton } from '../components/epic/GlowButton';
import { StepScaffold } from '../components/onboarding/StepScaffold';
import { colors, radii, spacing } from '../theme';

type OnboardingData = {
  intent: string | null;
  interests: string[];
  socialSize: string | null;
  socialPace: string | null;
  socialStyle: string | null;
  city: string;
  neighborhood: string;
};

type SocialField = 'socialSize' | 'socialPace' | 'socialStyle';

const INTENT_OPTIONS = [
  { emoji: '🕺', label: 'Rolês em grupo', hint: 'Shows, trilhas, games e rolês coletivos' },
  { emoji: '🤝', label: 'Amizades 1:1', hint: 'Menos gente, mais profundidade' },
  { emoji: '👥', label: 'Microgrupos', hint: 'Grupos de 4 a 8 pessoas na mesma vibe' },
  { emoji: '🌈', label: 'Depende do dia', hint: 'Uma mistura de tudo, conforme o momento' },
] as const;

const SOCIAL_QUESTIONS: { id: SocialField; question: string; options: string[] }[] = [
  {
    id: 'socialSize',
    question: 'Com quantas pessoas você se solta mais?',
    options: ['1:1', 'Microgrupo (4 a 8)', 'Grupo maior', 'Abertos'],
  },
  {
    id: 'socialPace',
    question: 'Qual é o seu ritmo de rolê ideal?',
    options: ['1x por mês', '2 a 3x por mês', 'Toda semana', 'O que vier'],
  },
  {
    id: 'socialStyle',
    question: 'Seus planos costumam ser…',
    options: ['Planejados', 'Espontâneos', 'Um pouco dos dois'],
  },
];

const EMPTY_DATA: OnboardingData = {
  intent: null,
  interests: [],
  socialSize: null,
  socialPace: null,
  socialStyle: null,
  city: '',
  neighborhood: '',
};

// Acentos são ignorados para "cafe" encontrar "Cafeterias", etc.
function normalizeText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(EMPTY_DATA);
  const [customHobbies, setCustomHobbies] = useState<string[]>([]);
  const [hobbyDraft, setHobbyDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!fontsLoaded) {
    return <View style={styles.screen} />;
  }

  function goBack() {
    if (step === 0) {
      router.back();
      return;
    }
    setStep(step - 1);
  }

  function toggleInterest(label: string) {
    setData((current) => ({
      ...current,
      interests: current.interests.includes(label)
        ? current.interests.filter((item) => item !== label)
        : [...current.interests, label],
    }));
  }

  function addCustomHobby() {
    const value = hobbyDraft.trim();
    if (!value || customHobbies.includes(value) || data.interests.includes(value)) return;

    Haptics.selectionAsync().catch(() => {});
    setCustomHobbies((current) => [...current, value]);
    setData((current) => ({ ...current, interests: [...current.interests, value] }));
    setHobbyDraft('');
  }

  function removeCustomHobby(value: string) {
    setCustomHobbies((current) => current.filter((item) => item !== value));
    setData((current) => ({
      ...current,
      interests: current.interests.filter((item) => item !== value),
    }));
  }

  function matchesSearch(label: string) {
    const query = normalizeText(searchQuery.trim());
    return query === '' || normalizeText(label).includes(query);
  }

  function setSocialAnswer(field: SocialField, value: string) {
    setData((current) => ({
      ...current,
      [field]: current[field] === value ? null : value,
    }));
  }

  function canContinue() {
    if (step === 0) return data.intent !== null;
    if (step === 1) return data.interests.length >= 3;
    if (step === 2) return data.socialSize !== null && data.socialPace !== null && data.socialStyle !== null;
    return data.city.trim() !== '';
  }

  function nextStep() {
    if (!canContinue()) return;
    setStep(step + 1);
  }

  function finish() {
    // TODO(backend): enviar data.intent/interests/social/city para
    // profiles, user_interests e user_preference_rules com sessão real.
    console.log('[onboarding] rascunho (backend pendente):', data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.replace('/descobrir');
  }

  function renderStep() {
    if (step === 0) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <StepScaffold
            kicker="O QUE VOCÊ QUER VIVER"
            title="Que tipo de amizade você gostaria de encontrar?"
            subtitle="Nada é definitivo: você ajusta isso a qualquer momento no Perfil."
          >
            <View style={styles.intentList}>
              {INTENT_OPTIONS.map((option) => {
                const selected = data.intent === option.label;
                return (
                  <Pressable
                    key={option.label}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      setData((current) => ({ ...current, intent: option.label }));
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[
                      styles.intentCard,
                      styles.borderBox,
                      selected && styles.intentCardSelected,
                    ]}
                  >
                    <Text style={styles.intentEmoji}>{option.emoji}</Text>
                    <View style={styles.intentTexts}>
                      <Text style={[styles.intentLabel, selected && styles.intentLabelSelected]}>
                        {option.label}
                      </Text>
                      <Text style={styles.intentHint}>{option.hint}</Text>
                    </View>
                    <View style={[styles.intentRadio, selected && styles.intentRadioSelected]} />
                  </Pressable>
                );
              })}
            </View>
          </StepScaffold>
        </ScrollView>
      );
    }

    if (step === 1) {
      const hasAnyVisible = interestCategories.some(
        (category) =>
          category.items.some((item) => matchesSearch(item.label)) ||
          (category.customizable && customHobbies.some(matchesSearch)),
      );

      return (
        <View style={styles.flexOne}>
          <StepScaffold
            kicker="O QUE TE MOVE"
            title="Qual é a sua vibe?"
            subtitle="Escolha seus interesses para encontrar pessoas que combinam com você."
          />

          <View style={[styles.searchRow, styles.borderBox]}>
            <Ionicons name="search" size={18} color="#756881" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar interesses…"
              placeholderTextColor="#756881"
              autoCapitalize="none"
              style={styles.searchInput}
            />
            {searchQuery !== '' && (
              <Pressable
                onPress={() => setSearchQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
              >
                <Ionicons name="close-circle" size={18} color="#8F829D" />
              </Pressable>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.flexOne}
            contentContainerStyle={styles.scrollContent}
          >
            {hasAnyVisible ? (
              interestCategories.map((category) => {
                const visibleItems = category.items.filter((item) =>
                  matchesSearch(item.label),
                );
                const visibleCustom =
                  category.customizable ? customHobbies.filter(matchesSearch) : [];

                if (visibleItems.length === 0 && visibleCustom.length === 0) {
                  return null;
                }

                return (
                  <View key={category.id} style={styles.category}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                      <Text style={styles.categoryLabel}>{category.label}</Text>
                    </View>

                    <View style={styles.chipWrap}>
                      {visibleItems.map((item) => (
                        <Chip
                          key={item.label}
                          label={item.label}
                          emoji={item.emoji}
                          selected={data.interests.includes(item.label)}
                          onPress={() => toggleInterest(item.label)}
                        />
                      ))}

                      {visibleCustom.map((hobby) => (
                        <Chip
                          key={hobby}
                          label={hobby}
                          selected
                          onPress={() => removeCustomHobby(hobby)}
                        />
                      ))}
                    </View>

                    {category.customizable && (
                      <View style={[styles.customRow, styles.borderBox]}>
                        <Text style={styles.customPlus}>＋</Text>
                        <TextInput
                          value={hobbyDraft}
                          onChangeText={setHobbyDraft}
                          onSubmitEditing={addCustomHobby}
                          returnKeyType="done"
                          placeholder="Adicionar meu hobby"
                          placeholderTextColor="#756881"
                          style={styles.customInput}
                        />
                        {hobbyDraft.trim() !== '' && (
                          <Pressable onPress={addCustomHobby} accessibilityRole="button">
                            <Text style={styles.customAdd}>Adicionar</Text>
                          </Pressable>
                        )}
                      </View>
                    )}

                    {category.sensitive && (
                      <Text style={styles.sensitiveNote}>
                        🔒 Sensível e opcional: nunca entra nas descobertas sem que você escolha
                        como e quando usar depois.
                      </Text>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={[styles.emptySearch, styles.borderBox]}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>
                  Nada encontrado para “{searchQuery.trim()}”
                </Text>
                <Text style={styles.emptyText}>
                  Tente outra palavra ou adicione como “meu hobby” na categoria Hobbies.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    if (step === 2) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <StepScaffold
            kicker="SUA MANEIRA DE SOCIALIZAR"
            title="Como é o seu jeito de sair?"
            subtitle="Sem diagnóstico e sem rótulo: só um perfil social para sugerir bons contextos."
          >
            {SOCIAL_QUESTIONS.map((question) => (
              <View key={question.id} style={styles.socialQuestion}>
                <Text style={styles.socialQuestionText}>{question.question}</Text>
                <View style={styles.chipWrap}>
                  {question.options.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      selected={data[question.id] === option}
                      onPress={() => setSocialAnswer(question.id, option)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </StepScaffold>
        </ScrollView>
      );
    }

    if (step === 3) {
      return (
        <View style={styles.flexOne}>
          <StepScaffold
            kicker="ONDE ESTÁ SUA REDE"
            title="Qual é a sua cidade?"
            subtitle="É por aqui que a mágica acontece. Bairro ajuda a achar rolês perto de casa."
          >
            <View style={styles.formArea}>
              <View>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                  value={data.city}
                  onChangeText={(city) => setData((current) => ({ ...current, city }))}
                  placeholder="Sua cidade"
                  placeholderTextColor="#756881"
                  autoCapitalize="words"
                  style={[styles.input, styles.borderBox]}
                />
              </View>

              <View>
                <Text style={styles.label}>Bairro (opcional)</Text>
                <TextInput
                  value={data.neighborhood}
                  onChangeText={(neighborhood) =>
                    setData((current) => ({ ...current, neighborhood }))
                  }
                  placeholder="Seu bairro"
                  placeholderTextColor="#756881"
                  autoCapitalize="words"
                  style={[styles.input, styles.borderBox]}
                />
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoEmoji}>📍</Text>
                <Text style={styles.infoText}>
                  Cidade e bairro são manuais por enquanto. GPS, mapa e modo viagem entram na
                  Fase 2 do produto — sem expor seu endereço.
                </Text>
              </View>
            </View>
          </StepScaffold>
        </View>
      );
    }

    return (
      <View style={styles.readyArea}>
        <StepScaffold
          kicker="TUDO PRONTO"
          title="Sua rede de amizades começa agora ✨"
          subtitle="Ninguém aqui veio por romance — apenas amizades que se repetem no mundo real."
          style={styles.readyText}
        />
        <GlowButton label="Começar agora" onPress={finish} />
      </View>
    );
  }

  const isReadyStep = step === 4;

  return (
    <View style={styles.screen}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <Constellation style={styles.constellation} />

      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.page,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + spacing.md },
          ]}
        >
          {!isReadyStep && (
            <>
              <View style={styles.header}>
                <Pressable
                  onPress={goBack}
                  style={styles.backButton}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar"
                >
                  <Text style={styles.backIcon}>‹</Text>
                </Pressable>
                <Text style={styles.stepText}>Etapa {step + 1} de 4</Text>
                <View style={styles.headerSpacer} />
              </View>

              <View style={styles.progress}>
                {[0, 1, 2, 3].map((index) => (
                  <View
                    key={index}
                    style={[styles.progressBar, index <= step && styles.progressBarActive]}
                  />
                ))}
              </View>
            </>
          )}

          <Animated.View
            key={step}
            entering={FadeInDown.duration(380)}
            exiting={FadeOutUp.duration(190)}
            style={styles.stepArea}
          >
            {renderStep()}
          </Animated.View>

          {!isReadyStep && (
            <View style={styles.footer}>
              {step === 1 && (
                <Text
                  style={[
                    styles.counter,
                    data.interests.length >= 3 && styles.counterOk,
                  ]}
                >
                  {data.interests.length >= 3
                    ? `${data.interests.length} interesses escolhidos ✓`
                    : `${data.interests.length} escolhidos — continue, escolha pelo menos 3`}
                </Text>
              )}
              <GlowButton label="Continuar" onPress={nextStep} disabled={!canContinue()} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0617',
    overflow: 'hidden',
  },

  flexOne: {
    flex: 1,
  },

  constellation: {
    opacity: 0.5,
  },

  glowOne: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(149, 106, 250, 0.13)',
    top: -180,
    right: -100,
  },

  glowTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(222, 89, 255, 0.07)',
    bottom: -120,
    left: -100,
  },

  page: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  backIcon: {
    color: colors.textPrimary,
    fontSize: 40,
    lineHeight: 42,
    fontFamily: 'Poppins_400Regular',
  },

  stepText: {
    color: '#8F829D',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },

  headerSpacer: {
    width: 44,
  },

  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },

  progressBar: {
    width: 26,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#291A37',
  },

  progressBarActive: {
    backgroundColor: colors.primary,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radii.md,
    borderColor: '#3B284A',
    backgroundColor: 'rgba(32, 19, 46, 0.85)',
    paddingHorizontal: 14,
    marginTop: spacing.lg,
  },

  searchInput: {
    flex: 1,
    height: 46,
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },

  emptySearch: {
    marginTop: spacing.xl,
    borderRadius: radii.lg,
    borderColor: '#3B284A',
    backgroundColor: '#1A1025',
    alignItems: 'center',
    padding: spacing.lg,
    gap: 6,
  },

  emptyEmoji: {
    fontSize: 28,
  },

  emptyTitle: {
    color: '#E9E2F2',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    textAlign: 'center',
  },

  emptyText: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  stepArea: {
    flex: 1,
    paddingTop: spacing.md,
  },

  scrollContent: {
    paddingBottom: spacing.xl,
  },

  footer: {
    gap: 10,
    paddingTop: spacing.sm,
  },

  counter: {
    color: '#8F829D',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    textAlign: 'center',
  },

  counterOk: {
    color: colors.success,
  },

  intentList: {
    gap: 12,
    marginTop: spacing.lg,
  },

  borderBox: {
    borderWidth: 1,
  },

  intentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: radii.lg,
    borderColor: '#3B284A',
    backgroundColor: '#1A1025',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  intentCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(149, 106, 250, 0.10)',
    boxShadow: '0 0 20px rgba(149, 106, 250, 0.22)',
  },

  intentEmoji: {
    fontSize: 22,
  },

  intentTexts: {
    flex: 1,
    gap: 2,
  },

  intentLabel: {
    color: '#E9E2F2',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
  },

  intentLabelSelected: {
    color: '#FFFFFF',
  },

  intentHint: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },

  intentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3B284A',
  },

  intentRadioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  category: {
    marginTop: spacing.lg,
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  categoryEmoji: {
    fontSize: 16,
  },

  categoryLabel: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.4,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    borderRadius: radii.md,
    borderColor: '#392649',
    backgroundColor: 'rgba(32, 19, 46, 0.65)',
    paddingHorizontal: 12,
  },

  customPlus: {
    color: colors.primaryLight,
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
  },

  customInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    paddingVertical: 12,
  },

  customAdd: {
    color: colors.primaryLight,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    paddingVertical: 10,
  },

  sensitiveNote: {
    color: '#8F829D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },

  socialQuestion: {
    marginTop: spacing.lg,
  },

  socialQuestionText: {
    color: '#E9E2F2',
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    marginBottom: 10,
  },

  formArea: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  label: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    marginBottom: 8,
  },

  input: {
    height: 58,
    borderRadius: radii.lg,
    borderColor: '#392649',
    backgroundColor: 'rgba(32, 19, 46, 0.85)',
    paddingHorizontal: 18,
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(149, 106, 250, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.20)',
    padding: 16,
  },

  infoEmoji: {
    fontSize: 18,
  },

  infoText: {
    flex: 1,
    color: '#BCAFCA',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 19,
  },

  readyArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },

  readyText: {
    marginTop: spacing.xxl,
  },
});
