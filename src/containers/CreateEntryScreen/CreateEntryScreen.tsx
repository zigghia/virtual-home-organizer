import React, { useEffect, useState } from "react";
import { s } from './CreateEntry.style';
import { ScrollView, View, Text } from 'react-native';
import UserImagePickerComponent from '@/components/CreateNewRecord/UserImagePickerComponent';
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColorsComponent';
import Button from '@/components/Button/Button';
import { ListItemModel, OtherSettingsProps, RecordModel, SelectColorItemModel, User } from '@/utils/models';
import InfoTextFieldComponent from '@/components/CreateNewRecord/InfoTextFieldComponent';
import { useTranslation } from 'react-i18next';
import EntryCard from '@/containers/CreateEntryScreen/EntryCard';
import { DataContext } from '@/context/StaticDataContext';
import { fetchAllData, insertProduct, insertProperty, Tables, updateProduct } from '@/utils/databases';
import { SQLResultSet } from 'expo-sqlite';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { appConstants, themeColors } from '@/constants/app.constants';
import * as FileSystem from 'expo-file-system';
import SelectColorsModal from '@/components/CreateNewRecord/SelectColors/SelectColorsModal';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SeasonComponent from '@/components/CreateNewRecord/SeasonComponent';
import PreviewItem from '@/components/PreviewItem';
import CreateNewCategoryComponent from '@/components/CreateNewRecord/CreateNewPropertyComponent';
import { CheckBox, FAB } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import commonStyle from '@/utils/common.style';
import { CustomRootNavigatorParamList } from '@/navigation/AppNavigator';
import Animated, { FadeIn } from 'react-native-reanimated';
import ChipsComponent from '@/components/CreateNewRecord/ChipsComponent';

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
	const {data, loadConfigData, users} = React.useContext(DataContext)!;
	const [colorsConfig, setColorsConfig] = useState(data.colors.filter(c => c.default));
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [showCreateFieldModal, setShowCreateFieldModal] = useState<string | null>(null);
	const [showColorsModal, setShowColorsModal] = useState(false);
	const {t, i18n} = useTranslation();
	const [loading, setLoading] = useState(false);
	const [displayable, setDisplayable] = useState<OtherSettingsProps>({});
	const isFocused = useIsFocused();


	useEffect(() => {
		if ( isFocused ) {
			setLoading(true);
			const initData = async () => {
				try {
					let k = await AsyncStorage.getItem('vho-settings-other');
					setDisplayable((k == null) ? {location: true, users: true, categories: true, season: true} : JSON.parse(k));
					setLoading(false);
				} catch (err) {
					console.log('err read storage', err);
				}
			}
			initData().catch(err => console.log(err));
		}
	}, [isFocused]);


	useEffect(() => {

		if ( route.params?.edit?.id ) {
			setLoading(true);
			const params = route.params.edit;

			const {id, imgUri, containerIdentifier, description, season} = params;

			const getIds = (key: 'categories' | 'colors') => {
				const obj = (params[key] ?? '').toLowerCase().split(',') ?? [];
				return data[key].filter(c => obj.includes(c.name?.toLowerCase())).map(c => c.id);
			}

			const categoriesIds = getIds('categories');
			const colorsIds = getIds('colors');

			setFormValues({id, imgUri,
				containerIdentifier,
				userID: params.userID,
				description, oldImgUri: imgUri, season,
				colorsIds: colorsIds,
				categoriesIds: categoriesIds, categories: params.categories});

			const sel = data.colors.filter(c => colorsIds?.includes(c.id));
			const def =  data.colors.filter(c => c.default && !colorsIds.includes(c.id));
			setColorsConfig([...sel, ...def].slice(0,9));

			setLoading(false);
		}
		else {}

	}, [route.params]);
	const setColors = (colorsIds: number[] = []) => {
		const sel = data.colors.filter(c => colorsIds?.includes(c.id));
		const def =  data.colors.filter(c => c.default && !colorsIds.includes(c.id));
		setColorsConfig([...sel, ...def].slice(0,9));
		setFormValues({...formValues, colorsIds: [...colorsIds]});
		setShowColorsModal(false);
	}


	const saveRecord = async () => {
		if ( !formValues.imgUri || !formValues.containerIdentifier ) {
			return;
		}
		const selectedColors = data.colors.filter(c => (formValues.colorsIds??[]).includes(c.id));

		let record: RecordModel = {
			colors: selectedColors.map(c => c.name).join().toLowerCase(),
			userID: formValues.userID || 1,
			containerIdentifier: formValues.containerIdentifier,
			description: formValues.description?.toLowerCase(),
			season: formValues.season ?? '',
			categories: data.categories.filter(c => (formValues.categoriesIds??[]).includes(c.id)).map(c => c.name).join().toLowerCase(),
			imgUri: formValues.imgUri,
		};

		record.searchKeys = [
			record.categories,
			record.season,
			formValues.userID ? users.find(u => u.id == formValues.userID)?.nickname: '',
			selectedColors.map(c => ([c.name, c.plural ?? ''] ?? []).filter(el => el?.length)).join(),
			record.description].filter(el => el?.length).join().toLowerCase();

		if ( record.description?.length ) {
			//check if saving description too
			const {rows}: SQLResultSet = await fetchAllData(Tables.PROPERTIES, ` WHERE lang=? and name= ? and type='description'`,
				[i18n.language, record.description as string])
			if ( !rows.length ) {
				await insertProperty(record.description ?? 'name', i18n.language, 'description');
				loadConfigData();
			}
		}

		formValues?.oldImgUri?.length && formValues?.oldImgUri != formValues.imgUri &&
		(await FileSystem.deleteAsync(formValues?.oldImgUri ?? '', {idempotent: true}));

		const savedFile = await saveFile(formValues.imgUri);
		savedFile && (record.imgUri = savedFile);

		if ( formValues.id != null ) {
			await updateProduct(record).catch(error => {
				alert(t('common:defaultDBError', {code: '001'}));
				console.log(error);
			});
		} else {
			await insertProduct(record).catch(error => {
				alert(t('common:defaultDBError', {code: '001'}));
				console.log(error);
			});
		}

		setFormValues({} as RecordModel);
		navigation.navigate('Main');
	}

	const updateRecordData = (key: keyof RecordModel, data: string | number) => {
		let value: any = data;

		if ( ['colorsIds', 'categoriesIds'].includes(key) ) {
			const ids = [...(formValues?.[key] as any ?? [])];
			if ( ids.includes(Number(data)) ) {
				value = ids.filter(i => i !== data);
			} else {
				value = [...ids, data];
			}
		}

		setFormValues({...formValues, [key]: value});
	}

	if ( loading ) {
		return null;
	}
	const cancel = () => {
		setFormValues({} as RecordModel);
		navigation.navigate('Main');
	}

	const locationComponent = displayable.location ? <EntryCard title={t('createEntry:description.title')}
																tooltipText={t('createEntry:description:tooltip')}
																footerText={t('createEntry:description.footer', {max: appConstants.maxLocationsAllowed})}
																buttonDisabled={data.descriptions.length >= appConstants.maxLocationsAllowed}
																buttonHandler={() => setShowCreateFieldModal('description')}
																subtitle={(data.descriptions??[]).length ? t('createEntry:description.subtitle1') : t('createEntry:description.subtitle')}>
																      <ChipsComponent items={data.descriptions ?? []}
																				onclickItem={(item: ListItemModel) =>
																					updateRecordData('description', formValues.description == item.name? '': item.name)}
																				value={formValues.description}
																	  />
													</EntryCard>
													: null;

	const categoryComponent = displayable.categories ? <EntryCard title={t('createEntry:category.title')}
																  tooltipText={t('createEntry:category:tooltip')}
																  footerText={t('createEntry:category.footer', {max: appConstants.maxCategoriesAllowed})}
																  buttonDisabled={data.categories.length >= appConstants.maxCategoriesAllowed}
																  buttonHandler={() => setShowCreateFieldModal('category')}>
		                                                             <ChipsComponent items={data.categories}
																						 onclickItem={(item: ListItemModel) => updateRecordData('categoriesIds', item.id)}
																						 selectedIds={formValues.categoriesIds}/>
													</EntryCard> : null;

	const seasonComponent = displayable?.season ? <EntryCard title={t('createEntry:season.title')}
															 tooltipText={t('createEntry:season:tooltip')}>
																			<SeasonComponent selectedSeason={formValues.season}
																							 updateData={(value, valueIndex) => {
																								 updateRecordData('season', value);
																							 }}/>

														</EntryCard> : null;

	const userComponent = displayable?.users ? <EntryCard title={t('createEntry:users.title')}
														  tooltipText={t('createEntry:season:tooltip')}>
														<View style={{flexWrap: 'wrap', flex: 1, flexDirection: 'row'}}>
															{users.map((user, index) => {
																return <CheckBox size={40}
																				 title={user.nickname}
																				 checkedColor={themeColors.secondary}
																				 key={'user' + user.id}
																				 onPress={() => updateRecordData('userID', user.id)}
																				 checked={formValues.userID== user.id}/>
															})
															}
														</View>
													</EntryCard> : null;


	return (
		<Animated.View  entering={FadeIn.duration(200)}>
			<FAB
				visible
				onPress={() => setShowPreviewModal(true)}
				style={{width: 120, position: 'absolute', alignSelf: 'center', top: -20, zIndex: 300, ...commonStyle.shadow}}
				color={themeColors.primary}
			>
				<Ionicons name="eye-sharp" size={24} color="white"/>
			</FAB>
			<ScrollView >
				<View style={s.container}>
					<EntryCard title={t('createEntry:picture.title')}>
						<UserImagePickerComponent onSaveData={(value: string) => updateRecordData('imgUri', value)}
												  imgUri={formValues.imgUri}
												  oldImgUri={formValues.oldImgUri}/>
					</EntryCard>
					<EntryCard title={t('createEntry:container.title')}
							   tooltipText={t('createEntry:container:tooltip')}
							   subtitle={t('createEntry:container.subtitle')}>
						<InfoTextFieldComponent
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
						<SelectColors items={colorsConfig}
									  selectedIs={formValues.colorsIds}
									  updateData={(id: number) => id && updateRecordData('colorsIds', id)}/>
					</EntryCard>
					{categoryComponent}
					{locationComponent}
					{userComponent}
					{seasonComponent}
				</View>
			</ScrollView>

			<View style={s.bottomButtons}>
				<Button isSecondary isLeft
						disabled={!formValues.imgUri?.length || !formValues.containerIdentifier?.length}
						onPress={saveRecord}
						text={t('common:save')}/>
				<Button onPress={cancel} isSecondary text={t('createEntry:cancel')}/>
			</View>
			<PreviewItem
				isVisible={showPreviewModal}
				formValues={formValues}
				categories={data.categories.filter(c => c.selected).map(c => c.name ?? '')}
				colors={data.colors.filter(c => c.selected).map(c => ({bgColor: c.bgColor, name: c.name}))}
				cancelText='OK'
				closeModal={() => setShowPreviewModal(false)}
			/>
			<CreateNewCategoryComponent
				isVisible={showCreateFieldModal != null}
				for = {showCreateFieldModal}
				saveData={() => {
					setShowCreateFieldModal(null);
				}}
				closeModal={() => setShowCreateFieldModal(null)}
			/>
			<SelectColorsModal
				selectedIds={formValues.colorsIds}
				items={data.colors}
				isVisible={showColorsModal}
				closeModal={(colorsIds: number[]) => setColors(colorsIds)}
			/>
		</Animated.View>
	)
}

export default CreateEntryScreen;
