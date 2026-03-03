import { AuthScreen, IAuthScreenProps } from '@/screens';
import { useLocalSearchParams } from 'expo-router';

export default function Auth() {
  const { authType } = useLocalSearchParams<IAuthScreenProps>();
  return <AuthScreen authType={authType} />;
}
