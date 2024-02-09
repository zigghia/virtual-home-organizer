export interface ListItemModel {
	id?: number;
	name?: string;
	selected?: boolean;
	deletable?: boolean
}


export interface SelectColorItemModel extends ListItemModel {
	bgColor?: string;
	fontColor?: string;
	default?: boolean; //only 9 color default maximum to be displayed in main page
	plural?: string; //when saving, save both form [rosu, rosii]
}

export interface RecordModel {
	id?: string;
	colors?: string;
	categories?: string;
	imgUri?: string;
	description?: string;
	userId?: number;
	containerIdentifier?: string;
	searchKeys?: string;
	season?: string;
}


export interface PropertiesDatabaseRecord {
	id: number,
	name: string,
	type: string,
	lang: string,
	properties: string
}

export interface User {
	id: number;
	nickname: string;
	isDefault: number
}


export interface ReducerPayload {
	type: string,
	payload?: unknown
}
