import { createContext, useEffect, useReducer, useRef, useState } from 'react';
import { ListItemModel, OtherSettingsProps, PropertiesDatabaseRecord, ReducerPayload, SelectColorItemModel, User } from '@/utils/models';
import { SQLResultSet } from 'expo-sqlite';
import { fetchAllData, loadPropertiedData, Tables } from '@/utils/databases';
import { useTranslation } from 'react-i18next';
import UserComponents from '@/components/SettingsComponents/UserComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DataType = {
	colors: SelectColorItemModel[],
	categories: ListItemModel[],
	descriptions: ListItemModel[]
};
export const DataContext = createContext<{
	readonly data: DataType,
	users: User[],
	loadingConfigData: boolean,
	loadConfigData: () => void,
	dispatch: React.Dispatch<ReducerPayload>
} | null>(null);


const getModifiedCopy = (records: SelectColorItemModel[], val: string | number, unique = false) => {
	const index = records.findIndex(rec => rec.id === val || rec.name?.toLowerCase() == val.toString().toLowerCase());

	if ( unique ) {
		const cpRec = [...records.map(r => ({...r, selected: false}))];
		(index > -1) && (cpRec[index].selected = !records[index].selected);
		return cpRec;
	}

	if ( index == -1 ) {
		return records;
	}

	const cpRec = [...records];
	cpRec[index].selected = !cpRec[index].selected;
	return cpRec;
};


const reducer = (state: DataType, action: ReducerPayload) => {
	const constr = (record: PropertiesDatabaseRecord) => {
		const {id, name, properties} = record;
		try {
			return {id, name, ...JSON.parse(properties)};
		} catch (err) {
			return {id, name, selected: false}
		}
	}

	const init = (type: string) => {
		return ((action.payload ?? []) as PropertiesDatabaseRecord[])
			.filter((data: PropertiesDatabaseRecord) => data.type === type)
			.map((el: PropertiesDatabaseRecord) => constr(el)) ?? [];
	}

	switch (action.type) {
		case 'reset' :
			return {
				descriptions: [...state.descriptions.map((d:ListItemModel) => ({...d, selected : false}))],
				categories:  [...state.categories.map((d:ListItemModel) => ({...d, selected : false}))],
				colors:  [...state.colors.map((d:ListItemModel) => ({...d, selected : false}))],
			};
		case 'init':
			return {
				descriptions: init('description'),
				categories: init('category'),
				colors: init('color')
			};
	}
	return state;
}

const RecordDataProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
	const [data, dispatch] = useReducer(reducer, {colors: [], descriptions: [], categories: []});
	const [users, setUsers] = useState<User[]>([]);
	const [loadingConfigData, setLoading] = useState(true);
	const {i18n} = useTranslation();
	const loadConfigData = async (where: string = '') => {
		const loadedData = await loadPropertiedData(i18n.language).catch(err => alert(err));

		const {rows} = await fetchAllData(Tables.USERS);
		setUsers(rows._array);

		if ( loadedData ) {
			dispatch({type: 'init', payload: loadedData});
			setLoading(false);
		}
	};

	useEffect(() => {
		loadConfigData();
	}, [])


	return <DataContext.Provider value={{data, loadingConfigData, dispatch, loadConfigData, users}}>
		{children}
	</DataContext.Provider>
}

export default RecordDataProvider;
