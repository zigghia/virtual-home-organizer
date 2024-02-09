import React from 'react';
import { useTranslation } from 'react-i18next';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import SearchScreen from '@/containers/SearchScreen/SearchScreen';


export type CustomRootNavigatorParamList = {
	Search: undefined;
	Create: {imgUri: string} | undefined;
};


const Stack = createNativeStackNavigator<CustomRootNavigatorParamList>();
export default function HomeScreen() {
	const {t, i18n} = useTranslation();

	return (
		<>
			<Stack.Navigator>
				<Stack.Screen
					name='Search'
					component={SearchScreen}
					options={{ headerShown: true, title: t('common:route.search') }}
				/>

				<Stack.Screen
					name= 'Create'
					component={CreateEntryScreen}
					options={{ headerShown: true, title: t('common:route.create') }}
				/>

			</Stack.Navigator>
		</>
	);
}
