import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Selector from '@/components/SettingsComponents/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '@/containers/Settings/SettingsScreen.style';
import { fetchAllData, Tables } from '@/utils/databases';
import { ListItemModel } from '@/utils/models';
import { useIsFocused } from '@react-navigation/native';
import SettingsItemList from '@/components/SettingsComponents/SettingsItemList';
import InfoTextField from '@/components/CreateNewRecord/InfoTextField/InfoTextField';
import { s } from '@/components/CreateNewRecord/InfoTextField/InfoTextField.style';
import Users from '@/components/SettingsComponents/Users';
import { Divider } from '@rneui/base';


export default function SettingsScreen({navigation}: any) {
	const {t, i18n} = useTranslation();
	const [selectedLanguageCode, setselectedLanguageCode] = useState(i18n.language);
	const [categories, setCategories] = useState<ListItemModel[]>([]);
	const [descriptions, setDescriptions] = useState<ListItemModel[]>([]);
	const [isLoading, setLoadData] = useState(true);
	const isFocused = useIsFocused();

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

		if ( isFocused || isLoading ) {
			getList().catch(err => console.log(err));
		}

	}, [isFocused, isLoading]);


	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
			style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ScrollView>
					<View style={{flex: 1, backgroundColor: '#fff', flexDirection: 'column'}}>
						<View style={styles.container}>
							<View style={styles.row}>
								<Text style={styles.title}>{t('common:languageSelector')}</Text>
								<MaterialIcons name="language" size={24} color="black"/>
							</View>
							<Selector onSelect={onSelectLanguage} code={selectedLanguageCode}/>
							{
								categories.length ? <>
									<View style={{...styles.row, marginTop: 30}}>
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
							<View style={{paddingBottom: 40}}>
								<Users/>
							</View>
						</View>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
