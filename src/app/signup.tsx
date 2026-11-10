import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
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

type AuthMethod = 'google' | 'apple' | 'email' | null;

export default function SignupScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!fontsLoaded) {
    return <View style={styles.screen} />;
  }

  function chooseSocialMethod(method: 'google' | 'apple') {
    setAuthMethod(method);
    setStep(2);
  }

  function chooseEmailMethod() {
    setAuthMethod('email');
  }

  function continueWithEmail() {
    if (!email || !password) return;

    setStep(2);
  }

  function nextStep() {
    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      router.push('/onboarding');
    }
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
              <Text style={styles.kicker}>BEM-VINDO AO CONECTAÍ</Text>

              <Text style={styles.title}>
                Como quer criar{'\n'}sua conta?
              </Text>

              <Text style={styles.subtitle}>
                Escolha a forma mais simples para começar.
                Depois você completa seu perfil com calma.
              </Text>
            </View>

            <View style={styles.authArea}>
              <Pressable
                style={styles.socialButton}
                onPress={() => chooseSocialMethod('apple')}
              >
                <View style={styles.iconBox}>
                  <FontAwesome
                    name="apple"
                    size={23}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.socialButtonText}>
                  Continuar com Apple
                </Text>
              </Pressable>

              <Pressable
                style={styles.socialButton}
                onPress={() => chooseSocialMethod('google')}
              >
                <View style={styles.iconBox}>
                  <FontAwesome
                    name="google"
                    size={20}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.socialButtonText}>
                  Continuar com Google
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.socialButton,
                  authMethod === 'email' && styles.socialButtonSelected,
                ]}
                onPress={chooseEmailMethod}
              >
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.socialButtonText}>
                  Continuar com e-mail
                </Text>
              </Pressable>

              {authMethod === 'email' && (
                <View style={styles.emailArea}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Seu e-mail"
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

                  <Pressable
                    onPress={continueWithEmail}
                    style={({ pressed }) => [
                      styles.continueButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.continueText}>
                      Continuar
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.content}>
            <View>
              <Text style={styles.kicker}>AGORA VAMOS TE CONHECER</Text>

              <Text style={styles.title}>
                Como podemos{'\n'}te chamar?
              </Text>

              <Text style={styles.subtitle}>
                Esse será o nome mostrado para suas futuras conexões.
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

        {step === 3 && (
          <View style={styles.content}>
            <View>
              <Text style={styles.kicker}>QUASE LÁ</Text>

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
                  Sua idade também ajuda a encontrar pessoas em fases
                  de vida compatíveis com a sua.
                </Text>
              </View>
            </View>
          </View>
        )}

        {step > 1 && (
          <View style={styles.bottom}>
            <Pressable
              onPress={nextStep}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.continueText}>
                {step === 3 ? 'Continuar para meus interesses' : 'Continuar'}
              </Text>
            </Pressable>
          </View>
        )}

        {step === 1 && (
          <View style={styles.loginRow}>
            <Text style={styles.loginQuestion}>
              Já tem uma conta?{' '}
            </Text>

            <Pressable onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>
                Entrar
              </Text>
            </Pressable>
          </View>
        )}
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

  authArea: {
    gap: 13,
    marginTop: 42,
  },

  formArea: {
    gap: 13,
    marginTop: 46,
  },

  socialButton: {
    height: 60,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#3B284A',
    backgroundColor: '#1A1025',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  socialButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(149, 106, 250, 0.10)',
  },

  iconBox: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  socialButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    textAlign: 'center',
    marginRight: 44,
  },

  emailArea: {
    gap: 12,
    marginTop: 8,
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
    marginTop: 34,
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
});
