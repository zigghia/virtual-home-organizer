import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import SettingsScreen from '@/containers/Settings/SettingsScreen';
import { themeColors } from '@/constants/app.constants';
import { RecordsNumberContext } from '@/context/StaticDataContext';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';
import MainScreen from '@/containers/MainScreen';
import commonStyle from '@/utils/common.style';

const  shoeIcon = require( './../assets/shoeIcon1.png');

//console.log(shoeIcon);

export const Tab = createBottomTabNavigator();
type icon = 'home' | 'home-outline' | 'settings' | 'settings-outline';

const icons = {
	Main: ['home', 'home-outline'],
	Settings: ['settings', 'settings-outline'],
	Record: ['footsteps', 'footsteps-outline']
};

function MyTabBar({state, descriptors, navigation}) {
	return (
		<View style={{flexDirection: 'row'}}>
			{state.routes.map((route, index) => {
				const {options} = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
							? options.title
							: route.name;

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
							<View  style={{
								 position: 'absolute', bottom: 2, flex: 1,
								justifyContent: 'center', alignItems: 'center', borderRadius: 100
							}}>
								<View style={{
									backgroundColor: isFocused ? themeColors.disabled :themeColors.primary,
									width: 80, height: 80, bottom: 20,
									justifyContent: 'center', alignItems: 'center', borderRadius: 3,
								    ...commonStyle.shadow
								}}>
									<TouchableOpacity  onPress={onPress} disabled = {isFocused}>
									{/*<Ionicons name={'footsteps-outline'} size={24} color={'white'}/>*/}
										<Image source={shoeIcon} style={{height: 50, width: 50}} tintColor={'white'}/>
									</TouchableOpacity>
								</View>
							</View>
							: <TouchableOpacity style={{ alignItems: 'center'}} onPress={onPress}>
								<Ionicons name={icons[route.name][0]} size={24} color={isFocused ? options.tabBarActiveTintColor : options.tabBarInactiveTintColor}/>
								<Text style={{color: isFocused ? themeColors.primary : themeColors.header}}>
									{label}
								</Text>
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
		const [total, setTotal] = useState(0);

		const setTotalValue = (total: number) => {
			setTotal(total);
		}

		return (
			<RecordsNumberContext.Provider value={{total, setTotal: setTotalValue}}>
				<NavigationContainer>
					<Tab.Navigator
						tabBar={(props) => <MyTabBar {...props}/>}
						screenOptions={({route}) => ({
							tabBarActiveTintColor: themeColors.primary,
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
								headerShown: true, title: t('common:route.search')}
						    }
						/>
						<Tab.Screen
							name='Record'
							component={CreateEntryScreen}
							options={{}}
						/>
						<Tab.Screen
							name='Settings'
							component={SettingsScreen}
							options={{
								tabBarLabel: t('navigate:settings'),
								 title: t('common:route.settings')}
							}
						/>
					</Tab.Navigator>
				</NavigationContainer>
			</RecordsNumberContext.Provider>
		);
	}
