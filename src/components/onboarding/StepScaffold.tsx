// Cabeçalho padrão das etapas do onboarding (kicker + título + subtítulo).

import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../../theme';

type StepScaffoldProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function StepScaffold({ kicker, title, subtitle, children, style }: StepScaffoldProps) {
  return (
    <View style={style}>
      <Text style={styles.kicker}>{kicker}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -1.2,
  },

  subtitle: {
    color: '#A89CB3',
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
});
