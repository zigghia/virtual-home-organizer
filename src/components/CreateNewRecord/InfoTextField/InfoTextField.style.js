import { StyleSheet } from "react-native";
import { themeColors } from "@/constants/app.constants";

export const s = StyleSheet.create({
	container: {
		 flex: 1,
		 flexDirection: 'row',
	},
	inner: {
		flex: 1,
		marginHorizontal: 5,
		justifyContent: 'justify-start'
	},
	input: {
		fontSize: 25,
		textAlign: 'center',
		borderWidth: 1,
		margin: 0,
		paddingRight: 0,
		paddingLeft: 10,
		paddingVertical: 15,
		borderRadius: 20,
		borderColor: themeColors.secondary,
		backgroundColor: '#fff',
		height: 60
	},
	text: {
		height: 60,
		backgroundColor: themeColors.lightGrey,
		padding: 10,
		borderRadius: 20,
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
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
