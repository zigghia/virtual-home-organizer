import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SelectColorItem from '@/components/CreateNewRecord/SelectColors/SelectColorItem';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { DataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading';
import { appConstants } from '@/constants/app.constants';

interface SelectColorProps extends WithTemplateListProps<SelectColorItemModel> {
	list?: [],
	bulletSize?: number,
	updateData: (v: SelectColorItemModel) => void
}

const SelectColorsComponent = ({list, bulletSize, updateData}: SelectColorProps) => {
	return (
		<View>
			{
				(list ?? []).map((line: SelectColorItemModel[], index: number) => {
					return <View style={{...commonStyle.containerList, width: '100%'}} key={`colorsLine${index}`}>
						{
							line.map((color, index) => {
								return <SelectColorItem key={`selectColor${color.id}`}
														bulletSize={bulletSize}
														item={color}
														isSelected={color.selected ?? false}
														onItemPress={() => updateData(color)}/>
							})
						}
					</View>
				})
			}
		</View>
	)
}

export default withTemplateList(SelectColorsComponent, 3);


