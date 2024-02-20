import React, { useState } from "react";
import { Button, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import SwipeableItem from '@/components/ListComponents/List/SwipeItem';
import { ListItemModel, RecordModel, RecordModelExtended, SelectColorItemModel } from '@/utils/models';
import 'react-native-gesture-handler';
import { s as st } from '@/components/CreateNewRecord/SelectColors/SelectColors.style';
import withTemplateList, { WithTemplateListProps, WithTemplateListPropsSimple } from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';
import { BackgroundImage } from '@rneui/base';
import RenderColors from '@/components/RenderColorsBullet/RenderColors';

export interface MainListItemProps {
	editAction: (id: number | undefined) => void;
	deleteAction: (id: number | undefined) => void;
	item: RecordModelExtended;
	index?: number
}

const SwipeRow = ({deleteAction, editAction, item, index}: MainListItemProps) => {

	const [imgPreview, setImgPreview] = useState(false);

	return (
		<>
			<SwipeableItem
				onEdit={() => editAction && editAction(item?.id)}
				onDelete={() => deleteAction && deleteAction(item?.id)}>
				<View style={s.container}>

					<View>
						<ImageBackground source={{uri: item.imgUri}} style={s.image}>
							<View style={s.boxContainer}>
								<Text style={s.boxText}>{item.containerIdentifier}</Text>
							</View>
						</ImageBackground>
					</View>

					{(index == 0) && <MaterialIcons name="swipe-left" size={24} color={themeColors.header} style={s.icon}/> }

					<View style={{flex: 1, paddingHorizontal: 20, borderLeftWidth: 2, left: 5, borderColor: themeColors.disabled}}>
						{item.description && <Text style={s.titleText}>{item.description}</Text>}
						{item.categories && <Text style={s.contentText}>{item.categories.replaceAll(',', ' | ')}</Text>}
						{item?.colorsInfo?.[0] &&  <RenderColors items={item.colorsInfo ?? []}/>
						}
					</View>
				</View>
			</SwipeableItem>
			{
				imgPreview && <></>
			}

		</>
	)
}

export const s = StyleSheet.create({
	icon: {
		position: 'absolute',
		right: 10,
		top: 10,
	},
	image: {
		height: 170,
		width: 170,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	boxContainer: {
		backgroundColor: themeColors.secondary,
	 	paddingVertical: 10,
		opacity: 0.95,
		minWidth: '80%',
		alignItems: 'center',
		justifyContent: 'center',
		alignContent: 'center'
	},
	boxText: {
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold'
	},
	container: {
		flexDirection: 'row',
		flex: 1,
		paddingVertical: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	titleText: {
		fontWeight: 'bold',
		backgroundColor: 'transparent',
		fontSize: 20,
		marginVertical: 5,
		textTransform: 'uppercase'
	},
	contentText: {
		color: themeColors.header,
		fontSize: 18,
		paddingVertical: 5
	}
});


export default SwipeRow;
