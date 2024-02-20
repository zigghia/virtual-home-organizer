import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { RecordModel, RecordModelExtended, SelectColorItemModel } from '@/utils/models';
import { useIsFocused } from '@react-navigation/native';
import { CURRENT_USER } from '@/constants/IMLocalize';
import { SQLResultSet } from 'expo-sqlite';
import { deleteFromTable, fetchAllData, Tables } from '@/utils/databases';
import * as FileSystem from 'expo-file-system';
import SwipeRow from '@/components/ListComponents/List/SwipeRow';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/ListComponents/SearchBar';
import { themeColors } from '@/constants/app.constants';
import { Ionicons } from '@expo/vector-icons';
import AlertComponent from '@/components/AlertComponent';
import ErrorComponent from '@/components/ErrorComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading/Loading';
import GridItem from '@/components/ListComponents/List/GridItem';

const MainScreen = (props: any) => {
	const [dbData, setDbData] = useState<RecordModelExtended[]>([]);
	const [filteredData, setListData] = useState<RecordModelExtended[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [toBeDeleted, setToBeDeleted] = useState<null | number>(null);
	const {data, init} = useContext(DataContext)!;
	const [isList, setIsList] = useState(true);
	const [loading, setLoading] = useState(init ?? false);
	const isFocus = useIsFocused();
	const [t] = useTranslation();


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

	const search = (value: string) => {
		if ( !value ) {
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

	const deleteAction = (id: number | undefined) => {
		if ( !id ) {
			return;
		}
		setToBeDeleted(id);
		setShowDeleteModal(true);
	}

	const navigateTpAddNew = async () => {
		await props.navigation.navigate('Create');
	}

	const renderItem = ({item, index}: { item: RecordModel, index: number }): any => {
		if ( !item ) {
			return;
		}
		return isList ? <SwipeRow key= {`list${index}-${item.id}`} item={item} index={index} deleteAction={deleteAction} editAction={(id) => {}}/>
						: <GridItem  key= {`grid${index}-${item.id}`} editAction={() => {}}  deleteAction={deleteAction} item={item}/>
	}

	if ( loading ) {
		return <Loading/>
	}


	return (
		<>
			<GestureHandlerRootView style={{flex: 1}}>
				<SearchBar onSearch={search} placeholder={t('search:searchPlaceholder')}/>
				<View style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'space-between'}}>
					<TouchableOpacity style={s.button1} onPress={navigateTpAddNew}>
						<View style={s.buttonContainer1}>
							<Ionicons name="footsteps-outline" size={24} color={themeColors.header}/>
							<Text style={s.buttonText}>{t('search:add')}</Text>
						</View>
					</TouchableOpacity>

					<View style={s.buttonContainer2}>
						<TouchableOpacity style={[s.button1,{justifyContent: 'center'}]} onPress={() => setIsList(!isList)}>
							<Ionicons name={isList ? "list-outline" : 'grid-outline'} size={24} color="black"/>
						</TouchableOpacity>
						<TouchableOpacity style={{height: 60, borderRadius: 0, justifyContent: 'center', paddingLeft: 10}} disabled>
							<Ionicons name='filter-outline' size={24} color="black" disabled/>
						</TouchableOpacity>
					</View>
				</View>

				<FlatList style={{flex: 1, zIndex: 200}}
						  data={filteredData}
						  ItemSeparatorComponent={() => <View style={s.separator}/>}
						  renderItem={renderItem}
						  keyExtractor={(_item, index) => `list${index}`}
				/>
			</GestureHandlerRootView>

			{
				<AlertComponent
					isVisible={showDeleteModal}
					closeModal={() => {
						setShowDeleteModal(false)
					}}
					message={t('search:deleteMessage')}
					title={t('search:deleteTitle')}
					onPressOK={deleteRecord}/>
			}

			{error && <ErrorComponent transparent
									  message={error}
									  cancelText='OK'
									  closeModal={() => setError(null)}/>
			}
		</>
	);
}

export const s = StyleSheet.create({
	buttonContainer2: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		alignContent: 'center',
		padding: 10
	},
	buttonText: {
		color: themeColors.header,
		fontWeight: 'bold',
		padding: 5
	},
	buttonContainer1 : {
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		minWidth: 50
	},
	button1: {
		height: 60,
		borderRightWidth: StyleSheet.hairlineWidth,
		paddingHorizontal: 10,
		borderColor: 'black'
	},
	separator: {
		backgroundColor: 'rgb(200, 199, 204)',
		height: StyleSheet.hairlineWidth,
	}
});

export default MainScreen;