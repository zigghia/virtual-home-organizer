import { createContext, useEffect, useReducer, useState } from 'react';
import { ListItemModel, PropertiesDatabaseRecord, ReducerPayload, SelectColorItemModel } from '@/utils/models';
import { SQLResultSet } from 'expo-sqlite';
import { fetchAllData, loadPropertiedData, Tables } from '@/utils/databases';
import { useTranslation } from 'react-i18next';


export type dataType = {
	colors: SelectColorItemModel[],
	categories: ListItemModel[],
	descriptions: ListItemModel[]
};
export const DataContext = createContext<{
	data: dataType,
	init: boolean,
	dispatch: React.Dispatch<ReducerPayload>;
} | null>(null);


const getModifiedCopy = (records: SelectColorItemModel[], val: string | number, unique = false) => {
	const index = records.findIndex(rec => rec.id === val || rec.name == val);

	if ( unique ) {
		const cpRec = [...records.map(r => ({...r, selected: false}))];
		(index > -1) && (cpRec[index].selected = !records[index].selected);
		return cpRec;
	}

	if ( index == -1 ) {
		return [];
	}

	const cpRec = [...records];
	cpRec[index].selected = !cpRec[index].selected;
	return cpRec;
};


const reducer = (state: dataType, action: ReducerPayload) => {
	const constr = (record: PropertiesDatabaseRecord) => {
		const {id, name, properties} = record;
		try {
			return {id, name, ...JSON.parse(properties), selected: false};
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
		case 'init':
			return {
				descriptions: init('description'),
				categories: init('category'),
				colors: init('color')
			};

		case 'update': {
			const payload = (action?.payload as { key: 'colors' | 'categories' | 'descriptions', id: number, name?: string, unique?: boolean });
			return {...state, [payload.key]: getModifiedCopy(state[payload.key], payload.id ?? payload.name ?? 0, payload.unique ?? false)};
		}
		case 'insert_category' :
			let obj = action.payload as { insertId: number, name: string };
			const categories = [...state.categories ?? []];
			categories.push({id: obj.insertId, deletable: true, name: obj.name, selected: true});
			return {
				...state,
				categories: categories
			};
		case 'recalculate': {
			const payload = (action?.payload as { data: PropertiesDatabaseRecord[], type: 'categories' | 'descriptions' });

			const key  = payload.type == 'categories' ? 'category' : 'description';

			const arr = state[payload.type];
			const selectedIds = arr.filter(el => el.selected).map(el => (el.id));
			const n = ((payload.data ?? []) as PropertiesDatabaseRecord[]).filter(el => el.type ==  key);
			const ref = n.map(((type: PropertiesDatabaseRecord) => constr(type))) ?? [];


			return {
				...state,
				[payload.type]: ref.map((el, index) => ({...el, selected: selectedIds.includes(el.id)})),
			}
		}
	}
	return state;
}

const RecordDataProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
	const [data, dispatch] = useReducer(reducer, {colors: [], descriptions: [], categories: []});
	const [init, setInit] = useState(true);
	const {i18n} = useTranslation();

	useEffect(() => {
		const loadData = async (where: string = '') => {
			const loadedData = await loadPropertiedData(i18n.language).catch(err => alert(err));

			if ( loadedData ) {
				dispatch({type: 'init', payload: loadedData});
				setInit(false);
			}
		};

		loadData();
	}, [])


	return <DataContext.Provider value={{data, init, dispatch}}>
		{children}
	</DataContext.Provider>
}

export default RecordDataProvider;
