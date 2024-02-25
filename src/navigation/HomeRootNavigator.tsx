import React from 'react';
import { useTranslation } from 'react-i18next';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import MainScreen from '@/containers/MainScreen';
import { RecordModelExtended } from '@/utils/models';
import { useTheme } from '@rneui/themed';


export type CustomRootNavigatorParamList = {
	Main?: undefined;
	Record?: { edit: RecordModelExtended } | undefined;
};


const Stack = createNativeStackNavigator<CustomRootNavigatorParamList>();
export default function HomeRootNavigator() {
	const {t} = useTranslation();
	const { theme, updateTheme } = useTheme();

	return (
		<Stack.Navigator screenOptions={{
			headerTintColor: theme.colors.grey2,
		}}>
			<Stack.Screen
				name='Search'
				component={MainScreen}
				options={{
					contentStyle: {backgroundColor: 'white'},
					headerStyle: {backgroundColor: theme.colors.primary},
					headerShown: true, title: t('common:route.search')}}
			/>


			<Stack.Screen
				name='Record'
				component={CreateEntryScreen}
				options={{headerShown: true, title: t('common:route.create')}}
			/>
		</Stack.Navigator>
	);
}
