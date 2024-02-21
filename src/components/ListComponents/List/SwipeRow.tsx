import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import SwipeableItem from '@/components/ListComponents/List/SwipeItem';
import { RecordModelExtended} from '@/utils/models';
import 'react-native-gesture-handler';
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
								<FontAwesome5 name="box-open" size={24} color={themeColors.secondary} style={s.boxIcon}>
									<Text style={{color: 'white', marginLeft: 5, fontSize: 40}}>{item.containerIdentifier}</Text>
								</FontAwesome5>
							</View>
						</ImageBackground>
					</View>

					{(index == 0) && <MaterialIcons name="swipe-left" size={24} color={themeColors.primary} style={s.icon}/> }

					<View style={{flex: 1, paddingHorizontal: 20}}>
						{item?.colorsInfo?.[0] &&  <RenderColors items={item.colorsInfo ?? []}/>}
						{item.categories && <Text style={s.contentText}>{item.categories.replaceAll(',', ' | ')}</Text>}
						{item.description && <Text style={s.titleText}>{item.description}</Text>}
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
	boxIcon: {
		verticalAlign: 'bottom',
		alignItems: 'center',
		alignSelf: 'center'
	},
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
