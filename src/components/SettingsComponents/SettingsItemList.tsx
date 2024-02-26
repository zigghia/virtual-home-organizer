import React, { useState } from 'react';
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
import { CheckBox } from '@rneui/themed';

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

	const check = (id: number) => {
		const newVal = {...checked, [id]: !checked[id]};
		setChecked(newVal);
		setButtonDisabled(!Object.keys(newVal).some((k) => newVal[Number(k)]));
	}

	const deleteSelected = async () => {
		setButtonDisabled(true);
		try {
			const ids = Object.entries(checked).filter(e => e[1]).map(e => Number(e[0]));
			await deleteFromTable(ids, Tables.PROPERTIES).catch(err => console.log('some err', err));
			const newData = await loadPropertiedData(i18n.language).catch(err => alert(err));
			deleted(true);
			setChecked([]);
			setTimeout(() => setShowAlert(false), 200);
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
								<CheckBox checked={checked[item.id] ?? false}
									  onPress={_ => check(item.id)}
									  title= {item.name ?? ''}
									  key={'settingsItemList'+type + i} size={32}
									  checkedColor={themeColors.secondary}/>
					          )
					}
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
