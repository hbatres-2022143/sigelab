import { COLORS } from '@/constants/colors';
import { registerBiometricUser } from '@/data/biometric';
import { getCurrentUser, setCurrentUser } from '@/data/session';
import { router, useFocusEffect } from 'expo-router';
import {
  ChevronRight,
  FlaskConical,
  Info,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Convierte los roles internos en nombres visibles.
const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  ENCARGADO: 'Encargado de laboratorio',
  DOCENTE: 'Docente',
};

export default function Profile() {
  const [user, setUser] = useState(getCurrentUser());
  // ACTUALIZACIÓN DE SESIÓN AL ABRIR LA PANTALLA
  // Recupera los datos más recientes del usuario.
  useFocusEffect(
    useCallback(() => {
      setUser(getCurrentUser());
    }, []),
  );

  // CERRAR SESIÓN
  // Solicita confirmación, limpia la sesión y vuelve al login.
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir de SIGELAB?',

      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            setCurrentUser(null);
            router.replace('/login');
          },
        },
      ],
    );
  };

  // REGISTRO BIOMÉTRICO
  // Ejecuta el registro facial y muestra el resultado.
  const handleRegisterBiometric = async () => {
    try {
      const result = await registerBiometricUser();
      Alert.alert(
        result.success ? 'Registro exitoso' : 'No se pudo registrar',
        result.message,
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo completar el registro biométrico.');
    }
  };

  // INICIALES DEL USUARIO
  // Genera las iniciales que se muestran en el avatar.
  const initials =
    user?.fullName
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'U';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ENCABEZADO Y LOGOTIPO DE SIGELAB */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <FlaskConical
            size={30}
            color={COLORS.primaryDark}
            strokeWidth={2}
          />

          <Text style={styles.logo}>
            <Text style={styles.logoSIGE}>SIGE</Text>
            <Text style={styles.logoLAB}>LAB</Text>
          </Text>
        </View>
        <Text style={styles.title}>Mi perfil</Text>
        <Text style={styles.subtitle}>Administra tu cuenta</Text>
      </View>
      {/* CONTENIDO SEGÚN EL ESTADO DE LA SESIÓN */}
      {!user ? (
        <View style={styles.card}>
          <Text style={styles.name}>Sesión no iniciada</Text>

          <Text style={styles.muted}>
            Inicia sesión para consultar tu perfil y acceder a la información de
            tu cuenta.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,

              pressed && styles.primaryPressed,
            ]}
            onPress={() => router.replace('/login')}
            accessibilityRole='button'
          >
            <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* AVATAR, NOMBRE, ROL Y ESTADO */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <Text style={styles.name}>{user.fullName}</Text>

            <Text style={styles.username}>@{user.username}</Text>

            <View style={styles.badgesRow}>
              <View style={styles.roleBadge}>
                <ShieldCheck
                  size={15}
                  color={COLORS.primary}
                />

                <Text style={styles.roleText}>
                  {ROLE_LABELS[user.role] ?? user.role}
                </Text>
              </View>

              <View style={styles.status}>
                <View style={styles.statusDot} />

                <Text style={styles.statusText}>Cuenta activa</Text>
              </View>
            </View>
          </View>

          {/* INFORMACIÓN PERSONAL DEL USUARIO */}
          <Text style={styles.sectionTitle}>Información personal</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <UserRound
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.label}>Nombre completo</Text>

                <Text style={styles.value}>{user.fullName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Mail
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.label}>Correo electrónico</Text>

                <Text style={styles.value}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <ShieldCheck
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.label}>Rol del sistema</Text>

                <Text style={styles.value}>
                  {ROLE_LABELS[user.role] ?? user.role}
                </Text>
              </View>
            </View>
          </View>

          {/* SEGURIDAD Y REGISTRO DE RECONOCIMIENTO FACIAL */}
          <Text style={styles.sectionTitle}>Seguridad</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <ShieldCheck
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.value}>Acceso biométrico</Text>

                <Text style={styles.label}>
                  Registra tu biometría para iniciar sesión sin contraseña.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleRegisterBiometric}
              style={({ pressed }) => [
                styles.primaryButton,

                pressed && styles.primaryPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                Registrar reconocimiento facial
              </Text>
            </Pressable>
          </View>

          {/* INFORMACIÓN Y VERSIÓN DE LA APLICACIÓN */}
          <Text style={styles.sectionTitle}>Aplicación</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Info
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.value}>SIGELAB Móvil</Text>

                <Text style={styles.label}>
                  Sistema de gestión de laboratorios
                </Text>
              </View>

              <Text style={styles.version}>v1.0</Text>
            </View>
          </View>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,

              pressed && styles.pressed,
            ]}
            accessibilityRole='button'
          >
            <LogOut
              size={20}
              color={COLORS.error}
            />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
            <ChevronRight
              size={20}
              color={COLORS.error}
              style={styles.logoutArrow}
            />
          </Pressable>

          {/* PIE DE PANTALLA */}
          <Text style={styles.footer}>
            <FlaskConical
              size={16}
              color={COLORS.textTertiary}
              strokeWidth={1.5}
            />{' '}
            SIGELAB · Gestión inteligente de laboratorios
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginBottom: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
  },
  logoSIGE: {
    color: COLORS.primaryDark,
  },
  logoLAB: {
    color: COLORS.navyLight,
  },
  title: {
    color: COLORS.navy,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  // TARJETA DE PERFIL Y AVATAR
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  avatarText: {
    color: COLORS.primaryDark,
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  username: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  // ETIQUETAS DE ROL Y ESTADO DE CUENTA
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    maxWidth: '100%',
  },
  roleText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  // TÍTULOS Y TARJETAS DE SECCIÓN
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 25,
  },
  // FILAS DE INFORMACIÓN, ICONOS Y TEXTOS
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 54,
  },
  // VERSIÓN Y ELEMENTOS PARA CERRAR SESIÓN
  version: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    borderRadius: 15,
    paddingHorizontal: 17,
  },
  logoutText: {
    flex: 1,
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 14,
  },
  logoutArrow: {
    marginLeft: 'auto',
  },
  // ESTADOS VISUALES DE LOS BOTONES
  pressed: {
    backgroundColor: COLORS.errorLight,
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  // BOTÓN PRINCIPAL Y TEXTO
  primaryButton: {
    width: '100%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 22,
  },
  primaryPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 15,
  },
  // MENSAJES SECUNDARIOS Y PIE DE PANTALLA
  muted: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 25,
  },
});
