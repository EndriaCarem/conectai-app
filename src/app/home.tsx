// Mantém links antigos funcionando: a Home temporária virou a tela Descobrir.
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  return <Redirect href="/descobrir" />;
}
