import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';

const LANGUAGES = [
	{ code: 'en', label: 'English' },
	{ code: 'ro', label: 'Romana' }
];

const Selector = ({onSelect, code} : ComponentProps<any>) => {
	const { t } = useTranslation();
	return (
		<View>
			{LANGUAGES.map(language => {
				const selectedLanguage = language.code === code;

				return (
					<TouchableOpacity
						key={language.code}
						style={styles.buttonContainer}
						disabled={selectedLanguage}
						onPress={() => onSelect(language.code)}
					>
						<Text
							style={[selectedLanguage ? styles.selectedText : styles.text]}
						>
							{language.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		marginTop: 10,
		height: 30
	},
	text: {
		fontSize: 18,
		color: '#000',
		paddingVertical: 4
	},
	selectedText: {
		fontSize: 18,
		fontWeight: '600',
		color: themeColors.primary,
		paddingVertical: 4
	}
});

export default Selector;
