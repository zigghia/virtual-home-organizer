import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { RecordModel } from '@/utils/models';
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

const MainScreen = (props: any) => {
	const [dbData, setDbData] = useState<RecordModel[]>([]);
	const [filteredData, setListData] = useState<RecordModel[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [toBeDeleted, setToBeDeleted] = useState<null | number>(null);
	const isFocus = useIsFocused();
	const [t] = useTranslation();


	const getList = async () => {
		try {
			const cu = await CURRENT_USER(t('common:defaultNickname'));
			const {rows}: SQLResultSet = await fetchAllData(Tables.PRODUCTS, ' WHERE userId=? ', [cu?.id ?? 1]);
			setDbData(rows._array);
			setListData(rows._array);
		} catch (error) {
			console.log(error);
		}
	};


	useEffect(() => {
		if ( !isFocus ) {
			return;
		}

		getList().catch((err) => console.log(err));
	}, [isFocus]);

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

	const renderListItem = ({item}: { item: RecordModel }): any => {
		if ( !item ) {
			return;
		}
		return <SwipeRow item={item} deleteAction={deleteAction} editAction={(id) => {
		}}/>
	}

	return (
		<>
			<GestureHandlerRootView style={{flex: 1}}>
				<SearchBar onSearch={search}/>
				<View style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'space-between'}}>
					<TouchableOpacity style={{
						height: 60, borderRightWidth: StyleSheet.hairlineWidth,
						paddingHorizontal: 10,
						borderColor: 'black'
					}} onPress={navigateTpAddNew}>
						<View style={{alignContent: 'center', alignItems: 'center', justifyContent: 'center', flex: 1}}>
							<Text style={{color: themeColors.header, fontWeight: 'bold', padding: 5}}>Adauga</Text>
							<Ionicons name="footsteps-outline" size={24} color={themeColors.header}/>
						</View>

					</TouchableOpacity>

					<View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: "center", padding: 10}}>
						<TouchableOpacity style={{
							height: 60, borderRadius: 0, borderRightWidth: StyleSheet.hairlineWidth, borderColor: 'black',
							justifyContent: 'center',
							paddingRight: 10, backgroundColor: 'transparent'
						}}
										  onPress={navigateTpAddNew}>
							<Ionicons name="grid-outline" size={24} color="black" style={{justifyContent: 'center', alignContent: 'center', alignSelf: 'center'}}/>
						</TouchableOpacity>
						<TouchableOpacity style={{height: 60, borderRadius: 0, justifyContent: 'center', paddingLeft: 10}}>
							<Ionicons name="filter-outline" size={24} color="black"/>
							{/*<Ionicons name="list-outline" size={24} color="black" />*/}
						</TouchableOpacity>
					</View>
				</View>

				<FlatList style={{flex: 1, zIndex: 200}}
						  data={filteredData}
						  ItemSeparatorComponent={() => <View style={s.separator}/>}
						  renderItem={renderListItem}
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
	separator: {
		backgroundColor: 'rgb(200, 199, 204)',
		height: StyleSheet.hairlineWidth,
	}
});

export default MainScreen;
