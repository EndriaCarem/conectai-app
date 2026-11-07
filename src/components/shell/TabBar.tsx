// Tab bar custom — ref 3/6/14: Descobrir | Mapa | Eventos | Chat | Perfil,
// com o centro (Eventos/BORA?) levemente destacado (backlog §8: ação central).

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';

import { colors } from '../../theme';

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  descobrir: 'search',
  mapa: 'map',
  eventos: 'calendar',
  chat: 'chatbubble-ellipses',
  perfil: 'person',
};

const CENTER_TAB = 'eventos';

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  function handlePress(routeName: string, isFocused: boolean) {
    if (isFocused) return;
    Haptics.selectionAsync().catch(() => {});
    navigation.navigate(routeName);
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCenter = route.name === CENTER_TAB;
        const icon = TAB_ICONS[route.name] ?? 'ellipse';

        const content = isCenter ? (
          <View style={styles.centerWrap}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.centerCircle, isFocused && styles.centerCircleFocused]}
            >
              <Ionicons name={icon} size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
            </Text>
          </View>
        ) : (
          <>
            <Ionicons
              name={icon}
              size={22}
              color={isFocused ? colors.primary : '#7C6E91'}
            />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
            </Text>
          </>
        );

        return (
          <Pressable
            key={route.key}
            onPress={() => handlePress(route.name, isFocused)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            style={[styles.tab, isCenter && styles.centerTab]}
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 9, 28, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(149, 106, 250, 0.18)',
    paddingTop: 10,
    paddingHorizontal: 6,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },

  centerTab: {
    justifyContent: 'flex-start',
  },

  centerWrap: {
    alignItems: 'center',
    gap: 4,
    marginTop: -26,
  },

  centerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 22px rgba(149, 106, 250, 0.5)',
  },

  centerCircleFocused: {
    boxShadow: '0 10px 28px rgba(149, 106, 250, 0.75)',
  },

  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    color: '#7C6E91',
  },

  labelFocused: {
    color: colors.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
});
