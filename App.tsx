import { StyleSheet, View } from 'react-native';
import './src/constants/IMLocalize';
import CustomRootNavigator from '@/navigation/CustomRootNavigation';
import 'intl-pluralrules';
import { useEffect, useState } from 'react';
import { fetchAllData, initDatabase, Tables } from '@/utils/databases';
import * as SplashScreen from 'expo-splash-screen';
import { Text } from '@rneui/base';
import { useTranslation } from 'react-i18next';


SplashScreen.preventAutoHideAsync()
	.then((result) => {})
	.catch(console.warn);


export default function App() {
	const [appIsReady, setAppIsReady] = useState(false);
	const [t] = useTranslation();

	const init = async () => {
		await SplashScreen.preventAutoHideAsync();

	    initDatabase(t('common:defaultNickname'))
			.then((value) => {
                setAppIsReady(true);
				SplashScreen.hideAsync();

			})
			.catch((err) => {
               console.log('Error init database ', err);
				SplashScreen.hideAsync();
			})
	}

	useEffect(() => {
		init();
	}, []);

    return (
        appIsReady ?
            <View style={styles.container}>
                    <CustomRootNavigator/>
            </View>
			:
			<View style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignSelf: 'center', padding:50}}>
				<Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold'}}>Sorry...</Text>
				<Text style={{ fontSize: 25, textAlign: 'center', paddingVertical: 10}}>App could not be initialised</Text>
			</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		padding: 10,
	},
});
