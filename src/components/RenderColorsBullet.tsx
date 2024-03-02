import withTemplateList, { WithTemplateListProps } from '@/hoc/withTemplateList';
import { StyleSheet, Text, View } from 'react-native';
import { SelectColorItemModel } from '@/utils/models';
import { themeColors } from '@/constants/app.constants';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface RenderColorsBullet extends  WithTemplateListProps<SelectColorItemModel> {
	size: number;
}

const RenderColorsBullet = withTemplateList(({list, size = 20} : RenderColorsBullet) => {
	return	<>
		{
			(list ?? []).map((line: SelectColorItemModel[], i: number) => {
				return <View style={s.colorsContainer} key={'colors'+i}>
					{line.map((c: SelectColorItemModel, i) =>
						(c?.plural ?? '').toLowerCase() === 'mix' ?
							<FontAwesome key={'colorLine' + c.id + i} name="bullseye" size={size + 2} color={themeColors.header} /> :
							<View key={'color_' + (c?.id ?? '' + Math.random()) + i}
								  style={{
									  ...s.colorBullet,
									  height: size,
									  width: size,
									  borderColor: themeColors.darkGrey,
									  borderWidth: StyleSheet.hairlineWidth,
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
