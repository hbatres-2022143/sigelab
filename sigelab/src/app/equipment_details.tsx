import { COLORS } from '@/constants/colors';
import { equipmentData } from '@/data/equipment';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Info,
  QrCode,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Equipment_Details() {
  // Recupera el identificador enviado mediante los parámetros de navegación
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  // Convierte el parámetro en un único identificador
  const equipmentId = Array.isArray(id) ? id[0] : id;

  // Busca el equipo utilizando su ID o código de inventario
  const equipment = equipmentData.find((item) => {
    const matchesId =
      String(item.id).toLowerCase() ===
      String(equipmentId ?? '')
        .trim()
        .toLowerCase();

    const matchesCode =
      String(item.code).toLowerCase() ===
      String(equipmentId ?? '')
        .trim()
        .toLowerCase();

    return matchesId || matchesCode;
  });

  // Controla el índice de la fotografía que se muestra actualmente.
  const [imageIndex, setImageIndex] = useState(0);

  // Si el equipo no existe, muestra una pantalla de error.
  if (!equipment) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top']}
      >
        {/* ENCABEZADO DE LA PANTALLA */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
            accessibilityLabel='Volver'
          >
            <ArrowLeft
              size={23}
              color={COLORS.textWhite}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Detalle del equipo</Text>
        </View>

        {/* MENSAJE DE EQUIPO NO ENCONTRADO */}
        <View style={styles.notFoundContainer}>
          <View style={styles.notFoundIcon}>
            <QrCode
              size={56}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.notFoundTitle}>Equipo no encontrado</Text>

          <Text style={styles.notFoundDescription}>
            No se encontró ningún equipo asociado con el código:
          </Text>

          <Text style={styles.notFoundCode}>
            {equipmentId || 'Sin identificador'}
          </Text>

          {/* REGRESAR A LA PANTALLA ANTERIOR */}
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Regresar al escáner</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Obtiene las fotografías del equipo.
  // Si no tiene una galería, utiliza su imagen principal.
  const images = equipment.images?.length
    ? equipment.images
    : [equipment.image];

  // Asigna un color según el estado actual del equipo.
  const statusColor =
    equipment.status === 'Disponible'
      ? COLORS.success
      : equipment.status === 'En préstamo'
        ? COLORS.primary
        : equipment.status === 'Dañado'
          ? COLORS.error
          : COLORS.warning;

  // Asigna un fondo según el estado del equipo.
  const statusBackground =
    equipment.status === 'Disponible'
      ? COLORS.successLight
      : equipment.status === 'En préstamo'
        ? COLORS.infoLight
        : equipment.status === 'Dañado'
          ? COLORS.errorLight
          : COLORS.warningLight;

  // Avanza a la siguiente fotografía de la galería
  const nextImage = () => {
    setImageIndex((current) => (current + 1) % images.length);
  };

  // Regresa a la fotografía anterior de la galería
  const previousImage = () => {
    setImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <View style={styles.header}>
        {/* BOTÓN PARA REGRESAR */}
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}
          accessibilityLabel='Volver'
        >
          <ArrowLeft
            size={23}
            color={COLORS.textWhite}
          />
        </Pressable>

        <Text
          style={styles.headerTitle}
          numberOfLines={1}
        >
          Detalle del equipo
        </Text>

        {/* CONSULTAR CÓDIGO DE INVENTARIO */}
        <Pressable
          style={styles.headerButton}
          onPress={() =>
            Alert.alert('Código QR', `Código de inventario: ${equipment.code}`)
          }
          accessibilityLabel='Ver código QR'
        >
          <QrCode
            size={21}
            color={COLORS.textWhite}
          />
        </Pressable>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gallery}>
            {/* IMAGEN ACTUAL DEL EQUIPO */}
            <Image
              source={images[imageIndex]}
              style={styles.productImage}
              resizeMode='contain'
            />

            {/* CONTADOR DE FOTOGRAFÍAS */}
            <View style={styles.imageCounter}>
              <Text style={styles.counterText}>
                {imageIndex + 1} / {images.length}
              </Text>
            </View>

            {/* CONTROLES DEL CARRUSEL */}
            {images.length > 1 && (
              <>
                {/* FOTOGRAFÍA ANTERIOR */}
                <Pressable
                  style={[styles.carouselButton, styles.leftButton]}
                  onPress={previousImage}
                  accessibilityLabel='Fotografía anterior'
                >
                  <ChevronLeft
                    size={23}
                    color={COLORS.navy}
                  />
                </Pressable>

                {/* FOTOGRAFÍA SIGUIENTE */}
                <Pressable
                  style={[styles.carouselButton, styles.rightButton]}
                  onPress={nextImage}
                  accessibilityLabel='Fotografía siguiente'
                >
                  <ChevronRight
                    size={23}
                    color={COLORS.navy}
                  />
                </Pressable>
              </>
            )}
          </View>

          {/* INDICADORES DE POSICIÓN DE LA GALERÍA */}
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => setImageIndex(index)}
                style={[styles.dot, imageIndex === index && styles.activeDot]}
                accessibilityLabel={`Fotografía ${index + 1}`}
              />
            ))}
          </View>

          <View style={styles.separator} />

          <View style={styles.productHeading}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productName}>{equipment.name}</Text>

              <Text style={styles.productCode}>{equipment.code}</Text>
            </View>

            {/* INDICADOR VISUAL DEL ESTADO */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusBackground },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />

              <Text style={[styles.statusText, { color: statusColor }]}>
                {equipment.status}
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ClipboardList
                size={24}
                color={COLORS.primary}
              />

              <Text style={styles.cardTitle}>Información del equipo</Text>
            </View>

            <View style={styles.cardSeparator} />

            {/* DATOS TÉCNICOS DEL EQUIPO */}
            <InfoRow
              label='Tipo'
              value={equipment.category}
            />
            <InfoRow
              label='Marca'
              value={equipment.brand || 'No registrada'}
            />
            <InfoRow
              label='Modelo'
              value={equipment.model || 'No registrado'}
            />
            <InfoRow
              label='N.º de serie'
              value={equipment.serialNumber || 'No registrado'}
            />
            <InfoRow
              label='Laboratorio'
              value={equipment.laboratory || 'No registrado'}
            />
            <InfoRow
              label='Cód. Laboratorio'
              value={equipment.codeLaboratory || 'No registrado'}
            />
            {/* ESTADO ACTUAL DEL EQUIPO */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text style={styles.infoColon}>:</Text>

              <View
                style={[
                  styles.statusBadge,
                  styles.inlineStatus,
                  { backgroundColor: statusBackground },
                ]}
              >
                <View
                  style={[styles.statusDot, { backgroundColor: statusColor }]}
                />

                <Text style={[styles.statusText, { color: statusColor }]}>
                  {equipment.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Esta sección aparece únicamente si existe una descripción. */}
          {equipment.description ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Info
                  size={24}
                  color={COLORS.primary}
                />

                <Text style={styles.cardTitle}>Descripción</Text>
              </View>

              <Text style={styles.description}>{equipment.description}</Text>
            </View>
          ) : null}

          <Pressable
            style={styles.qrCard}
            onPress={() =>
              Alert.alert(
                'Código de inventario',
                `${equipment.code}\n\nEste es el identificador de este equipo.`,
              )
            }
          >
            {/* ICONO QR */}
            <View style={styles.qrPlaceholder}>
              <QrCode
                size={43}
                color={COLORS.navy}
              />
            </View>

            {/* INFORMACIÓN DEL CÓDIGO */}
            <View style={styles.qrInfo}>
              <Text style={styles.qrTitle}>Código QR</Text>

              <Text style={styles.qrDescription}>
                Escanea para identificar este equipo
              </Text>

              <Text style={styles.qrCode}>{equipment.code}</Text>
            </View>

            {/* ACCIÓN PARA CONSULTAR EL CÓDIGO */}
            <View style={styles.qrButton}>
              <Text style={styles.qrButtonText}>Ver QR</Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Muestra una etiqueta y su valor dentro de los detalles del equipo
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoColon}>:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  header: {
    minHeight: 58,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 5,
  },

  headerTitle: {
    flex: 1,
    color: COLORS.textWhite,
    fontWeight: '800',
    fontSize: 24,
  },

  headerButton: {
    width: 34,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    overflow: 'hidden',
    paddingBottom: 30,
  },

  content: {
    width: '100%',
    padding: 12,
    paddingBottom: 24,
    gap: 10,
  },

  // GALERÍA DE IMÁGENES
  gallery: {
    height: 205,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.textWhite,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  imageCounter: {
    position: 'absolute',
    top: 9,
    right: 9,
    backgroundColor: COLORS.filter,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },

  counterText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '700',
  },

  // CONTROLES DEL CARRUSEL
  carouselButton: {
    position: 'absolute',
    top: '43%',
    width: 29,
    height: 29,
    borderRadius: 18,
    backgroundColor: COLORS.filter,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftButton: {
    left: 7,
  },

  rightButton: {
    right: 7,
  },

  // INDICADORES DE FOTOGRAFÍAS
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    minHeight: 12,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: COLORS.infoLight,
  },

  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.primary,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.borderDark,
    marginVertical: 1,
  },

  // NOMBRE, CÓDIGO Y ESTADO
  productHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 2,
  },

  productTitleContainer: {
    flex: 1,
  },

  productName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.navy,
  },

  productCode: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ETIQUETAS DE ESTADO
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // TARJETAS DE INFORMACIÓN
  card: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 9,
  },

  cardTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '800',
  },

  cardSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 4,
  },

  // FILAS DE INFORMACIÓN
  infoRow: {
    minHeight: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoLabel: {
    width: '34%',
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  infoColon: {
    width: '7%',
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  infoValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
  },

  inlineStatus: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  // DESCRIPCIÓN
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
  },

  // TARJETA DE CÓDIGO QR
  qrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 10,
    borderRadius: 13,
    backgroundColor: COLORS.textWhite,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },

  qrPlaceholder: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },

  qrInfo: {
    flex: 1,
    gap: 3,
  },

  qrTitle: {
    fontSize: 14,
    color: COLORS.navy,
    fontWeight: '800',
  },

  qrDescription: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },

  qrCode: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  qrButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  qrButtonText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  // PANTALLA DE EQUIPO NO ENCONTRADO
  notFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  notFoundIcon: {
    width: 100,
    height: 100,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#102B50',
  },

  notFoundTitle: {
    marginTop: 24,
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.textWhite,
    textAlign: 'center',
  },

  notFoundDescription: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textWhiteSecondary,
    textAlign: 'center',
  },

  notFoundCode: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // BOTÓN PARA REGRESAR
  backButton: {
    marginTop: 28,
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },

  // ESTADOS DE INTERACCIÓN
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
