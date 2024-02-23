import React, { useContext, useEffect, useState } from "react";
import InfoTextFieldComponent from '@/components/CreateNewRecord/InfoTextFieldComponent';
import { useTranslation } from 'react-i18next';
import commonStyle from '@/utils/common.style';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { ListItemModel } from '@/utils/models';
import { themeColors } from '@/constants/app.constants';
import { DataContext } from '@/context/StaticDataContext';

interface LocationProps extends WithTemplateListProps {
	value: string,
	list?: [],
	onValueSaved: (value: string) => void
}

const LocationComponent = ({list, value, onValueSaved}: LocationProps) => {
	const [t] = useTranslation();
	const {data, dispatch} = React.useContext(DataContext)!;
	const [readOnly, setReadOnly] = useState(false);

	useEffect(() => {
		setReadOnly(data.descriptions.some(d => d.selected));
	}, [value]);

	const updateByIdHandler = (item: ListItemModel) => {
		if ( !item?.name ) {
			return;
		}
		dispatch({type: 'update', payload: {key: 'descriptions', id: item.id, unique: true}});
	}

	const updateByNameHandler = (value: string | undefined | number) => {
		const v = (value ?? '').toString().toLowerCase();
		const di =  data.descriptions.find(d => d.name == value);
		if (di?.id) {
			dispatch({type: 'update', payload: {key: 'descriptions', id: di.id, unique: true}});
			return;
		}
		onValueSaved(v);
	}


	return (
		<>{
			(list ?? []).map((line: [], index: number) => {
				return <View style={commonStyle.containerList} key={`line${index}`}>
					{
						line.map((item: ListItemModel, index) =>
							<View key={`type${index}`} style={[commonStyle.containerListItem, s.container, item.selected && s.background]}>
								<TouchableOpacity
									onPress={() => updateByIdHandler(item)}
									style={{flex: 1, alignItems: 'center', paddingVertical: 10}}>
									<Text style={item.selected && s.textWhite}>{item?.name} </Text>
								</TouchableOpacity>
							</View>
						)
					}
				</View>
			})
		}
			<View style={{marginTop: 10}}>
				<InfoTextFieldComponent value={value}
							   editDisabled={readOnly}
							   onValueSaved={updateByNameHandler}
							   maxLen={{message: t('common:errors.maxLen', {max: 10}), value: 10}}/>
			</View>
		</>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 3
	},
	background: {
		backgroundColor: themeColors.secondary
	},
	textWhite: {
		color: 'white',
		fontSize: 15
	}
});

export default withTemplateList(LocationComponent, 2);
