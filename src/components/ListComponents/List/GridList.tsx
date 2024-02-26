import React, { useRef, useState } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, findNodeHandle, TextStyle, ViewStyle, ScrollView } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import WithTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';
import { FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import PreviewItem from '@/components/PreviewItem';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { HandlerStateChangeEvent } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading';
import { RecordModel } from '@/utils/models';

interface MainListItemProps1 extends WithTemplateListProps {
	list: [];
	deleteAction: (id: number) => void;
	editAction: (item: RecordModel) => void;
}
const GridList = ({list, deleteAction, editAction}: MainListItemProps1) => {
	const [preview, setPreview] = useState<null | RecordModel>(null);
	const {showActionSheetWithOptions} = useActionSheet();
	const {t} = useTranslation();
	const options = useRef([t('common:actions.preview'),
		t('common:actions.edit'),
		t('common:actions.delete'),
		t('common:actions.cancel')]).current;

	const onLongPress = (event: HandlerStateChangeEvent, item: RecordModel) => {

		if ( event.nativeEvent.state === State.ACTIVE ) {
			showActionSheetWithOptions({
				options,
				cancelButtonIndex: 3,
				destructiveButtonIndex: 2,
				icons: [<FontAwesome name='trash-o' size={30} color={themeColors.header}/>, <FontAwesome name={'edit'} size={30} color={themeColors.header}/>]
			}, (selectedIndex: number | undefined) => {
				switch (selectedIndex) {
					case 0:
						setPreview(item);
						break;

					case 1:
						editAction(item);
						break;

					case 2:
						deleteAction(item.id ?? 0);
				}
			});
		}
	};

	if (!list.length) {
		return <Loading/>
	}

	return (
		<ScrollView style={commonStyle.shadow}>
			{
				(list ?? []).map((line: [], i: number) => {
					return <View style={{...commonStyle.containerList, backgroundColor: 'white'}} key={`line${i}`}>
						{
							line.map((item: RecordModel, ii) =>
								<TouchableWithoutFeedback onPress={() => setPreview(item)} key={'linecolumn' + ii}>
									<View style={{...s.lineContainer}}>
										<ImageBackground source={{uri: item.imgUri}} style={s.image} resizeMethod={'resize'}>
											<LongPressGestureHandler
												onHandlerStateChange={(event) => onLongPress(event, item)}
												minDurationMs={500}
												maxDist={20}
											>
												<View  style={s.image}>
													<View style={{...s.infoBar, ...s.infoBarPreview}}>
														<MaterialIcons name="zoom-out-map" size={30} color={themeColors.header}/>
													</View>

													<View style={{...s.infoBar, ...s.infoBarBox}}>
														<FontAwesome5 name="box-open" size={24} color={themeColors.secondary} style={s.boxIcon}>
															<Text style={{color: 'white', marginLeft: 5, fontSize: 40}}>{item.containerIdentifier}</Text>
														</FontAwesome5>
													</View>
												</View>
											</LongPressGestureHandler>
										</ImageBackground>

									</View>
								</TouchableWithoutFeedback>
							)
						}
					</View>
				})
			}

			<PreviewItem isVisible={preview != null}
								formValues={{
									colorsInfo: preview?.colorsInfo,
									containerIdentifier: preview?.containerIdentifier,
									description: preview?.description,
									imgUri: preview?.imgUri,
									season: preview?.season
								}}
								categories={preview?.categories?.length ? preview.categories.split(',') : []}
								cancelText='OK'
								closeModal={() => setPreview(null)}/>
		</ScrollView>
	);
};


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
