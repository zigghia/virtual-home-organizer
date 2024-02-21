import React, { useRef, useState } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, findNodeHandle, TextStyle, ViewStyle } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import WithTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import commonStyle from '@/utils/common.style';
import { RecordModelExtended } from '@/utils/models';
import { FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import PreviewCreatedItem from '@/components/CreateNewRecord/PreviewCreatedItem/PreviewCreatedItem';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { HandlerStateChangeEvent } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';
import { useTranslation } from 'react-i18next';

interface MainListItemProps1 extends WithTemplateListProps {
	list: [];
	deleteAction: (id: number) => void;
	editAction: (iten: RecordModelExtended) => void;
}

const GridList = ({list, deleteAction, editAction}: MainListItemProps1) => {
	const [preview, setPreview] = useState<null | RecordModelExtended>(null);
	const {showActionSheetWithOptions} = useActionSheet();
	const {t} = useTranslation();
	const options = useRef([t('search:actions.preview'),
		t('search:actions.edit'),
		t('search:actions.delete'),
		t('search:actions.cancel')]).current;

	const onLongPress = (event: HandlerStateChangeEvent, item: RecordModelExtended) => {

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

	return (
		<>
			{
				(list ?? []).map((line: [], i: number) => {
					return <View style={{...commonStyle.containerList, backgroundColor: 'white'}} key={`line${i}`}>
						{
							line.map((item: RecordModelExtended, ii) =>
								<TouchableWithoutFeedback onPress={() => setPreview(item)} key={'linecolumn' + ii + '-' + 'i'}>
									<View style={{...s.lineContainer}} key={'column' + ii + '-' + 'i'}>
										<ImageBackground source={{uri: item.imgUri}} key={'column4' + ii + '-' + 'i'}>
											<LongPressGestureHandler
												onHandlerStateChange={(event) => onLongPress(event, item)}
												minDurationMs={500}
												maxDist={20}
											>
												<View style={s.image} key={'column1' + ii + '-' + 'i'}>
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
