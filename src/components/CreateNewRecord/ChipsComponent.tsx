import React from "react";
import withTemplateList, { WithTemplateListProps } from "@/hoc/withTemplateList";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItemModel, User } from '@/utils/models';
import commonStyle from '@/utils/common.style'

interface CategoryComponentProps extends WithTemplateListProps<ListItemModel> {
	onclickItem: (item: ListItemModel | User) => void;
	value?: string,
	fieldkey: string
}

const ChipsComponent = ({list, onclickItem, value, fieldkey}: CategoryComponentProps) => {

	return (
		<View>
			{
				(list ?? []).map((line: (ListItemModel | User)[], index: number) => {
					return <View style={commonStyle.containerList} key={`line${index}`}>
						{
							line.map((item: (ListItemModel | User), index) => {
                                    const isSelected = value != undefined ? (item as any)?.[fieldkey] == value: (item as ListItemModel).selected;
									return <View key={`type${index}`} style={[commonStyle.containerListItem, s.container,
										isSelected && commonStyle.containerListItemBackground]}>
										<TouchableOpacity
											onPress={() => onclickItem(item)}
											style={{flex: 1, alignItems: 'center', paddingVertical: 10}}>
											<Text style={[isSelected&& commonStyle.containerListItemTextWhite]}>{(item as any)[fieldkey]} </Text>
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
