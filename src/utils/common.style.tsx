import { StyleSheet } from 'react-native';

const commonStyle = StyleSheet.create({
	containerList: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',

	},
	containerListItem: {
		minWidth: 80,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#F8F8F8',
		margin: 5,
		height: 50,
		fontSize: 20,
		alignItems: 'center',
		fontWeight: 'bold',
		borderRadius: 10
	},
	shadow: {
		shadowColor: "#444",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.4,
		shadowRadius: 2.22,
		elevation: 10,
	}
});

export default commonStyle;
