import Checkbox from 'expo-checkbox';
import React, { ComponentProps, JSXElementConstructor, useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { ListItemModel, SelectColorItemModel } from '@/utils/models';
import Button from '@/components/Button/Button';
import withTemplateList from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';
import { useTranslation } from 'react-i18next';
import { deleteFromTable, Tables } from '@/utils/databases';

interface CLProps {
	list: [];
	items: [];
	deleted: (value: boolean) => void
}

const CategoriesList = ({list, deleted}: CLProps) => {
	const [checked, setChecked] = useState<{ [key: number]: boolean }>({});
	const [buttonDisabled, setButtonDisabled] = useState(true)
	const [t, i18n] = useTranslation();

	const check = (value: boolean, id: number) => {
		const newVal = {...checked, [id]: value};
		setChecked(newVal);
		setButtonDisabled(!Object.keys(newVal).some((k) => newVal[Number(k)]));
	}

	const deleteSelectedCategories = async () => {
		const ids = Object.entries(checked).filter(e => e[1]).map(e => Number(e[0]));
		return await deleteFromTable(ids, Tables.PROPERTIES).catch(err => console.log('some err', err));
	}

	const showAlert = async () => {
		Alert.alert(t('settings:categories.alert.title'),
			t('settings:categories.alert.message'),
			[
				{
					text: t('common:permission.camera.no'),
					style: 'cancel',
				},
				{
					text: t('common:permission.camera.yes'),
					onPress: () => {
						deleteSelectedCategories()
							.then(() => {
								setChecked([]);
								deleted(true)
							})
							.catch(() => {
								deleted(false);
								Alert.alert(
									t('settings:categories.alert.error.title'),
									t('settings:categories.alert.error.message'));
							});
					}
				}
			]);
	}
	const renderItem = (item: ListItemModel) => {

		return <View style={styles.section} key={`check${item.id}`}>
			<Checkbox
				style={styles.checkbox}
				value={checked[item.id] ?? false}
				onValueChange={value => check(value, item.id)}
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
			<Button text='Sterge' onPress={showAlert} disabled={buttonDisabled}></Button>
		</View>
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

export default withTemplateList(CategoriesList, 2);
