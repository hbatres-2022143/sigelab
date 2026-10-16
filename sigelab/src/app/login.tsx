import { COLORS } from '@/constants/colors';
import {
  Eye,
  EyeOff,
  FlaskConical,
  LockKeyhole,
  ScanFace,
  UserRound,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
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
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <UserRound
              size={24}
              color={COLORS.navy}
            />
            <Text style={styles.label}>Usuario</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder='Ingresa usuario'
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
            autoCorrect={false}
            accessibilityLabel='Usuario'
          />
        </View>
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <LockKeyhole
              size={24}
              color={COLORS.navy}
            />
            <Text style={styles.label}>Contraseña</Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder='Ingresa contraseña'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              accessibilityLabel='Contraseña'
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
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
        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </Pressable>
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>o</Text>
          <View style={styles.separatorLine} />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.faceButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => alert('Aquí conectaremos el reconocimiento facial.')}
        >
          <ScanFace
            size={23}
            color={COLORS.primary}
          />
          <Text style={styles.faceButtonText}>Usar reconocimiento facial</Text>
        </Pressable>
      </View>
      <Text style={styles.version}>
        <Text style={styles.company}>SIGELAB</Text>
        <Text style={styles.versionV}> v1.0</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 40,
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
    marginBottom: 30,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 8,
  },
  label: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    marginLeft: 30,
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 13,
    backgroundColor: COLORS.backgroundInput,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  passwordContainer: {
    height: 48,
    marginLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 13,
    backgroundColor: COLORS.backgroundInput,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
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
    shadowOffset: { width: 0, height: 4 },
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
