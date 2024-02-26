import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SelectColorItem from '@/components/CreateNewRecord/SelectColors/SelectColorItem';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { DataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading';
import { appConstants } from '@/constants/app.constants';

interface SelectColorProps extends WithTemplateListProps {
	list?: [],
	bulletSize?: number,
	selectedIs: number [],
	updateData: (v: number) => void
}

const SelectColorsComponent = ({list, bulletSize, selectedIs, updateData}: SelectColorProps) => {

	return (
		<View>
			{
				(list ?? []).map((line: SelectColorItemModel[], index: number) => {
					return <View style={{...commonStyle.containerList, width: '100%'}} key={`colorsLine${index}`}>
						{
							line.map((color, index) => {
								const isSelected = (selectedIs ?? []).includes(color.id);
								return <SelectColorItem key={`selectColor${color.id}`}
														bulletSize={bulletSize}
														item={color}
														isSelected={isSelected}
														onItemPress={() => updateData(color.id)}/>
							})
						}
					</View>
				})
			}
		</View>
	)
}

export default withTemplateList(SelectColorsComponent, 3);


