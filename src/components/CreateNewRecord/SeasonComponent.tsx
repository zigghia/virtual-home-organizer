import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import { Ionicons } from '@expo/vector-icons';
import EntryCard from '@/containers/CreateEntryScreen/EntryCard';
import { themeColors } from '@/constants/app.constants';
import { useTranslation } from 'react-i18next';

;

type SeasonComponentProps  = {
	selectedSeason:  string | undefined,
	updateRecordData:  (value: string, valueId: number | null) => void
}
const SeasonComponent = ({selectedSeason, updateRecordData} : SeasonComponentProps) => {
	const {t} = useTranslation();

	return (
		<EntryCard title={t('createEntry:season.title')}
				   tooltipText={t('createEntry:season:tooltip')}>
			<View style={{flex:1, flexWrap: 'wrap', flexDirection: 'row'}}>
				{
					[`${t('common:seasons.winter').toLowerCase()}:snow-sharp`,
						`${t('common:seasons.spring').toLowerCase()}:flower-outline`,
						`${t('common:seasons.summer').toLowerCase()}:sunny-sharp`,
						`${t('common:seasons.autumn').toLowerCase()}:rainy`].map((key, index) => {
						const [season, icon] = key.split(':');

						const style = season === selectedSeason ? s.seasonButtonSelected : {};
						return <Button  buttonStyle = {{...s.seasonButton, ...style, marginRight: index%2 == 0 ? 5 : 0}} key={'season'+index}
										onPress={() =>
										{
											if (selectedSeason == season) {
												updateRecordData('', null);
												return;
											}
											updateRecordData(season, index);
										}}>
							<Text style={s.seasonButtonText}>{season}</Text>
							<Ionicons name={icon as 'snow-sharp' | 'flower-outline' | 'sunny-sharp' | 'rainy'} size={24} color="white" />
						</Button>
					})
				}
			</View>
		</EntryCard>
	);
}


export const s = StyleSheet.create({
	seasonButton: {
		minWidth: 120,
		marginVertical: 5
	},
	seasonButtonText: {
		color: 'white',
		marginRight: 5,
		fontSize: 16,
		textTransform: 'capitalize'
	},
	seasonButtonSelected: {
		backgroundColor: themeColors.disabled
	}
});


export default SeasonComponent;
