import { COLORS } from '@/constants/colors';
import { equipmentData } from '@/data/equipment';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import { Flashlight, QrCode, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const scannedRef = useRef(false);
  const scanLine = useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = useWindowDimensions();
  useFocusEffect(
    useCallback(() => {
      scannedRef.current = false;
      setScanning(true);
      setCameraReady(false);
      setTorchEnabled(false);

      return () => {
        scannedRef.current = true;
      };
    }, []),
  );

  useEffect(() => {
    if (!scanning || !cameraReady) {
      scanLine.stopAnimation();
      scanLine.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      scanLine.stopAnimation();
    };
  }, [scanLine, scanning, cameraReady]);

  const enableCamera = useCallback(async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        'Permiso de cámara',
        result.canAskAgain
          ? 'Necesitas permitir el acceso a la cámara para escanear los códigos QR.'
          : 'El permiso está desactivado. Habilita la cámara desde los ajustes de tu teléfono.',
      );
    }
  }, [requestPermission]);

  const retryScan = useCallback(() => {
    scannedRef.current = false;
    setScanError(null);
    setScanning(true);
  }, []);

  const handleScan = useCallback(
    ({ data }: { data: string }) => {
      if (scannedRef.current || !scanning) return;
      scannedRef.current = true;
      setScanning(false);
      setTorchEnabled(false);

      const rawData = data.trim();
      let equipmentId = rawData;
      try {
        const parsed: unknown = JSON.parse(rawData);

        if (typeof parsed === 'object' && parsed !== null) {
          const qrObject = parsed as Record<string, unknown>;
          const value = qrObject.equipmentId ?? qrObject.id ?? qrObject.code;

          if (typeof value === 'string' || typeof value === 'number') {
            equipmentId = String(value).trim();
          }
        }
      } catch {}
      const normalizedId = equipmentId.toLowerCase();
      const equipment = equipmentData.find((item) => {
        const itemId = String(item.id ?? '')
          .trim()
          .toLowerCase();

        const itemCode = String(item.code ?? '')
          .trim()
          .toLowerCase();
        return itemId === normalizedId || itemCode === normalizedId;
      });

      if (!equipment) {
        setScanError('Equipo no existe');
        setScanning(false);
        return;
      }
      router.push({
        pathname: '/equipment_details',
        params: {
          id: String(equipment.id),
        },
      });
    },
    [scanning, retryScan],
  );

  if (!permission) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size='large'
          color={COLORS.primary}
        />
        <Text style={styles.loadingText}>Preparando cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom']}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityLabel='Cerrar escáner'
          >
            <X
              size={27}
              color={COLORS.textWhite}
            />
          </Pressable>
        </View>
        <Text style={styles.title}>Escanear código QR</Text>
        <Text style={styles.description}>
          Apunta la cámara al código QR del equipo
          {'\n'}
          para ver más información.
        </Text>
        <View style={styles.cameraSection}>
          <View
            style={[
              styles.permissionBox,
              { maxHeight: Math.min(615, screenHeight * 0.48) },
            ]}
          >
            <QrCode
              size={110}
              color={COLORS.textWhite}
              strokeWidth={2.5}
            />

            <Text style={styles.permissionText}>
              Necesitamos acceso a tu cámara
            </Text>

            {permission.canAskAgain ? (
              <Pressable
                style={({ pressed }) => [
                  styles.allowButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={enableCamera}
              >
                <Text style={styles.allowText}>Activar cámara</Text>
              </Pressable>
            ) : (
              <Text style={styles.permissionHint}>
                Habilita el permiso de cámara desde los ajustes de tu teléfono y
                vuelve a intentarlo.
              </Text>
            )}
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel='Volver'
        >
          <X
            size={27}
            color={COLORS.textWhite}
          />
        </Pressable>
      </View>
      <Text style={styles.title}>Escanear código QR</Text>
      <Text style={styles.description}>
        Apunta la cámara al código QR del equipo
        {'\n'}
        para ver más información.
      </Text>
      <View style={styles.cameraSection}>
        <View style={styles.frame}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing='back'
            enableTorch={torchEnabled}
            onCameraReady={() => setCameraReady(true)}
            onBarcodeScanned={scanning ? handleScan : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
          {!cameraReady && (
            <View style={styles.cameraLoading}>
              <ActivityIndicator
                size='large'
                color={COLORS.textWhite}
              />
              <Text style={styles.loadingText}>Iniciando cámara...</Text>
            </View>
          )}
          <View
            pointerEvents='none'
            style={styles.frameOverlay}
          >
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {scanning && cameraReady && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanLine.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 190],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}
            {!scanning && (
              <View style={styles.detectedOverlay}>
                <QrCode
                  size={46}
                  color={COLORS.textWhite}
                />
                <Text style={styles.detectedText}>Código detectado</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <Text style={[styles.hint, scanError !== null && styles.errorHint]}>
        {scanError
          ? scanError
          : !cameraReady
            ? 'Preparando cámara...'
            : scanning
              ? 'Buscando código QR...'
              : 'Código detectado'}
      </Text>
      <View style={styles.actions}>
        {!scanning && (
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={retryScan}
          >
            <Text style={styles.retryText}>Escanear de nuevo</Text>
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.flashButton,
            torchEnabled && styles.flashButtonActive,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setTorchEnabled((current) => !current)}
          accessibilityLabel={
            torchEnabled ? 'Apagar linterna' : 'Encender linterna'
          }
        >
          <Flashlight
            size={25}
            color={COLORS.textWhite}
          />
        </Pressable>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.cancelButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </Pressable>
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
  loadingText: {
    color: COLORS.textWhite,
    fontSize: 14,
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
  permissionBox: {
    width: '100%',
    maxWidth: 300,
    minHeight: 350,
    flexGrow: 0,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    aspectRatio: 1,
    gap: 18,
  },
  permissionText: {
    color: COLORS.textWhite,
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 27,
    maxWidth: 310,
  },
  permissionHint: {
    color: COLORS.textWhiteSecondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
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
  frame: {
    width: '100%',
    maxWidth: 300,
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
  cameraLoading: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
  },
  frameOverlay: {
    ...StyleSheet.absoluteFill,
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
  scanLine: {
    position: 'absolute',
    top: 20,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#5D8DFF',
    shadowColor: '#3675FF',
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 8,
  },
  detectedOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 26, 53, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  detectedText: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    color: COLORS.textWhiteSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 16,
  },
  errorHint: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 20,
  },
  flashButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#7796CB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  retryButton: {
    paddingHorizontal: 22,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '600',
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
