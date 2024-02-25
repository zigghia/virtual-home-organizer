import React from "react";
import {  View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { useTranslation } from 'react-i18next';
import { Chip } from '@rneui/themed';

type SeasonComponentProps  = {
	selectedSeason?:  string | undefined | null,
	updateData:  (value: string, valueId: number | null) => void
}
const SeasonComponent = ({selectedSeason, updateData} : SeasonComponentProps) => {
	const {t} = useTranslation();

	return <View style={{flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly'}}>
		{
			[`${t('common:seasons.winter').toLowerCase()}:snow-sharp`,
				`${t('common:seasons.spring').toLowerCase()}:flower-outline`,
				`${t('common:seasons.summer').toLowerCase()}:sunny-sharp`,
				`${t('common:seasons.autumn').toLowerCase()}:rainy`].map((key, index) => {
				const [season, icon] = key.split(':');

				const isCurrent = selectedSeason == season;
				return <Chip
					title={season}
					key={'season' + index}
					icon={{
						name: icon,
						type: 'ionicon',
						size: 20,
						color: isCurrent ? 'white' : themeColors.secondary,
					}}
					titleStyle={{color: isCurrent ? 'white' : themeColors.secondary, fontSize: 16}}
					onPress={() => {
						if ( isCurrent ) {
							updateData('', null);
							return;
						}
						updateData(season, index);
					}}
					type={isCurrent ? "solid" : "outline"}
					color={themeColors.secondary}
					containerStyle={{marginRight: index % 2 == 0 ? 5 : 0, marginTop: 10, borderWidth: 1, borderColor: themeColors.secondary, minWidth: 150}}
				/>
			})
		}
	</View>
}
export default SeasonComponent;
