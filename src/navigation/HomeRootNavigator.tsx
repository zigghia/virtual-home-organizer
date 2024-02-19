import React from 'react';
import { useTranslation } from 'react-i18next';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import { themeColors } from '@/constants/app.constants';
import { View } from 'react-native';
import MainScreen from '@/containers/MainScreen';
import RecordDataProvider from '@/context/StaticDataContext';


export type CustomRootNavigatorParamList = {
	Search: undefined;
	Create: { imgUri: string } | undefined;
};


const Stack = createNativeStackNavigator<CustomRootNavigatorParamList>();
export default function HomeRootNavigator() {
	const {t} = useTranslation();

	return (
		<Stack.Navigator screenOptions={{
			headerTintColor: themeColors.header
		}}>
			<Stack.Screen
				name='Search'
				component={MainScreen}
				options={{headerShown: true, title: t('common:route.search')}}
			/>


			<Stack.Screen
				name='Create'
				options={{headerShown: true, title: t('common:route.create')}}
			>
				{(props) => {
					return (
						<RecordDataProvider>
							<CreateEntryScreen {...props}/>
						</RecordDataProvider>)
				}}
			</Stack.Screen>
		</Stack.Navigator>
	);
}
