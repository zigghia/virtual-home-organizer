import { StyleSheet, View } from 'react-native';
import './src/constants/IMLocalize';
import CustomRootNavigator from '@/navigation/CustomRootNavigation';
import { useCallback, useEffect, useState } from 'react';
import { initDatabase, } from '@/utils/databases';
import * as SplashScreen from 'expo-splash-screen';
import { Text } from '@rneui/base';
import { useTranslation } from 'react-i18next';


SplashScreen.preventAutoHideAsync().catch((err) => console.log(err));


export default function App() {
	const [appIsReady, setAppIsReady] = useState({app: false, err: false});
	const [t] = useTranslation();


	useEffect(() => {
		const init = async () => {
			try {
				await initDatabase(t('common:defaultNickname'));
			} catch (err) {
				console.log('Error init database ', err);
				setAppIsReady({...appIsReady, err: true});
			} finally {
				setAppIsReady({...appIsReady, app: true});
			}
		}
		init();
	}, []);

	const onLayoutRootView = useCallback(async () => {

		if ( appIsReady.app ) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady.app]);


	if ( appIsReady.err ) {
		return <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignSelf: 'center', padding: 50}}>
			<Text style={{fontSize: 30, textAlign: 'center', fontWeight: 'bold'}}>Sorry...</Text>
			<Text style={{fontSize: 25, textAlign: 'center', paddingVertical: 10}}>App could not be initialised</Text>
		</View>
	}

	if ( !appIsReady.app ) {
		return;
	}
	return (
		<View style={styles.container} onLayout={onLayoutRootView}>
			<CustomRootNavigator/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		padding: 10,
	},
});
