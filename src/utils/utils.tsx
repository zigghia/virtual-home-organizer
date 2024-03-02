import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllData, Tables } from "@/utils/databases";
import { useRef } from "react";

export const debounce = (func?: any, delay?: number) => {
	let timeoutId: any;

	return (...args : any) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func?.apply(this, args);
		}, delay);
	};
};

export const CURRENT_USER = async (me = 'None') => {
	const def = {nickname: me, id: 1, 'isDefault': 1};
	try {
		let currentUser = await AsyncStorage.getItem('vho-current-user');
		if (!currentUser) {
			const {rows} = await fetchAllData(Tables.USERS);
			currentUser = JSON.stringify((rows._array ?? [])[0]);

			try {
				await AsyncStorage.setItem(
					'vho-current-user',
					currentUser
				);
			} catch (error) {
				return def;
			}
		}

		return JSON.parse(currentUser);

	} catch (error) {
		return def;
	}
}


