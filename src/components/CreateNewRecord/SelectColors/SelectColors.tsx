import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SelectColorItem from '@/components/CreateNewRecord/SelectColors/SelectColorItem';
import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { SelectColorItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import withStaticDataContext from '@/hoc/withStaticDataContext';
import { StaticDataContext } from '@/context/StaticDataContext';
import Loading from '@/components/Loading/Loading';

interface SelectColorProps extends WithTemplateListProps{
	list?: [],
	items?: [],
	context?: React.ContextType<typeof StaticDataContext>
}

const SelectColors = ({list, context}: SelectColorProps) => {

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
		return (() => {
			setLoading(true);
		});
	}, [list]);

	const updateData = (color: any) => {
		context?.updateColors(color);
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

export default withStaticDataContext(withTemplateList(SelectColors, 3));


