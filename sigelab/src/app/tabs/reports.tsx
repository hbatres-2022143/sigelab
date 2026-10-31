import { COLORS } from '@/constants/colors';
import { equipmentData } from '@/data/equipment';
import { router } from 'expo-router';
import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  History,
  MonitorSmartphone,
  Package,
  Wrench,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define los colores de cada categoría de equipos.
// Cada categoría tiene un color principal, fondo, fondo del icono y borde.
const statColors = {
  total: {
    color: '#2949E8',
    background: '#FAFBFF',
    iconBackground: '#DFE9FF',
    border: '#D9E4FF',
  },
  available: {
    color: '#059669',
    background: '#FAFDFB',
    iconBackground: '#D8F4E8',
    border: '#D8EFE5',
  },
  loaned: {
    color: '#2563EB',
    background: '#F1FAFF',
    iconBackground: '#DCE9FF',
    border: '#D9E7FF',
  },
  maintenance: {
    color: '#F59E0B',
    background: '#FFFAF2',
    iconBackground: '#FFEDCC',
    border: '#F8E8CF',
  },
  damaged: {
    color: '#EF4444',
    background: '#FFF5F5',
    iconBackground: '#FFE0E0',
    border: '#F8DDDD',
  },
};

// Calcula automáticamente la cantidad de equipos según su estado.
// Los valores se obtienen directamente de equipmentData.
const dashboardStats = [
  {
    id: 'total',
    title: 'Total de equipos',
    value: equipmentData.length,
    Icon: MonitorSmartphone,
  },
  {
    id: 'available',
    title: 'Disponibles',
    value: equipmentData.filter((item) => item.status === 'Disponible').length,
    Icon: CheckCircle2,
  },
  {
    id: 'loaned',
    title: 'Prestados',
    value: equipmentData.filter((item) => item.status === 'En préstamo').length,
    Icon: Package,
  },
  {
    id: 'maintenance',
    title: 'En mantenimiento',
    value: equipmentData.filter((item) => item.status === 'En mantenimiento')
      .length,
    Icon: Wrench,
  },
  {
    id: 'damaged',
    title: 'Dañados',
    value: equipmentData.filter((item) => item.status === 'Dañado').length,
    Icon: CircleAlert,
  },
] as const;

// Define las secciones a las que el usuario puede acceder
// desde la pantalla de reportes.
const reportOptions = [
  {
    id: 'inventory',
    title: 'Inventario general',
    description: 'Consulta todos los equipos registrados y su estado.',
    Icon: ClipboardList,
    color: '#2949E8',
    background: '#DFE9FF',
    route: '/tabs/equipment',
  },
  {
    id: 'availability',
    title: 'Equipos disponibles',
    description: 'Consulta los equipos disponibles para préstamo.',
    Icon: CheckCircle2,
    color: '#059669',
    background: '#D8F4E8',
    route: '/tabs/equipment',
  },
  {
    id: 'loans',
    title: 'Historial de préstamos',
    description: 'Accede a la sección de préstamos del laboratorio.',
    Icon: History,
    color: '#2563EB',
    background: '#DCE9FF',
    route: '/loans',
  },
  {
    id: 'maintenance',
    title: 'Incidencias y mantenimiento',
    description: 'Revisa los equipos dañados o en mantenimiento.',
    Icon: Wrench,
    color: '#D97706',
    background: '#FFEDCC',
    route: '/tabs/equipment',
  },
];

export default function Reports() {
  // Separa la estadística principal del resto de estadísticas
  const totalStat = dashboardStats[0];
  const otherStats = dashboardStats.slice(1);

  // Obtiene el icono y la paleta de colores de la tarjeta principal
  const TotalIcon = totalStat.Icon;
  const totalPalette = statColors.total;

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reportes</Text>
        <Text style={styles.headerSubtitle}>
          Consulta estadísticas del laboratorio
        </Text>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Resumen general</Text>
            <Text style={styles.sectionSubtitle}>
              Estado actual del inventario
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.totalCard,
            {
              backgroundColor: totalPalette.background,
              borderColor: totalPalette.border,
            },
          ]}
        >
          {/* Icono de total de equipos */}
          <View
            style={[
              styles.totalIconBox,
              { backgroundColor: totalPalette.iconBackground },
            ]}
          >
            <TotalIcon
              size={30}
              color={totalPalette.color}
              strokeWidth={2}
            />
          </View>

          {/* Nombre y cantidad total de equipos */}
          <View style={styles.totalInfo}>
            <Text style={[styles.totalLabel, { color: totalPalette.color }]}>
              {totalStat.title}
            </Text>
            <Text style={styles.totalValue}>{totalStat.value}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {otherStats.map((item) => {
            // Obtiene los colores y el icono correspondientes
            const palette = statColors[item.id];
            const Icon = item.Icon;

            return (
              // Tarjeta individual de cada estado
              <View
                key={item.id}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: palette.background,
                    borderColor: palette.border,
                  },
                ]}
              >
                {/* Icono de la categoría */}
                <View
                  style={[
                    styles.statIconBox,
                    { backgroundColor: palette.iconBackground },
                  ]}
                >
                  <Icon
                    size={24}
                    color={palette.color}
                    strokeWidth={2}
                  />
                </View>

                {/* Información de la estadística */}
                <View style={styles.statInfo}>
                  <Text
                    style={[styles.statLabel, { color: palette.color }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  {/* Cantidad de equipos según su estado */}
                  <Text style={styles.statValue}>{item.value}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.reportsSection}>
          {/* Título y descripción de la sección */}
          <Text style={styles.sectionTitle}>Reportes disponibles</Text>
          <Text style={styles.sectionSubtitle}>
            Selecciona una sección para consultar sus datos
          </Text>

          <View style={styles.reportList}>
            {reportOptions.map((item) => {
              // Obtiene el icono de cada opción
              const Icon = item.Icon;

              return (
                // Tarjeta interactiva que permite navegar a otra sección
                <Pressable
                  key={item.id}
                  onPress={() => router.push(item.route as never)}
                  style={({ pressed }) => [
                    styles.reportCard,
                    pressed && styles.reportCardPressed,
                  ]}
                >
                  {/* Icono representativo del reporte */}
                  <View
                    style={[
                      styles.reportIconBox,
                      { backgroundColor: item.background },
                    ]}
                  >
                    <Icon
                      size={23}
                      color={item.color}
                      strokeWidth={2}
                    />
                  </View>

                  {/* Título y descripción de la opción */}
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <Text style={styles.reportDescription}>
                      {item.description}
                    </Text>
                  </View>

                  {/* Indicador visual de navegación */}
                  <ChevronRight
                    size={21}
                    color={COLORS.icon}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 30,
    paddingTop: 8,
    paddingBottom: 40,
  },
  headerTitle: {
    color: COLORS.textWhite,
    fontWeight: '800',
    fontSize: 24,
  },
  headerSubtitle: {
    marginTop: 4,
    color: COLORS.textWhiteSecondary,
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  // TÍTULOS DE LAS SECCIONES
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontWeight: '700',
    fontSize: 17,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },

  totalCard: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalIconBox: {
    width: 58,
    height: 58,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  statCard: {
    width: '48.5%',
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  statInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 3,
  },
  reportsSection: {
    marginTop: 28,
  },
  reportList: {
    gap: 9,
    marginTop: 3,
  },
  reportCard: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
  },
  // Apariencia de la tarjeta cuando el usuario la presiona
  reportCardPressed: {
    opacity: 0.75,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  reportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportInfo: {
    flex: 1,
    minWidth: 0,
  },
  reportTitle: {
    color: COLORS.navy,
    fontWeight: '600',
    fontSize: 13,
  },
  reportDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
});
