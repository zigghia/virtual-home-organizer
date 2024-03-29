import React from "react";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from "@rneui/base";
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { s } from '@/components/CreateNewRecord/SelectColors/SelectColors.style';
import { FontAwesome } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';

interface SelectColorItemProps {
	item?: SelectColorItemModel;
	onItemPress?: () => void,
	bulletSize?: number,
	isSelected: boolean
}

const SelectColorItem = ({item, isSelected, onItemPress, bulletSize}: SelectColorItemProps) => {

	const isMix = item?.name.toLowerCase().includes('mix');

	const extraTextStyle = {
		color: isMix ? themeColors.primary : item?.fontColor || 'black',
	};

	let content = <Text style={{fontSize: 12}} numberOfLines={1}>{item?.name}</Text>;
	const size  = bulletSize ? bulletSize: 25;


	return <Pressable onPress={onItemPress}
					  style={({pressed}) => ([commonStyle.containerListItem, pressed && s.pressed])}>

					<View style={[s.color, {height: size, width: size, marginLeft: 5, backgroundColor: item?.bgColor}]}>
						{
							isMix && <FontAwesome name="bullseye" size={size + 2} color={themeColors.header} style={{position: 'absolute'}} />
						}
						{
							isSelected && <Icon
								iconStyle={extraTextStyle}
								name="check"
								size={(size)}
								type="material"
							/>
						}
					</View>
					<View style={{flex: 1}}>
						{content}
		</View>
	</Pressable>;
}


export default SelectColorItem;
