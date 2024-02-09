import { createContext } from "react";

export interface TempDataContextProp {
	data: any,
	updateData: (key: unknown, data: unknown) => void
}


const TempDataContext = createContext<TempDataContextProp>({
	data: {},

	updateData: (data: unknown) => {}
});

export default TempDataContext;
