import React, { useContext} from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import SwipeableItem from '@/components/ListComponents/List/SwipeItem';
import 'react-native-gesture-handler';
import RenderColors from '@/components/RenderColorsBullet';
import { FormRecordModel, RecordModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import Slide from '@/components/Animations/Slide';
import { Chip } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { DataContext, SeasonIconsType } from '@/context/StaticDataContext';

export interface MainListItemProps {
	editAction: (item: FormRecordModel) => void;
	deleteAction: (id: number | undefined) => void;
	item: FormRecordModel;
	index?: number,
	clickPreview: () => void
}

const SwipeRow = ({deleteAction, editAction, item, index, clickPreview}: MainListItemProps) => {
	const categories = (item?.categories ?? '').split(',');
	const {t} = useTranslation();
	const {seasons} = useContext(DataContext)!;

	return (
		<>
			<SwipeableItem
				itemKey={'swipe'+index}
				onEdit={() => editAction && editAction(item)}
				onDelete={() => deleteAction && deleteAction(item?.id)}>
				<View style={s.container}>


					{index == 0 &&
						<View style={s.icon}>
							<Slide><MaterialIcons name="swipe-left" size={24} color={themeColors.primary}/></Slide>
						</View>
					}

					<View style={{flex: 1,  backgroundColor: themeColors.lightGrey, padding: 15,  height: 150}}>
						{item.season && <View style={{flexDirection: 'row'}}>
							<Ionicons name={(Object.keys(seasons).find((k: string )=> seasons[k as SeasonIconsType] == item.season)) as SeasonIconsType}
									  size={24}
									  color={themeColors.header}
									  style={{paddingRight: 5}}/>
							<Text style={s.contentText} numberOfLines={1}>{item.season}</Text>
						</View>}
						{item?.selectColors[0] &&
							<View style={{flexDirection: 'row'}}>
								<RenderColors items={item.selectColors.slice(0, 3) ?? []}/>
								{item.selectColors.length > 3 && <Text style={{alignSelf: 'flex-end', paddingBottom: 10}}> + {item.selectColors.length - 3}</Text>}
							</View>}
						<View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
							{categories[0] &&
								<Chip
									color={themeColors.lightGrey}
									titleStyle={{color: themeColors.header, fontSize: 14}}
									containerStyle={{ padding: 0, borderColor: themeColors.secondary, borderWidth: StyleSheet.hairlineWidth}}
									title={categories[0]}
									key={'category' + item.id}/>
							}
							{categories.length > 1 ? <Text style={{ alignSelf: 'center'}}>  +{categories.length - 1} </Text> : null}
						</View>

					</View>
					<Pressable onPress={clickPreview} style={{flex: 2}}>
						<ImageBackground source={{uri: item.imgUri}} style={s.image}>
							<View style={s.box}>
								<Text style={{fontSize: 60, ...s.boxText}}>{item.containerIdentifier}</Text>
								<Text style={{fontSize: 20, ...s.boxText}}>{item.description}</Text>
							</View>
						</ImageBackground>
					</Pressable>
				</View>
			</SwipeableItem>
		</>
	)
}

export const s = StyleSheet.create({
	icon: {
		position: 'absolute',
		right: 20,
		bottom: 20,
	},
	image: {
		height: 150,
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
	},
	container: {
		flexDirection: 'row',
		flex: 1,
		padding: 10,
		alignItems: 'flex-start',
		backgroundColor: 'white'
	},
	contentText: {
		color: themeColors.header,
		paddingVertical: 3,
	},
	boxText : {
		color: themeColors.white,
		fontWeight: 'bold'
	},
	box: {
		justifyContent: 'flex-end',
		padding: 10,
		opacity: 0.8,
		alignItems: 'flex-start',
		margin: 10,
		...commonStyle.shadow,
		backgroundColor: themeColors.header,
		width: 120
	}
});


export default SwipeRow;
