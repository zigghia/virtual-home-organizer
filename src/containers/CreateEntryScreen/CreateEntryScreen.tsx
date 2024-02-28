import React, { useCallback, useEffect, useRef, useState } from "react";
import { s } from './CreateEntry.style';
import { ScrollView, View } from 'react-native';
import UserImagePickerComponent from '@/components/CreateNewRecord/UserImagePickerComponent';
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColorsComponent';
import Button from '@/components/Button/Button';
import { FormRecordModel, ListItemModel, OtherSettingsProps, RecordModel, SelectColorItemModel, User } from '@/utils/models';
import InfoTextFieldComponent from '@/components/CreateNewRecord/InfoTextFieldComponent';
import { useTranslation } from 'react-i18next';
import { DataContext } from '@/context/StaticDataContext';
import { insertProduct, updateProduct } from '@/utils/databases';
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
		await FileSystem.moveAsync({from: imgUri, to: source});
	} catch (err) {
		console.log(err);
	}
	return source;
};

const CreateEntryScreen = ({route, navigation}: Props) => {

	const [formValues, setFormValues] = useState<FormRecordModel | null>(null);
	const {data, users} = React.useContext(DataContext)!;
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [showCreateFieldModal, setShowCreateFieldModal] = useState<'categories' | 'description' | null>(null);
	const [showColorsModal, setShowColorsModal] = useState(false);
	const {t} = useTranslation();
	const [loading, setLoading] = useState(false);
	const [show, setDisplayable] = useState<OtherSettingsProps>({});
	const isFocused = useIsFocused();
	const mergeData = useCallback((sourceColors: SelectColorItemModel[], sourceCategories: ListItemModel[]) => {
		const currColorsIds = (sourceColors ?? []).filter(c => c.selected).map(c => c.id);
		const currCategoriesIds = (sourceCategories ?? []).filter(c => c.selected).map(c => c.id);
		const merge = (obj: ListItemModel[], refObj: number[]) => {
			obj.forEach(o => o.selected = refObj.includes(o.id));
			return obj;
		}

		const colors = merge(JSON.parse(JSON.stringify(data.colors)), currColorsIds);

		return {
			selectColors: orderColors(colors),
			selectCategories: merge(JSON.parse(JSON.stringify(data.categories)), currCategoriesIds),
		}
	}, [data.categories, data.colors, isFocused]);

	const listRef = useRef<ScrollView>(null);

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
				...formValues ?? {} as FormRecordModel,
				...mergeData(formValues?.selectColors ?? [], formValues?.selectCategories ?? [])
			});
		}
	}, [isFocused]);


	useEffect(() => {

		setFormValues({
			...formValues ?? {} as FormRecordModel,
			...mergeData(formValues?.selectColors ?? [], formValues?.selectCategories ?? [])
		});
	}, [data.colors, data.categories]);


	useEffect(() => {

		if ( route.params?.edit?.id ) {
			setLoading(true);
			const params = route.params.edit;
			const {id, imgUri, containerIdentifier, description, season} = params;

			const mergeSavedData = (key: 'colors' | 'categories') => {
				const savedObj = (params[key] ?? '').split(',');
				const obj = [...JSON.parse(JSON.stringify(data[key]))];
				obj.forEach(c => c.selected = savedObj.includes(c.name.toLowerCase()));
				return obj;
			}

			setFormValues(
				{
					id,
					imgUri,
					containerIdentifier,
					userID: params.userID,
					description,
					oldImgUri: imgUri,
					season,
					selectColors: orderColors(mergeSavedData('colors')),
					selectCategories: mergeSavedData('categories')
				});


			setLoading(false);
		}

	}, [route.params]);

	const orderColors = (colors: SelectColorItemModel[]) => {
		const colors1 = colors.sort((c1: SelectColorItemModel, c2: SelectColorItemModel) => Number(c2.default) - Number(c1.default));
		const c1 = colors.filter(c => c.selected);
		const c2 = c1.filter(c => (c as SelectColorItemModel).default).map(c => c.id);
		return [...c1, ...colors1.filter(c => !c2.includes(c.id))].slice(0, 9);
	}

	const saveRecord = async () => {
		if ( formValues == null ) {
			return;
		}

		if ( !formValues.imgUri || !formValues.containerIdentifier ) {
			return;
		}

		const colors = (formValues.selectColors ?? []).filter(c => c?.selected) ?? [];

		let record: RecordModel = {
			colors: colors.map(c => c.name).join().toLowerCase(),
			userID: formValues.userID || 1,
			containerIdentifier: formValues.containerIdentifier,
			description: formValues.description?.toLowerCase() ?? '',
			season: formValues.season ?? '',
			categories: (formValues.selectCategories ?? []).filter(c => c.selected).map(c => c.name).join().toLowerCase(),
			imgUri: formValues.imgUri,
			searchKeys: ''
		};

		record.searchKeys = [
			record.categories,
			record.season,
			formValues.userID ? users.find(u => u.id == formValues.userID)?.nickname : users.find(u=> u.id == 1)?.nickname,
			colors.map(c => ([c.name, c.plural ?? ''] ?? []).filter(el => el?.length)).join(),
			record.description].filter(el => el?.length).join().toLowerCase();

		let saveNewFile = true;
		if ( formValues?.oldImgUri?.length ) {
			const oldf = formValues.oldImgUri.split('/').pop();
			const newf = formValues.imgUri.split('/').pop();
			saveNewFile = false;
			if ( oldf !== newf ) {
				saveNewFile = true;
				await FileSystem.deleteAsync(FileSystem.documentDirectory + 'appImages/' + formValues.oldImgUri, {idempotent: true});
				formValues.oldImgUri = undefined;
			}
		}

		// const x = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'appImages') ?? [];
		// x.forEach(a => {
		// 	const j = async  () => await FileSystem.deleteAsync(FileSystem.documentDirectory + 'appImages/' + a );
		// 	console.log(a);
		// 	// j();
		// });

		if ( saveNewFile ) {
			const savedFile = await saveFile(formValues.imgUri);
			savedFile && (record.imgUri = savedFile);
		}

		if ( formValues.id != null ) {
			await updateProduct({...record, id: formValues.id}).catch(error => {
				alert(t('common:defaultDBError', {code: '001'}));
				console.log(error);
			});
		} else {
			await insertProduct(record).catch(error => {
				alert(t('common:defaultDBError', {code: '001'}));
				console.log(error);
			});
		}

		reset();
	}

	const updateRecordData = (key: keyof FormRecordModel, data: string | number | ListItemModel) => {
		let value: any = data;

		if ( formValues == null ) {
			return;
		}

		if ( ['selectCategories', 'selectColors'].includes(key) ) {
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
	const reset = () => {
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
			<ScrollView ref={listRef}>
				<View style={s.container}>
					<EntryCard title={t('createEntry:picture.title')}>
						<UserImagePickerComponent onSaveData={(value: string) => updateRecordData('imgUri', value)}
												  imgUri={formValues?.imgUri}
						/>
					</EntryCard>
					<EntryCard title={t('createEntry:container.title')}
							   tooltipText={t('createEntry:container:tooltip')}
							   subtitle={t('createEntry:container.subtitle')}>
						<InfoTextFieldComponent
							value={formValues?.containerIdentifier}
							withLock
							onValueSaved={(value: any) => updateRecordData('containerIdentifier', value)}
							keyboardType='numeric'
							isRequired={{message: t('common:errors.required')}}
							maxLen={{message: t('common:errors.maxLen', {max: 3}), value: 3}}
							onEdit={() => {
								listRef?.current && listRef.current.scrollTo({x: 0, y: 150, animated: true})
							}}
							key='containerIdentifier'
						/>
					</EntryCard>

					<EntryCard title={t('createEntry:colors.title')}
							   footerText={t('createEntry:colors.footer')}
							   buttonHandler={() => setShowColorsModal(true)}
							   subtitle={t('createEntry:colors.subtitle')}>
						<SelectColors items={formValues?.selectColors ?? []}
									  updateData={(color: SelectColorItemModel) => updateRecordData('selectColors', color)}
						/>
					</EntryCard>
					{show.categories && formValues?.selectCategories?.length &&
						<EntryCard title={t('createEntry:categories.title')}
								   tooltipText={t('createEntry:categories:tooltip')}
								   footerText={t('createEntry:categories.footer', {max: appConstants.maxCategoriesAllowed})}
								   buttonDisabled={data.categories.length >= appConstants.maxCategoriesAllowed}
								   buttonHandler={() => setShowCreateFieldModal('categories')}>
							<ChipsComponent items={formValues.selectCategories}
											onclickItem={(item: ListItemModel) => updateRecordData('selectCategories', item)}
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
											onclickItem={(item: ListItemModel) => updateRecordData('description', formValues?.description == item.name ? '' : item.name)}
											value={formValues?.description}/>
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
																	  checked={formValues?.userID == user.id}
									/>
								)}
							</View>
						</EntryCard>
					}
					{show?.season &&
						<EntryCard title={t('createEntry:season.title')}
								   tooltipText={t('createEntry:season:tooltip')}>
							<SeasonComponent selectedSeason={formValues?.season}
											 updateData={(value, valueIndex) => {
												 updateRecordData('season', value);
											 }}
							/>
						</EntryCard>
					}
				</View>
			</ScrollView>

			<View style={s.bottomButtons}>
				<Button onPress={reset} isSecondary text={t('createEntry:cancel')} isCancel isLeft/>
				<Button isSecondary
						disabled={!formValues?.imgUri?.length || !formValues?.containerIdentifier?.length}
						onPress={saveRecord}
						text={t('common:save')}/>
			</View>
			<PreviewItem
				isVisible={showPreviewModal}
				formValues={formValues}
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
				selected={formValues?.selectColors}
				isVisible={showColorsModal}
				closeModal={() => setShowColorsModal(false)}
				updateColors={(colors: SelectColorItemModel[]) => {
					setFormValues({...formValues ?? {} as FormRecordModel, selectColors: orderColors(colors)});
					setShowColorsModal(false);
				}}
			/>
		</Animated.View>
	)
}

export default CreateEntryScreen;
