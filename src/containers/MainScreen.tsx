import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, Text, ImageBackground, Image, Pressable } from 'react-native';
import { FormRecordModel, RecordModel } from '@/utils/models';
import { useIsFocused } from '@react-navigation/native';
import { SQLResultSet } from 'expo-sqlite';
import { deleteFromTable, fetchAllData, Tables } from '@/utils/databases';
import * as FileSystem from 'expo-file-system';
import SwipeRow from '@/components/ListComponents/List/SwipeRow';
import { useTranslation } from 'react-i18next';
import { themeColors } from '@/constants/app.constants';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AlertComponent from '@/components/AlertComponent';
import ErrorComponent from '@/components/ErrorComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading';
import GridList from '@/components/ListComponents/List/GridList';
import Filters from '@/components/MainScreen/Filters';
import { SearchBar } from '@rneui/themed';
import Intro from '@/components/Animations/Intro';
import Animated, { FadeIn } from 'react-native-reanimated';
import PreviewItem from '@/components/PreviewItem';
import { SwipeProvider } from '@/context/SwipeProvider';

const MainScreen = (props: any) => {
	const [dbData, setDbData] = useState<FormRecordModel[]>([]);
	const [filteredData, setFilteredData] = useState<FormRecordModel[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showFilters, setShowFilters] = useState<boolean | null>(null);
	const [hasFilters, setHasFilters] = useState<boolean>(false);
	const [toBeDeleted, setToBeDeleted] = useState<null | number>(null);
	const {data, loadingConfigData} = useContext(DataContext)!;
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState<string | undefined>("");
	const [isList, setIsList] = useState(true);
	const [previewInfo, setPreviewInfo] = useState<FormRecordModel | null>(null);
	const isFocus = useIsFocused();
	const [t] = useTranslation();

	const setListData = (data: FormRecordModel[]) => {
		setFilteredData(data);
	}

	const getList = async () => {
		try {
			setLoading(true);
			const {rows}: SQLResultSet = await fetchAllData(Tables.PRODUCTS);
			//add colorsInfo
			const fullData: FormRecordModel[] = rows._array.map(record => {
				const cArr = record.colors.split(',').map((c: string) => c.trim().toLowerCase()) ?? [];
				return {...record, selectColors: (data.colors ?? []).filter(c => cArr.includes(c.name?.toLowerCase())).map(c => ({...c, selected: true}))}
			});

			setLoading(false);
			setDbData(fullData);
			setListData(fullData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if ( !isFocus || loadingConfigData ) {
			setShowFilters(false);
			return;
		}
		getList().catch((err) => console.log(err));
	}, [isFocus, loadingConfigData]);


	const deleteRecord = async () => {
		setShowDeleteModal(false);
		if ( !toBeDeleted ) {
			return;
		}

		try {
			const item = dbData.find(el => el.id === toBeDeleted);
			await FileSystem.deleteAsync(item?.imgUri ?? '', {idempotent: true});
			await deleteFromTable([toBeDeleted], Tables.PRODUCTS);
			await getList();
		} catch (error) {
			setError(t('common:error.message', {code: '003'}));
		}
	}

	const searchMultifilterData = (obj: string [][]) => {
		setHasFilters(true);
		setListData(performSearch(obj));
	}

	const performSearch = (searchKeys: string[][]) => {
		const newList: FormRecordModel[] = [];

		dbData.forEach(item => {
			let found = searchKeys.map((key: string[]) => {
				return key.some(k => item.searchKeys?.search(`,${k}`) != -1)
			});


			if ( found.every(f => f) ) {
				newList.push(item);
			}
		});

		return newList;
	}
	const searchData = (value: string) => {
		setSearch(value);
		if ( value.length == 0 ) {
			setListData(dbData);
			return;
		}

		if ( value.length >= 2 ) {
			const keys = value.toLowerCase().split(/\s+/).filter(k => k.length);
			setListData(performSearch([keys]));
		}
	}

	const editAction = async (item: RecordModel) => {
		await props.navigation.navigate('Record', {edit: item});
	}

	const deleteAction = (id: number | undefined) => {
		if ( !id ) {
			return;
		}
		setToBeDeleted(id);
		setShowDeleteModal(true);
	}


	const renderItem = ({item, index}: { item: FormRecordModel, index: number }): any => {
		if ( !item ) {
			return;
		}
		return <SwipeRow key={`list${index}-${item.id}`}
						 item={item}
						 index={index}
						 clickPreview={() => setPreviewInfo(item)}
						 deleteAction={deleteAction}
						 editAction={editAction}/>

	}

	if ( loading ) {
		return <Loading/>
	}


	if ( !dbData.length ) {
		return <Intro/>;
	}

	return (
		<Animated.View style={{flex: 1, backgroundColor: 'white'}} entering={FadeIn.duration(200)}>
			<SearchBar
				disabled={dbData.length == 0 || showFilters == true}
				lightTheme
				showSoftInputOnFocus
				searchIcon={<Ionicons name='search' size={24} color="black" style={{left: 0}}/>}
				clearIcon={<TouchableOpacity onPress={() => searchData('')}><Ionicons name='close' size={24} color="black"/></TouchableOpacity>}
				rightIconContainerStyle={s.searchClear}
				inputStyle={s.searchInput}
				inputContainerStyle={s.searchInputContainer}
				containerStyle={s.searchContainer}
				placeholder={t('search:searchPlaceholder')}
				onChangeText={searchData}
				value={search}
			/>
			<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

				<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5}}>
					<Text style={{fontSize: 18, fontWeight: '500'}}> {t('common:total') + ': ' + filteredData.length + ' '}</Text>
					<FontAwesome5 name="box-open" size={24} color={themeColors.secondary}/>
				</View>
				<View style={{flexDirection: 'row'}}>
					<TouchableOpacity style={s.button1} disabled={showFilters == true}
									  onPress={() => setIsList(!isList)}>
						<Ionicons name={isList ? 'grid-outline' : "list-outline"} size={24} color={showFilters ? themeColors.disabled : themeColors.header}/>
						<Text style={s.iconText}>{!isList ? t('search:list') : t('search:grid')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{...s.button1}}
									  onPress={() => setShowFilters(!showFilters)}>
						<Ionicons name="options" size={24} color="black"/>
						<Text style={s.iconText} >{t('search:filters')}</Text>
					</TouchableOpacity>
					{hasFilters && !showFilters && <TouchableOpacity style={{...s.button1}}
													 onPress={() => {
														 setHasFilters(false);
														 searchData('');
													 }}>
						<Ionicons name="close" size={20} color="black"/>
						<Text style={s.iconText}> {t('search:delete')}</Text>
						<Text style={s.iconText}> {t('search:deleteFilters')}</Text>
					</TouchableOpacity>}
				</View>
			</View>

			<Filters isVisible={showFilters}
					 hasFilters = {hasFilters}
					 cancel={() => setShowFilters(false)}
					 search={(obj: [][]) => {
						 searchMultifilterData(obj);
						 setShowFilters(false);
					 }}/>

			<GestureHandlerRootView style={{flex: 1}}>
				{isList ?
					<SwipeProvider>
						<FlatList data={filteredData}
								  ItemSeparatorComponent={() => <View style={s.separator}/>}
								  renderItem={renderItem}
								  keyExtractor={(_item, index) => `list${index}`}
						/>
					</SwipeProvider> :
					<GridList items={filteredData}
							  deleteAction={deleteAction}
							  onPreview={(item: FormRecordModel) => setPreviewInfo(item)}
							  editAction={editAction}/>
				}
			</GestureHandlerRootView>


			<AlertComponent
				isVisible={showDeleteModal}
				closeModal={() => {
					setShowDeleteModal(false)
				}}
				message={t('search:deleteMessage')}
				title={t('search:deleteTitle')}
				onPressOK={deleteRecord}/>

			<PreviewItem isVisible={previewInfo != null}
						 formValues={previewInfo}
						 cancelText='OK'
						 closeModal={() => setPreviewInfo(null)}/>

			{error && <ErrorComponent transparent
									  message={error}
									  cancelText='OK'
									  closeModal={() => setError(null)}/>
			}
		</Animated.View>
	);
}

export const s = StyleSheet.create({
	iconText: {
		fontSize: 10,
		paddingTop: 3
	},
	searchContainer: {
		backgroundColor: themeColors.lightGrey,
		paddingVertical: 5,
		paddingHorizontal: 0
	},
	searchInputContainer: {
		backgroundColor: themeColors.lightGrey,
		padding: 0,
		paddingVertical: 5

	},
	searchInput: {
		backgroundColor: themeColors.lightGrey,
		borderWidth: StyleSheet.hairlineWidth,
		paddingLeft: 20,
		borderRadius: 20,
		left: -5

	},
	searchClear: {
		marginRight: 0
	},

	button1: {
		height: 60,
		paddingHorizontal: 10,
		paddingTop: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	separator: {
		backgroundColor: 'rgb(200, 199, 204)',
		height: StyleSheet.hairlineWidth,
	}
});

export default MainScreen;
