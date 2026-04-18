import { AuthScreen, IAuthScreenProps } from '@/screens';
import { useLocalSearchParams } from 'expo-router';

export default function Auth() {
  const { authType } = useLocalSearchParams<IAuthScreenProps>();
  const normalizedAuthType = authType ?? 'login';
  return <AuthScreen authType={normalizedAuthType} />;
}
