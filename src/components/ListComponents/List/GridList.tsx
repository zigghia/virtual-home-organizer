import React, { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { MainListItemProps } from '@/components/ListComponents/List/SwipeRow';
import WithTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';
import { ListItemModel, RecordModelExtended, SelectColorItemModel } from '@/utils/models';
import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import PreviewCreatedItem from '@/components/CreateNewRecord/PreviewCreatedItem/PreviewCreatedItem';

interface MainListItemProps1 extends WithTemplateListProps {
	list: []
}
const GridList = ({list}: MainListItemProps1) => {
	const [preview, setPreview] = useState<null | RecordModelExtended>(null);

	return (
		<>{
			(list ?? []).map((line: [], index: number) => {
				return <View style={{...commonStyle.containerList, backgroundColor: 'white'}} key={`line${index}`}>
					{
						line.map((item: RecordModelExtended, index) =>
							<TouchableWithoutFeedback onPress={() => setPreview(item)} key={`gridList${index}`}>
								<View style={{...s.lineContainer}}>
									<ImageBackground source={{uri: item.imgUri}} style={s.image}>
										<View style={{...s.infoBar, ...s.infoBarPreview}}>
											<MaterialIcons name="zoom-out-map" size={30} color={themeColors.header}/>
										</View>
										<View style={{ ...s.infoBar, ...s.infoBarBox}}>
											<FontAwesome5 name="box-open" size={24} color={themeColors.secondary} style={s.boxIcon}>
												<Text style={{color: 'white', marginLeft: 5, fontSize: 40}}>{item.containerIdentifier}</Text>
											</FontAwesome5>
										</View>
									</ImageBackground>
								</View>
							</TouchableWithoutFeedback>
						)
					}
				</View>
			})
		}
			<PreviewCreatedItem isVisible={preview != null}
								formValues={{
									colorsInfo: preview?.colorsInfo,
									containerIdentifier: preview?.containerIdentifier,
									description: preview?.description,
									imgUri: preview?.imgUri
								}}
								categories={preview?.categories?.length ? preview.categories.split(',') : []}
								cancelText='OK'
								closeModal={() => setPreview(null)}/>
		</>
	);
}


export const s = StyleSheet.create({
	infoBar: {
		borderTopWidth: 2,
		height: 80,
		justifyContent: 'center',
		alignContent: 'center'
	},
	infoBarPreview: {
		flex: 1,
		borderColor: themeColors.secondary,
		alignItems: 'center',
		backgroundColor: themeColors.secondary
	},
	infoBarBox: {
		flex: 2,
		borderColor: themeColors.header,
		flexDirection: 'row',
		opacity: 0.75,
		backgroundColor: themeColors.header
	},
	lineContainer: {
		flex: 1,
		padding: 5
	},
	boxIcon: {
		verticalAlign: 'bottom',
		alignItems: 'center',
		alignSelf: 'center'
	},
	image: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignContent: 'flex-end',
		alignItems: 'flex-end',
		height: 300,
		maxWidth: '100%'
	}
});

export default WithTemplateList(GridList, 2);
