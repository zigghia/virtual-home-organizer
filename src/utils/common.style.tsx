import { StyleSheet } from 'react-native';
import { themeColors } from '@/constants/app.constants';

const commonStyle = StyleSheet.create({
	containerList: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
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
