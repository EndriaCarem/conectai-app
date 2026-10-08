import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectaí</Text>

      <Text style={styles.subtitle}>
        Pessoas reais. Amizades de verdade.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12081F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '700',
  },

  subtitle: {
    color: '#C9B8DA',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});
