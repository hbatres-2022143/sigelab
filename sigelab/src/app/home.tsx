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

  const handleLogin = () => {
    if (!username.trim() || !password) {
      alert('Ingresa tu usuario y contraseña.');
      return;
    }

    // Aquí conectaremos la autenticación con tu API.
    console.log('Usuario:', username);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FlaskConical
          size={44}
          color={COLORS.primary}
          strokeWidth={2.2}
        />

        <Text style={styles.logoText}>SIGELAB</Text>

        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <UserRound
              size={23}
              color={COLORS.navy}
            />
            <Text style={styles.label}>Usuario</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder='Ingresa tu usuario'
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
              size={23}
              color={COLORS.navy}
            />
            <Text style={styles.label}>Contraseña</Text>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder='Ingresa tu contraseña'
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
          onPress={handleLogin}
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

      <Text style={styles.version}>SIGELAB v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.91)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 75,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  logoText: {
    marginTop: 5,
    fontFamily: 'RobotoBold',
    fontSize: 30,
    color: COLORS.navy,
  },
  subtitle: {
    marginTop: 20,
    fontFamily: 'RobotoMedium',
    fontSize: 15,
    color: COLORS.navy,
  },
  form: {
    width: '100%',
    marginTop: 30,
  },
  field: {
    marginBottom: 23,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 8,
  },
  label: {
    fontFamily: 'RobotoMedium',
    fontSize: 13,
    color: COLORS.navy,
  },
  input: {
    height: 48,
    marginLeft: 30,
    paddingHorizontal: 13,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.82)',
    fontFamily: 'Roboto',
    fontSize: 14,
    color: COLORS.text,
  },
  passwordContainer: {
    height: 48,
    marginLeft: 30,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Roboto',
    fontSize: 14,
    color: COLORS.text,
  },
  loginButton: {
    height: 49,
    marginTop: 1,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  loginButtonText: {
    fontFamily: 'RobotoBold',
    fontSize: 15,
    color: COLORS.textWhite,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  separatorText: {
    fontFamily: 'RobotoBold',
    fontSize: 13,
  },
  faceButton: {
    minHeight: 48,
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
    fontFamily: 'RobotoBold',
    fontSize: 13,
    color: COLORS.primary,
  },
  version: {
    fontFamily: 'RobotoMedium',
    textAlign: 'center',
    fontSize: 11,
  },
});
