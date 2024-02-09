import { createContext } from "react";
import { RecordModel } from '@/utils/models';

export interface RecordContextProps {
	data: RecordModel,
	updateData: (key: keyof RecordModel, data: string) => void
}


const RecordContext = createContext<RecordContextProps>({
	data: {
		colors: '',
		categories: '',
		imgUri: '',
		description: '',
		containerIdentifier: '',
		userId: ''
	},

	updateData: (key:  keyof RecordModel, data:  string) => {}
});

export default RecordContext;
