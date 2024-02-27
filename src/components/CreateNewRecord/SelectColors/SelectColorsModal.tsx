import React, { useEffect, useState } from "react";
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColorsComponent';
import withModal from '@/hoc/withModal';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import { appConstants, themeColors, themeDefaults } from '@/constants/app.constants';
import { SelectColorItemModel } from '@/utils/models';
import Fade from '@/components/Animations/Fade';
import { useTranslation } from 'react-i18next';
import { color } from '@rneui/base';

const SelectColorsModal = ({updateColors, items, selected}: { updateColors: (ids: SelectColorItemModel[]) => void, items: SelectColorItemModel[], selected: SelectColorItemModel[]}) => {
	const [colors, setColors] = useState<SelectColorItemModel[]>([]);
	const [warning, setWarning] = useState<boolean>(false);
	const {t} = useTranslation();

	if ( !items?.length) {
		return null;
	}

	useEffect(() => {
		const ids = (selected ?? []).filter(c => c.selected).map(c => c.id);
		const ce = JSON.parse(JSON.stringify(items)).map((i: SelectColorItemModel) => ({...i, selected: ids.includes(i.id)}));
        setColors(ce);

	}, []);


	const updateLocalColors = (id: number) => {

		if ( colors.filter(c => c.selected).length >= appConstants.maxColorsSelected +1) {
			setWarning(true);
			return;
		}

		setWarning(false);
		const color = colors.find(c => c.id == id) ?? {} as SelectColorItemModel;
		color.selected = !color?.selected;
		setColors([...colors]);
	}


	return (
		<ScrollView style={{flex: 1}}>
			<Fade isVisible={warning}>
				<Text style={{color: themeColors.error, alignSelf: 'center', marginBottom: 10}}>
					{t('common:warnings.tooManyColors', {max: appConstants.maxColorsSelected})}
				</Text>
			</Fade>

			<SelectColors bulletSize={30}
						  items={colors}
						  updateData={(item: SelectColorItemModel) => updateLocalColors(item.id)}/>

			<View style={{marginBottom: 30, marginTop: 30, height: themeDefaults.buttonHeight}}>
				<Button text={'OK'}
						disabled ={warning}
						onPress={() => updateColors(colors)}/>
			</View>

		</ScrollView>
	);
}

export default withModal(SelectColorsModal, {position: 'bottom', height: 450, modal: true});
