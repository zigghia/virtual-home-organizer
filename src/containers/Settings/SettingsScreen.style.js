import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		paddingBottom: 30,
		paddingHorizontal: 20,
		backgroundColor: 'white',
		flex: 1,
		justifyContent: 'flex-end'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
		flex: 1
	},
	title: {
		color: '#444',
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 0,
		paddingLeft: 10
	}
});
