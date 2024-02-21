import React, { useCallback, useEffect, useReducer, useState } from "react";
import { s } from './CreateEntry.style';
import { Animated, View, Text } from 'react-native';
import UserImagePicker from '@/components/CreateNewRecord/UserImagePicker/UserImagePicker';
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColors';
import ScrollView = Animated.ScrollView;
import Button from '@/components/Button/Button';
import { RecordModel, ReducerPayload, SelectColorItemModel, User } from '@/utils/models';
import PreviewCreatedItem from '@/components/CreateNewRecord/PreviewCreatedItem/PreviewCreatedItem';
import InfoTextField from '@/components/CreateNewRecord/InfoTextField/InfoTextField';
import { useTranslation } from 'react-i18next';
import EntryCard from '@/containers/CreateEntryScreen/EntryCard';
import CategoryComponent from '@/components/CreateNewRecord/CategoryComponent/CategoryComponent';
import CreateNewCategory from '@/components/CreateNewRecord/CreateNewCategory/CreateNewCategory';
import { DataContext } from '@/context/StaticDataContext';
import { fetchAllData, insertProduct, insertProperty, Tables } from '@/utils/databases';
import { SQLResultSet } from 'expo-sqlite';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { appConstants, themeColors } from '@/constants/app.constants';
import { CURRENT_USER } from '@/constants/IMLocalize';
import * as FileSystem from 'expo-file-system';
import { CustomRootNavigatorParamList } from '@/navigation/HomeRootNavigator';
import Location from '@/components/CreateNewRecord/LocationComponent/Location';
import SelectColorsModal from '@/components/CreateNewRecord/SelectColors/SelectColorsModal';
import Loading from '@/components/Loading/Loading';

type Props = NativeStackScreenProps<CustomRootNavigatorParamList, 'Record'>;
const imageDir = FileSystem.documentDirectory + 'appImages/';
const saveFile = async (imgUri: string) => {

	if ( !imgUri || !(await FileSystem.getInfoAsync(imgUri)) ) {
		return null;
	}

	const dirInfo = await FileSystem.getInfoAsync(imageDir);
	if ( !dirInfo.exists ) {
		await FileSystem.makeDirectoryAsync(imageDir, {intermediates: true});
	}

	const source = imageDir + imgUri.split('/').pop();

	try {
		await FileSystem.copyAsync({from: imgUri, to: source});
	} catch (err) {
		console.log(err);
	}

	return source;
};

const CreateEntryScreen = ({route, navigation}: Props) => {
	const [formValues, setFormValues] = useState<RecordModel>({} as RecordModel);
	const {data, dispatch, reloadData} = React.useContext(DataContext)!;
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [showCreateNewCategoryModal, setshowCreateNewCategoryModal] = useState(false);
	const [showColorsModal, setShowColorsModal] = useState(false);
	const {t, i18n} = useTranslation();
	const [loading, setLoading] = useState(true);
	const getDisplayColors = useCallback(() => {
		const def = data.colors.filter(c => c.default);
		const sel = data.colors.filter(c => c.selected && !c.default);
		return [...def.slice(0, def.length - sel.length), ...sel];
	}, [data.colors]);

	useEffect(() => console.log('loading effect', formValues.id), [loading]);

	useEffect(() => {
		console.log('containerIdentifier', formValues.containerIdentifier, formValues.id);
		setLoading(false);
		console.log('loading', loading);
	}, [formValues.containerIdentifier, formValues.id]);

	useEffect(() => {
		console.log('effect1 ', route.params?.edit.id);
		if ( route.params?.edit?.id ) {
			const {id, imgUri, containerIdentifier} = route.params.edit;
			setFormValues({id, imgUri, containerIdentifier});
		}

	}, [route.params?.edit?.id]);

	const saveRecord = async () => {
		const cu = await CURRENT_USER(t('common:defaultNickname'));
		let userId = 1;
		if ( cu.id ) {
			userId = cu.id;
		}

		let record: RecordModel = {
			colors: data.colors.filter(c => c.selected).map(c => c.name).join().toLowerCase(),
			userId,
			containerIdentifier: formValues.containerIdentifier,
			description: formValues.description?.toLowerCase(),
			categories: data.categories.filter(c => c.selected).map(c => [c.name, c?.plural ?? ''].filter(el => el?.length)).join().toLowerCase(),
			imgUri: formValues.imgUri,
		};

		record.searchKeys = [record.categories,
			data.colors.filter(c => c.selected).map(c => ([c.name, c.plural ?? ''] ?? []).filter(el => el?.length)).join().toLowerCase(),
			record.description].filter(el => el?.length).join(',');


		const savedFile = await saveFile(formValues.imgUri);

		if ( savedFile ) {
			record.imgUri = savedFile;

			await insertProduct(record)
				.catch(error => {
					alert(t('common:defaultDBError', {code: '001'}));
					console.log(error);
				});

			if ( record.description?.length ) {
				//check if saving description too
				const {rows}: SQLResultSet = await fetchAllData(Tables.PROPERTIES, ` WHERE lang=? and name= ? and type='description'`,
					[i18n.language, record.description as string])
				if ( !rows.length ) {
					await insertProperty(record.description ?? 'name', i18n.language, 'description');
				}
			}
			reloadData();
			navigation.navigate('Search');
		}
	}

	const updateRecordData = (key: keyof RecordModel, data: string | number) => {
		 setFormValues({...formValues, [key]: data});
	};

	useEffect(() => {
		if (loading) {
			return;
		}
		const selectedDescription = data.descriptions.find(d => d.selected);
		updateRecordData('description', selectedDescription?.name ?? '');
	}, [data.descriptions]);


	if (loading) {
		return <Loading text/>
	}

	return (<>
			<ScrollView>
				<View style={s.container}>
					<EntryCard title={t('createEntry:picture.title')}>
						<UserImagePicker onSaveData={(value: string) => updateRecordData('imgUri', value)} imgUri={formValues.imgUri}/>
					</EntryCard>
					<EntryCard title={t('createEntry:container.title')}
							   tooltipText={t('createEntry:container:tooltip')}
							   subtitle={t('createEntry:container.subtitle')}>
						<InfoTextField
							value={formValues.containerIdentifier}
							onValueSaved={(value: any) => updateRecordData('containerIdentifier', value)}
							keyboardType='numeric'
							isRequired={{message: t('common:errors.required')}}
							maxLen={{message: t('common:errors.maxLen', {max: 3}), value: 3}}
							key='containerIdentifier'/>
					</EntryCard>
					<EntryCard title={t('createEntry:colors.title')}
							   footerText={t('createEntry:colors.footer')}
							   buttonHandler={() => setShowColorsModal(true)}
							   subtitle={t('createEntry:colors.subtitle')}>
						<SelectColors items={getDisplayColors()}/>
					</EntryCard>
					<EntryCard title={t('createEntry:description.title')}
							   subtitle={t('createEntry:description.subtitle')}>
						<Location items={data.descriptions}
								  onValueSaved={(value: string) => updateRecordData('description', value)}
								  value={formValues.description}/>
					</EntryCard>
					<EntryCard title={t('createEntry:category.title')}
							   containerStyle={{marginBottom: 100}}
							   tooltipText={t('createEntry:category:tooltip')}
							   footerText={t('createEntry:category.footer', {max: appConstants.maxCategoriesAllowed})}
							   buttonDisabled={data.categories.length >= appConstants.maxCategoriesAllowed}
							   buttonHandler={() => setshowCreateNewCategoryModal(true)}>
						<CategoryComponent items={data.categories}/>
					</EntryCard>
				</View>
			</ScrollView>

			<View style={s.bottomButtons}>
				<Button isSecondary isLeft
						disabled={!formValues.imgUri?.length || !formValues.containerIdentifier?.length}
						onPress={saveRecord}
						text={t('common:save')}/>
				<Button onPress={() => setShowPreviewModal(true)} isSecondary text={t('createEntry:preview')}/>
			</View>
			<PreviewCreatedItem
				isVisible={showPreviewModal}
				formValues={formValues}
				categories={data.categories.filter(c => c.selected).map(c => c.name ?? '')}
				colors={data.colors.filter(c => c.selected).map(c => ({bgColor: c.bgColor, name: c.name}))}
				cancelText='OK'
				closeModal={() => setShowPreviewModal(false)}
			/>
			<CreateNewCategory
				isVisible={showCreateNewCategoryModal}
				saveData={({name, insertId}: { name: string, insertId: number }) => {
					setshowCreateNewCategoryModal(false);
					dispatch({type: 'insert_category', payload: {insertId, name}})
				}}
				closeModal={() => setshowCreateNewCategoryModal(false)}
			/>
			<SelectColorsModal
				isVisible={showColorsModal}
				closeModal={() => setShowColorsModal(false)}
			/>
		</>

	)
}

export default CreateEntryScreen;
