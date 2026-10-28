import { COLORS } from '@/constants/colors';
import { dashboardStats, quickAccessItems } from '@/data/dashboard';
import { router } from 'expo-router';
import {
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  CircleAlert,
  History,
  MonitorSmartphone,
  Package,
  ScanLine,
  Search,
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
    background: '#f1faff',
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

const statIcons = {
  monitorsmartphone: MonitorSmartphone,
  available: CheckCircle2,
  package: Package,
  damaged: CircleAlert,
  maintenance: Wrench,
};

const quickIcons = {
  search: Search,
  scanner: ScanLine,
  history: History,
  reports: ChartNoAxesColumnIncreasing,
};

const quickRoutes: Record<string, string> = {
  equipment: '/tabs/equipment',
  scanner: '/tabs/scanner',
  loans: '/tabs/loans',
  reports: '/tabs/reports',
};
export default function Dashboard() {
  const totalStat = dashboardStats.find((item) => item.id === 'total');

  const otherStats = dashboardStats.filter((item) => item.id !== 'total');
  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <View style={styles.greeting}>
            <Text style={styles.greetingTitle}>Hola, Hermes</Text>
            <Text style={styles.greetingSubtitle}>Bienvenido a SigeLab</Text>
          </View>
        </View>
        <View style={styles.headerSeparator} />

        {/* Details */}
        {totalStat && (
          <View style={styles.totalCard}>
            <View style={styles.totalIconBox}>
              <MonitorSmartphone
                size={30}
                color={statColors.total.color}
                strokeWidth={2}
              />
            </View>
            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>{totalStat.title}</Text>

              <Text style={styles.totalValue}>{totalStat.value}</Text>
            </View>
          </View>
        )}
        <View style={styles.statsGrid}>
          {otherStats.map((item) => {
            const Icon = statIcons[item.icon as keyof typeof statIcons];
            const palette = statColors[item.id as keyof typeof statColors];
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
                    {
                      backgroundColor: palette.iconBackground,
                    },
                  ]}
                >
                  {Icon && (
                    <Icon
                      size={24}
                      color={palette.color}
                      strokeWidth={2}
                    />
                  )}
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
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
        </View>

        {/* Access */}
        <View style={styles.quickSection}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
          <View style={styles.quickGrid}>
            {quickAccessItems.map((item) => {
              const Icon = quickIcons[item.icon as keyof typeof quickIcons];
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    const path = quickRoutes[item.action];
                    if (path) {
                      router.push(path as never);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.quickCard,
                    pressed && styles.quickCardPressed,
                  ]}
                >
                  <View style={styles.quickIconBox}>
                    {Icon && (
                      <Icon
                        size={27}
                        color={COLORS.primary}
                        strokeWidth={2}
                      />
                    )}
                  </View>
                  <Text style={styles.quickTitle}>{item.title}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    paddingVertical: 4,
  },
  headerSeparator: {
    height: 1,
    backgroundColor: COLORS.borderDark,
    marginBottom: 20,
    marginHorizontal: -30,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.primary,
  },
  greeting: {
    marginLeft: 12,
  },
  greetingTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  totalCard: {
    minHeight: 100,
    backgroundColor: statColors.total.background,
    borderWidth: 1,
    borderColor: statColors.total.border,
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
    backgroundColor: statColors.total.iconBackground,
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
    color: statColors.total.color,
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
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.borderDark,
  },
  quickSection: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 13,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  quickCard: {
    width: '48.5%',
    minHeight: 112,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 14,
    justifyContent: 'space-between',
  },
  quickCardPressed: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    opacity: 0.85,
  },
  quickIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 10,
  },
});
