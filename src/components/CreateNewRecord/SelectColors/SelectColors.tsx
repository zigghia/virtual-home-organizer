import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SelectColorItem from '@/components/CreateNewRecord/SelectColors/SelectColorItem';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { DataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading/Loading';

interface SelectColorProps extends WithTemplateListProps{
	list?: []
}

const SelectColors = ({list}: SelectColorProps) => {

	const { dispatch } = React.useContext(DataContext)!;

	const updateData = (color: any) => {
		dispatch({type: 'update', payload: {key: 'colors', id: color.id}});
	};
	return (
		<View>
			{
				(list ?? []).map((line: SelectColorItemModel[], index: number) => {
					return <View style={{...commonStyle.containerList, 	width: '100%'}} key={`line${index}`}>
						{
							line.map(color => <SelectColorItem key={`selectColor${color.id}`} item={color} onItemPress={() => updateData(color)}/>)
						}
					</View>
				})
			}

		</View>
	)
}

export default withTemplateList(SelectColors, 3);


