import { COLORS } from '@/constants/colors';
import { setCurrentUser } from '@/data/session';
import { USERS } from '@/data/users';
import { router } from 'expo-router';
import {
  AlertCircle,
  Eye,
  EyeOff,
  FlaskConical,
  LockKeyhole,
  ScanFace,
  UserRound,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    const cleanUsername = username.trim().toLowerCase();

    setErrorMessage('');

    if (!cleanUsername || !password) {
      setErrorMessage('Ingresa tu usuario y contraseña.');
      return;
    }

    const user = USERS.find(
      (item) =>
        item.username.toLowerCase() === cleanUsername &&
        item.password === password,
    );

    if (!user) {
      setErrorMessage('Usuario o contraseña incorrectos.');
      return;
    }

    if (!user.active) {
      setErrorMessage('Tu cuenta está inactiva. Contacta al administrador.');
      return;
    }

    setCurrentUser(user);
    router.replace('/tabs/dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.header}>
            <FlaskConical
              size={64}
              color={COLORS.primaryDark}
              strokeWidth={2.2}
            />

            <Text style={styles.logoText}>
              <Text style={styles.logoSIGE}>SIGE</Text>
              <Text style={styles.logoLAB}>LAB</Text>
            </Text>

            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* User */}
            <View style={styles.field}>
              <Text style={styles.label}>Usuario</Text>

              <View style={styles.inputContainer}>
                <UserRound
                  size={20}
                  color={COLORS.navy}
                />

                <TextInput
                  style={styles.input}
                  placeholder='Ingresa usuario'
                  value={username}
                  onChangeText={(value) => {
                    setUsername(value);
                    setErrorMessage('');
                  }}
                  autoCapitalize='none'
                  autoCorrect={false}
                  accessibilityLabel='Usuario'
                  returnKeyType='next'
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>

              <View style={styles.passwordContainer}>
                <LockKeyhole
                  size={20}
                  color={COLORS.navy}
                />

                <TextInput
                  style={styles.passwordInput}
                  placeholder='Ingresa contraseña'
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setErrorMessage('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  autoCorrect={false}
                  accessibilityLabel='Contraseña'
                  returnKeyType='done'
                  onSubmitEditing={handleLogin}
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={10}
                  accessibilityRole='button'
                  accessibilityLabel={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={21}
                      color={COLORS.navy}
                    />
                  ) : (
                    <Eye
                      size={21}
                      color={COLORS.navy}
                    />
                  )}
                </Pressable>
              </View>
            </View>
            {errorMessage !== '' && (
              <View style={styles.errorContainer}>
                <AlertCircle
                  size={18}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </Pressable>

            {/* Line */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>o</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Face ID */}
            <Pressable
              style={({ pressed }) => [
                styles.faceButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/face_authentication')}
            >
              <ScanFace
                size={23}
                color={COLORS.primary}
              />

              <Text style={styles.faceButtonText}>
                Usar reconocimiento facial
              </Text>
            </Pressable>
          </View>

          {/* Version */}
          <Text style={styles.version}>
            <Text style={styles.company}>SIGELAB</Text>
            <Text style={styles.versionV}> v1.0</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 80,
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
  },

  header: {
    alignItems: 'center',
  },

  logoText: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: '700',
  },

  logoSIGE: {
    color: COLORS.primaryDark,
  },

  logoLAB: {
    color: COLORS.navyLight,
  },

  subtitle: {
    marginTop: 26,
    fontSize: 15,
    color: COLORS.navy,
    fontWeight: '500',
  },

  form: {
    width: '100%',
  },

  field: {
    marginBottom: 25,
  },

  label: {
    marginBottom: 9,
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '500',
  },

  inputContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 13,
    borderWidth: 1.5,
    borderRadius: 13,
    backgroundColor: COLORS.backgroundInput,
    borderColor: COLORS.border,
  },

  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },

  passwordContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 13,
    borderWidth: 1.5,
    borderRadius: 13,
    backgroundColor: COLORS.backgroundInput,
    borderColor: COLORS.border,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 12,
    marginTop: -10,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  errorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },

  loginButton: {
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  loginButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },

  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 25,
  },

  separatorLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.borderDark,
  },

  separatorText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },

  faceButton: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#B7D0FF',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  faceButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.primary,
  },

  version: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 11,
  },

  company: {
    color: COLORS.navy,
  },

  versionV: {
    color: COLORS.textTertiary,
  },
});
