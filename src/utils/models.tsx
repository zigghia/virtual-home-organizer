


export interface SelectColorItemModel extends ListItemModel {
	bgColor?: string;
	fontColor?: string;
	default?: boolean; //only 9 color default maximum to be displayed in main page
}

export interface FormRecordModel {
	id?: number;
	colors: SelectColorItemModel[];
	categories: ListItemModel[];
	description?: string;
	imgUri?: string;
	oldImgUri?: string;
	userID?: number;
	containerIdentifier?: string;
	season?: string;
}
export interface RecordModel {
	id?: number;
	colors?: string;
	categories?: string;
	imgUri: string;
	description?: string;
	userID?: number;
	containerIdentifier?: string;
	searchKeys?: string;
	season?: string;
}
//
// export interface RecordModelExtended extends  RecordModel{
// 	colorsInfo?: SelectColorItemModel[],
// 	categoriesInfo?: ListItemModel[];
// }

export interface PropertiesDatabaseRecord {
	id: number,
	name: string,
	type: string,
	lang: string,
	properties: string
}

export interface ListItemModel {
	plural?: string | undefined;
	id: number;
	name: string;
	selected?: boolean;
	deletable?: boolean
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


export interface OtherSettingsProps {
	location?: boolean,
	categories?: boolean,
	users?: boolean,
	season?: boolean
}

export type otherSettingsKeys = keyof OtherSettingsProps;
