import React, { ComponentType, useMemo } from "react";
import { Card, Text } from "@rneui/base";
import { FlatList, Image, Modal, StyleSheet, View } from "react-native";
import withModal from '@/hoc/withModal';
import { ListItemModel, RecordModel, SelectColorItemModel } from '@/utils/models';
import { useTranslation } from 'react-i18next';
import { themeColors, themeDefaults } from '@/constants/app.constants';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Ionicons } from '@expo/vector-icons';

interface PreviewCreatedItemProps {
	colors: SelectColorItemModel[],
	categories: ListItemModel[],
	formValues: RecordModel
}

type ItemProps = { id: string; value:  string; title?: string; titleStyle: {}, itemStyle: {}, textContainerStyle?: {} };
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
const PreviewCreatedItem = ({colors, categories, formValues}: PreviewCreatedItemProps) => {
	const [t] = useTranslation();
	const categoryList = useMemo(() => (categories ?? []).filter(c => c.selected).map(c => c.name).join(), categories);
	const colorsList = useMemo(() => (colors ?? []).filter(c => c.selected).map(c => c.name).join(), colors);

	const DATA = [
		{
			id: 'previewList1',
			title: 'Culori:',
			value: 'shshdhd, dddd',
			titleStyle: s.title,
			itemStyle: s.item

		},
		{
			id: 'previewList2',
			title: 'Categorii:',
			value: 'dddd ddd',
			titleStyle: s.title,
			itemStyle: s.item
		},
		{
			id: 'previewList3',
			title: 'Observatii: ',
			value: formValues?.description ?? ' ddddddddddddd',
			titleStyle: s.title,
			itemStyle: s.item
		},
		{
			id: 'previewList4',
			title: 'Observatii: ',
			value: formValues?.description ?? ' ddddddddddddd',
			titleStyle: s.title,
			itemStyle: s.item
		},
		{
			id: 'previewList5',
			title: 'Observatii: ',
			value: formValues?.description ?? ' ddddddddddddd',
			titleStyle: s.title,
			itemStyle: s.item
		},
	];

	return (
	  <SafeAreaView>
			<View style={{backgroundColor: themeColors.secondary, paddingVertical: 40}}>
				<Entypo name="price-tag" size={100} color='white'
						style={{  shadowColor: "#000", verticalAlign: 'bottom', alignItems: 'center', alignSelf: 'center',
							padding: 10,
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.25,
							shadowRadius: 4,
							elevation: 3,}}>
					<Text style={{ color: 'white',fontSize: 100,}}>12</Text>
				</Entypo>



			</View>
			<View>
				<FlatList style={{maxHeight:  300}}
					data={DATA}
					renderItem={({item}) => <Item  {...item}/>}
					keyExtractor={item => item.id}
				/>
			</View>
			<View style={[s.item, {justifyContent: 'center'}]}>
				{formValues?.imgUri?.length && <Image source={{uri: formValues.imgUri}} style={s.image}/>}
			</View>

	  </SafeAreaView>

	);
}

export const s = StyleSheet.create({
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
		paddingHorizontal: '30%',
		justifyContent: 'center',
		paddingBottom: 20,
		shadowColor: "#000",
		padding: 10,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,

		elevation: 3,
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
		shadowColor: "#000",
		padding: 10,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,

		elevation: 3,
	},
	title: {
		fontSize: themeDefaults.fontHeader3,
	},
});

export default withModal(PreviewCreatedItem);
