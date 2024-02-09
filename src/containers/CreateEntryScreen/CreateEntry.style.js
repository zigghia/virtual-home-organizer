import { StyleSheet } from "react-native";
import { themeDefaults } from "@/constants/app.constants";

export const s = StyleSheet.create({
	container: {
		minHeight: 200,
		marginTop: 15
	},
	fonts: {
		marginBottom: 20,
		fontSize: themeDefaults.fontSize,
		justifyContent: 'space-evenly'
	},
	user: {
		flexDirection: 'row',
		marginBottom: 6,
	},
	image: {
		width: 30,
		height: 30,
		marginRight: 10,
	},
	name: {
		fontSize: 16,
		marginTop: 5,
	},
	divider: {
		marginTop: 20
	},
	bottomButtons: {
		flex: 1,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		paddingHorizontal: 10,
		paddingVertical: 20,
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: '#ccc',
		borderStyle: 'solid'
	}
});
