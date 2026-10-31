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
  // Controla los permisos de acceso a la cámara.
  const [permission, requestPermission] = useCameraPermissions();
  // Indica si la cámara terminó de inicializarse.
  const [cameraReady, setCameraReady] = useState(false);
  // Controla el encendido y apagado de la linterna.
  const [torchEnabled, setTorchEnabled] = useState(false);
  // Almacena los errores encontrados durante el escaneo.
  const [scanError, setScanError] = useState<string | null>(null);
  // Indica si el escáner está buscando códigos QR.
  const [scanning, setScanning] = useState(true);
  // Evita procesar varias veces el mismo código QR.
  const scannedRef = useRef(false);
  // Controla el valor de la animación de la línea de escaneo.
  const scanLine = useRef(new Animated.Value(0)).current;
  // Obtiene la altura disponible de la pantalla.
  const { height: screenHeight } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      // Restablece los estados al entrar nuevamente al escáner.
      scannedRef.current = false;
      setScanning(true);
      setCameraReady(false);
      setTorchEnabled(false);

      // Evita procesar códigos cuando se abandona la pantalla.
      return () => {
        scannedRef.current = true;
      };
    }, []),
  );

  useEffect(() => {
    // Detiene la animación si el escáner no está activo
    // o la cámara todavía no está preparada.
    if (!scanning || !cameraReady) {
      scanLine.stopAnimation();
      scanLine.setValue(0);
      return;
    }

    // Crea una animación continua de arriba hacia abajo.
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

    // Limpia la animación cuando cambian sus dependencias.
    return () => {
      animation.stop();
      scanLine.stopAnimation();
    };
  }, [scanLine, scanning, cameraReady]);

  const enableCamera = useCallback(async () => {
    // Solicita autorización para utilizar la cámara.
    const result = await requestPermission();

    // Si el permiso es rechazado, muestra el mensaje correspondiente.
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
    // Permite procesar un nuevo código QR.
    scannedRef.current = false;

    // Limpia los errores anteriores y reactiva el escáner.
    setScanError(null);
    setScanning(true);
  }, []);

  const handleScan = useCallback(
    ({ data }: { data: string }) => {
      // Evita procesar códigos repetidos o escaneos inactivos.
      if (scannedRef.current || !scanning) return;

      // Bloquea nuevas lecturas mientras se procesa el resultado.
      scannedRef.current = true;
      setScanning(false);
      setTorchEnabled(false);

      // Obtiene el contenido del código QR.
      const rawData = data.trim();
      let equipmentId = rawData;

      try {
        // Intenta interpretar el contenido como JSON.
        const parsed: unknown = JSON.parse(rawData);

        if (typeof parsed === 'object' && parsed !== null) {
          const qrObject = parsed as Record<string, unknown>;

          // Busca el identificador en las propiedades disponibles.
          const value = qrObject.equipmentId ?? qrObject.id ?? qrObject.code;

          if (typeof value === 'string' || typeof value === 'number') {
            equipmentId = String(value).trim();
          }
        }
      } catch {}

      // Normaliza el identificador para evitar diferencias de escritura
      const normalizedId = equipmentId.toLowerCase();

      // Busca coincidencias por ID o código de inventario.
      const equipment = equipmentData.find((item) => {
        const itemId = String(item.id ?? '')
          .trim()
          .toLowerCase();
        const itemCode = String(item.code ?? '')
          .trim()
          .toLowerCase();

        return itemId === normalizedId || itemCode === normalizedId;
      });

      // Si el equipo no existe, muestra el mensaje de error.
      if (!equipment) {
        setScanError('Equipo no existe');
        setScanning(false);
        return;
      }

      // Envía el identificador del equipo a la pantalla de detalles.
      router.push({
        pathname: '/equipment_details',
        params: {
          id: String(equipment.id),
        },
      });
    },
    [scanning, retryScan],
  );

  // Muestra una pantalla de carga mientras se consultan los permisos.
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

        {/* TÍTULO Y DESCRIPCIÓN */}
        <Text style={styles.title}>Escanear código QR</Text>
        <Text style={styles.description}>
          Apunta la cámara al código QR del equipo
          {'\n'}
          para ver más información.
        </Text>

        {/* INFORMACIÓN SOBRE LOS PERMISOS */}
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

            {/* BOTÓN PARA SOLICITAR PERMISO */}
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
              // Instrucciones cuando el permiso ya no puede solicitarse.
              <Text style={styles.permissionHint}>
                Habilita el permiso de cámara desde los ajustes de tu teléfono y
                vuelve a intentarlo.
              </Text>
            )}
          </View>
        </View>

        {/* BOTÓN PARA CANCELAR */}
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

          {/* INICIALIZACIÓN DE LA CÁMARA */}
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
            {/* ESQUINAS DEL ÁREA DE ESCANEO */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* ANIMACIÓN DE LA LÍNEA DE ESCANEO */}
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

            {/* INDICADOR VISUAL DE CÓDIGO DETECTADO */}
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
      {/* ESCANER*/}
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
        {/* BOTÓN PARA VOLVER A ESCANEAR */}
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

        {/* BOTÓN PARA ACTIVAR O DESACTIVAR LA LINTERNA */}
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
      {/* BOTÓN CANCELAR*/}
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

  // PANTALLA DE CARGA
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

  // ENCABEZADO
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
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '400',
  },

  // ÁREA DE LA CÁMARA
  cameraSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flexGrow: 0,
    flexShrink: 0,
  },

  // CONTENEDOR DE PERMISOS
  permissionBox: {
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
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

  // BOTÓN PARA ACTIVAR LA CÁMARA
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

  // MARCO PRINCIPAL DEL ESCÁNER
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

  // CARGA DE LA CÁMARA
  cameraLoading: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
  },

  frameOverlay: {
    ...StyleSheet.absoluteFill,
  },

  // ESQUINAS DEL ÁREA DE ESCANEO
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

  // ANIMACIÓN DE LA LÍNEA DE ESCANEO
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

  // SUPERPOSICIÓN AL DETECTAR UN CÓDIGO
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

  // MENSAJES DE ESTADO
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

  // CONTENEDOR DE ACCIONES
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 20,
  },

  // BOTÓN DE LINTERNA
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

  // BOTÓN PARA REPETIR EL ESCANEO
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

  // BOTÓN PARA CANCELAR
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

  // ESTADOS DE INTERACCIÓN
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
