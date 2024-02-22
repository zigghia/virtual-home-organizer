import { StyleSheet } from 'react-native';
import { themeColors } from '@/constants/app.constants';

const commonStyle = StyleSheet.create({
	containerList: {
		flex: 1,
		flexDirection: 'row',
	},
	containerListItem: {
		minWidth: 80,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: themeColors.lightGrey,
		margin: 5,
		height: 50,
		alignItems: 'center',
		fontWeight: 'bold',
		borderRadius: 10
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
	shadow: {
		// shadowColor: "#444",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 0.5,
		// },
		// shadowOpacity: 0.4,
		// shadowRadius: 2.22,
		// elevation: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#444'
	},
	containerListItemBackground: {
		backgroundColor: themeColors.secondary
	},
	containerListItemTextWhite: {
		color: 'white',
		fontSize: 15
	}
});

export default commonStyle;
