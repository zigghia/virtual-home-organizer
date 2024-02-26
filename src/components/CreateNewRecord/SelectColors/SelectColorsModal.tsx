import React, { useState } from "react";
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColorsComponent';
import withModal from '@/hoc/withModal';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import { appConstants, themeColors, themeDefaults } from '@/constants/app.constants';
import { SelectColorItemModel } from '@/utils/models';
import Fade from '@/components/Animations/Fade';
import { useTranslation } from 'react-i18next';

const SelectColorsModal = ({closeModal, items, selectedIds}: { closeModal: (ids: number[]) => void, items: SelectColorItemModel[], selectedIds: number[] }) => {
	const [colors, setColors] = useState(selectedIds);
	const [warning, setWarning] = useState<boolean>(false);
	const {t} = useTranslation();

	if ( !items ) {
		return null;
	}

	const updateData = (id: number) => {
		let c = colors.find(c => c == id);
		const newVal = c ? [...colors.filter(c => c != id)] : [...colors, id];


		if ( newVal.length > appConstants.maxColorsSelected ) {
			setWarning(true);
			return;
		}

		setWarning(false);
		setColors(newVal);
	}
	return (
		<ScrollView style={{flex: 1}}>
			<Fade isVisible={warning}>
				<Text style={{color: themeColors.error, alignSelf: 'center', marginBottom: 10}}>
					{t('common:warnings.tooManyColors', {max: appConstants.maxColorsSelected})}
				</Text>
			</Fade>

			<SelectColors bulletSize={30}
						  items={items}
						  selectedIs={colors}
						  updateData={(id: number) => updateData(id)}/>
			<View style={{marginBottom: 30, marginTop: 30, height: themeDefaults.buttonHeight}}>
				<Button text={'OK'} onPress={() => closeModal(colors)}/>
			</View>

		</ScrollView>
	);
}

export default withModal(SelectColorsModal, {position: 'bottom', height: 450, modal: true});
