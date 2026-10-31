import { COLORS } from '@/constants/colors';
import { authenticateBiometricUser } from '@/data/biometric';
import { setCurrentUser } from '@/data/session';
import { router } from 'expo-router';
import { ScanFace, ShieldAlert, ShieldCheck, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Face_Authentication() {
  // Indica si se está realizando la verificación biométrica
  const [analyzing, setAnalyzing] = useState(false);

  // Almacena el resultado de la autenticación:
  // true: identidad verificada
  // false: verificación fallida
  // null: estado inicial
  const [recognized, setRecognized] = useState<boolean | null>(null);

  async function startRecognition() {
    // Evita iniciar otra verificación mientras existe una en proceso
    if (analyzing) return;

    try {
      setAnalyzing(true);
      setRecognized(null);

      // Ejecuta la autenticación biométrica del usuario
      const result = await authenticateBiometricUser();

      if (!result.success) {
        setRecognized(false);

        // Mensajes correspondientes a cada posible error
        const messages: Record<
          | 'NOT_REGISTERED'
          | 'USER_NOT_FOUND'
          | 'USER_INACTIVE'
          | 'FACE_NOT_SUPPORTED'
          | 'BIOMETRIC_NOT_ENROLLED'
          | 'AUTHENTICATION_FAILED'
          | 'ERROR',
          string
        > = {
          NOT_REGISTERED:
            'No existe una cuenta registrada para el acceso biométrico. Inicia sesión con tu contraseña y registra tu biometría.',
          USER_NOT_FOUND: 'La cuenta vinculada no existe en SIGELAB.',
          USER_INACTIVE:
            'Tu cuenta está desactivada. Contacta al administrador.',
          FACE_NOT_SUPPORTED:
            'Este dispositivo no admite reconocimiento facial.',
          BIOMETRIC_NOT_ENROLLED:
            'No tienes una biometría configurada en Android.',
          AUTHENTICATION_FAILED:
            'No se pudo verificar tu identidad. Inténtalo nuevamente.',
          ERROR: 'Ocurrió un problema al verificar tu identidad.',
        };
        // Muestra el motivo por el cual se rechazó el acceso.
        Alert.alert('Acceso denegado', messages[result.reason]);
        return;
      }

      // Guarda el usuario autenticado en la sesión.
      setCurrentUser(result.user);
      setRecognized(true);

      // Da la bienvenida y permite continuar al dashboard.
      Alert.alert(
        'Acceso autorizado',
        `¡Bienvenido, ${result.user.fullName}!`,
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/tabs/dashboard'),
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      // Captura errores inesperados durante la autenticación
      console.error('Error de autenticación:', error);

      setRecognized(false);

      Alert.alert('Error', 'Ocurrió un problema al verificar tu identidad.');
    } finally {
      // Finaliza el estado de carga independientemente del resultado
      setAnalyzing(false);
    }
  }

  function retryRecognition() {
    setRecognized(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel='Cerrar'
        >
          <X
            size={27}
            color={COLORS.textWhite}
          />
        </Pressable>
      </View>
      <Text style={styles.title}>Reconocimiento facial</Text>
      <Text style={styles.description}>
        Verifica tu identidad mediante la biometría
        {'\n'}
        configurada en tu dispositivo.
      </Text>

      {/* AUTENTICACIÓN */}
      <View style={styles.cameraSection}>
        <View style={styles.frame}>
          {/* MARCO DE RECONOCIMIENTO */}
          <View style={styles.frameOverlay}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* ESTADOS*/}
          {analyzing ? (
            // Estado: verificando identidad.
            <View style={styles.centerContent}>
              <ActivityIndicator
                size='large'
                color={COLORS.textWhite}
              />

              <Text style={styles.statusText}>Verificando identidad...</Text>
            </View>
          ) : recognized === true ? (
            // Estado: identidad verificada correctamente.
            <View style={styles.centerContent}>
              <ShieldCheck
                size={105}
                color='#34D399'
                strokeWidth={1.5}
              />

              <Text style={styles.successText}>Identidad verificada</Text>
            </View>
          ) : recognized === false ? (
            // Estado: autenticación fallida.
            <View style={styles.centerContent}>
              <ShieldAlert
                size={105}
                color='#F87171'
                strokeWidth={1.5}
              />

              <Text style={styles.errorText}>Verificación fallida</Text>
            </View>
          ) : (
            // Estado inicial: preparado para verificar.
            <View style={styles.centerContent}>
              <ScanFace
                size={125}
                color={COLORS.textWhite}
                strokeWidth={1.3}
              />

              <Text style={styles.statusText}>Preparado para verificar</Text>
            </View>
          )}
        </View>
      </View>

      {/* INFORMACIÓN*/}
      <Text style={styles.information}>
        Coloca tu rostro frente al dispositivo y sigue las instrucciones de
        autenticación.
      </Text>

      {/* BOTONES */}
      <View style={styles.footer}>
        {recognized === false ? (
          // Permite reiniciar la verificación después de un error.
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={retryRecognition}
          >
            <Text style={styles.primaryButtonText}>Intentar nuevamente</Text>
          </Pressable>
        ) : (
          // Inicia el proceso de autenticación biométrica.
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              analyzing && styles.disabledButton,
            ]}
            onPress={startRecognition}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.primaryButtonText}>Verificar identidad</Text>
            )}
          </Pressable>
        )}

        {/* CANCELAR Y REGRESAR A LA PANTALLA ANTERIOR */}
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 30,
  },

  // BARRA SUPERIOR
  topBar: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // TÍTULO Y DESCRIPCIÓN
  title: {
    marginTop: 34,
    textAlign: 'center',
    color: COLORS.textWhite,
    fontSize: 26,
    fontWeight: '500',
  },

  description: {
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.textWhiteSecondary,
    fontSize: 16,
    lineHeight: 23,
  },

  // ÁREA DE RECONOCIMIENTO
  cameraSection: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },

  // MARCO PRINCIPAL
  frame: {
    width: '90%',
    maxWidth: 270,
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.navy,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.65,
    shadowRadius: 18,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SUPERPOSICIÓN DEL MARCO
  frameOverlay: {
    ...StyleSheet.absoluteFill,
  },

  // CONTENIDO CENTRAL
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 15,
  },

  // MENSAJES DE ESTADO
  statusText: {
    color: COLORS.textWhite,
    fontSize: 14,
    textAlign: 'center',
  },

  successText: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
  },

  errorText: {
    color: '#F87171',
    fontSize: 14,
    fontWeight: '700',
  },

  // ESQUINAS DEL MARCO
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
    borderWidth: 5,
    borderRadius: 1,
  },

  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 22,
  },

  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 22,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 22,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 22,
  },

  // INFORMACIÓN ADICIONAL
  information: {
    color: COLORS.textWhiteSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 25,
  },
  footer: {
    gap: 12,
  },

  // BOTÓN PRINCIPAL
  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderbutton,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  primaryButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },

  // BOTÓN DE CANCELACIÓN
  cancelButton: {
    width: '100%',
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },

  cancelText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '600',
  },

  // ESTADOS DE INTERACCIÓN
  disabledButton: {
    opacity: 0.65,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
