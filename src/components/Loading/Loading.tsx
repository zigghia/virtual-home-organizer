import { ActivityIndicator, View, Text } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Loading = ({text}:  React.ComponentProps<typeof Boolean>) => {
	const { t, i18n } = useTranslation();
	const [selectedLanguageCode, setselectedLanguageCode] = useState<string>();

	useEffect(() => {
		setselectedLanguageCode(i18n.language);

	}, []);

	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={themeColors.primary} style={styles.spinner}/>
			{text && <View style={styles.textContainer}><Text style={styles.text}>{t('common:loading')}</Text></View>}
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	spinner: {
		height: 80
	},
	text: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold'
	},
	textContainer: {
		backgroundColor: themeColors.primary,
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderRadius: 10,
	}
});
export default Loading;
