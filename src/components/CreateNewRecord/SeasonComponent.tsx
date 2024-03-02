import React, { useEffect, useRef, useState } from "react";
import { Text, View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { useTranslation } from 'react-i18next';
import { Chip } from '@rneui/themed';

type SeasonComponentProps = {
	selectedSeasons?: string[] | undefined;
	updateData: (value: string, isDelete: boolean) => void;
	multiple?: boolean
}
const SeasonComponent = ({selectedSeasons, updateData, multiple = false}: SeasonComponentProps) => {
	const {t} = useTranslation();
	const seasons = useRef([`${t('common:seasons.winter').toLowerCase()}:snow-sharp`,
		`${t('common:seasons.spring').toLowerCase()}:flower-outline`,
		`${t('common:seasons.summer').toLowerCase()}:sunny-sharp`,
		`${t('common:seasons.autumn').toLowerCase()}:rainy`]).current;

	return <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
		{
			seasons.map((key, index) => {
				const [season, icon] = key.split(':');

				const isCurrent = (selectedSeasons ?? []).find((s) => season == s);
				return <View key={'season' + index}  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
					<Chip
						title={season}
						icon={{
							name: icon,
							type: 'ionicon',
							size: 20,
							color: isCurrent ? 'white' : themeColors.secondary,
						}}
						titleStyle={{color: isCurrent ? 'white' : themeColors.secondary, fontSize: 16}}
						onPress={() => {
							updateData(season, isCurrent != null);
						}}
						type={isCurrent ? "solid" : "outline"}
						color={themeColors.secondary}
						containerStyle={{marginTop: 10, borderWidth: 1, borderColor: themeColors.secondary, minWidth: 150}}
					/>
					<Text style={{paddingHorizontal: 2, fontSize: 8}}>{multiple && (index < 3) ? t('common:or') : ''}</Text>
				</View>
			})
		}
	</View>
}
	export default SeasonComponent;
