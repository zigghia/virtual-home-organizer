import { createContext } from 'react';
import { ListItemModel, RecordModel, SelectColorItemModel } from '@/utils/models';

export const StaticDataContext = createContext({
	colors: [] as SelectColorItemModel[],
	categories:[] as ListItemModel[],
	updateColors: (data: SelectColorItemModel) => {},
	updateCategories: (data: ListItemModel) => {}
});
