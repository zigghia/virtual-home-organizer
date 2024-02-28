import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import SwipeableItem from '@/components/ListComponents/List/SwipeItem';
import 'react-native-gesture-handler';
import RenderColors from '@/components/RenderColorsBullet';
import { FormRecordModel, RecordModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';

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
									<Text style={{color: 'white', marginLeft: 5, fontSize: 40}}>{item.containerIdentifier}</Text>
								</FontAwesome5>
							</View>
						</ImageBackground>
					</Pressable>

					{(index == 0) && <MaterialIcons name="swipe-left" size={24} color={themeColors.primary} style={s.icon}/> }

					<View style={{flex: 1, paddingHorizontal: 20}}>
						{item?.selectColors[0] &&  <RenderColors items={item.selectColors ?? []}/>}
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
		verticalAlign: 'bottom',
		alignItems: 'center',
		alignSelf: 'center'
	},
	icon: {
		position: 'absolute',
		right: 10,
		bottom: 20,
	},
	image: {
		height: 150,
		width: 150,
		margin: 5,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		...commonStyle.shadow
	},
	boxContainer: {
		backgroundColor: themeColors.header,
	 	paddingVertical: 10,
		opacity: 0.75,
		minWidth: '100%',
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
