import { createTheme } from '@rneui/themed';

export const theme = createTheme({
	mode: 'light',
	lightColors: {
		primary: '#ff0080',
		secondary: '#59b300',
		grey0: '#C8C7CD',
		grey1: '#e1e1ea',
		grey2: '#444',
		searchBg: 'red',
		error: '#cc0000'
		// disabled: string;
		// divider: string;
	}
});
export enum themeColors {
	secondary1= '#4fb09d',
	secondary= '#59b300',
	primary1=  '#ff9900',
	primary=  '#ff0080',
	disabled = '#e0e0e0',
	darkGrey = '#C8C7CD',
	header= '#444',
	lightGrey = '#f2f2f2',
	error =  '#cc0000',
	white = '#ffffff'
}

export enum themeDefaults {
	buttonHeight = 40,
	inputHeight = 50,
	fontSize = 16,
	fontHeader1 = 40,
	fontHeader2 = 30,
	fontHeader3 = 20,
	fontHeader4 = 18,
}

export enum appConstants {
	maxColorsSelected = 9,
	maxCategoriesAllowed = 15,
	maxLocationsAllowed = 5,
	maxCategoryCharsAllowed = 10,
	maxCategoryLocationAllowed = 10,
	maxBoxIdentifierLength=3,
	maxUserLength= 10,
	minUserLength= 2,
	maxUsersNo = 5
}

export enum seasons {
	SPRING,
	SUMMER,
	AUTUMN,
	WINTER
}
export enum errorCodes {
	"001", //inserare un produs in baza de date,
	"002", //categoria nu a fost adaugata in baza de date
	"003", //produsul nu a fost sters din lista
	"004", //categoriile nu pot fi sterse din settings
}
