import React, {  useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View, Text } from "react-native";
import withModal from '@/hoc/withModal';
import { RecordModelExtended, SelectColorItemModel } from '@/utils/models';
import { themeColors } from '@/constants/app.constants';
import { FontAwesome5 } from '@expo/vector-icons';
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
				<FontAwesome5 name="box-open" size={80} color='white' style={s.boxNo}>
					<Text style={{color: 'white', fontSize: 80,}}>{formValues?.containerIdentifier ?? '?'}</Text>
				</FontAwesome5>
			</View>
			{ formValues?.description && <View style={{paddingVertical: 10, paddingLeft: 5}}><Text style={s.text}>{formValues.description.toUpperCase()}</Text></View>}
			{ formValues?.season && <View style={{paddingVertical: 5, paddingLeft: 5}}><Text style={s.text}>{formValues.season.toLowerCase()}</Text></View>}
			{ categories.length ? <View style={s.categoriesContainer}>
										{
											categories.map((c, index) =>
												<View key={'category' + index} style={s.categoriesStyle}>
													<Text lineBreakMode={'clip'} style={[s.text, {padding: 5}]}>{c}</Text>
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
	boxNo :{
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
	image: {
		minHeight: 250,
	},
	item: {
		backgroundColor: '#fefefe',

	}
});

export default withModal(PreviewItem, {position: 'full'});
