import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text,  TouchableWithoutFeedback, View } from 'react-native';
import Selector from '@/components/SettingsComponents/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '@/containers/Settings/SettingsScreen.style';
import { ListItemModel, otherSettingsKeys, OtherSettingsProps } from '@/utils/models';
import { useIsFocused } from '@react-navigation/native';
import SettingsItemList from '@/components/SettingsComponents/SettingsItemList';
import UserComponents from '@/components/SettingsComponents/UserComponents';
import { Divider } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from '@/context/StaticDataContext';
import { Switch } from '@rneui/themed';
import Animated, { FadeIn } from 'react-native-reanimated';

import { themeColors } from '@/constants/app.constants';

export default function SettingsScreen({navigation}: any) {
	const {t, i18n} = useTranslation();
	const {loadConfigData, data} = useContext(DataContext)!;
	const [loading, setLoading] = useState(true);
	const [selectedLanguageCode, setselectedLanguageCode] = useState(i18n.language);
	const [categories, setCategories] = useState<ListItemModel[]>([]);
	const [other, setOtherSettings] = useState<OtherSettingsProps>({});
	const updateOther = useCallback(async (key: keyof OtherSettingsProps, value: boolean) => {
		const obj = {...other, [key]: value};
		await AsyncStorage.setItem('vho-settings-other', JSON.stringify(obj));
		setOtherSettings(obj);
	}, [other]);
	const isFocused = useIsFocused();

	const onSelectLanguage = (code: string) => {
		i18n.changeLanguage(code);
		setselectedLanguageCode(code);
		navigation.navigate('Main', {screen: 'Main'});
	}


	useEffect(() => {
		setLoading(true);
		const setOtherSettingsValues = async () => {
			try {
				let k = await AsyncStorage.getItem('vho-settings-other');
				if ( k === null ) {
					setOtherSettings({location: true, users: true, categories: true, season: true});
				} else {
					setOtherSettings(JSON.parse(k));
				}

			} catch (err) {
				throw err;
			}
		}


		setOtherSettingsValues().catch(err => console.log('read storage for others keys', err));
		setTimeout(() => {setLoading(false)}, 100);

	}, [isFocused]);

	useEffect(() => {
		setCategories(data.categories.filter(c => c.deletable));
	}, [isFocused, data.categories, data.descriptions])

    if (loading) {
		return null;
	}
	return (
		<Animated.View>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ScrollView>
					<View style={{flex: 1, backgroundColor: '#fff', flexDirection: 'column'}}>
						<View style={styles.container}>
							<View style={styles.row}>
								<Text style={styles.title}>{t('common:languageSelector')}</Text>
								<MaterialIcons name="language" size={24} color="black"/>
							</View>
							<Selector onSelect={onSelectLanguage} code={selectedLanguageCode}/>
							<Divider style={{marginVertical: 20}}/>
							{
								categories.length ? <>
									<View style={styles.row}>
										<Text style={styles.title}>{t('settings:categories.title')}</Text>
										<MaterialIcons name="category" size={24} color="black"/>
									</View>
									<SettingsItemList items={categories} type={'categories'} deleted={loadConfigData}/>
									<Divider/>
								</> : null
							}
							{
								data.descriptions.length ? <>
									<View style={styles.row}>
										<Text style={styles.title}>{t('settings:descriptions.title')}</Text>
										<MaterialIcons name="blinds-closed" size={24} color="black"/>
									</View>
									<SettingsItemList items={data.descriptions} deleted={loadConfigData} type={'descriptions'}/>
									<Divider/>
								</> : null
							}
							<View style={styles.row}>
								<Text style={styles.title}>{t('settings:users.title')}</Text>
								<MaterialIcons name="supervised-user-circle" size={24} color="black"/>
							</View>
							<UserComponents/>
							<Divider style={{marginVertical: 20}}/>
							<View style={styles.row}>
								<Text style={styles.title}>{t('settings:other.title')}</Text>
								<MaterialIcons name="auto-stories" size={24} color="black"/>
							</View>
							<View style={{paddingBottom: 100}}>
								{
									(Object.keys(other) ?? [])
										.map((key, index) =>
											<View key={'checkboxOther' + index}
												  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10}}>
												<Switch
													color={themeColors.secondary}
													value={other?.[key as otherSettingsKeys] ?? false}
													onValueChange={(value) => updateOther(key as otherSettingsKeys, value)}
												/>
												<View style={{flex: 1, marginLeft: 5}}>
													<Text> {t(`settings:other.${key}`)}</Text>
												</View>
											</View>)
								}
							</View>
						</View>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</Animated.View>
	);
}
