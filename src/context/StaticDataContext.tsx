import { createContext, useReducer } from 'react';
import { ListItemModel, PropertiesDatabaseRecord, ReducerPayload, SelectColorItemModel } from '@/utils/models';


export type dataType = { colors: SelectColorItemModel[], categories: ListItemModel[], descriptions: ListItemModel[] };
export const DataContext = createContext<{
	data: dataType
	dispatch: React.Dispatch<ReducerPayload>;
} | null>(null);

const getModifiedCopy = (records: SelectColorItemModel[], val: string | number, unique = false) => {
	const index = records.findIndex(rec => rec.id === val || rec.name == val);

	if ( unique ) {
		const cpRec = [...records.map(r => ({...r, selected: false}))];
		(index >  -1)  && (cpRec[index].selected = !records[index].selected);
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
				colors: init('color').filter(el => el.default)
			};

		case 'update': {
			const payload  = (action?.payload as {key: 'colors' | 'categories' | 'descriptions', id: number, name?: string, unique?: boolean});
			return {...state, [payload.key]: getModifiedCopy(state[payload.key], payload.id ?? payload.name ?? 0, payload.unique ?? false)};
		}
		case 'insert_category' :
			let obj = action.payload as { insertId: number, name: string };
			const categories =[ ...state.categories ?? []];
			categories.push({id: obj.insertId, deletable: true, name: obj.name, selected: true});
			return {
				...state,
				categories: categories};
		case 'recalculate_categories': {
			if ( !state.categories.length ) {
				return state;
			}
			const categories = state.categories;
			const selectedIds = categories.filter(el => el.selected).map(el => (el.id));
			const refCurr = ((action.payload ?? []) as PropertiesDatabaseRecord[]).map(((type: PropertiesDatabaseRecord) => constr(type))) ?? [];
			return {
				...state,
				categories: refCurr.map((el, index) => ({...el, selected: selectedIds.includes(el.id)}))
			}
		}
	}
	return state;
}

const RecordDataProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
	const [data, dispatch] = useReducer(reducer, {colors: [], descriptions: [], categories: []});

	return <DataContext.Provider value={{data, dispatch}}>
		{children}
	</DataContext.Provider>
}

export default RecordDataProvider;
