import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from "react";
import { themeColors, themeDefaults } from "@/constants/app.constants";


const Button = (props) => {

	const extraStyle = {
		marginRight: props.isLeft ? 5 : 0,
		...props.buttonStyle,
	};

	const style = [		s.button, {...extraStyle},
						props?.isSecondary && s.secondary,
						props.disabled && s.disabled,

				  ];
	return (
		<TouchableOpacity style={style} onPress={props?.onPress} disabled={props.disabled}>
			{
				props.text && <Text style={[s.textButton, props.children && {marginRight: 10}]}>{props.text}</Text>
			}
			{props.children}
		</TouchableOpacity>
	);
}

export default Button;


export const s = StyleSheet.create({
	disabled: {
		backgroundColor: themeColors.disabled
	},
	button: {
		minWidth: 100,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 32,
		borderRadius: 10,
		flexDirection: 'row',
		backgroundColor: themeColors.primary
	},
	secondary: {
		backgroundColor: themeColors.secondary
	},
	textButton: {
		color: '#fff',
		fontSize: themeDefaults.fontSize,
		fontWeight: 'bold',
		justifyContent: 'center',
		alignItems: "center",
		flexWrap: "wrap"
	}
});
