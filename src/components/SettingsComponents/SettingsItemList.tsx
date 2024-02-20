import Checkbox from 'expo-checkbox';
import React, { ComponentProps, JSXElementConstructor, useCallback, useContext, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { ListItemModel, SelectColorItemModel } from '@/utils/models';
import Button from '@/components/Button/Button';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';
import { useTranslation } from 'react-i18next';
import { deleteFromTable, loadPropertiedData, Tables } from '@/utils/databases';
import AlertComponent from '@/components/AlertComponent';
import StaticDataContext, { DataContext } from '@/context/StaticDataContext';

interface CLProps extends WithTemplateListProps{
	list: [];
	deleted: (value: boolean) => void,
	type: 'categories' | 'descriptions'
}

const SettingsItemsList = ({list, deleted, type}: CLProps) => {
	const [checked, setChecked] = useState<{ [key: number]: boolean }>({});
	const [buttonDisabled, setButtonDisabled] = useState(true)
	const [t, i18n] = useTranslation();
	const [showAlertModal, setShowAlert] = useState(false);
	const {data, dispatch} = useContext(DataContext)!;

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

		}
		catch (err) {
			console.log('Delete settings', err);
			deleted(false);
			Alert.alert(
				t('settings:categories.alert.error.title'),
				t('settings:categories.alert.error.message'));
		}
	}
	const renderItem = (item: ListItemModel) => {
		if (!item?.id) {
			return;
		}

		return <View style={styles.section} key={`check${item.id}`}>
			<Checkbox
				style={styles.checkbox}
				value={checked[item.id] ?? false}
				onValueChange={value => check(value, Number(item.id))}
				color={checked[item.id] ? themeColors.secondary : undefined}
			/>
			<Text style={styles.paragraph}>{item.name}</Text>
		</View>
	}

	return <View>
		{
			(list ?? []).map((line: ListItemModel[], index: number) => {
				return <View style={commonStyle.containerList} key={`line${index}`}>
					{line.map(item => renderItem(item))}
				</View>
			})
		}

		<View style={styles.container}>
			<Button text='Sterge' onPress={() => setShowAlert(true)} disabled={buttonDisabled}></Button>
		</View>

		<AlertComponent
			isVisible={showAlertModal}
			closeModal={() => {
				setShowAlert(false)
			}}
			message={t(`settings:${type}.alert.message`)}
			title={t(`settings:${type}.alert.title`)}
			onPressOK={deleteSelected}/>
	</View>
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 32,
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
