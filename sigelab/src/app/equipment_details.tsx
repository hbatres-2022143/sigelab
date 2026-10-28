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
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const equipmentId = Array.isArray(id) ? id[0] : id;
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

  const [imageIndex, setImageIndex] = useState(0);
  if (!equipment) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top']}
      >
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

  const images = equipment.images?.length
    ? equipment.images
    : [equipment.image];

  const statusColor =
    equipment.status === 'Disponible'
      ? COLORS.success
      : equipment.status === 'En préstamo'
        ? COLORS.primary
        : equipment.status === 'Dañado'
          ? COLORS.error
          : COLORS.warning;

  const statusBackground =
    equipment.status === 'Disponible'
      ? COLORS.successLight
      : equipment.status === 'En préstamo'
        ? COLORS.infoLight
        : equipment.status === 'Dañado'
          ? COLORS.errorLight
          : COLORS.warningLight;

  const nextImage = () => {
    setImageIndex((current) => (current + 1) % images.length);
  };

  const previousImage = () => {
    setImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
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
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
        >
          Detalle del equipo
        </Text>
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
            <Image
              source={images[imageIndex]}
              style={styles.productImage}
              resizeMode='contain'
            />
            <View style={styles.imageCounter}>
              <Text style={styles.counterText}>
                {imageIndex + 1} / {images.length}
              </Text>
            </View>

            {images.length > 1 && (
              <>
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
            <View style={styles.qrPlaceholder}>
              <QrCode
                size={43}
                color={COLORS.navy}
              />
            </View>
            <View style={styles.qrInfo}>
              <Text style={styles.qrTitle}>Código QR</Text>
              <Text style={styles.qrDescription}>
                Escanea para identificar este equipo
              </Text>
              <Text style={styles.qrCode}>{equipment.code}</Text>
            </View>
            <View style={styles.qrButton}>
              <Text style={styles.qrButtonText}>Ver QR</Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
  },
  content: {
    width: '100%',
    padding: 12,
    paddingBottom: 24,
    gap: 10,
  },
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
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
  },
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
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
