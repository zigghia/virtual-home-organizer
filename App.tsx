import { StyleSheet, View } from 'react-native';
import './src/constants/IMLocalize';
import { useCallback, useEffect, useState } from 'react';
import { initDatabase, resetDataBase, } from '@/utils/databases';
import * as SplashScreen from 'expo-splash-screen';
import { Text } from '@rneui/base';
import { useTranslation } from 'react-i18next';
import RecordDataProvider from '@/context/StaticDataContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from '@/navigation/AppNavigator';


SplashScreen.preventAutoHideAsync().catch((err) => console.log(err));


export default function App() {
	const [appIsReady, setAppIsReady] = useState({app: false, err: false});
	const [t] = useTranslation();


	useEffect(() => {
		const init = async () => {
			try {
				//await resetDataBase();
				await initDatabase(t('common:defaultNickname'));
				let k = await AsyncStorage.getItem('vho-settings-other');
				if ( k === null ) {
					const k = {location: true, categories: true, users: true, season: true};
					await AsyncStorage.setItem('vho-settings-other', JSON.stringify(k));
				}
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
		<ActionSheetProvider>
			<RecordDataProvider>
				<View style={styles.container} onLayout={onLayoutRootView}>
					<AppNavigator/>
				</View>
			</RecordDataProvider>
		</ActionSheetProvider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		padding: 0,
	},
});
