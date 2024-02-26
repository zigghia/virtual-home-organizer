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

interface CreateNewCategoryProps {
	saveData: ({}) => void,
	closeModal: () => void,
	for: string
}

const CreateNewPropertyComponent = (props: CreateNewCategoryProps) => {
	const [data, setData] = useState<string>('');
	const {t, i18n} = useTranslation();
	const [warning, setWaring] = useState(false);
	const {loadConfigData} = useContext(DataContext)!;

	const insertNewCategory = () => {
		const insert = async () => {
			//check if category exists (by name')
			const {rows}: SQLResultSet = await fetchAllData(Tables.PROPERTIES, ` WHERE lang=? and name= ? and type='${props.for}'`, [i18n.language, data as string])
			if ( rows.length ) {
				setWaring(true);
				setTimeout(() => {
					setWaring(false);
				}, 2000);
				return;
			}
			const {insertId}: SQLResultSet = await insertProperty(data as string, i18n.language, props.for);
			props.saveData({insertId, name: data});
			loadConfigData();
		}
		insert().catch(err => {
			alert(t('common:defaultDBError', {code: '002'}));
			console.log(err);
		});

	};

	const setCategory = (value: unknown) =>  {
		setData( '' + (value ?? ''));
	}

	const max = props.for == 'category' ? appConstants.maxLocationsAllowed : appConstants.maxLocationsAllowed;

	return (<View style={{...StyleSheet.absoluteFillObject, paddingHorizontal: 10, flexDirection: 'row'}}>
			<TouchableWithoutFeedback
				onPress={(event) => {
					Keyboard.dismiss();
				}}>
				<View style={{paddingHorizontal: 10, paddingVertical: 60}}>
					<Text style={st.title}>
						{t(`createEntry:${props.for}.createNewTitle`)}
					</Text>
					<Text style={st.subtitle}>
						{t(`createEntry:${props.for}.createNewSubtitle`, {max: appConstants.maxCategoryCharsAllowed})}
					</Text>
					<Fade isVisible={warning}>
						<View style={{padding: 10}}>
							<Text style={{color: themeColors.error}}>{t(`createEntry:${props.for}.addWarning`)}</Text>
						</View>
					</Fade>
					<InfoTextFieldComponent
						value = {data ?? ''}
						onValueSaved={setCategory}
						maxLen={{message: t('common:errors.maxLen',  {max: max}), value: max}}
						isRequired={{message: t('common:errors.required')}}/>

					<Button buttonStyle={{maxHeight: 60, marginTop: 20}} text={t('common:save')} onPress={insertNewCategory} disabled={!data}/>
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
		textTransform: 'uppercase'
	},
	subtitle: {
		marginVertical: 20,
		lineHeight: 20
	}
});

export default withModal(CreateNewPropertyComponent, {position: 'bottom', height: 400});
