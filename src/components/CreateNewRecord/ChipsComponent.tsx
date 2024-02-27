import React, { useEffect, useState } from "react";
import withTemplateList, { WithTemplateListProps } from "@/hoc/withTemplateList";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style'

interface CategoryComponentProps extends WithTemplateListProps<ListItemModel> {
	onclickItem: (item: ListItemModel) => void;
	list: ListItemModel[][];
	value?: string
}

const ChipsComponent = ({list, onclickItem, value}: CategoryComponentProps) => {
	return (
		<View>
			{
				(list ?? []).map((line: ListItemModel[], index: number) => {
					return <View style={commonStyle.containerList} key={`line${index}`}>
						{
							line.map((item: ListItemModel, index) => {
                                     const isSelected = value != undefined ? item.name == value: item.selected;
									return <View key={`type${index}`} style={[commonStyle.containerListItem, s.container,
										isSelected && commonStyle.containerListItemBackground]}>
										<TouchableOpacity
											onPress={() => onclickItem(item)}
											style={{flex: 1, alignItems: 'center', paddingVertical: 10}}>
											<Text style={[isSelected&& commonStyle.containerListItemTextWhite]}>{item?.name} </Text>
										</TouchableOpacity>
									</View>
								}
							)
						}
					</View>
				})
			}

		</View>
	)
}

 const s = StyleSheet.create({
	container: {
		flex: 1,
		padding: 3
	}
});


export default withTemplateList(ChipsComponent, 3);
