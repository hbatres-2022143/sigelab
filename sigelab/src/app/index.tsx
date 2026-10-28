import { COLORS } from '@/constants/colors';
import { router } from 'expo-router';
import { FlaskConical } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.background}>
      {/* Imagen de fondo */}
      <Image
        source={require('../../assets/images/sigelab.png')}
        style={styles.backgroundImage}
        resizeMode='cover'
        accessible={false}
      />
      {/* Overlay azul */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <FlaskConical
              size={64}
              color={COLORS.textWhite}
              strokeWidth={1.8}
            />
            <Text style={styles.logoText}>SIGELAB</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Sistema de Gestión y Control{'\n'}de Laboratorios Universitarios
          </Text>
        </View>

        {/* Description */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Tu laboratorio,
            {'\n'}
            mejor organizado
          </Text>

          <Text style={styles.description}>
            Controla, presta y da seguimiento{'\n'}a los equipos de laboratorio
            de forma{'\n'}segura y eficiente.
          </Text>
        </View>
        {/* Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },

  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: undefined,
    height: undefined,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.glassnavi,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 180,
    paddingBottom: 80,
    justifyContent: 'space-between',
    fontFamily: 'Roboto',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoText: {
    color: COLORS.textWhite,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 14,
    color: COLORS.textWhiteSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
    fontWeight: '400',
  },
  content: {
    width: '100%',
    marginTop: 100,
  },
  title: {
    color: COLORS.textWhite,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '500',
    marginBottom: 20,
  },
  description: {
    color: COLORS.textWhiteSecondary,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '400',
  },
  button: {
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
  buttonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
});
