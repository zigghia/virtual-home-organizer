import withTemplateList, { WithTemplateListPropsSimple } from '@/hoc/withTemplateList';
import { StyleSheet, Text, View } from 'react-native';
import { SelectColorItemModel } from '@/utils/models';
import { themeColors } from '@/constants/app.constants';
import React from 'react';

const RenderColorsBullet = withTemplateList(({list} : WithTemplateListPropsSimple) => {
	return	<>
		{
			(list ?? []).map((line: [], i: number) => {
				return <View style={s.colorsContainer} key={'colors'+i}>
					{line.map((c: SelectColorItemModel, i) =>
						(c?.plural ?? '').toLowerCase() === 'mix' ? <Text key={'colorLine' + c.id + i}>mix</Text> :
							<View key={'color_' + (c?.id ?? '' + Math.random()) + i}
								  style={{
									  ...s.colorBullet,
									  borderColor: themeColors.darkGrey, borderWidth: StyleSheet.hairlineWidth,
									  backgroundColor: c?.bgColor
								  }}/>)
					}
				</View>
			})
		}
	</>
}, 6);

export const s = StyleSheet.create({
	colorBullet: {
		marginRight: 5,
		marginLeft: 2,
		height: 20,
		width: 20,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	colorsContainer: {
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	}
});

export default RenderColorsBullet;
