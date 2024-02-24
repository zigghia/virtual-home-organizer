import React, { useContext, useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { RecordModel, RecordModelExtended, SelectColorItemModel } from '@/utils/models';
import { useIsFocused } from '@react-navigation/native';
import { CURRENT_USER } from '@/constants/IMLocalize';
import { SQLResultSet } from 'expo-sqlite';
import { deleteFromTable, fetchAllData, Tables } from '@/utils/databases';
import * as FileSystem from 'expo-file-system';
import SwipeRow from '@/components/ListComponents/List/SwipeRow';
import { useTranslation } from 'react-i18next';
import { theme, themeColors } from '@/constants/app.constants';
import { Feather, Ionicons } from '@expo/vector-icons';
import AlertComponent from '@/components/AlertComponent';
import ErrorComponent from '@/components/ErrorComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataContext, RecordsNumberContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading';
import GridList from '@/components/ListComponents/List/GridList';
import Filters from '@/components/MainScreen/Filters';
import { SearchBar } from '@rneui/themed';
import commonStyle from '@/utils/common.style';

const MainScreen = (props: any) => {
	const [dbData, setDbData] = useState<RecordModelExtended[]>([]);
	const [filteredData, setFilteredData] = useState<RecordModelExtended[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showFilters, setShowFilters] = useState<boolean | null>(null);
	const [toBeDeleted, setToBeDeleted] = useState<null | number>(null);
	const {data, init} = useContext(DataContext)!;
	const [search, setSearch] = useState<string | undefined>("");
	const [isList, setIsList] = useState(true);
	const [loading, setLoading] = useState(init ?? false);
	const isFocus = useIsFocused();
	const [t] = useTranslation();
	const {setTotal} = useContext(RecordsNumberContext)!;
	const ref = useRef(null);

	const setListData = (data: RecordModelExtended[]) => {
		setFilteredData(data);
		setTotal(data.length ?? 0);
	}

	const getList = async () => {
		try {
			const cu = await CURRENT_USER(t('common:defaultNickname'));
			const {rows}: SQLResultSet = await fetchAllData(Tables.PRODUCTS, ' WHERE userId=? ', [cu?.id ?? 1]);

			//add colorsInfo
			const fullData: RecordModelExtended[] = rows._array.map(record => {
				const cArr = record.colors.split(',').map((c: string) => c.trim().toLowerCase()) ?? [];
				return {...record, colorsInfo: (data.colors ?? []).filter(c => cArr.includes(c.name?.toLowerCase()))}
			});

			setDbData(fullData);
			setListData(fullData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if ( !isFocus || init ) {
			return;
		}

		getList().catch((err) => console.log(err));
		setLoading(false);
	}, [isFocus, init]);


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

	const editAction = async (item: RecordModelExtended) => {
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
		return <Loading/>
	}

	const showFiltersPAnel = () => {
		//if ()
	}

	const icon = () => {
		return <Ionicons name='search' size={24} color="black" />
	}

	return (
		<>
			<GestureHandlerRootView style={{flex: 1, backgroundColor: themeColors.white}}>
				<SearchBar
					lightTheme
					searchIcon = {icon()}
					rightIconContainerStyle = {s.searchClear}
					inputStyle = {s.searchInput}
					inputContainerStyle =  {s.searchInputContainer}
					containerStyle =  {s.searchContainer}
					placeholder={t('search:searchPlaceholder')}
					onChangeText={searchData}
					value={search}
				/>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
					<View style={s.buttonContainer2}>
						<TouchableOpacity style={s.button1} onPress={() => setIsList(!isList)}>
							<Ionicons name={isList ? 'grid-outline' : "list-outline"} size={30} color="black"/>
						</TouchableOpacity>
						<TouchableOpacity style={{...s.button1, paddingLeft: 10}} onPress={() => setShowFilters(!showFilters)}>
							<Ionicons name="options" size={30} color="black" ref={ref}/>
						</TouchableOpacity>
					</View>
				</View>
				{<Filters isVisible={showFilters}/>}
				{isList ?
					<FlatList style={{flex: 1, padding: 10}}
							  data={filteredData}
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
		</>
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
		padding:2,
		borderRadius: 10,
		...commonStyle.shadow
	},
	searchInput: {
		backgroundColor: 'white',
		padding: 3,
		borderRadius: 3},
	searchClear : {
		width: 24,
		padding: 5
	},
	buttonContainer2: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		alignContent: 'center',
		paddingHorizontal: 10
	},
	button1: {
		height: 60,
		paddingHorizontal: 10,
		paddingTop: 5,
		justifyContent: 'center'
	},
	separator: {
		backgroundColor: 'rgb(200, 199, 204)',
		height: StyleSheet.hairlineWidth,
	}
});

export default MainScreen;
