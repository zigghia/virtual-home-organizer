import React, { useContext, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import withModal from '@/hoc/withModal';
import InfoTextFieldComponent from '@/components/CreateNewRecord/InfoTextFieldComponent';
import Button from '@/components/Button/Button';
import { useTranslation } from 'react-i18next';
import { appConstants, themeColors, themeDefaults } from '@/constants/app.constants';
import { SQLResultSet } from 'expo-sqlite';
import { fetchAllData, insertProperty, Tables } from '@/utils/databases';
import Fade from '@/components/Animations/Fade';
import { DataContext } from '@/context/StaticDataContext';

interface CreateNewPropertyProps {
	saveData: ({}) => void,
	closeModal: () => void,
	for: string
}

const CreateNewPropertyComponent = (props: CreateNewPropertyProps) => {
	const [data, setData] = useState<string>('');
	const {t, i18n} = useTranslation();
	const [warning, setWaring] = useState(false);
	const {loadConfigData} = useContext(DataContext)!;

	const insertNewProperty = () => {
		const insert = async () => {
			//check if property exists (by name')
			const type = props.for == 'categories' ? 'category' : 'description';
			const {rows}: SQLResultSet = await fetchAllData(Tables.PROPERTIES, ` WHERE lang=? and name= ? and type='${type}'`, [i18n.language, data as string])
			if ( rows.length ) {
				setWaring(true);
				setTimeout(() => {
					setWaring(false);
				}, 2000);
				return;
			}
			const {insertId}: SQLResultSet = await insertProperty(data as string, i18n.language, type);
			await loadConfigData();
			props.saveData({insertId, value: data});

		}
		insert().catch(err => {
			alert(t('common:defaultDBError', {code: '002'}));
			console.log(err);
		});

	};

	const setProperty = (value: unknown) =>  {
		setData( '' + (value ?? ''));
	}

	const max = props.for == 'categories' ? appConstants.maxLocationsAllowed : appConstants.maxLocationsAllowed;

	return (<View style={{ paddingHorizontal: 10, flex: 1}}>
			<TouchableWithoutFeedback
				onPress={(event) => {
					Keyboard.dismiss();
				}}>
				<View style={{flex:1, paddingBottom: 30}}>
					<Text style={st.title}>
						{t(`createEntry:${props.for}.createNewTitle`)}
					</Text>
					<Text style={st.subtitle}>
						{t(`createEntry:${props.for}.createNewSubtitle`, {max: props.for == 'categories' ? appConstants.maxCategoryCharsAllowed: appConstants.maxLocationsAllowed})}
					</Text>
					<Fade isVisible={warning}>
						<View style={{padding: 10}}>
							<Text style={{color: themeColors.error}}>{t(`createEntry:${props.for}.addWarning`)}</Text>
						</View>
					</Fade>
					<InfoTextFieldComponent
						value = {data ?? ''}
						onValueSaved={setProperty}
						maxLen={{message: t('common:errors.maxLen',  {max: max}), value: max}}
						isRequired={{message: t('common:errors.required')}}/>

					<Button buttonStyle={{maxHeight: 60}}  text={t('common:save')} onPress={insertNewProperty} disabled={!data}/>

				</View>
			</TouchableWithoutFeedback>

		</View>
	);
}

const st = StyleSheet.create({
	title: {
		fontSize: themeDefaults.fontHeader3,
		color: themeColors.header,
		lineHeight: 22,
		textTransform: 'uppercase',
		alignSelf: 'center'
	},
	subtitle: {
		marginVertical: 20,
		lineHeight: 20
	}
});

export default withModal(CreateNewPropertyComponent, {position: 'bottom', height: 400});
