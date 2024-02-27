import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import SettingsScreen from '@/containers/Settings/SettingsScreen';
import { themeColors } from '@/constants/app.constants';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';
import MainScreen from '@/containers/MainScreen';
import commonStyle from '@/utils/common.style';
import { RecordModel } from '@/utils/models';


const shoeIcon = require('./../assets/high-heels.png');
export const Tab = createBottomTabNavigator();

function TheTabBar({state, descriptors, navigation}: BottomTabBarProps) {
	return (
		<View style={{flexDirection: 'row'}}>
			{state.routes.map((route, index) => {
				const {options} = descriptors[route.key];
				const label = options.tabBarLabel !== undefined
					? options.tabBarLabel
					: options.title !== undefined
						? options.title
						: route.name ?? '';

				const isFocused = state.index === index;
				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if ( !isFocused && !event.defaultPrevented ) {
						navigation.navigate(route.name, {edit: null});
					}
				};

				return (
					<View
						key={'tabbar' + index}
						accessibilityRole="button"
						accessibilityState={isFocused ? {selected: true} : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						style={[{
							backgroundColor: themeColors.disabled,
							flex: 1,
							padding: 20, justifyContent: 'center', alignItems: 'center'
						}
						]}
					>
						{route.name == 'Record' ?
							<View style={s.bottomBarContainerAdd}>
								<View style={{...s.bottomBarAdd, backgroundColor: isFocused ? themeColors.disabled : themeColors.primary}}>
									<TouchableOpacity onPress={onPress} disabled={isFocused}>
										<Image source={shoeIcon} style={{height: 50, width: 50}} tintColor={'white'}/>
									</TouchableOpacity>
								</View>
							</View>
							: <TouchableOpacity style={{alignItems: 'center'}} onPress={onPress} disabled={isFocused}>
								<Ionicons name={route.name == 'Main' ? 'home' : 'settings'}
										  size={24}
										  color={isFocused ? options.tabBarActiveTintColor : options.tabBarInactiveTintColor}/>
								<Text style={{color: isFocused ? themeColors.secondary : themeColors.header}}>{label}</Text>
							</TouchableOpacity>
						}
					</View>
				);
			})}
		</View>
	);
}

export default function AppNavigator() {
	const {t} = useTranslation();

	return (
		<NavigationContainer>
			<Tab.Navigator
				tabBar={(props) => <TheTabBar {...props}/>}
				screenOptions={({route}) => ({
					tabBarActiveTintColor: themeColors.secondary,
					tabBarInactiveTintColor: themeColors.header,
					headerStyle: {backgroundColor: themeColors.primary, borderWidth: 1, borderBottomColor: themeColors.primary},
					headerShadowVisible: false,
					headerTransparent: false,
					headerTitleStyle: {color: 'white'},
					headerShown: true
				})}
			>
				<Tab.Screen
					name='Main'
					component={MainScreen}
					options={{
						tabBarLabel: t('navigate:home'),
						headerStyle: {backgroundColor: themeColors.primary},
						headerShown: true, title: t('common:route.search')
					}
					}
				/>
				<Tab.Screen
					name='Record'
					options={{
						headerStyle: {backgroundColor: themeColors.primary},
						headerShown: true,
						title: t('navigate:record')
					}}
					component={CreateEntryScreen}
				/>
				<Tab.Screen
					name='Settings'
					component={SettingsScreen}
					options={{
						tabBarLabel: t('navigate:settings'),
						title: t('common:route.settings')
					}
					}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}


export const s = StyleSheet.create({
	bottomBarAdd: {
		width: 80, height: 80, bottom: 20,
		justifyContent: 'center', alignItems: 'center', borderRadius: 100,
		...commonStyle.shadow
	},
	bottomBarContainerAdd: {
		position: 'absolute',
		bottom: 10,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100
	}
});
