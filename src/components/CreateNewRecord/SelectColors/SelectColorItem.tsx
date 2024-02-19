import React from "react";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from "@rneui/base";
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { s } from '@/components/CreateNewRecord/SelectColors/SelectColors.style';

interface SelectColorItemProps {
	item?: SelectColorItemModel;
	onItemPress?: () => void
}

const SelectColorItem = ({item, onItemPress}: SelectColorItemProps) => {

	const extraStyle = {
		backgroundColor: item?.bgColor,
		opacity: item?.selected ? '0.5' : '1'
	};

	const extraTextStyle = {
		color: item?.fontColor || 'black',
	};


	let content = <Text>{item?.name}</Text>;


	return <Pressable onPress={onItemPress} style={({pressed}) => ([commonStyle.containerListItem, pressed && s.pressed])}>

		<View style={[s.color, {backgroundColor: item?.bgColor}]}>
			{
				item?.selected && <Icon
					iconStyle={extraTextStyle}
					name="check"
					size={25}
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
