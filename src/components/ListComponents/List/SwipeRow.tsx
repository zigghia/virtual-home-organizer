import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import SwipeableItem from '@/components/ListComponents/List/SwipeItem';
import { ListItemModel, RecordModel, RecordModelExtended, SelectColorItemModel } from '@/utils/models';
import 'react-native-gesture-handler';
import { s as st } from '@/components/CreateNewRecord/SelectColors/SelectColors.style';
import withTemplateList, { WithTemplateListProps, WithTemplateListPropsSimple } from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';

export interface MainListItemProps {
	editAction: (id: number | undefined) => void;
	deleteAction: (id: number | undefined) => void;
	item: RecordModelExtended;
	index?: number
}

const RenderColors = withTemplateList(({list} : WithTemplateListPropsSimple) => {
	return	<>
		{
			(list ?? []).map((line: [], index: number) => {
				return <View style={s.colorsContainer} key={'colors'+index}>
					{line.map((c: SelectColorItemModel, i) =>
						(c?.plural ?? '').toLowerCase() === 'mix' ? <Text key={'color' + c.id + index}>mix</Text> :
							<View key={'color' + c?.id + index}
								  style={{
									  ...s.colorBullet,
									  borderColor: themeColors.darkGrey, borderWidth: StyleSheet.hairlineWidth,
									  backgroundColor: c?.bgColor
								  }}/>)
					}
				</View>
			})
		}
	</>
}, 6);
const SwipeRow = ({deleteAction, editAction, item, index}: MainListItemProps) => {

	const [imgPreview, setImgPreview] = useState(false);


	return (
		<>
			<SwipeableItem
				onEdit={() => editAction && editAction(item?.id)}
				onDelete={() => deleteAction && deleteAction(item?.id)}>
				<View style={s.container}>

					<TouchableOpacity onPress={() => {
						setImgPreview(true)
					}}>
						<Image source={{uri: item.imgUri}} style={s.image}/>
					</TouchableOpacity>

					{(index == 0) && <MaterialIcons name="swipe-left" size={24} color={themeColors.header} style={s.icon}/> }

					<View style={{flex: 1, paddingHorizontal: 20}}>
						{item.description && <Text style={s.titleText}>{item.description}</Text>}
						{item.categories && <Text style={s.contentText}>{item.categories.replaceAll(',', ' | ')}</Text>}
						{item?.colorsInfo?.[0] &&  <RenderColors items={item.colorsInfo ?? []}/>
						}
						<View style={s.boxContainer}>
							<Text style={s.boxText}>{item.containerIdentifier}</Text>
						</View>
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
	colorBullet: {
		marginRight: 5,
		marginLeft: 2,
		height: 20,
		width: 20,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
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
		height: '100%',
		width: 120,
		backgroundColor: 'grey',
		borderRadius: 5,
		left: -5
	},
	boxContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: themeColors.secondary,
		marginRight: 10,

		height: 45,
		marginBottom: 10
	},
	boxText: {
		color: 'white',
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
