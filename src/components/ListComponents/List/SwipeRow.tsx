import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import SwipeableItem from '@/components/ListComponents/List/SwipeItem';
import 'react-native-gesture-handler';
import RenderColors from '@/components/RenderColorsBullet';
import { FormRecordModel, RecordModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import Fade from '@/components/Animations/Fade';
import Slide from '@/components/Animations/Slide';

export interface MainListItemProps {
	editAction: (item: FormRecordModel) => void;
	deleteAction: (id: number | undefined) => void;
	item: FormRecordModel;
	index?: number,
	clickPreview: () => void
}

const SwipeRow = ({deleteAction, editAction, item, index, clickPreview}: MainListItemProps) => {

	return (
		<>
			<SwipeableItem
				onEdit={() => editAction && editAction(item)}
				onDelete={() => deleteAction && deleteAction(item?.id)}>
				<View style={s.container}>

					<Pressable onPress={clickPreview}>
						<ImageBackground source={{uri: item.imgUri}} style={s.image}>
							<View style={s.boxContainer}>
								<FontAwesome5 name="box-open" size={24} color={themeColors.secondary} style={s.boxIcon}>
									<Text style={{color: 'white', marginLeft: 5, fontSize: 50}}>{item.containerIdentifier}</Text>
								</FontAwesome5>
							</View>
						</ImageBackground>
					</Pressable>

					{index == 0 &&
						<View style={s.icon}>
							<Slide><MaterialIcons name="swipe-left" size={24} color={themeColors.primary}/></Slide>
						</View>
					}

					<View style={{flex: 1, marginHorizontal: 10}}>
						{item?.selectColors[0] && <RenderColors items={item.selectColors ?? []}/>}
						{item.categories && <Text style={s.contentText}>{item.categories.replaceAll(',', ' | ')}</Text>}
						{item.description && <Text style={s.titleText}>{item.description}</Text>}
					</View>
				</View>
			</SwipeableItem>
		</>
	)
}

export const s = StyleSheet.create({
	boxIcon: {
		// verticalAlign: 'bottom',
		// alignItems: 'center',
		// alignSelf: 'center'
	},
	icon: {
		position: 'absolute',
		right: 20,
		bottom: 20,
	},
	image: {
		height: 150,
		width: 220,
		margin: 5,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		...commonStyle.shadow
	},
	boxContainer: {
        ...commonStyle.shadow,
		marginLeft: 10,
		marginBottom: 10,
		borderRadius: 3,
		minWidth: 80,
		padding: 5,
		//backgroundColor: themeColors.header,
		alignSelf: 'flex-start',
		justifyContent: 'flex-end',
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
		textTransform: 'uppercase'
	},
	contentText: {
		color: themeColors.header,
		fontSize: 18,
	}
});


export default SwipeRow;
