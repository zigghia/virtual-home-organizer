import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { MainListItemProps } from '@/components/ListComponents/List/SwipeRow';

const GridItem = ({item, index} : MainListItemProps) => {
	const [preview, setPreview] = useState(false);

	return (
		<View style={{backgroundColor: 'red', flexDirection: 'row', flex: 1}}>
			<TouchableOpacity onPress={() => {setPreview(true)}}>
				<Image source={{uri: item.imgUri}} style={s.image}/>
			</TouchableOpacity>

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
	icon: {
		position: 'absolute',
		right: 10,
		top: 10,
	},
	image: {
		height: 140,
		width: 120,
		backgroundColor: 'grey',
		borderRadius: 5,
		left: -5
	},
	boxContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: themeColors.secondary,
		maxWidth: 100,
		marginBottom: 10
	}
});

export default GridItem;
