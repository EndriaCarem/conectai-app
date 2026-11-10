import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { IntroLoader } from '../components/IntroLoader';

export default function LoadingScreen() {
  const router = useRouter();

  const handleFinished = useCallback(() => {
    router.replace('/home');
  }, [router]);

  return <IntroLoader onFinished={handleFinished} />;
}
