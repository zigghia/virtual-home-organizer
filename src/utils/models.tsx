export interface ListItemModel {
	plural?: string | undefined;
	id: number;
	name?: string;
	selected?: boolean;
	deletable?: boolean
}


export interface SelectColorItemModel extends ListItemModel {
	bgColor?: string;
	fontColor?: string;
	default?: boolean; //only 9 color default maximum to be displayed in main page
}

export interface RecordModel {
	id?: number;
	colors?: string;
	categories?: string;
	imgUri?: string;
	description?: string;
	userId?: number;
	containerIdentifier?: string;
	searchKeys?: string;
	season?: string;
}

export interface RecordModelExtended extends  RecordModel{
	colorsInfo?: SelectColorItemModel[]
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
