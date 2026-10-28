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
    route: '/tabs/loans',
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
  const totalStat = dashboardStats[0];
  const otherStats = dashboardStats.slice(1);
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
          <View style={styles.totalInfo}>
            <Text style={[styles.totalLabel, { color: totalPalette.color }]}>
              {totalStat.title}
            </Text>
            <Text style={styles.totalValue}>{totalStat.value}</Text>
          </View>
        </View>
        <View style={styles.statsGrid}>
          {otherStats.map((item) => {
            const palette = statColors[item.id];
            const Icon = item.Icon;
            return (
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

                <View style={styles.statInfo}>
                  <Text
                    style={[styles.statLabel, { color: palette.color }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.statValue}>{item.value}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Reportes disponibles</Text>
          <Text style={styles.sectionSubtitle}>
            Selecciona una sección para consultar sus datos
          </Text>
          <View style={styles.reportList}>
            {reportOptions.map((item) => {
              const Icon = item.Icon;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(item.route as never)}
                  style={({ pressed }) => [
                    styles.reportCard,
                    pressed && styles.reportCardPressed,
                  ]}
                >
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
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <Text style={styles.reportDescription}>
                      {item.description}
                    </Text>
                  </View>
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
