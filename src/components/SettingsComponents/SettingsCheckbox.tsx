import { StyleSheet, Text, View } from 'react-native';
import Checkbox from 'expo-checkbox';
import { themeColors } from '@/constants/app.constants';
import React from 'react';

interface SettingsCheckboxProps {
	id: number;
	name?: string;
	onValueChange: (v: boolean) => void,
	value: boolean
}

const SettingsCheckbox = (item: SettingsCheckboxProps) => {
	if ( item?.id  == null) {
		return;
	}

	return <View style={styles.section} key={`check${item.id}`}>
				<Checkbox style={styles.checkbox}
						  value={item.value ?? false}
						  onValueChange={item.onValueChange}
						  color={item.value ? themeColors.secondary : undefined}
				/>
		{
			item.name ?
		     <View style={styles.textContainer}>
				 <Text style={styles.paragraph}>{item.name}</Text>
			 </View>
			: null
		}

	</View>
}

const styles = StyleSheet.create({
	textContainer: {
		paddingHorizontal: 10
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	paragraph: {
		fontSize: 15,
	},
	checkbox: {
		margin: 8,
		height: 40,
		width: 40,
		borderRadius: 10,
		padding: 5
	},
});
export default SettingsCheckbox;
