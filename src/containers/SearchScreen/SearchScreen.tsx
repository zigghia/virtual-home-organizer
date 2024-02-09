import React, { useEffect, useReducer, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '@/components/Button/Button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAppPermissions } from '@/utils/permissions';
import { SQLResultSet } from 'expo-sqlite';
import { deleteFromTable, fetchAllData, Tables } from '@/utils/databases';
import { ListItemModel, RecordModel, ReducerPayload, User } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { themeColors, themeDefaults } from '@/constants/app.constants';
import ErrorComponent from '@/components/ErrorComponent';
import { useTranslation } from 'react-i18next';
import AlertComponent from '@/components/AlertComponent';
import { useIsFocused } from '@react-navigation/native';
import { CURRENT_USER } from '@/constants/IMLocalize';
import * as punycode from 'punycode';
import { launchCameraAsync } from 'expo-image-picker';
import * as querystring from 'querystring';


const reducer = (state: RecordModel[], action: ReducerPayload): RecordModel[] => {
	switch (action.type) {
		case 'fetch_all':
			return action.payload as RecordModel[];
	}
	return [];
}
const SearchScreen = (props: any) => {
	const [cameraPermission, settingsHandler] = useAppPermissions();
	const [dbData, setDbData] = useState<RecordModel[]>([]);
	const [filteredData, setListData] = useState<RecordModel[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [toBeDeleted, setToBeDeleted] = useState<null | number>(null);
	const isFocus = useIsFocused();
	const [t] = useTranslation();
	const [searchQuery, setSearchQuery] = useState('');

	const getList = async () => {
		try {
			const cu  = await CURRENT_USER(t('common:defaultNickname'));
			const where = [`userID = ${1}`]
			const {rows}: SQLResultSet = await fetchAllData(Tables.PRODUCTS, ' WHERE ' + where.join(' AND '));
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
		getList().catch((err) => {
			console.log('eeee', err);
		});

	}, [isFocus]);

	const deleteRecord = async () => {
		setShowDeleteModal(false);
		if ( !toBeDeleted ) {
			return;
		}

		try {
			await deleteFromTable([toBeDeleted], Tables.PRODUCTS);
			await getList();
		} catch (error) {
			setError(t('common:error.message', {code: '003'}));
			console.log(error);
		}
	}

	const search = (value: string) => {

		setSearchQuery(value);

		if ( value.length > 2 ) {
			const keys = value.split(/\s+/).filter(k => k.length);
			console.log(keys);
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

	const resetSearch = () => {
		setSearchQuery('');
		setListData(dbData);
	}

	const renderItem = ({item}: any) => {
		return <View style={[s.card, commonStyle.shadow]}>
			<Image source={{uri: item.imgUri}} style={s.image}/>
			<View style={{alignContent: 'center', flex: 1}}>
				<TouchableOpacity onPress={() => {
					setToBeDeleted(item.id);
					setShowDeleteModal(true);
				}}>
					<Ionicons name="trash-sharp" size={30} color={themeColors.header}
							  style={{alignSelf: 'flex-end', flex: 1, padding: 5, borderRadius: 50}}/>
				</TouchableOpacity>
				<Text adjustsFontSizeToFit={true}
					  numberOfLines={3}
					  style={{flex: 1, padding: 10, fontSize: themeDefaults.fontSize}}>{item.categories + ' ' + item.colors + ' ' + item.description}</Text>
				<View style={{flex: 4, backgroundColor: themeColors.primary, margin: 10, borderRadius: 10, justifyContent: 'center'}}>
					<Text adjustsFontSizeToFit={true}
						  numberOfLines={1}
						  style={{fontSize: themeDefaults.fontHeader1, textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>{item.containerIdentifier}
					</Text>
				</View>

			</View>
		</View>
	}

	const navigateTpAddNew = async () => {


		if ( !cameraPermission ) {
			settingsHandler();
			return;
		}

		const result = await launchCameraAsync({
			allowsEditing: true,
			aspect: [3, 4],
			quality: 0.5
		});


		if ( result?.canceled ) {
			return;
		}

		const imgUri = result?.assets?.[0]?.uri;

		await props.navigation.navigate('Create', {imgUri: imgUri});
	}

	return (
		<>
			<View style={[s.resetSearch]}>
				<Button isSecondary onPress={resetSearch} text={t('search:reset')}>
					<MaterialIcons name="clear" size={38} color="white" />
				</Button>
			</View>
			<View style={[s.moreFilters]}>
				<Button isSecondary onPress={resetSearch} text={t('search:filters')} disabled>
					<Ionicons name="filter" size={38} color="white" />
				</Button>
			</View>
			<View style={[s.addNew]}>
				<Button isSecondary onPress={navigateTpAddNew} text={t('search:add')}>
					<MaterialIcons name="add-box" size={38} color="white"/>
				</Button>
			</View>
			<View style={[{paddingHorizontal: 10, marginTop: 80, marginBottom: 20, zIndex: 100}]}>
				<TextInput placeholder={'Cauta'}
						   clearButtonMode='while-editing'
						   onChangeText={search}
						   clearTextOnFocus
						   value={searchQuery}
						   style={[commonStyle.shadow, {
							   paddingVertical: 20,
							   paddingHorizontal: 20,
							   fontSize: themeDefaults.fontHeader4,
							   borderTopStartRadius: 4,
							   borderTopEndRadius: 4,
							   backgroundColor: '#fff',
							   borderBottomWidth: 4,
							   marginHorizontal: 0, borderColor: themeColors.secondary
						   }]}></TextInput>
			</View>
			<FlatList
				data={filteredData}
				renderItem={renderItem}
				keyExtractor={(item) => 'display' + item.id}
			/>
			{showDeleteModal ? <AlertComponent onPressNo={() => {
				setShowDeleteModal(false)
			}}
											   message={t('search:deleteMessage')}
											   title={t('search:deleteTitle')}
											   onPressOK={deleteRecord}/> : null}

			{error?.length ? <ErrorComponent transparent
											 message={error}
											 cancelText='OK'
											 closeModal={() => setError(null)}/> : null}
		</>
	)
}


export const s = StyleSheet.create({
	image: {
		width: 200,
		height: 200
	},
	card: {
		backgroundColor: 'white',
		color: 'black',
		margin: 10,
		padding: 10,
		flexDirection: 'row'
	},


	moreFilters: {
		position: 'absolute',
		top: 135,
		paddingTop: 0,
		width: 145,
		height: 70,
		left: 10,
		zIndex: 50,
	},
	addNew: {
		position: 'absolute',
		top: 20,
		paddingTop: 0,
		width: 145,
		left:  156,
		height: 70,
		zIndex: 50
	},
	resetSearch: {
		position: 'absolute',
		top: 20,
		paddingTop: 0,
		width: 145,
		height: 70,
		left: 10,
		zIndex: 50
	}
});

export default SearchScreen;
