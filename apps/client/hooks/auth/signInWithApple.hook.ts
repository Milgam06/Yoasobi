import { supabaseAuth } from '@/libs';
import * as AppleAuthentication from 'expo-apple-authentication';

export const signInWithApple = async () => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const identityToken = credential.identityToken;

  if (!identityToken) {
    throw new Error('failed to get identity token');
  }

  const { data, error } = await supabaseAuth.signInWithIdToken({
    provider: 'apple',
    token: identityToken,
  });

  if (error) {
    console.error(error);
    throw new Error('failed to sign in with apple');
  }

  console.log({ data });
};
