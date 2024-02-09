import React, { useCallback, useEffect, useReducer, useState } from "react";
import { s } from './CreateEntry.style';
import { Animated, View } from 'react-native';
import UserImagePicker from '@/components/CreateNewRecord/UserImagePicker/UserImagePicker';
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColors';
import ScrollView = Animated.ScrollView;
import Button from '@/components/Button/Button';
import { ListItemModel, PropertiesDatabaseRecord, RecordModel, ReducerPayload, SelectColorItemModel, User } from '@/utils/models';
import PreviewCreatedItem from '@/components/CreateNewRecord/PreviewCreatedItem/PreviewCreatedItem';
import InfoTextField from '@/components/CreateNewRecord/InfoTextField/InfoTextField';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading/Loading';
import EntryCard from '@/containers/CreateEntryScreen/EntryCard';
import CategoryComponent from '@/components/CreateNewRecord/CategoryComponent/CategoryComponent';
import CreateNewCategory from '@/components/CreateNewRecord/CreateNewCategory/CreateNewCategory';
import { StaticDataContext } from '@/context/StaticDataContext';
import { fetchAllData, insertProduct, Tables } from '@/utils/databases';
import { SQLResultSet } from 'expo-sqlite';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomRootNavigatorParamList } from '@/containers/HomeScreen';
import { appConstants, themeColors } from '@/constants/app.constants';
import { useIsFocused } from '@react-navigation/native';
import { CURRENT_USER } from '@/constants/IMLocalize';

type Props = NativeStackScreenProps<CustomRootNavigatorParamList, 'Create'>;
const getModifiedCopy = (records: SelectColorItemModel[], id: string | number) => {
	const index = records.findIndex(rec => rec.id === id);

	if ( index == -1 ) {
		return [];
	}
	const cpRec = [...records];
	cpRec[index].selected = !cpRec[index].selected;
	return cpRec;
};

const reducer = (state: SelectColorItemModel[], action: ReducerPayload) => {
	const constr = (record: PropertiesDatabaseRecord) => {
		const {id, name, properties} = record;
		try {
			return {id, name, ...JSON.parse(properties), selected: false};
		} catch (err) {
			return {id, name, selected: false}
		}
	}

	switch (action.type) {
		case 'init_colors':
			return ((action.payload ?? []) as PropertiesDatabaseRecord[]).map((color: PropertiesDatabaseRecord) => constr(color)).filter(el => el.default);
		case 'init_categories':
			return ((action.payload ?? []) as PropertiesDatabaseRecord[]).map(((type: PropertiesDatabaseRecord) => constr(type)));
		case 'update_colors':
		case 'update_categories':
			return getModifiedCopy(state, (action.payload as number) ?? 0);
		case 'insert_category' :
			let obj = action.payload as { insertId: number, name: string };
			return [...state, {id: obj.insertId, deletable: true, name: obj.name, selected: true}];
		case 'recalculate_categories': {
			if ( !state.length ) {
				return [];
			}
			const selectedIds = state.filter(el => el.selected).map(el => (el.id));
			const refCurr = ((action.payload ?? []) as PropertiesDatabaseRecord[]).map(((type: PropertiesDatabaseRecord) => constr(type))) ?? [];
			return refCurr.map((el, index) => ({...el, selected: selectedIds.includes(el.id)}));
		}
	}
	return [];
}
const CreateEntryScreen = ({route, navigation}: Props) => {
	const [formValues, setFormValues] = useState<RecordModel>({} as RecordModel);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [showCreateNewCategoryModal, setshowCreateNewCategoryModal] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const {t, i18n} = useTranslation();
	const [loading, setLoading] = useState(true);
	const [colors, setColors] = useReducer(reducer, []);
	const [categories, setCategories] = useReducer(reducer, []);
	const isFocused = useIsFocused();
	const loadPropertiesData = useCallback(async (where: string = '') => {
		const {rows}: SQLResultSet = await fetchAllData(Tables.PROPERTIES, where);
		return (rows._array ?? []).filter((data: PropertiesDatabaseRecord) => data.lang == i18n.language);
	}, [categories, colors]);

	const saveRecord = async () => {
		const cu = await CURRENT_USER(t('common:defaultNickname'));
		let userId = 1;
		if ( cu.length ) {
			userId = (JSON.parse(cu) as User).id;
		}

		let record: RecordModel = {
			colors: colors.filter(c => c.selected).map(c => [c.name, c.plural].filter(el => el.length)).join().toLowerCase(),
			userId,
			containerIdentifier: formValues.containerIdentifier,
			description: formValues.description,
			categories: categories.filter(c => c.selected).map(c => [c.name, c?.plural ?? ''].filter(el => el.length)).join().toLowerCase(),
			imgUri: formValues.imgUri,
		};

		record.searchKeys = [record.categories, record.colors, record.description].filter(el => el?.length).join(',');

		await insertProduct(record)
			.catch(error => {
				alert(t('common:defaultDBError', {code: '001'}));
				console.log(error);
			});

		navigation.navigate('Search');
	}

	const updateRecordData = (key: keyof RecordModel, data: string | number) => {
		setFormValues({...formValues, [key]: data});
	};


	useEffect(() => {
		if ( !isFocused || !categories.length ) {
			return;
		}


		loadPropertiesData(" WHERE type='category'").then((data) => {
			setCategories({type: 'recalculate_categories', payload: data});
		}).catch(err => {
			alert(t('createEntry:loadingDataError'));
			console.log('err init data', err);
		});


	}, [isFocused]);


	useEffect(() => {
		loadPropertiesData().then((data) => {
			setLoading(false);
			const colorsRecords = data.filter((data: PropertiesDatabaseRecord) => data.type === 'color');
			const typesRecords = data.filter((data: PropertiesDatabaseRecord) => data.type === 'category');
			setColors({type: 'init_colors', payload: colorsRecords});
			setCategories({type: 'init_categories', payload: typesRecords});
		}).catch(err => {
			alert(t('createEntry:loadingDataError'));
			console.log('err init data', err);
		});

		if ( route?.params?.imgUri ) {
			setFormValues({...formValues, imgUri: route.params.imgUri});
		}

	}, []);


	if ( loading ) {
		return <Loading text/>
	}

	return (
		<>
			<StaticDataContext.Provider
				value={{
					colors: colors as SelectColorItemModel[],
					categories: categories,
					updateColors: (value: SelectColorItemModel) => {
						setColors({type: 'update_colors', payload: value.id})
					},
					updateCategories: (value: ListItemModel) => setCategories({type: 'update_categories', payload: value.id})
				}}>

				<ScrollView>
					<View style={s.container}>
						<EntryCard title={t('createEntry:picture.title')}>
							<UserImagePicker imgUri={formValues.imgUri}
											 onSaveData={(value: string) => updateRecordData('imgUri', value)}
							/>
						</EntryCard>
						<EntryCard title={t('createEntry:container.title')}
								   containerStyle={{borderColor: themeColors.secondary, borderWidth: 2}}
								   footerText={t('createEntry:container.footer')}
								   subtitle={t('createEntry:container.subtitle')}>
							<InfoTextField
								onValueSaved={(value: any) => updateRecordData('containerIdentifier', value)}
								keyboardType='numeric'
								isRequired={{message: t('common:errors.required')}}
								maxLen={{message: t('common:errors.maxLen', {max: 10}), value: 5}}
								key='containerIdentifier'/>
						</EntryCard>
						<EntryCard title={t('createEntry:colors.title')}
								   footerText={t('createEntry:colors.footer')}
								   buttonHandler={() => alert('Load more colors')}
								   subtitle={t('createEntry:colors.subtitle')}>
							<SelectColors items={colors}/>
						</EntryCard>
						<EntryCard title={t('createEntry:description.title')}
								   subtitle={t('createEntry:description.subtitle')}>
							<InfoTextField value={formValues.description}
										   onValueSaved={(value: any) => updateRecordData('description', value)}
										   maxLen={{message: t('common:errors.maxLen', {max: 10}), value: 10}}/>
						</EntryCard>
						<EntryCard title={t('createEntry:category.title')}
								   containerStyle={{marginBottom: 100}}
								   subtitle={t('createEntry:category.subtitle')}
								   footerText={t('createEntry:category.footer', {max: appConstants.maxCategoriesAllowed})}
								   buttonDisabled={categories.length >= appConstants.maxCategoriesAllowed}
								   buttonHandler={() => setshowCreateNewCategoryModal(true)}>
							<CategoryComponent items={categories}/>
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
			</StaticDataContext.Provider>
			{showPreviewModal &&
				<PreviewCreatedItem
					setVisible={showPreviewModal}
					colors={colors}
					categories={categories}
					formValues={formValues}
					cancelText='OK'
					closeModal={() => setShowPreviewModal(false)}
				/>}
			{
				showCreateNewCategoryModal &&
				<CreateNewCategory
					setVisible={showCreateNewCategoryModal}
					saveData={({name, insertId}: { name: string, insertId: number }) => {
						setshowCreateNewCategoryModal(false);
						setCategories({type: 'insert_category', payload: {insertId, name}})
					}}
					closeModal={() => setshowCreateNewCategoryModal(false)}
				/>
			}
		</>

	)
}

export default CreateEntryScreen;
