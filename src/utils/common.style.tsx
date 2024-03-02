import { StyleSheet } from 'react-native';
import { themeColors, themeDefaults } from '@/constants/app.constants';

const commonStyle = StyleSheet.create({
	containerList: {
		flex: 1,
		flexDirection: 'row',
	},
	containerListItem: {
		flexDirection: 'row',
		minWidth: 100,
		backgroundColor: themeColors.lightGrey,
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		padding: 5,
		marginTop: 5,
		marginRight: 5,
		fontWeight: 'bold',
		borderRadius: 20
	},
	listIemSelected: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: themeColors.disabled,
		backgroundColor: themeColors.secondary
	},
	containerListItemBackground: {
		backgroundColor: themeColors.secondary
	},
	input: {
		fontSize: 25,
		textAlign: 'center',
		borderWidth: 1,
		margin: 0,
		paddingRight: 0,
		paddingLeft: 10,
		borderRadius: 20,
		borderColor: themeColors.secondary,
		backgroundColor: '#fff',
		height: themeDefaults.inputHeight
	},
	shadow: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity:  0.19,
		shadowRadius: 5.62,
		elevation: 6
	},
	containerListItemTextWhite: {
		color: 'white'
	}
});

export default commonStyle;
