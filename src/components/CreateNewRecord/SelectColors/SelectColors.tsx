import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SelectColorItem from '@/components/CreateNewRecord/SelectColors/SelectColorItem';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import { DataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading/Loading';

interface SelectColorProps extends WithTemplateListProps{
	list?: [],
	items?: []
}

const SelectColors = ({list}: SelectColorProps) => {

	const [loading, setLoading] = useState(true);
	const { dispatch } = React.useContext(DataContext)!;

	useEffect(() => {
		setLoading(false);
		return (() => {
			setLoading(true);
		});
	}, [list]);

	const updateData = (color: any) => {
		dispatch({type: 'update', payload: {key: 'colors', id: color.id}});
	};

	if (loading) {
		return <Loading/>
	}

	return (
		<View>
			{
				(list ?? []).map((line: SelectColorItemModel[], index: number) => {
					return <View style={commonStyle.containerList} key={`line${index}`}>
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


