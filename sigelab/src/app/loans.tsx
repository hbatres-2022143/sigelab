import { COLORS } from '@/constants/colors';
import { Loan, loanDetails, loans } from '@/data/loans';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  Search,
  UserRound,
  XCircle,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type FilterStatus = 'TODOS' | 'ACTIVO' | 'FINALIZADO' | 'VENCIDO';

export default function Loans() {
  // Estados para controlar la búsqueda y el filtro seleccionado
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('TODOS');
  const totalLoans = loans.length;
  const activeLoans = loans.filter((loan) => loan.status === 'ACTIVO').length;
  const finishedLoans = loans.filter(
    (loan) => loan.status === 'FINALIZADO',
  ).length;

  const overdueLoans = loans.filter((loan) => loan.overdue).length;

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      // Buscar por nombre, identificación o número de préstamo
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        loan.applicant.toLowerCase().includes(searchText) ||
        loan.identification.toLowerCase().includes(searchText) ||
        String(loan.number).includes(searchText);

      // Filtrar según el estado seleccionado
      const matchesFilter =
        activeFilter === 'TODOS' ||
        (activeFilter === 'VENCIDO' && loan.overdue) ||
        loan.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Préstamos</Text>
        <Text style={styles.headerSubtitle}>
          Gestión y control de préstamos
        </Text>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* RESUMEN GENERAL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumen general</Text>
          <Text style={styles.sectionSubtitle}>
            Estado actual de los préstamos
          </Text>
        </View>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <View style={styles.statsGrid}>
          <LoanStatCard
            title='Total'
            value={totalLoans}
            color='#2949E8'
            background='#FAFBFF'
            iconBackground='#DFE9FF'
            border='#D9E4FF'
            icon={
              <Package
                size={20}
                color='#2949E8'
                strokeWidth={2}
              />
            }
          />
          <LoanStatCard
            title='Activos'
            value={activeLoans}
            color='#2563EB'
            background='#F1FAFF'
            iconBackground='#DCE9FF'
            border='#D9E7FF'
            icon={
              <Clock3
                size={20}
                color='#2563EB'
                strokeWidth={2}
              />
            }
          />
          <LoanStatCard
            title='Finalizados'
            value={finishedLoans}
            color='#059669'
            background='#FAFDFB'
            iconBackground='#D8F4E8'
            border='#D8EFE5'
            icon={
              <CheckCircle2
                size={20}
                color='#059669'
                strokeWidth={2}
              />
            }
          />
          <LoanStatCard
            title='Vencidos'
            value={overdueLoans}
            color='#EF4444'
            background='#FFF5F5'
            iconBackground='#FFE0E0'
            border='#F8DDDD'
            icon={
              <AlertCircle
                size={20}
                color='#EF4444'
                strokeWidth={2}
              />
            }
          />
        </View>

        {/* SECCIÓN DE BÚSQUEDA DE PRÉSTAMOS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registro de préstamos</Text>
          <Text style={styles.sectionSubtitle}>
            Consulta y administra los préstamos registrados
          </Text>
        </View>

        {/* CAMPO DE BÚSQUEDA Y BOTÓN PARA LIMPIAR */}
        <View style={styles.searchContainer}>
          <Search
            size={19}
            color={COLORS.textTertiary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Buscar por solicitante, identificación...'
            placeholderTextColor={COLORS.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <XCircle
                size={18}
                color={COLORS.textTertiary}
              />
            </Pressable>
          )}
        </View>

        {/* FILTROS POR ESTADO DEL PRÉSTAMO */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <FilterButton
            label='Todos'
            value='TODOS'
            activeFilter={activeFilter}
            onPress={setActiveFilter}
          />
          <FilterButton
            label='Activos'
            value='ACTIVO'
            activeFilter={activeFilter}
            onPress={setActiveFilter}
          />
          <FilterButton
            label='Finalizados'
            value='FINALIZADO'
            activeFilter={activeFilter}
            onPress={setActiveFilter}
          />
          <FilterButton
            label='Vencidos'
            value='VENCIDO'
            activeFilter={activeFilter}
            onPress={setActiveFilter}
          />
        </ScrollView>

        {/* ENCABEZADO Y CONTADOR DE RESULTADOS */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Préstamos registrados</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{filteredLoans.length}</Text>
          </View>
        </View>

        {/* LISTADO DE PRÉSTAMOS Y ESTADO VACÍO */}
        {filteredLoans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Search
                size={28}
                color={COLORS.textTertiary}
              />
            </View>

            <Text style={styles.emptyTitle}>No se encontraron préstamos</Text>

            <Text style={styles.emptySubtitle}>
              Intenta cambiar tu búsqueda o seleccionar otro filtro.
            </Text>
          </View>
        ) : (
          filteredLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type FilterButtonProps = {
  label: string;
  value: FilterStatus;
  activeFilter: FilterStatus;
  onPress: (value: FilterStatus) => void;
};

function FilterButton({
  label,
  value,
  activeFilter,
  onPress,
}: FilterButtonProps) {
  // Identificar si el filtro está seleccionado
  const isActive = activeFilter === value;

  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
    >
      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

type LoanStatCardProps = {
  title: string;
  value: number;
  color: string;
  background: string;
  iconBackground: string;
  border: string;
  icon: React.ReactNode;
};

function LoanStatCard({
  title,
  value,
  color,
  background,
  iconBackground,
  border,
  icon,
}: LoanStatCardProps) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: background,
          borderColor: border,
        },
      ]}
    >
      {/* ICONO Y COLORES DE LA TARJETA */}
      <View style={[styles.statIconBox, { backgroundColor: iconBackground }]}>
        {icon}
      </View>

      {/* INFORMACIÓN DE LA ESTADÍSTICA */}
      <View style={styles.statInfo}>
        <Text
          style={[styles.statLabel, { color }]}
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

function LoanCard({ loan }: { loan: Loan }) {
  // Obtener los equipos asociados al número de préstamo
  const details = loanDetails.filter(
    (detail) => detail.loanNumber === loan.number,
  );

  // Identificar si el préstamo ya fue finalizado
  const isFinished = loan.status === 'FINALIZADO';

  return (
    <View style={styles.loanCard}>
      {/* NÚMERO Y ESTADO DEL PRÉSTAMO */}
      <View style={styles.loanCardHeader}>
        <View style={styles.loanNumberContainer}>
          <Text style={styles.loanNumberLabel}>PRÉSTAMO</Text>
          <Text style={styles.loanNumber}>N.{loan.number}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isFinished ? styles.finishedBadge : styles.activeBadge,
          ]}
        >
          {isFinished ? (
            <CheckCircle2
              size={13}
              color='#059669'
            />
          ) : (
            <Clock3
              size={13}
              color='#2563EB'
            />
          )}
          <Text
            style={[
              styles.statusText,
              isFinished ? styles.finishedText : styles.activeText,
            ]}
          >
            {loan.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* INFORMACIÓN DEL SOLICITANTE */}
      <View style={styles.applicantRow}>
        <View style={styles.applicantIcon}>
          <UserRound
            size={19}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.applicantInfo}>
          <Text style={styles.applicantName}>{loan.applicant}</Text>

          <Text style={styles.identification}>
            Identificación: {loan.identification}
          </Text>
        </View>
      </View>

      {/* FECHAS DEL PRÉSTAMO Y DEVOLUCIÓN */}
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <CalendarDays
            size={16}
            color={COLORS.textSecondary}
          />

          <View style={styles.dateInfo}>
            <Text style={styles.infoLabel}>Fecha de préstamo</Text>
            <Text style={styles.infoValue}>{loan.loanDate}</Text>
          </View>
        </View>

        <View style={styles.dateItem}>
          <Clock3
            size={16}
            color={COLORS.textSecondary}
          />

          <View style={styles.dateInfo}>
            <Text style={styles.infoLabel}>Devolver antes de</Text>
            <Text style={styles.infoValue}>{loan.returnBefore}</Text>
          </View>
        </View>
      </View>

      {/* ALERTA DE PRÉSTAMO VENCIDO */}
      {loan.overdue && (
        <View style={styles.overdueContainer}>
          <AlertCircle
            size={16}
            color='#EF4444'
          />
          <Text style={styles.overdueText}>
            Este préstamo se encuentra vencido
          </Text>
        </View>
      )}

      {/* EQUIPOS ASOCIADOS AL PRÉSTAMO */}
      <View style={styles.equipmentSection}>
        {/* ENCABEZADO DE EQUIPOS */}
        <View style={styles.equipmentHeader}>
          <Package
            size={17}
            color={COLORS.primary}
          />
          <Text style={styles.equipmentTitle}>Equipos asociados</Text>
        </View>

        {/* RESUMEN DE EQUIPOS: TOTAL, DEVUELTOS Y PENDIENTES */}
        <View style={styles.equipmentStats}>
          <EquipmentCount
            label='Total'
            value={loan.equipmentCount}
            color='#2949E8'
            background='#FAFBFF'
          />
          <EquipmentCount
            label='Devueltos'
            value={loan.returnedCount}
            color='#059669'
            background='#FAFDFB'
          />
          <EquipmentCount
            label='Pendientes'
            value={loan.pendingCount}
            color='#F59E0B'
            background='#FFFAF2'
          />
        </View>

        {/* DETALLE INDIVIDUAL DE EQUIPOS */}
        {details.map((detail) => (
          <View
            key={detail.id}
            style={styles.equipmentItem}
          >
            <View style={styles.equipmentItemInfo}>
              <Text style={styles.equipmentName}>{detail.equipment}</Text>

              <Text style={styles.equipmentCode}>
                Código: {detail.equipmentCode}
              </Text>

              {/* FECHA DE DEVOLUCIÓN, SI EXISTE */}
              {detail.returnDate && (
                <Text style={styles.returnDate}>
                  Devuelto: {detail.returnDate}
                </Text>
              )}

              {/* CONDICIÓN DEL EQUIPO */}
              {detail.condition && (
                <Text style={styles.conditionText}>
                  Condición: {detail.condition}
                </Text>
              )}
            </View>

            {/* ESTADO INDIVIDUAL DEL EQUIPO */}
            <View
              style={[
                styles.detailStatus,
                detail.situation === 'Devuelto'
                  ? styles.returnedBadge
                  : styles.pendingBadge,
              ]}
            >
              <Text
                style={[
                  styles.detailStatusText,
                  detail.situation === 'Devuelto'
                    ? styles.returnedText
                    : styles.pendingText,
                ]}
              >
                {detail.situation}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* INFORMACIÓN DEL REGISTRO Y OBSERVACIONES */}
      <View style={styles.footerInfo}>
        <Text style={styles.footerLabel}>Registró</Text>
        <Text style={styles.footerValue}>{loan.registeredBy}</Text>

        {/* MOSTRAR OBSERVACIONES SI EXISTEN */}
        {loan.observations.length > 0 && (
          <>
            <View style={styles.footerDivider} />
            <Text style={styles.footerLabel}>Observaciones</Text>
            <Text style={styles.footerValue}>{loan.observations}</Text>
          </>
        )}
      </View>
    </View>
  );
}

type EquipmentCountProps = {
  label: string;
  value: number;
  color: string;
  background: string;
};

function EquipmentCount({
  label,
  value,
  color,
  background,
}: EquipmentCountProps) {
  return (
    <View style={[styles.equipmentCount, { backgroundColor: background }]}>
      <Text style={[styles.equipmentCountValue, { color }]}>{value}</Text>

      <Text style={styles.equipmentCountLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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

  // CONTENIDO PRINCIPAL Y DISTRIBUCIÓN
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // TÍTULOS Y SUBTÍTULOS DE SECCIONES
  sectionHeader: {
    marginBottom: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // ICONOS Y TEXTOS
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },

  // CAMPO DE BÚSQUEDA
  searchContainer: {
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: COLORS.text,
    paddingVertical: 0,
  },

  // FILTROS POR ESTADO
  filtersContainer: {
    gap: 8,
    paddingBottom: 22,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.textWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.textWhite,
  },

  // ENCABEZADO
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    gap: 9,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  counterBadge: {
    backgroundColor: COLORS.filter,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // TARJETA DEL PRÉSTAMO
  loanCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 17,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  loanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loanNumberContainer: {
    gap: 3,
  },
  loanNumberLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textTertiary,
    letterSpacing: 1,
  },
  loanNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },

  // INDICADORES DE ESTADO DEL PRÉSTAMO
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  activeBadge: {
    backgroundColor: COLORS.filter,
  },
  finishedBadge: {
    backgroundColor: COLORS.successLight,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeText: {
    color: '#2563EB',
  },
  finishedText: {
    color: '#059669',
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.borderDark,
    marginVertical: 15,
  },

  // INFORMACIÓN DEL SOLICITANTE
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  applicantIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.filter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applicantInfo: {
    marginLeft: 11,
    flex: 1,
  },
  applicantName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  identification: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // FECHAS DEL PRÉSTAMO
  dateContainer: {
    gap: 13,
    marginBottom: 15,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateInfo: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },

  // PRÉSTAMOS VENCIDOS
  overdueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.errorLight,
    borderRadius: 9,
    padding: 11,
    marginBottom: 15,
  },
  overdueText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.error,
  },

  // SECCIÓN DE EQUIPOS
  equipmentSection: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 2,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 13,
  },
  equipmentTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },

  // RESUMEN DE CANTIDADES DE EQUIPOS
  equipmentStats: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 13,
  },
  equipmentCount: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },
  equipmentCountValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  equipmentCountLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  // DETALLE DEL EQUIPO
  equipmentItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 7,
  },
  equipmentItemInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  equipmentCode: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  returnDate: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  conditionText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },

  // ESTADOS DE DEVOLUCIÓN DE EQUIPOS
  detailStatus: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
  },
  returnedBadge: {
    backgroundColor: COLORS.successLight,
  },
  pendingBadge: {
    backgroundColor: COLORS.warningLight,
  },
  detailStatusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  returnedText: {
    color: COLORS.success,
  },
  pendingText: {
    color: COLORS.warning,
  },

  // REGISTRO Y OBSERVACIONES
  footerInfo: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginBottom: 3,
  },
  footerValue: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  footerDivider: {
    height: 8,
  },

  // MENSAJE CUANDO NO EXISTEN RESULTADOS
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 28,
    alignItems: 'center',
    marginTop: 5,
  },
  emptyIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: COLORS.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
  },

  // DISTRIBUCIÓN DE TARJETAS
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 25,
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
});
