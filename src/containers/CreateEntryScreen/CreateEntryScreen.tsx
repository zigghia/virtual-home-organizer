import React, { useCallback, useEffect, useState } from "react";
import { s } from './CreateEntry.style';
import { ScrollView, View, Text } from 'react-native';
import UserImagePickerComponent from '@/components/CreateNewRecord/UserImagePickerComponent';
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColorsComponent';
import Button from '@/components/Button/Button';
import { FormRecordModel, ListItemModel, OtherSettingsProps, RecordModel, SelectColorItemModel, User } from '@/utils/models';
import InfoTextFieldComponent from '@/components/CreateNewRecord/InfoTextFieldComponent';
import { useTranslation } from 'react-i18next';
import { DataContext } from '@/context/StaticDataContext';
import { insertProduct, updateProduct } from '@/utils/databases';

;
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
import Animated, { FadeIn } from 'react-native-reanimated';
import ChipsComponent from '@/components/CreateNewRecord/ChipsComponent';
import EntryCard from '@/components/CreateNewRecord/EntryCard';

export type CustomRootNavigatorParamList = {
	Main?: undefined;
	Record?: { edit: RecordModel } | undefined;
};

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

	const [formValues, setFormValues] = useState<FormRecordModel>({} as FormRecordModel);
	const {data, loadConfigData, users} = React.useContext(DataContext)!;
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [showCreateFieldModal, setShowCreateFieldModal] = useState<'categories' | 'description' | null>(null);
	const [showColorsModal, setShowColorsModal] = useState(false);
	const {t} = useTranslation();
	const [loading, setLoading] = useState(false);
	const [show, setDisplayable] = useState<OtherSettingsProps>({});
	const isFocused = useIsFocused();
	const mergeData = useCallback(() => {
		const currColorsIds = (formValues.colors ?? []).filter(c => c.selected).map(c => c.id);
		const currCategoriesIds = (formValues.categories ?? []).filter(c => c.selected).map(c => c.id);
		//merge
		const merge = (obj: ListItemModel[], refObj: number[]) => {
			obj.forEach(o => o.selected = refObj.includes(o.id));
			return obj;
		}

		const colors = merge(JSON.parse(JSON.stringify(data.colors)), currColorsIds);

		return {
			colors: orderColors(colors),
			categories: merge(JSON.parse(JSON.stringify(data.categories)), currCategoriesIds),
		}
	}, [data.categories, data.colors, isFocused]);


	const orderColors = (colors: SelectColorItemModel[]) => {
		const colors1 = colors.sort((c1: SelectColorItemModel, c2: SelectColorItemModel) => Number(c2.default) - Number(c1.default));
		const c1 = colors.filter(c => c.selected);
		const c2 = c1.filter(c => (c as SelectColorItemModel).default).map(c => c.id);
		return  [...c1, ...colors1.filter(c => !c2.includes(c.id))].slice(0, 9);
	}

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

			setFormValues({
				...formValues,
				...mergeData()
			});
		}
	}, [isFocused]);


	useEffect(() => {
		setFormValues({
			...formValues,
			...mergeData()
		});
	}, [data.colors, data.categories])


	useEffect(() => {
		if ( route.params?.edit?.id ) {
			setLoading(true);
			// const params = route.params.edit;
			//
			// const {id, imgUri, containerIdentifier, description, season} = params;
			//
			// const getIds = (key: 'categories' | 'colors') => {
			// 	const obj = (params[key] ?? '').toLowerCase().split(',') ?? [];
			// 	return data[key].filter(c => obj.includes(c.name?.toLowerCase())).map(c => c.id);
			// }
			//
			// const categoriesIds = getIds('categories');
			// const colorsIds = getIds('colors');
			//
			// setFormValues({id, imgUri,
			// 	containerIdentifier,
			// 	userID: params.userID,
			// 	description, oldImgUri: imgUri, season,
			// 	colorsIds: colorsIds,
			// 	categoriesIds: categoriesIds, categories: params.categories});
			//
			// const sel = data.colors.filter(c => colorsIds?.includes(c.id));
			// const def =  data.colors.filter(c => c.default && !colorsIds.includes(c.id));
			// setColorsConfig([...sel, ...def].slice(0,9));
			//
			// setLoading(false);
		} else {
		}

	}, [route.params]);


	const saveRecord = async () => {
		if ( !formValues.imgUri || !formValues.containerIdentifier ) {
			return;
		}

		const colors = (formValues.colors ?? []).filter(c => c?.selected) ?? [];

		let record: RecordModel = {
			colors: colors.map(c => c.name).join().toLowerCase(),
			userID: formValues.userID || 1,
			containerIdentifier: formValues.containerIdentifier,
			description: formValues.description?.toLowerCase() ?? '',
			season: formValues.season ?? '',
			categories: (formValues.categories ?? []).filter(c => c.selected).map(c => c.name).join().toLowerCase(),
			imgUri: formValues.imgUri,
			searchKeys: ''
		};

		record.searchKeys = [
			record.categories,
			record.season,
			formValues.userID ? users.find(u => u.id == formValues.userID)?.nickname : '',
			colors.map(c => ([c.name, c.plural ?? ''] ?? []).filter(el => el?.length)).join(),
			record.description].filter(el => el?.length).join().toLowerCase();


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

		setFormValues({} as FormRecordModel);
		navigation.navigate('Main');
	}

	const updateRecordData = (key: keyof FormRecordModel, data: string | number | ListItemModel) => {
		let value: any = data;

		if ( ['categories', 'colors'].includes(key) ) {
			const obj: ListItemModel[] = (formValues[key] as ListItemModel[]) ?? [];
			const i = obj.find(o => o.id == value.id) ?? {selected: false};
			i.selected = !i?.selected
			value = [...obj];
		}

		setFormValues({...formValues, [key]: value});
	}

	if ( loading ) {
		return null;
	}
	const cancel = () => {
		setFormValues({} as FormRecordModel);
		navigation.navigate('Main');
	}

	return (
		<Animated.View entering={FadeIn.duration(200)}>
			<FAB
				visible
				onPress={() => setShowPreviewModal(true)}
				style={{width: 120, position: 'absolute', alignSelf: 'center', top: -20, zIndex: 300, ...commonStyle.shadow}}
				color={themeColors.primary}
			>
				<Ionicons name="eye-sharp" size={24} color="white"/>
			</FAB>
			<ScrollView>
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
							withLock
							onValueSaved={(value: any) => updateRecordData('containerIdentifier', value)}
							keyboardType='numeric'
							isRequired={{message: t('common:errors.required')}}
							maxLen={{message: t('common:errors.maxLen', {max: 3}), value: 3}}
							key='containerIdentifier'
						/>
					</EntryCard>
					{formValues?.colors?.length &&
						<EntryCard title={t('createEntry:colors.title')}
								   footerText={t('createEntry:colors.footer')}
								   buttonHandler={() => setShowColorsModal(true)}
								   subtitle={t('createEntry:colors.subtitle')}>
							<SelectColors items={formValues.colors}
										  updateData={(color: SelectColorItemModel) => updateRecordData('colors', color)}
							/>
						</EntryCard>}
					{show.categories && formValues?.categories?.length &&
						<EntryCard title={t('createEntry:categories.title')}
								   tooltipText={t('createEntry:categories:tooltip')}
								   footerText={t('createEntry:categories.footer', {max: appConstants.maxCategoriesAllowed})}
								   buttonDisabled={data.categories.length >= appConstants.maxCategoriesAllowed}
								   buttonHandler={() => setShowCreateFieldModal('categories')}>
							<ChipsComponent items={formValues.categories}
											onclickItem={(item: ListItemModel) => updateRecordData('categories', item)}
							/>
						</EntryCard>
					}
					{show.location &&
						<EntryCard title={t('createEntry:description.title')}
								   tooltipText={t('createEntry:description:tooltip')}
								   footerText={t('createEntry:description.footer', {max: appConstants.maxLocationsAllowed})}
								   buttonDisabled={data.descriptions.length >= appConstants.maxLocationsAllowed}
								   buttonHandler={() => setShowCreateFieldModal('description')}
								   subtitle={(data.descriptions ?? []).length ? t('createEntry:description.subtitle1') : t('createEntry:description.subtitle')}>
							<ChipsComponent items={data.descriptions ?? []}
											onclickItem={(item: ListItemModel) => updateRecordData('description', formValues.description == item.name ? '' : item.name)}
											value={formValues.description}/>
						</EntryCard>
					}
					{show.users && users.length &&
						<EntryCard title={t('createEntry:users.title')}
								   tooltipText={t('createEntry:season:tooltip')}>
							<View style={{flexWrap: 'wrap', flex: 1, flexDirection: 'row'}}>
								{users.map((user, index) => <CheckBox size={40}
																	  title={user.nickname}
																	  checkedColor={themeColors.secondary}
																	  key={'user' + user.id}
																	  onPress={() => updateRecordData('userID', user.id)}
																	  checked={formValues.userID == user.id}
									/>
								)}
							</View>
						</EntryCard>
					}
					{show?.season &&
						<EntryCard title={t('createEntry:season.title')}
								   tooltipText={t('createEntry:season:tooltip')}>
							<SeasonComponent selectedSeason={formValues.season}
											 updateData={(value, valueIndex) => {
												 updateRecordData('season', value);
											 }}
							/>
						</EntryCard>
					}
				</View>
			</ScrollView>

			<View style={s.bottomButtons}>
				<Button onPress={cancel} isSecondary text={t('createEntry:cancel')} isCancel isLeft/>
				<Button isSecondary
						disabled={!formValues.imgUri?.length || !formValues.containerIdentifier?.length}
						onPress={saveRecord}
						text={t('common:save')}/>
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
				for={showCreateFieldModal}
				saveData={({id, value}: { id: number; value: string }) => {
					setShowCreateFieldModal(null);
				}}
				closeModal={() => setShowCreateFieldModal(null)}
			/>
			<SelectColorsModal
				items={data.colors}
				selected={formValues.colors}
				isVisible={showColorsModal}
				closeModal={() => setShowColorsModal(false)}
				updateColors={(colors: SelectColorItemModel[]) => {
					setFormValues({...formValues, colors: orderColors(colors)});
					setShowColorsModal(false);
				}}
			/>
		</Animated.View>
	)
}

export default CreateEntryScreen;
