import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Text, StyleSheet, TextInput, View, TouchableOpacity, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { appConstants, themeColors, themeDefaults } from '@/constants/app.constants';
import commonStyle from '@/utils/common.style';
import Button from '@/components/Button/Button';
import { useTranslation } from 'react-i18next';
import { deleteUser, fetchAllData, insertUser, Tables, updateUser } from '@/utils/databases';
import { User } from '@/utils/models';
import { debounce } from '@/utils/utils';
import { FontAwesome } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AlertComponent from '@/components/AlertComponent';
import { DataContext } from '@/context/StaticDataContext';


const UserComponents = () => {
	const [error, setError] = useState<string | null>(null);
	const [value, setValue] = useState('');
	const {loadConfigData} = useContext(DataContext)!;
	const [users, setUsers] = useState<User[]>([]);
	const [isTouched, setIsTouched] = useState(false);
	const [edit, setEdit] = useState<number>(0);
	const [deleteAlert, setDeleteAlert] = useState(false);
	const [toBeDeleted, setToBeDeleted] = useState<number | null>(null);

	const validate = useCallback((value: string) => {
		const v = (value ?? '').trim();

		if ( !v.length ) {
			return;
		}
		if ( v.length < appConstants.minUserLength ) {
			setError(t('common:errors.minLen', {min: appConstants.minUserLength}));
			return;
		}
		if ( v.length > appConstants.maxUserLength ) {
			setError(t('common:errors.minLen', {min: appConstants.maxUserLength}));
			return;
		}

		setError(null);
	}, []);

	const {t} = useTranslation();

	const {showActionSheetWithOptions} = useActionSheet();
	const options = useRef([t('common:actions.delete'),
		t('common:actions.edit'),
		t('common:actions.cancel')]).current;

	const getUsers = useCallback(async () => {
		try {
			const {rows} = await fetchAllData(Tables.USERS);
			const array = rows._array.map(u => ({...u, disabled: u.isDefault == 1}));
			setUsers(array);
		} catch (err) {
			console.log('Error reading users!' + err);
		}
	}, [users]);


	useEffect(() => {
		getUsers();
		validate(value);
	}, []);


	const onChangeText = (value: string) => {
		setValue(value);
		setTimeout(() => validate(value), 500);
	}
	const onUserClick = (user: User) => {
		setIsTouched(false);

		showActionSheetWithOptions({
			options,
			cancelButtonIndex: 2,
			destructiveButtonIndex: 0,
			disabledButtonIndices: user.isDefault ? [0] : [],
			icons: [<FontAwesome name='trash-o' size={30} color={themeColors.header}/>, <FontAwesome name={'edit'} size={30} color={themeColors.header}/>]
		}, (selectedIndex: number | undefined) => {
			switch (selectedIndex) {
				case 0:
					setToBeDeleted(user.id);
					setDeleteAlert(true);
					break;
				case 1:
					setValue(user.nickname);
					setError(null);
					setIsTouched(true);
					setEdit(user.id);
					break;
				case 2:
					//	setChecked([]);
					break;
			}
		});
	}

	const handleUser = async () => {
		try {
			if ( edit ) {
				await updateUser(edit, value);
				setEdit(0)
			} else {
				if ( users.find(user => user.nickname == value) == null) {
					await insertUser(value);
				}
			}
			setValue('');
			setIsTouched(false);
			getUsers();
			await loadConfigData();
		} catch (err) {
			alert('Error inserting user' + err);
		}

	}
	const deleteSelected = async () => {
		if ( !toBeDeleted ) {
			return;
		}
		await deleteUser(toBeDeleted).catch(err => alert('Error ' + err));
		getUsers();
		await loadConfigData()
		setDeleteAlert(false);
	}

	return (<View style={{flex: 1, paddingTop: 10}}>
					<View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
						{
							users.map((user, index) => {
								return <View key={`type${index}`}
											 style={[commonStyle.containerListItem,
												 user.id === edit ? commonStyle.listIemSelected : null,
												 user.isDefault ? styles.disabled : null]}>
									<TouchableOpacity
										onPress={() => onUserClick(user)}
										style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
										<Text>{user?.nickname} </Text>
									</TouchableOpacity>
								</View>
							})
						}
					</View>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'height' : 'height'}
				style={{flex: 1}}
			>

				{error && <Text style={{color: themeColors.error, marginTop: 20}}>{error}</Text>}
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={{marginTop: 20}}>
						<TextInput
							selectTextOnFocus
							onBlur={() => {
								setError(null);
								if ( !value.length && edit ) {
									setEdit(0);
									setError(null);
									setIsTouched(false);
									return;
								}
								debounce(validate(value), 500);
								setIsTouched(true);
							}}
							placeholder={t('settings:users.placeholder')}
							onFocus={() => setError(null)}
							clearButtonMode='always'
							style={commonStyle.input}
							maxLength={appConstants.maxUserLength}
							onChangeText={onChangeText}
							value={value}
						/>
					</View>
				</TouchableWithoutFeedback>

			</KeyboardAvoidingView>

			<Button text={edit ? t('settings:users.editButtonText') : t('settings:users.addButtonText')} disabled={
				error != null || !value.length ||
				!edit && users.length > appConstants.maxUsersNo} buttonStyle={{marginTop: 20, height: themeDefaults.buttonHeight}} onPress={handleUser}/>

			<AlertComponent
				isVisible={deleteAlert}
				closeModal={() => {
					setDeleteAlert(false);
				}}
				message={t(`settings:users.alert.message`)}
				title={t(`settings:users.alert.title`)}
				onPressOK={deleteSelected}/>
		</View>
	);
}

const styles = StyleSheet.create({
	disabled: {
		backgroundColor: themeColors.disabled
	},
	container: {
		flex: 1
	}
});

export default UserComponents;
