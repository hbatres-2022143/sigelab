import { COLORS } from '@/constants/colors';
import {
  Equipment,
  EquipmentCategory,
  equipmentData,
  EquipmentStatus,
} from '@/data/equipment';
import { router } from 'expo-router';
import {
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Categorías disponibles para filtrar los equipos.
const categories = [
  'Todos',
  'Cámara',
  'Laptop',
  'Proyector',
  'Router',
  'Switch',
  'Tablet',
  'Monitor',
  'Kit electrónico',
] as const;

// Tipo de dato para las categorías seleccionables.
type CategoryFilter = (typeof categories)[number];

// Estados disponibles para filtrar el inventario.
const statuses: Array<'Todos' | EquipmentStatus> = [
  'Todos',
  'Disponible',
  'En préstamo',
  'Dañado',
  'En mantenimiento',
];

// Obtiene los colores correspondientes al estado del equipo.
function getStatusStyle(status: EquipmentStatus) {
  switch (status) {
    case 'Disponible':
      return {
        backgroundColor: COLORS.successLight,
        color: COLORS.success,
      };

    case 'En préstamo':
      return {
        backgroundColor: COLORS.primaryLight,
        color: COLORS.primary,
      };

    case 'Dañado':
      return {
        backgroundColor: COLORS.errorLight,
        color: COLORS.error,
      };

    case 'En mantenimiento':
      return {
        backgroundColor: COLORS.warningLight,
        color: COLORS.warning,
      };
  }
}

// Muestra la información principal de cada equipo,
// incluyendo imagen, nombre, código y estado actual.
function EquipmentCard({
  item,
  selected,
  onPress,
}: {
  item: Equipment;
  selected: boolean;
  onPress: () => void;
}) {
  // Obtiene los colores según el estado del equipo.
  const statusStyle = getStatusStyle(item.status);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.equipmentCard,
        selected && styles.selectedCard,
        pressed && styles.cardPressed,
      ]}
    >
      {/* IMAGEN DEL EQUIPO */}
      <View style={styles.equipmentImage}>
        <Image
          source={item.image}
          style={styles.productImage}
          resizeMode='contain'
          accessibilityLabel={item.name}
        />
      </View>

      {/* INFORMACIÓN DEL EQUIPO */}
      <View style={styles.equipmentInfo}>
        <Text
          style={styles.equipmentName}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={styles.equipmentCode}>{item.code}</Text>
        {/* INDICADOR DEL ESTADO */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* ICONO DE NAVEGACIÓN */}
      <ChevronRight
        size={21}
        color={COLORS.icon}
      />
    </Pressable>
  );
}
export default function Devices() {
  // Controla el texto ingresado en el buscador.
  const [searchText, setSearchText] = useState('');

  // Categoría seleccionada para filtrar los equipos.
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>('Todos');

  // Estado seleccionado para filtrar el inventario.
  const [selectedStatus, setSelectedStatus] = useState<
    'Todos' | EquipmentStatus
  >('Todos');

  // Controla la visibilidad del panel de filtros.
  const [showFilters, setShowFilters] = useState(false);

  // Almacena el identificador del equipo seleccionado.
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(
    null,
  );
  // Filtra los equipos según el texto de búsqueda,
  // la categoría y el estado seleccionado.
  // useMemo evita recalcular la lista si no cambian los filtros.
  const filteredEquipment = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return equipmentData.filter((item) => {
      // Busca coincidencias por nombre, código o ID.
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      // Comprueba si el equipo pertenece a la categoría seleccionada.
      const matchesCategory =
        selectedCategory === 'Todos' ||
        item.category === (selectedCategory as EquipmentCategory);
      // Comprueba si coincide con el estado seleccionado.
      const matchesStatus =
        selectedStatus == 'Todos' || item.status === selectedStatus;
      // Devuelve únicamente los equipos que cumplen los filtros.
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchText, selectedCategory, selectedStatus]);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      {/* ENCABEZADO DE LA PANTALLA */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equipos</Text>

        <Text style={styles.headerSubtitle}>
          Consulta el inventario del laboratorio
        </Text>
      </View>

      {/* CONTENIDO PRINCIPAL DEL INVENTARIO */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps='handled'
        showsHorizontalScrollIndicator={false}
      >
        {/* BUSCADOR Y BOTÓN DE FILTROS */}
        <View style={styles.searchRow}>
          {/* CAMPO DE BÚSQUEDA */}
          <View style={styles.searchBox}>
            <Search
              size={18}
              color={COLORS.textPrimary}
            />

            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder='Busca equipo, código o modelo...'
              placeholderTextColor={COLORS.textTertiary}
              returnKeyType='search'
              autoCapitalize='none'
              autoCorrect={false}
              accessibilityLabel='Buscar equipos'
            />

            {/* BOTÓN PARA LIMPIAR LA BÚSQUEDA */}
            {searchText.length > 0 && (
              <Pressable
                onPress={() => setSearchText('')}
                hitSlop={8}
                accessibilityLabel='limpiar búsqueda'
              >
                <X
                  size={17}
                  color={COLORS.textSecondary}
                />
              </Pressable>
            )}
          </View>

          {/* BOTÓN PARA MOSTRAR U OCULTAR FILTROS */}
          <Pressable
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
            accessibilityLabel='Mostrar filtros por estado'
          >
            {showFilters ? (
              <SlidersHorizontal
                size={20}
                color={COLORS.primary}
              />
            ) : (
              <Filter
                size={20}
                color={COLORS.primary}
              />
            )}
          </Pressable>
        </View>

        {/* FILTROS POR CATEGORÍA */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* PANEL DE FILTROS POR ESTADO */}
        {showFilters && (
          <View style={styles.filterPanel}>
            {/* ENCABEZADO Y RESTABLECIMIENTO DE FILTROS */}
            <View style={styles.filterPanelHeader}>
              <Text style={styles.filterPanelTitle}>Filtrar por estado</Text>

              <Pressable
                onPress={() => {
                  setSelectedStatus('Todos');
                  setSelectedCategory('Todos');
                  setSearchText('');
                }}
              >
                <Text style={styles.clearFilters}>Limpiar</Text>
              </Pressable>
            </View>

            {/* OPCIONES DE ESTADO */}
            <View style={styles.statusFilters}>
              {statuses.map((status) => {
                const active = selectedStatus === status;

                return (
                  <Pressable
                    key={status}
                    onPress={() => setSelectedStatus(status)}
                    style={[
                      styles.statusFilterChip,
                      active && styles.statusFilterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusFilterText,
                        active && styles.statusFilterTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ENCABEZADO Y CONTADOR DE RESULTADOS */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Inventario</Text>

          <Text style={styles.resultsCount}>
            {filteredEquipment.length}{' '}
            {filteredEquipment.length === 1 ? 'equipo' : 'equipos'}
          </Text>
        </View>

        {/* LISTADO DE EQUIPOS */}
        <View style={styles.equipmentList}>
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              item={item}
              selected={selectedEquipmentId === item.id}
              onPress={() => {
                // Navega al detalle del equipo seleccionado.
                router.push({
                  pathname: '/equipment_details',
                  params: { id: item.id },
                });
              }}
            />
          ))}
        </View>

        {/* ESTADO VACÍO CUANDO NO EXISTEN RESULTADOS */}
        {filteredEquipment.length === 0 && (
          <View style={styles.emptyState}>
            {/* ICONO INFORMATIVO */}
            <Search
              size={55}
              color={COLORS.textTertiary}
            />

            <Text style={styles.emptyTitle}>No encontramos equipos</Text>

            <Text style={styles.emptyDescription}>
              Prueba con otro nombre, código o filtro.
            </Text>

            {/* BOTÓN PARA RESTABLECER LA BÚSQUEDA */}
            <Pressable
              onPress={() => {
                setSearchText('');
                setSelectedCategory('Todos');
                setSelectedStatus('Todos');
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>
                Mostrar todos los equipos
              </Text>
            </Pressable>
          </View>
        )}
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
    paddingTop: 10,
    paddingBottom: 22,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  searchBox: {
    flex: 1,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 11,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    color: COLORS.text,
    fontWeight: '500',
    fontSize: 12,
  },

  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.filter,
    borderRadius: 20,
  },

  filterButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },

  categoryList: {
    gap: 6,
    paddingTop: 10,
    paddingBottom: 12,
  },

  categoryChip: {
    minHeight: 30,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: COLORS.filter,
    borderRadius: 18,
  },

  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },

  categoryText: {
    color: COLORS.navy,
    fontWeight: '400',
    fontSize: 10,
  },

  categoryTextActive: {
    color: COLORS.textWhite,
  },

  filterPanel: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
  },

  filterPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  filterPanelTitle: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 13,
  },

  clearFilters: {
    color: COLORS.primary,
    fontWeight: '400',
    fontSize: 12,
  },

  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  statusFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
  },

  statusFilterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  statusFilterText: {
    color: COLORS.textSecondary,
    fontWeight: '400',
    fontSize: 10,
  },

  statusFilterTextActive: {
    color: COLORS.textWhite,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  resultsTitle: {
    color: COLORS.navy,
    fontWeight: '600',
    fontSize: 14,
  },

  resultsCount: {
    color: COLORS.textSecondary,
    fontWeight: '400',
    fontSize: 11,
  },

  equipmentList: {
    gap: 5,
  },

  equipmentCard: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
  },

  // Apariencia de la tarjeta seleccionada.
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundSelected,
  },

  // Efecto visual al presionar una tarjeta.
  cardPressed: {
    opacity: 0.78,
  },

  equipmentImage: {
    width: 51,
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F5FC',
    borderRadius: 9,
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  equipmentInfo: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
    gap: 2,
  },

  equipmentName: {
    maxWidth: '100%',
    color: COLORS.navy,
    fontWeight: '600',
    fontSize: 14,
  },

  equipmentCode: {
    color: COLORS.textSecondary,
    fontWeight: '400',
    fontSize: 10,
  },

  statusBadge: {
    marginTop: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  statusText: {
    fontWeight: '500',
    fontSize: 10,
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 42,
    gap: 10,
  },

  emptyTitle: {
    color: COLORS.navy,
    fontWeight: '700',
    fontSize: 16,
  },

  emptyDescription: {
    color: COLORS.textSecondary,
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
  },

  resetButton: {
    marginTop: 7,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  resetButtonText: {
    color: COLORS.textWhite,
    fontWeight: '500',
    fontSize: 12,
  },
});
