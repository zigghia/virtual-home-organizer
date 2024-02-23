import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
	container: {
		marginBottom: 100
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
