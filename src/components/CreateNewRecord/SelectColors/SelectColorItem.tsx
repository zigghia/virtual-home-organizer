import React from "react";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from "@rneui/base";
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { s } from '@/components/CreateNewRecord/SelectColors/SelectColors.style';

interface SelectColorItemProps {
	item?: SelectColorItemModel;
	onItemPress?: () => void,
	bulletSize?: number
}

const SelectColorItem = ({item, onItemPress, bulletSize}: SelectColorItemProps) => {

	const extraTextStyle = {
		color: item?.fontColor || 'black',
	};

	let content = <Text>{item?.name}</Text>;
	const size  = bulletSize ? bulletSize: 30;


	return <Pressable onPress={onItemPress} style={({pressed}) => ([commonStyle.containerListItem, pressed && s.pressed])}>

		<View style={[s.color, {height: size, width: size, marginLeft: 5, backgroundColor: item?.bgColor}]}>
			{
				item?.selected && <Icon
					iconStyle={extraTextStyle}
					name="check"
					size={(size - 5)}
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
