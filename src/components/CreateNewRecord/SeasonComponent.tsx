import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import { Ionicons } from '@expo/vector-icons';
import EntryCard from '@/containers/CreateEntryScreen/EntryCard';
import { themeColors } from '@/constants/app.constants';
import { useTranslation } from 'react-i18next';

;

type SeasonComponentProps  = {
	selectedSeason:  number | null,
	updateRecordData:  (value: string, valueId: number | null) => void
}
const SeasonComponent = ({selectedSeason, updateRecordData} : SeasonComponentProps) => {
	const {t} = useTranslation();

	return (
		<EntryCard title={t('createEntry:season.title')}
				   tooltipText={t('createEntry:season:tooltip')}>
			<View style={{flex:1, flexWrap: 'wrap', flexDirection: 'row'}}>
				{
					['winter:snow-sharp', 'spring:flower-outline', 'summer:sunny-sharp', 'autumn:rainy'].map((key, index) => {
						const [season, icon] = key.split(':');
						const style = index === selectedSeason ? s.seasonButtonSelected : {};
						return <Button  buttonStyle = {{...s.seasonButton, ...style, marginRight: index%2 == 0 ? 5 : 0}} key={'season'+index}
										onPress={() =>
										{
											if (selectedSeason == index) {
												updateRecordData('', null);
												return;
											}
											updateRecordData(t(`createEntry:season.${season}`).toLowerCase(), index);
										}}>
							<Text style={s.seasonButtonText}>{t(`createEntry:season.${season}`)}</Text>
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
		fontSize: 16
	},
	seasonButtonSelected: {
		backgroundColor: themeColors.disabled
	}
});


export default SeasonComponent;
