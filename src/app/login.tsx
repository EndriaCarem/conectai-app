import { useRouter } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { colors, radii, spacing } from '../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const useDesktopImage = width >= 1200 || (width >= 768 && isLandscape);

  return (
    <ImageBackground
      source={
        useDesktopImage
          ? require('../../assets/images/telalogindesktop.png')
          : require('../../assets/images/telalogin.png')
      }
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.spacer} />

        <View style={styles.actions}>
          <Pressable
            style={styles.createButton}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.createButtonText}>Criar conta</Text>
          </Pressable>

          <Pressable
            style={styles.loginButton}
            onPress={() => router.push('/loading')}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </Pressable>

          <Text style={styles.footer}>
            Sem romance. Apenas amizades. 💜
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },

  spacer: {
    flex: 1,
  },

  actions: {
    gap: 12,
  },

  createButton: {
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  loginButton: {
    height: 56,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    backgroundColor: 'rgba(18, 8, 31, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
