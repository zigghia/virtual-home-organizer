import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, Text, ImageBackground, Image } from 'react-native';
import { RecordModel } from '@/utils/models';
import { useIsFocused } from '@react-navigation/native';
import { SQLResultSet } from 'expo-sqlite';
import { deleteFromTable, fetchAllData, Tables } from '@/utils/databases';
import * as FileSystem from 'expo-file-system';
import SwipeRow from '@/components/ListComponents/List/SwipeRow';
import { useTranslation } from 'react-i18next';
import { themeColors } from '@/constants/app.constants';
import { Ionicons } from '@expo/vector-icons';
import AlertComponent from '@/components/AlertComponent';
import ErrorComponent from '@/components/ErrorComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataContext } from '@/context/StaticDataContext';
import GridList from '@/components/ListComponents/List/GridList';
import Filters from '@/components/MainScreen/Filters';
import { SearchBar } from '@rneui/themed';
import commonStyle from '@/utils/common.style';
import Intro from '@/components/Animations/Intro';
import Animated, { FadeIn } from 'react-native-reanimated';

const MainScreen = (props: any) => {
	const [dbData, setDbData] = useState<RecordModel[]>([]);
	const [filteredData, setFilteredData] = useState<RecordModel[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showFilters, setShowFilters] = useState<boolean | null>(null);
	const [toBeDeleted, setToBeDeleted] = useState<null | number>(null);
	const {data, loadingConfigData, loadConfigData} = useContext(DataContext)!;
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState<string | undefined>("");
	const [isList, setIsList] = useState(true);
	const isFocus = useIsFocused();
	const [t] = useTranslation();
	const ref = useRef(null);

	const setListData = (data: RecordModel[]) => {
		setFilteredData(data);
	}

	const getList = async () => {
		try {
			setLoading(true);
			const {rows}: SQLResultSet = await fetchAllData(Tables.PRODUCTS);
			//add colorsInfo
			const fullData: RecordModel[] = rows._array.map(record => {
				const cArr = record.colors.split(',').map((c: string) => c.trim().toLowerCase()) ?? [];
				return {...record, colorsInfo: (data.colors ?? []).filter(c => cArr.includes(c.name?.toLowerCase()))}
			});
//colorsInfo
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

	const searchData = (value: string) => {
		setSearch(value);
		if ( value.length == 0 ) {
			setListData(dbData);
			return;
		}

		if ( value.length > 2 ) {
			const keys = value.split(/\s+/).filter(k => k.length);

			const newList: RecordModel[] = [];
			dbData.forEach(item => {
				let notFound = keys.some(k => item.searchKeys?.search(k) == -1);
				if ( !notFound ) {
					newList.push(item);
				}
			});
			setListData(newList);
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


	const renderItem = ({item, index}: { item: RecordModel, index: number }): any => {
		if ( !item ) {
			return;
		}
		return <SwipeRow key={`list${index}-${item.id}`}
						 item={item}
						 index={index}
						 deleteAction={deleteAction}
						 editAction={editAction}/>

	}

	if ( loading ) {
		return null
	}


	if ( !dbData.length ) {
		return <Intro/>;
	}

	return (
		<Animated.View style={{flex: 1, backgroundColor: 'white'}} entering={FadeIn.duration(200)}>
			<SearchBar
				disabled={dbData.length == 0}
				lightTheme
				searchIcon={<Ionicons name='search' size={24} color="black"/>}
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
					<Text> {t('common:total') + ':' + filteredData.length}</Text>
				</View>
				<View style={{flexDirection: 'row'}}>
					<TouchableOpacity style={s.button1} disabled={showFilters == true}
									  onPress={() => setIsList(!isList)}>
						<Ionicons name={isList ? 'grid-outline' : "list-outline"} size={28} color={showFilters ? themeColors.disabled : themeColors.header}/>
						<Text>{!isList ? t('search:list') : t('search:grid')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{...s.button1, paddingLeft: 10}}
									  onPress={() => setShowFilters(!showFilters)}>
						<Ionicons name="options" size={30} color="black" ref={ref}/>
						<Text>{t('search:filters')}</Text>
					</TouchableOpacity>
				</View>
			</View>

			<Filters isVisible={showFilters}
					 cancel={() => setShowFilters(false)}
					 search={(value: string) => {
						 searchData(value);
						 setShowFilters(false);
					 }}/>

			<GestureHandlerRootView style={{flex: 1}}>
				{isList ?
					<FlatList data={filteredData}
							  ItemSeparatorComponent={() => <View style={s.separator}/>}
							  renderItem={renderItem}
							  keyExtractor={(_item, index) => `list${index}`}
					/> :
					<GridList items={filteredData} deleteAction={deleteAction} editAction={editAction}/>
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

			{error && <ErrorComponent transparent
									  message={error}
									  cancelText='OK'
									  closeModal={() => setError(null)}/>
			}
		</Animated.View>
	);
}

export const s = StyleSheet.create({
	searchContainer: {
		backgroundColor: 'white',
		paddingVertical: 5,
		paddingHorizontal: 5,
		borderBottomColor: 'white'
	},
	searchInputContainer: {
		backgroundColor: themeColors.disabled,
		padding: 2,
		borderRadius: 10,
		...commonStyle.shadow
	},
	searchInput: {
		backgroundColor: 'white',
		padding: 3,
		borderRadius: 3
	},
	searchClear: {
		width: 24,
		padding: 5
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
