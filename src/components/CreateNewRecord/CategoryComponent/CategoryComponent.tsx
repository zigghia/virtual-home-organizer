import React, { useEffect, useState } from "react";
import withTemplateList from "@/hoc/withTemplateList";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style'
import Loading from '@/components/Loading/Loading';
import { DataContext } from '@/context/StaticDataContext';

const CategoryComponent = ({list, context}: any) => {
	const [loading, setLoading] = useState(true);
	const { dispatch } = React.useContext(DataContext)!;

    useEffect(() => {
		setLoading(false);
		return (() => {
			//
		});
	}, [list])

	const updateDataHandler = (item: ListItemModel) => {
		dispatch({type: 'update', payload: {key: 'categories', id: item.id}});
	}

	if (loading) {
		return <Loading />
	}

	return (
		<View>
			{
				(list ?? []).map((line: [], index: number) => {
					return <View style={commonStyle.containerList} key={`line${index}`}>
						{
							line.map((item: ListItemModel, index) =>
								<View key={`type${index}`} style={[commonStyle.containerListItem,  s.container, item.selected &&  commonStyle.containerListItemBackground]}>
									<TouchableOpacity
										onPress={() => updateDataHandler(item)}
										style={{flex: 1, alignItems: 'center', paddingVertical: 10}}>
										<Text style={item.selected && commonStyle.containerListItemTextWhite}>{item?.name} </Text>
									</TouchableOpacity>
								</View>
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
		justifyContent: 'center',
		padding: 3
	}
});


export default withTemplateList(CategoryComponent, 3);
