import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import SwipeableItem from '@/components/ListComponents/List/SwipeItem';
import { RecordModel } from '@/utils/models';
import 'react-native-gesture-handler';

interface SwipeRowProps {
	editAction: (id: number | undefined) => void;
	deleteAction: (id: number | undefined) => void;
	item: RecordModel;
	index?: number
}

const SwipeRow = ({deleteAction, editAction, item, index}: SwipeRowProps) => {

	const [imgPreview, setImgPreview] = useState(false);

	return (
		<>
			<SwipeableItem
				onEdit={() => editAction && editAction(item?.id)}
				onDelete={() => deleteAction && deleteAction(item?.id)}>
				<View style={s.container}>
					<View style={s.boxContainer}>
						<Text style={s.boxText}>{item.containerIdentifier}</Text>
					</View>

					<TouchableOpacity onPress={() => {setImgPreview(true)}}>
						<Image source={{uri: item.imgUri}} style={s.image}/>
					</TouchableOpacity>



					{(index == 0) ? <MaterialIcons name="swipe-left" size={24} color={themeColors.header} style={s.icon}/> :
						<Feather name="zoom-in" size={24} color={themeColors.header} style={s.icon}/>}

					<View style={{flex: 1, padding: 20}}>
						<Text style={s.titleText}>{item.categories}</Text>
						<Text numberOfLines={1} style={s.contentText}>{item.colors}</Text>
						<Text numberOfLines={2} style={s.contentText}>{item.description}</Text>
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
		top: 10
	},
	image: {
		height: 120,
		width: 120,
		backgroundColor: 'grey',
		borderRadius: 5,
		left: -5
	},
	boxContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: themeColors.secondary,
		height: 120,
		minWidth: 60
	},
	boxText: {
		transform: [{rotate: '270deg'}],
		color: 'white',
		padding: 0,
		fontSize: 30,
		fontWeight: 'bold',
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
		lineHeight: 30,
		textTransform: 'uppercase'
	},
	contentText: {
		color: '#999',
		fontSize: 18,
		lineHeight: 20,
		backgroundColor: 'transparent',
	}
});


export default SwipeRow;
