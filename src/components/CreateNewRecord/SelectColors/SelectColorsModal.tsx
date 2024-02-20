import React, { useContext } from "react";
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColors';
import withModal from '@/hoc/withModal';
import { useTranslation } from 'react-i18next';
import { DataContext } from '@/context/StaticDataContext';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '@/components/Button/Button';
import { themeDefaults } from '@/constants/app.constants';

const SelectColorsModal = ({closeModal}: {closeModal: () => void}) => {
	const [t, i18n] = useTranslation();
	const {data, dispatch} = useContext(DataContext)!;
	return (
		<>
		<ScrollView contentContainerStyle={{alignItems: 'center'}}>
			<SelectColors items={data.colors}/>
		</ScrollView>
		<Button text={'OK'} buttonStyle={{marginBottom: 30, height: themeDefaults.buttonHeight}} onPress={closeModal}/>
		</>
	);
}

export default withModal(SelectColorsModal, {position: 'bottom', height: 450});
