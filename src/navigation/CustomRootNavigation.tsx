import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import HomeScreen from '@/containers/HomeScreen';
import SettingsScreen from '@/containers/Settings/SettingsScreen';
import { themeColors } from '@/constants/app.constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const Tab = createBottomTabNavigator();

export default function CustomRootNavigator() {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {

            let iconName = focused ? 'home' : 'home-outline';

              if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#A20373',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
          <Tab.Screen
              name='Home'
              component={HomeScreen}
              options={{ tabBarLabel: t('navigate:home') , tabBarBadge: 0, tabBarBadgeStyle: { backgroundColor: themeColors.secondary, color: 'white' } }}
          />
        <Tab.Screen
          name='Settings'
          component={SettingsScreen}
          options={{ tabBarLabel: t('navigate:settings') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
