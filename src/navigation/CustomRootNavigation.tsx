import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import HomeRootNavigator from './HomeRootNavigator';
import SettingsScreen from '@/containers/Settings/SettingsScreen';
import { themeColors } from '@/constants/app.constants';
import RecordDataProvider from '@/context/StaticDataContext';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';

export const Tab = createBottomTabNavigator();
type icon = 'home' | 'home-outline' | 'settings' | 'settings-outline';
export default function CustomRootNavigator() {
	const {t} = useTranslation();
	return (
		<NavigationContainer>
			<Tab.Navigator screenOptions={({route}) => ({
				tabBarIcon: ({focused, color, size}) => {

					let iconName = focused ? 'home' : 'home-outline';

					if ( route.name === 'Settings' ) {
						iconName = focused ? 'settings' : 'settings-outline';
					}

					return <Ionicons name={iconName as icon} size={size} color={color}/>;
				},
				tabBarActiveTintColor: themeColors.primary,
				tabBarInactiveTintColor: themeColors.darkGrey,
				headerShown: false
			})}
			>
				<Tab.Screen
					name='Home'
					component={HomeRootNavigator}
					options={{tabBarLabel: t('navigate:home'), tabBarBadge: 0, tabBarBadgeStyle: {backgroundColor: themeColors.secondary, color: 'white'}}}
				/>
				<Tab.Screen
					name='Settings'
					component={SettingsScreen}
					options={{tabBarLabel: t('navigate:settings')}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}
