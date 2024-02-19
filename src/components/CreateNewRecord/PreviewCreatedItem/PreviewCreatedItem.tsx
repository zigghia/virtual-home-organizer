import React, { ComponentType, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text } from "@rneui/base";
import { FlatList, Image, Modal, StyleSheet, View } from "react-native";
import withModal from '@/hoc/withModal';
import { ListItemModel, RecordModel, SelectColorItemModel } from '@/utils/models';
import { useTranslation } from 'react-i18next';
import { themeColors, themeDefaults } from '@/constants/app.constants';

import { DataContext } from '@/context/StaticDataContext';
import { s as st } from '@/components/CreateNewRecord/SelectColors/SelectColors.style';
import { Entypo } from '@expo/vector-icons';

interface PreviewCreatedItemProps {
	colors: SelectColorItemModel[],
	categories: ListItemModel[],
	formValues: RecordModel
}

type ItemProps = { id: string; value: string; title?: string; titleStyle: {}, itemStyle: {}, textContainerStyle?: {} };
const Item = ({title, value, titleStyle, itemStyle, textContainerStyle}: ItemProps) => (
	value ?
		<View style={itemStyle}>
			<View style={s.textContainer}>
				<Text style={titleStyle}> {title}</Text>
				<Text style={titleStyle}> {value}</Text>
			</View>
		</View>
		: null
);
const PreviewCreatedItem = ({formValues}: PreviewCreatedItemProps) => {

	const {data} = React.useContext(DataContext)!;
	const [colors, setColors] = useState<SelectColorItemModel[]>([]);
	const [categories, setCategories] = useState<string[]>([]);

	useEffect(() => {
		setColors(data.colors.filter(c => c.selected).map(c => ({bgColor: c.bgColor, name: c.name})));
		setCategories(data.categories.filter(c => c.selected).map(c => c.name ?? ''));
	}, []);

	return (
		<View style={s.container}>
			<View style={{backgroundColor: themeColors.secondary}}>
				<Entypo name="price-tag" size={80} color='white'
						style={s.priceTag}>
					<Text style={{color: 'white', fontSize: 80,}}>{formValues.containerIdentifier ?? '?'}</Text>
				</Entypo>
			</View>
			{ formValues.description && <View style={{paddingVertical: 10, paddingLeft: 5}}><Text style={s.text}>{formValues.description.toUpperCase()}</Text></View>}

			{ categories[0] && <View style={s.categoriesContainer}>
										{
											categories.map((c, index) =>
																			<View key={'category' + index} style={s.categoriesStyle}>
																							<Text lineBreakMode={'clip'} style={[s.text, {padding: 10}]}>{c}</Text>
																			</View>)
										}
									</View>
			}

			{ colors[0] && <View style={s.colorsContainer}>
				{
					colors.map((c, index) => <View key={'color' + index} style={[st.color, {height: 30, backgroundColor: c?.bgColor}]}/>)

				}
				</View>
			}

			<View style={[s.item, {justifyContent: 'center', marginVertical: 10}]}>
				{formValues?.imgUri?.length && <Image source={{uri: formValues.imgUri}} style={s.image}/>}
			</View>

		</View>

	);
}

export const s = StyleSheet.create({
	colorsContainer: {
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	container: {
		margin: 10,
		padding: 10
	},
	priceTag :{
		verticalAlign: 'bottom',
		alignItems: 'center',
		alignSelf: 'center',
		padding: 10,
	},
	categoriesContainer: {
		marginVertical: 10,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexWrap: 'wrap'
	},
	categoriesStyle: {
		flexDirection: 'row',
		borderRightWidth: StyleSheet.hairlineWidth,
		borderColor: themeColors.disabled,
		borderLeftWidth: StyleSheet.hairlineWidth
	},
	text: {
		fontSize: 25,
		color: themeColors.header
	},
	textContainer: {
		flexDirection: 'row'
	},
	boxTitle: {
		fontSize: themeDefaults.fontHeader1,
		textAlign: 'center',
		color: '#fff',
		fontWeight: 'bold'
	},
	boxContainer: {
		textAlignVertical: 'center',
	},
	textContainerTitle: {
		textAlign: 'center',
		padding: 20,
		backgroundColor: themeColors.secondary,
		borderRadius: 10
	},
	image: {
		minHeight: 250,
	},
	item: {
		backgroundColor: '#fefefe',

	},
	title: {
		fontSize: themeDefaults.fontHeader3,
	},
});

export default withModal(PreviewCreatedItem, {position: 'full'});
