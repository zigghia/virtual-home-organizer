import React, { useEffect, useState } from "react";
import withTemplateList from "@/hoc/withTemplateList";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItemModel } from '@/utils/models';
import commonStyle from '@/utils/common.style';
import withStaticDataContext from '@/hoc/withStaticDataContext';
import Loading from '@/components/Loading/Loading';


const CategoryComponent = ({list, context}: any) => {


	const [loading, setLoading] = useState(true);

    useEffect(() => {
		setLoading(false);
		return (() => {
			//
		});
	}, [list])

	const updateDataHandler = (item: ListItemModel) => {
		context?.updateCategories(item);
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
								<View key={`type${index}`} style={[commonStyle.containerListItem, commonStyle.shadow, s.container, item.selected && s.background]}>
									<TouchableOpacity
										onPress={() => updateDataHandler(item)}
										style={{flex: 1, alignItems: 'center', paddingVertical: 10}}>
										<Text style={item.selected && s.textWhite}>{item?.name} </Text>
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
	},
	 background: {
		 backgroundColor: '#4fb09d'
	 },
	 textWhite: {
		color: 'white',
		 fontSize: 15
	 }
});


export default withStaticDataContext(withTemplateList(CategoryComponent, 3));
