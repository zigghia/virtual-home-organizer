import React, { ComponentProps } from "react";
import withModal from '@/hoc/withModal';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button/Button';
import { themeColors, themeDefaults } from '@/constants/app.constants';
import { useTheme } from '@rneui/themed';

const AlertComponent = ({message, title, closeModal, onPressOK}: ComponentProps<any>) => {
	const [t] = useTranslation();
	const theme = useTheme();
	return (
		<>
			<View style={{alignItems: 'center'}}>
				<Text style={{fontSize: themeDefaults.fontHeader3, color: themeColors.header, fontWeight: 'bold'}}>
					{title.toUpperCase()}
				</Text>

			</View>
			<View style={{padding: 10}}>
				<Text style={{fontSize: themeDefaults.fontHeader4, textAlign: 'center'}}>{message}</Text>
			</View>

			<View style={{height: themeDefaults.buttonHeight, flexDirection: 'row', marginVertical: 20}}>
				<Button text={t('common:no')} onPress={closeModal} isLeft/>
				<Button text={t('common:yes')} onPress={onPressOK}/>
			</View>
		</>
	);
}

export default withModal(AlertComponent, {position: 'alert'});
