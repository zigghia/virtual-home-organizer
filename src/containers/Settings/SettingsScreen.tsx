import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Selector from '@/components/SettingsComponents/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '@/containers/Settings/SettingsScreen.style';
import { fetchAllData, Tables } from '@/utils/databases';
import { ListItemModel, otherSettingsKeys, otherSettingsProps } from '@/utils/models';
import { useIsFocused } from '@react-navigation/native';
import SettingsItemList from '@/components/SettingsComponents/SettingsItemList';
import Users from '@/components/SettingsComponents/Users';
import { Divider } from '@rneui/base';
import SettingsCheckbox from '@/components/SettingsComponents/SettingsCheckbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({navigation}: any) {
	const {t, i18n} = useTranslation();
	const [selectedLanguageCode, setselectedLanguageCode] = useState(i18n.language);
	const [categories, setCategories] = useState<ListItemModel[]>([]);
	const [descriptions, setDescriptions] = useState<ListItemModel[]>([]);
	const [isLoading, setLoadData] = useState(true);
	const [other, setOtherSettings] = useState<otherSettingsProps>({});
	const isFocused = useIsFocused();
	const updateOther = useCallback(async  (key: keyof otherSettingsProps, value: boolean) => {
		const obj = {...other, [key]: value};
		await AsyncStorage.setItem('vho-settings-other', JSON.stringify(obj));
		setOtherSettings(obj);
	}, [other]);

	const onSelectLanguage = (code: string) => {
		i18n.changeLanguage(code);
		setselectedLanguageCode(code);
		navigation.navigate('Home', {screen: 'Search'});
	}


	useEffect(() => {
		const getList = async () => {
			const {rows} = await fetchAllData(Tables.PROPERTIES, ` WHERE lang = ? and json_extract(properties,'$.deletable')=true`,
				[i18n.language]);
			const {_array} = rows ?? [];

			setCategories(_array.filter(record => record.type == 'category'));
			setDescriptions(_array.filter(record => record.type == 'description'));
			setLoadData(false);
		}

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

		if ( isFocused || isLoading ) {
			getList().catch(err => console.log(err));
			setOtherSettingsValues().catch(err => console.log('read storage for others keys', err));
		}

	}, [isFocused, isLoading]);


	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}>
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
									<SettingsItemList items={categories} type={'categories'} deleted={(value: boolean) => setLoadData(value)}/>
									<Divider/>
								</> : null
							}
							{
								descriptions.length ? <>
									<View style={styles.row}>
										<Text style={styles.title}>{t('settings:descriptions.title')}</Text>
										<MaterialIcons name="blinds-closed" size={24} color="black"/>
									</View>
									<SettingsItemList items={descriptions} deleted={(value: boolean) => setLoadData(value)} type={'descriptions'}/>
									<Divider/>
								</> : null
							}
							<View style={styles.row}>
								<Text style={styles.title}>{t('settings:users.title')}</Text>
								<MaterialIcons name="supervised-user-circle" size={24} color="black"/>
							</View>
							<Users/>
							<Divider style={{marginVertical: 20}}/>
							<View style={styles.row}>
								<Text style={styles.title}>{t('settings:other.title')}</Text>
								<MaterialIcons name="auto-stories" size={24} color="black"/>
							</View>
							<View style={{paddingBottom: 100}}>
								{
									(Object.keys(other) ?? [])
										.map((key, index) =>
											<View  key={'checkboxOther'+index}
											        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
												   <SettingsCheckbox id={index}
																  name = ''
																  onValueChange={(value) => updateOther(key as otherSettingsKeys, value)}
																  value={other?.[key as otherSettingsKeys] ?? false}/>
													<View style={{flex: 1}}>
														 <Text> {t(`settings:other.${key}`)}</Text>
													</View>
											</View>)
								}

							</View>
						</View>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
