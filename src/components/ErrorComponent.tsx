import React, { ComponentProps } from "react";
import withModal from '@/hoc/withModal';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const ErrorComponent = ({message}: ComponentProps<any>) => {
	const [t] = useTranslation();

	return (
		<View style={{backgroundColor: '#fff', height: 300,}}>
			<Text>{t('common:error.title')}</Text>
			<Text>{message}</Text>
		</View>
	);
}

export default withModal(ErrorComponent);
