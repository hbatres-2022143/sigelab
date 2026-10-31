import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { getCurrentUser } from '@/data/session';
import { USERS, type AppUser } from '@/data/users';

const BIOMETRIC_USER_KEY = 'sigelab_biometric_user_id';

export async function registerBiometricUser() {
  try {
    const user = getCurrentUser();

    if (!user || !user.active) {
      return {
        success: false,
        message: 'No hay una sesión activa para registrar la biometría.',
      };
    }

    const hardwareAvailable = await LocalAuthentication.hasHardwareAsync();

    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    const enrolled = await LocalAuthentication.isEnrolledAsync();

    const hasFaceSupport = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    );

    const hasFingerprintSupport = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    );

    console.log('DIAGNÓSTICO BIOMÉTRICO SIGELAB:', {
      hardwareAvailable,
      supportedTypes,
      hasFaceSupport,
      hasFingerprintSupport,
      enrolled,
    });

    if (!hardwareAvailable) {
      return {
        success: false,
        message: 'El dispositivo no tiene hardware biométrico compatible.',
      };
    }

    if (!hasFaceSupport) {
      return {
        success: false,
        message:
          'Android no detecta el reconocimiento facial como biometría compatible.',
      };
    }

    if (!enrolled) {
      return {
        success: false,
        message: 'Android no detecta ninguna biometría compatible registrada.',
      };
    }
    await SecureStore.setItemAsync(BIOMETRIC_USER_KEY, user.id);

    return {
      success: true,
      message:
        'Tu cuenta se vinculó correctamente con la autenticación biométrica.',
    };
  } catch (error) {
    console.error('Error al registrar biometría:', error);

    return {
      success: false,
      message: 'Ocurrió un error al registrar la biometría.',
    };
  }
}

export async function authenticateBiometricUser(): Promise<
  | { success: true; user: AppUser }
  | {
      success: false;
      reason:
        | 'NOT_REGISTERED'
        | 'USER_NOT_FOUND'
        | 'USER_INACTIVE'
        | 'FACE_NOT_SUPPORTED'
        | 'BIOMETRIC_NOT_ENROLLED'
        | 'AUTHENTICATION_FAILED'
        | 'ERROR';
    }
> {
  try {
    const registeredUserId = await SecureStore.getItemAsync(BIOMETRIC_USER_KEY);

    if (!registeredUserId) {
      return { success: false, reason: 'NOT_REGISTERED' };
    }

    const user = USERS.find((item) => item.id === registeredUserId);

    if (!user) {
      return { success: false, reason: 'USER_NOT_FOUND' };
    }

    if (!user.active) {
      return { success: false, reason: 'USER_INACTIVE' };
    }

    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    const hasFaceSupport = supportedTypes.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    );

    if (!hasFaceSupport) {
      return { success: false, reason: 'FACE_NOT_SUPPORTED' };
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!enrolled) {
      return { success: false, reason: 'BIOMETRIC_NOT_ENROLLED' };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Acceso biométrico - SIGELAB',
      cancelLabel: 'Cancelar',
      biometricsSecurityLevel: 'weak',
    });

    if (!result.success) {
      return { success: false, reason: 'AUTHENTICATION_FAILED' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error en autenticación biométrica:', error);

    return { success: false, reason: 'ERROR' };
  }
}

export async function removeBiometricUser() {
  await SecureStore.deleteItemAsync(BIOMETRIC_USER_KEY);
}
