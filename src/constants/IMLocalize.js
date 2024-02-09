import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "intl-pluralrules";

import en from './translations/en';
import ro  from './translations/ro';
import { fetchAllData, Tables } from "@/utils/databases";
import { User } from '@/utils/models';


export const CURRENT_USER = async (me = 'None') => {
	const def = {nickname: me, id: 1, 'isDefault': 1};
	try {
		let currentUser =  await AsyncStorage.getItem('vho-current-user');
		if (!currentUser) {
				const {rows} = await fetchAllData(Tables.USERS);
					currentUser = JSON.stringify((rows._array ?? [])[0]);

				try {
					await AsyncStorage.setItem(
						'vho-current-user',
						JSON.stringify(currentUser)
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

const LANGUAGES = {
	en,
	ro
};


const LANGUAGE_DETECTOR = {
	type: 'languageDetector',
	async: true,
	detect: callback => {
		AsyncStorage.getItem('vho-user-language', (err, language) => {
			// if error fetching stored data or no language was stored
			// display errors when in DEV mode as console statements
			if (err || !language) {
				if (err) {
					console.log('Error fetching Languages from asyncstorage ', err);
				} else {
					console.log('No language is set, choosing English as fallback');
				}

				callback('en');
				return;
			}
			callback(language);
		});
	},
	init: () => {},
	cacheUserLanguage: language => {
		AsyncStorage.setItem('vho-user-language', language);
	}
};

i18n
	// detect language
	.use(LANGUAGE_DETECTOR)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// set options
	.init({
		resources: LANGUAGES,
		react: {
			useSuspense: false
		},
		interpolation: {
			escapeValue: false
		},
		defaultNS: 'common'
	});
