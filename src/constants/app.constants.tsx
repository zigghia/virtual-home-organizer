export enum themeColors {
	secondary= '#4fb09d',
	primary=  '#A20373',
	disabled = '#e0e0e0',
	darkGrey = '#C8C7CD',
	header= '#444',
	lightGrey = '#F8F8F8',
	error =  '#cc0000'
}

export enum themeDefaults {
	buttonHeight = 40,
	fontSize = 16,
	fontHeader1 = 40,
	fontHeader2 = 30,
	fontHeader3 = 20,
	fontHeader4 = 18,
}

export enum appConstants {
	maxCategoriesAllowed = 15,
	maxCategoryCharsAllowed = 10,
	maxBoxIdentifierLength=3
}


export enum errorCodes {
	"001", //inserare un produs in baza de date,
	"002", //categoria nu a fost adaugata in baza de date
	"003", //produsul nu a fost sters din lista
	"004", //categoriile nu pot fi sterse din settings
}
