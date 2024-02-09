import React, { useRef, useState } from "react";
import { View, Text } from 'react-native';
import withModal from '@/hoc/withModal';
import InfoTextField from '@/components/CreateNewRecord/InfoTextField/InfoTextField';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button/Button';
import { useTranslation } from 'react-i18next';
import { appConstants, themeColors, themeDefaults } from '@/constants/app.constants';
import { SQLResultSet } from 'expo-sqlite';
import { insertCategory } from '@/utils/databases';

interface CreateNewCategoryProps  {
	saveData: ({ }) => void,
	closeModal: () => void,
}
const CreateNewCategory = (props: CreateNewCategoryProps) => {
	const [data, setData] = useState<unknown>('');
	const {t, i18n} = useTranslation();
	const subtitle =  useRef(t('createEntry:category.createNewSubtitle', {max: appConstants.maxCategoryCharsAllowed}));

	const insertNewCategory = () => {

		const insert = async () => {
			const {insertId}: SQLResultSet = await insertCategory(data as string, i18n.language);
			props.saveData({insertId, name: data});
		}
		insert().catch(err => {
			alert(t('common:defaultDBError', {code: '002'}));
			console.log(err);
		});

	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{justifyContent: 'space-between', paddingTop: 30, flex: 1, backgroundColor: themeColors.secondary}}>
				<View>
					<Text>
						{t('createEntry:category.createNewTitle')}
					</Text>
					<Text>
						{t('createEntry:category.createNewSubtitle', {max: appConstants.maxCategoryCharsAllowed})}
					</Text>
				</View>
				<View 	style = {{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
					<InfoTextField
						onValueSaved={setData}
						maxLen={{message: t('common:errors.maxLen', {max: appConstants.maxCategoryCharsAllowed}), value: 10}}
						isRequired={{message: t('common:errors.required')}}/>
				</View>
				<View style={{ height: themeDefaults.buttonHeight, flexDirection: 'row', marginBottom: 20, marginTop: 20, paddingHorizontal: 20}}>
					<Button text={t('common:cancel')} onPress={props.closeModal} isLeft/>
					<Button text={t('common:save')} onPress={insertNewCategory} disabled = {!data}/>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

export default withModal(CreateNewCategory);
