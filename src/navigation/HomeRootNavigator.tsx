import React from 'react';
import { useTranslation } from 'react-i18next';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import { themeColors } from '@/constants/app.constants';
import MainScreen from '@/containers/MainScreen';
import { RecordModelExtended } from '@/utils/models';


export type CustomRootNavigatorParamList = {
	Search: undefined;
	Record: { edit: RecordModelExtended } | undefined;
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
				name='Record'
				component={CreateEntryScreen}
				options={{headerShown: true, title: t('common:route.create')}}
			/>
		</Stack.Navigator>
	);
}
