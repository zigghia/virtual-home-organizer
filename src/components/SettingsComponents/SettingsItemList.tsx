import Checkbox from 'expo-checkbox';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { ListItemModel, User } from '@/utils/models';
import Button from '@/components/Button/Button';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';
import { useTranslation } from 'react-i18next';
import { deleteFromTable, loadPropertiedData, Tables } from '@/utils/databases';
import AlertComponent from '@/components/AlertComponent';
import { DataContext } from '@/context/StaticDataContext';
import { ListItemCheckBox } from '@rneui/base/dist/ListItem/ListItem.CheckBox';
import SettingsCheckbox from '@/components/SettingsComponents/SettingsCheckbox';

interface CLProps extends WithTemplateListProps {
	list: [];
	deleted: (value: boolean) => void,
	type: 'categories' | 'descriptions'
}

const SettingsItemsList = ({list, deleted, type}: CLProps) => {
	const [checked, setChecked] = useState<{ [key: number]: boolean }>({});
	const [buttonDisabled, setButtonDisabled] = useState(true)
	const [t, i18n] = useTranslation();
	const [showAlertModal, setShowAlert] = useState(false);
	const {dispatch} = useContext(DataContext)!;

	const check = (value: boolean, id: number) => {

		const newVal = {...checked, [id]: value};
		setChecked(newVal);
		setButtonDisabled(!Object.keys(newVal).some((k) => newVal[Number(k)]));
	}

	const deleteSelected = async () => {
		setButtonDisabled(true);
		try {
			const ids = Object.entries(checked).filter(e => e[1]).map(e => Number(e[0]));
			setShowAlert(false);
			await deleteFromTable(ids, Tables.PROPERTIES).catch(err => console.log('some err', err));
			const newData = await loadPropertiedData(i18n.language).catch(err => alert(err));
			dispatch({type: 'recalculate', payload: {data: newData, type}});
			deleted(true);
			setChecked([]);

		} catch (err) {
			console.log('Delete settings', err);
			deleted(false);
			Alert.alert(
				t(`settings:${type}.alert.error.title`),
				t(`settings:${type}.alert.error.message`));
		}
	}

	return <View>
		{
			(list ?? []).map((line: ListItemModel[], index: number) => {
				return <View style={commonStyle.containerList} key={`line${index}`}>
					{line.map((item, i) =>
						        <SettingsCheckbox key={'settingsItemList'+type + i}
							  		 onValueChange={value => check(value, Number(item.id))}
									 name = {item.name ?? ''}
						             id = {item.id}
						             value = {checked[item.id] ?? false}/>)}
				</View>
			})
		}

		<Button buttonStyle={styles.container}
				text={t(`settings:${type}.buttonText`)}
				onPress={() => setShowAlert(true)}
				disabled={buttonDisabled}/>

		<AlertComponent
			isVisible={showAlertModal}
			closeModal={() => {
				setShowAlert(false);
			}}
			message={t(`settings:${type}.alert.message`)}
			title={t(`settings:${type}.alert.title`)}
			onPressOK={deleteSelected}/>
	</View>
}

const styles = StyleSheet.create({
	disabled: {
		backgroundColor: themeColors.disabled,
		borderWidth: 5,
		borderColor: 'red'
	},
	container: {
		marginVertical: 20,
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flex: 1
	},
	paragraph: {
		fontSize: 15,
	},
	checkbox: {
		margin: 8,
		height: 40,
		width: 40,
		borderRadius: 10,
		padding: 5
	},
});

export default withTemplateList(SettingsItemsList, 2);
