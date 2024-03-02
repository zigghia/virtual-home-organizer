import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SelectColorItem from '@/components/CreateNewRecord/SelectColors/SelectColorItem';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { DataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading';
import { appConstants } from '@/constants/app.constants';
import { Text } from '@rneui/base';

interface SelectColorProps extends WithTemplateListProps<SelectColorItemModel> {
	bulletSize?: number,
	updateData: (v: SelectColorItemModel) => void
	spacer?: string | null;
}

const SelectColorsComponent = ({list, bulletSize, updateData, spacer = null}: SelectColorProps) => {
	return (
		<View>
			{
				(list ?? []).map((line: SelectColorItemModel[], index: number) => {
					return <View style={{...commonStyle.containerList, justifyContent: 'space-between'}} key={`colorsLine${index}`}>
						{
							line.map((color, ind) => {
								return <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}} key={`selectColor${color.id}`}>
											<SelectColorItem bulletSize={bulletSize}
															 item={color}
															 isSelected={color.selected ?? false}
															 onItemPress={() => updateData(color)}/>
									{spacer  &&  (ind < line.length - 1 || index < list.length - 1 ) ? <Text style={{fontSize: 10, alignSelf: 'center'}}>{spacer}</Text> : null}
								</View>
							})
						}
					</View>
				})
			}
		</View>
	)
}

export default withTemplateList(SelectColorsComponent, 3);


