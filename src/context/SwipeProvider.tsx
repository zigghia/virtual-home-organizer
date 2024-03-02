import React, { createContext, ReactNode, useMemo, useState } from "react";

type SwipeContextProps = {
	openedItemKey: string;
	setOpenedItemKey: (key: string) => void;
};

type SwipeProviderProps = {
	children: ReactNode;
	initialOpenedItemKey?: string;
};

const swipeContextValues: SwipeContextProps = {
	openedItemKey: '',
	setOpenedItemKey: () => {},
};

export const SwipeContext = createContext<SwipeContextProps>(
	swipeContextValues,
);

export const SwipeProvider: React.FC<SwipeProviderProps> = ({children, initialOpenedItemKey}) => {
	const [openedItemKey, setOpenedItemKey] = useState(initialOpenedItemKey ?? '');

	const value = useMemo(() => {
		return {
			openedItemKey,
			setOpenedItemKey,
		};
	}, [openedItemKey]);

	return (
		<SwipeContext.Provider value={value}>{children}</SwipeContext.Provider>
	);
}


