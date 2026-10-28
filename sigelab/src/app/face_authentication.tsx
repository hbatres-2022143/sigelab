import { COLORS } from '@/constants/colors';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { ScanFace, X } from 'lucide-react-native';
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
  const [analyzing, setAnalyzing] = useState(false);
  const [recognized, setRecognized] = useState<boolean | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);

  async function enableCamera() {
    const result = await requestPermission();

    if (!result.granted) {
      Alert.alert(
        'Permiso de cámara',
        'Necesitas permitir el acceso a la cámara para continuar con el reconocimiento facial.',
      );
    }
  }

  if (!permission) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          color={COLORS.navy}
          size='large'
        />
      </View>
    );
  }

  function startRecognition() {
    if (!cameraReady || analyzing) return;
    setAnalyzing(true);
    setRecognized(null);
    setTimeout(() => {
      setAnalyzing(false);
      setRecognized(true);
    }, 1800);
  }
  function retryRecognition() {
    setRecognized(null);
    setAnalyzing(false);
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
        Coloca tu rostro frente a la cámara
        {'\n'}
        para continuar.
      </Text>
      <View style={styles.cameraSection}>
        {permission.granted ? (
          <View style={styles.frame}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing='front'
              onCameraReady={() => setCameraReady(true)}
            />
            {!cameraReady && (
              <ActivityIndicator
                style={styles.cameraLoading}
                size='large'
                color={COLORS.textWhite}
              />
            )}
            <View
              pointerEvents='none'
              style={styles.frameOverlay}
            >
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        ) : (
          <View style={styles.permissionBox}>
            <ScanFace
              size={150}
              color={COLORS.textWhite}
            />
            <Text style={styles.permissionText}>
              Necesitamos acceso a tu cámara
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.allowButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={enableCamera}
            >
              <Text style={styles.allowText}>Activar cámara</Text>
            </Pressable>
          </View>
        )}
      </View>
      <Text style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
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
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '400',
  },
  cameraSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
  },
  frame: {
    width: '100%',
    maxWidth: 270,
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.navy,
    backgroundColor: COLORS.navy,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.65,
    shadowRadius: 18,
    elevation: 10,
  },
  frameOverlay: {
    ...StyleSheet.absoluteFill,
  },
  cameraLoading: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
  },
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
  permissionBox: {
    width: '100%',
    maxWidth: 270,
    aspectRatio: 1,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 18,
  },
  permissionText: {
    color: COLORS.textWhite,
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 16,
  },
  allowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  allowText: {
    color: COLORS.textWhite,
    fontWeight: '500',
  },
  footer: {
    margin: 4,
  },
  cancelButton: {
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
  cancelText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
