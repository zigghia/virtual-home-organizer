import React, {  useEffect, useState } from "react";
import { Text } from "@rneui/base";
import { Image, Pressable, StyleSheet, View } from "react-native";
import withModal from '@/hoc/withModal';
import { ListItemModel, RecordModel, RecordModelExtended, SelectColorItemModel } from '@/utils/models';
import { themeColors, themeDefaults } from '@/constants/app.constants';

import { DataContext } from '@/context/StaticDataContext';
import { s as st } from '@/components/CreateNewRecord/SelectColors/SelectColors.style';
import { Entypo } from '@expo/vector-icons';
import RenderColors from '@/components/RenderColorsBullet';

interface PreviewItemProps {
	colors?: SelectColorItemModel[],
	categories: string [],
	formValues: RecordModelExtended,
	closeModal: () => void
}

const PreviewItem = ({formValues, categories, colors, closeModal}: PreviewItemProps) => {
	const [coolors, setColors] = useState<SelectColorItemModel[]>([]);

	useEffect(() => {
		let c = colors ?? [];
		if (!colors?.length) {
			c = formValues?.colorsInfo ?? [];
		}
		setColors(c);
	},[])

	return (
		<View style={s.container}>
			<View style={{backgroundColor: themeColors.secondary}}>
				<Entypo name="price-tag" size={80} color='white'
						style={s.priceTag}>
					<Text style={{color: 'white', fontSize: 80,}}>{formValues?.containerIdentifier ?? '?'}</Text>
				</Entypo>
			</View>
			{ formValues?.description && <View style={{paddingVertical: 10, paddingLeft: 5}}><Text style={s.text}>{formValues.description.toUpperCase()}</Text></View>}
			{ formValues?.season && <View style={{paddingVertical: 5, paddingLeft: 5}}><Text style={s.text}>{formValues.season.toLowerCase()}</Text></View>}
			{ categories.length ? <View style={s.categoriesContainer}>
										{
											categories.map((c, index) =>
												<View key={'category' + index} style={s.categoriesStyle}>
													<Text lineBreakMode={'clip'} style={[s.text, {padding: 10}]}>{c}</Text>
												</View>)
										}
									</View>: null
			}

			{coolors.length ?  <RenderColors items={coolors} /> : null}

			<Pressable style={[s.item, {justifyContent: 'center', marginVertical: 10}]} onPress={closeModal}>
				{formValues?.imgUri?.length && <Image source={{uri: formValues.imgUri}} style={s.image}/>}
			</Pressable>

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

export default withModal(PreviewItem, {position: 'full'});
