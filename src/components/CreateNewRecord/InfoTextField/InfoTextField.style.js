import { StyleSheet } from "react-native";
import { themeColors } from "@/constants/app.constants";

export const s = StyleSheet.create({
	container: {
		 flex: 1,
		 flexDirection: 'row'
	},
	inner: {
		flex: 1,
		padding: 10,
		justifyContent: 'justify-start'
	},
	input: {
		fontSize: 30,
		margin: 0,
		textAlign: 'center',
		borderWidth: 2,
		paddingRight: 60,
		paddingLeft: 10,
		paddingVertical: 10,
		borderRadius: 20,
		borderColor: '#4fb09d',
		backgroundColor: '#fff'
	},
	text: {
		backgroundColor: themeColors.disabled,
		padding: 15,
		borderRadius: 10,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	error: {
		color: '#cc0000',
		marginTop: 20
	},
	closeIcon: {
		justifyContent: 'flex-end',
		position: "absolute",
		right: 10,
		top: -20
	},
	checkmark: {
		justifyContent: 'flex-end',
		right: 0,
		top: 0,
		width: 30
	}
});
