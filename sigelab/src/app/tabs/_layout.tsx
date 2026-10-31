import { COLORS } from '@/constants/colors';
import { Tabs } from 'expo-router';
import {
  ClipboardList,
  House,
  MonitorSmartphone,
  ScanLine,
  UserRound,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 62 + insets.bottom,
          paddingTop: 7,
          paddingBottom: insets.bottom + 5,
        },
        tabBarLabelStyle: {
          fontWeight: '500',
          fontSize: 11,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name='dashboard'
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <House
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='equipment'
        options={{
          title: 'Equipos',
          tabBarIcon: ({ color, size }) => (
            <MonitorSmartphone
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='scanner'
        options={{
          title: 'Escáner',
          tabBarIcon: ({ color, size }) => (
            <ScanLine
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='reports'
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => (
            <ClipboardList
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <UserRound
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
