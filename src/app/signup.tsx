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

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';

import { colors, radii, spacing } from '../theme';

export default function SignupScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!fontsLoaded) {
    return <View style={styles.screen} />;
  }

  function nextStep() {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    router.push('/onboarding');
  }

  function previousStep() {
    if (step === 1) {
      router.back();
      return;
    }

    setStep(step - 1);
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <Pressable onPress={previousStep} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.stepText}>{step} de 3</Text>
        </View>

        <View style={styles.progress}>
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              style={[
                styles.progressBar,
                item <= step && styles.progressBarActive,
              ]}
            />
          ))}
        </View>

        {step === 1 && (
          <View style={styles.content}>
            <View>
              <Text style={styles.kicker}>VAMOS COMEÇAR PELO BÁSICO</Text>

              <Text style={styles.title}>
                Como podemos{'\n'}te chamar?
              </Text>

              <Text style={styles.subtitle}>
                Seu perfil começa com o básico. O resto a gente descobre juntos.
              </Text>
            </View>

            <View style={styles.formArea}>
              <Text style={styles.label}>Seu nome</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                placeholderTextColor="#756881"
                style={styles.input}
                autoCapitalize="words"
                autoFocus
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.content}>
            <View>
              <Text style={styles.kicker}>SÓ MAIS UM POUQUINHO</Text>

              <Text style={styles.title}>
                Quando você{'\n'}nasceu?
              </Text>

              <Text style={styles.subtitle}>
                O Conectaí é uma comunidade para maiores de 18 anos.
              </Text>
            </View>

            <View style={styles.formArea}>
              <Text style={styles.label}>Data de nascimento</Text>

              <TextInput
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="DD / MM / AAAA"
                placeholderTextColor="#756881"
                style={styles.input}
                keyboardType="numbers-and-punctuation"
                autoFocus
              />

              <View style={styles.infoCard}>
                <Text style={styles.infoEmoji}>💜</Text>
                <Text style={styles.infoText}>
                  Sua idade ajuda a encontrar pessoas em fases de vida compatíveis.
                </Text>
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.content}>
            <View>
              <Text style={styles.kicker}>ÚLTIMO PASSO</Text>

              <Text style={styles.title}>
                Como quer entrar{'\n'}no Conectaí?
              </Text>

              <Text style={styles.subtitle}>
                Escolha a forma mais simples para criar sua conta.
              </Text>
            </View>

            <View style={styles.formArea}>
              <Pressable style={styles.socialButton}>
                <Text style={styles.socialButtonText}>
                  Continuar com Apple
                </Text>
              </Pressable>

              <Pressable style={styles.socialButton}>
                <Text style={styles.socialButtonText}>
                  Continuar com Google
                </Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou use seu e-mail</Text>
                <View style={styles.dividerLine} />
              </View>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="E-mail"
                placeholderTextColor="#756881"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Crie uma senha"
                placeholderTextColor="#756881"
                style={styles.input}
                secureTextEntry
              />
            </View>
          </View>
        )}

        <View style={styles.bottom}>
          <Pressable
            onPress={nextStep}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.continueText}>
              {step === 3 ? 'Criar minha conta' : 'Continuar'}
            </Text>
          </Pressable>

          {step === 1 && (
            <View style={styles.loginRow}>
              <Text style={styles.loginQuestion}>Já tem uma conta? </Text>

              <Pressable onPress={() => router.replace('/login')}>
                <Text style={styles.loginLink}>Entrar</Text>
              </Pressable>
            </View>
          )}

          {step === 3 && (
            <Text style={styles.terms}>
              Ao continuar, você concorda com os Termos de Uso e a Política de
              Privacidade do Conectaí.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0617',
    overflow: 'hidden',
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
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'web' ? 32 : 54,
    paddingBottom: 32,
  },

  top: {
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

  progress: {
    flexDirection: 'row',
    gap: 7,
    marginTop: spacing.md,
  },

  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#291A37',
  },

  progressBarActive: {
    backgroundColor: colors.primary,
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 470,
    paddingTop: 58,
  },

  kicker: {
    color: colors.primaryLight,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  title: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: -1.4,
  },

  subtitle: {
    color: '#A89CB3',
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 410,
  },

  formArea: {
    gap: 13,
    marginTop: 46,
  },

  label: {
    color: '#DCD4E4',
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },

  input: {
    height: 60,
    borderWidth: 1,
    borderColor: '#392649',
    borderRadius: radii.lg,
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
    backgroundColor: 'rgba(149, 106, 250, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(149, 106, 250, 0.20)',
    borderRadius: radii.lg,
    padding: 16,
    marginTop: 4,
  },

  infoEmoji: {
    fontSize: 20,
  },

  infoText: {
    flex: 1,
    color: '#BCAFCA',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 19,
  },

  socialButton: {
    height: 58,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#3B284A',
    backgroundColor: '#1A1025',
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2D2038',
  },

  dividerText: {
    color: '#746A7D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },

  bottom: {
    marginTop: 46,
  },

  continueButton: {
    height: 60,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  continueText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  loginQuestion: {
    color: '#94889F',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },

  loginLink: {
    color: colors.primaryLight,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
  },

  terms: {
    color: '#716679',
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
  },
});
