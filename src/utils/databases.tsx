import * as SQLite from 'expo-sqlite';
import { SQLResultSet, SQLTransaction } from 'expo-sqlite';

import { PropertiesDatabaseRecord, RecordModel } from '@/utils/models';
import { SQLStatementArg } from 'expo-sqlite/src/SQLite.types';
import { warnAboutConfigAndThrow } from 'expo-cli/build/commands/utils/modifyConfigAsync';

export enum Tables {
	PROPERTIES = 'properties',
	USERS = 'users',
	PRODUCTS = 'products',
	SETTINGS = 'settings'
}

//settings version, imgDirName, fa => free account
const database = SQLite.openDatabase('virtualHomeOrganiser.db');

const dropTables = async (table?: Tables): Promise<any> => {
	return database.transactionAsync(async tx => {
		table && table == Tables.USERS && (await tx.executeSqlAsync(`DROP TABLE IF EXISTS ${Tables.USERS}`, []));
		table && table == Tables.PROPERTIES && (await tx.executeSqlAsync(`DROP TABLE IF EXISTS ${Tables.PROPERTIES}`, []));
		table && table == Tables.PRODUCTS && (await tx.executeSqlAsync(`DROP TABLE IF EXISTS ${Tables.PRODUCTS}`, []));
	}, false);
}

const createTables = async (userNicknameDefault: string): Promise<unknown> => {

	return database.transactionAsync(async tx => {
		await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS ${Tables.SETTINGS}
                                  (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT
                                      NOT NULL,
                                      dbversion TEXT NOT NULL
                                  )`, []);

		await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS ${Tables.PROPERTIES}
                                  (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT
                                      NOT NULL,
                                      name TEXT NOT NULL,
                                      type TEXT NOT NULL,
                                      lang TEXT NOT NULL,
                                      properties  TEXT
                                  )`, []);

		await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS ${Tables.USERS} (
												id INTEGER PRIMARY KEY NOT NULL,
												nickname TEXT UNIQUE NOT NULL,
                                                               isDefault INTEGER  NOT NULL CHECK (isDefault IN (0, 1)) default 0
                                    )`,[]);

		await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS ${Tables.PRODUCTS}(
                                                               id        			INTEGER PRIMARY KEY NOT NULL,
                                                               containerIdentifier  TEXT,
                                                               colors  	  			TEXT,
                                                               categories  			TEXT,
                                                               imgUri				TEXT,
                                                               description			TEXT,
                                                               season  				TEXT,
                                                               searchKeys           TEXT,
                                                               userID INTEGER CHECK (userID IN (0,1)) default 0      
                                                               
                                    )`,[]);


		await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS ${Tables.PRODUCTS} (
    								  id INTEGER PRIMARY KEY  NOT NULL,
                                      containerIdentifier TEXT,
                                      colors TEXT,
                                      categories TEXT,
                                      season TEXT,
                                      description TEXT,
                                      imgUri TEXT,
                                      searchKeys TEXT,
                                      userID  NUMBER default 1

                                  )`, []);


		const {rows} = await tx.executeSqlAsync(`SELECT (SELECT count(*) FROM ${Tables.PROPERTIES}) as cp, (SELECT count(*) as count
                                                 FROM ${Tables.USERS}) as cu`, []);

		if ( !rows[0]['cu'] ) {
			await tx.executeSqlAsync(`INSERT INTO ${Tables.USERS} (nickname, isDefault)
                                      VALUES ('${userNicknameDefault}', 1)`, []);
		}

		if ( !rows[0]['cp'] ) {
			const DATA_TYPES = [
				{id: 1, name: 'Shoes', type: 'category', lang: 'en', properties: '{"deletable": false}'},
				{id: 2, name: 'Boots', type: 'category', lang: 'en', properties: '{"deletable": false}'},
				{id: 3, name: 'Sandals', type: 'category', lang: 'en', properties: '{"deletable": false}'},
				{id: 4, name: 'Sneakers', type: 'category', lang: 'en', properties: '{"deletable": false}'},
				{id: 5, name: 'Cizme', type: 'category', lang: 'ro', properties: '{"deletable": false}'},
				{id: 6, name: 'Sandale', type: 'category', lang: 'ro', properties: '{"deletable": false}'},
				{id: 7, name: 'Pantofi', type: 'category', lang: 'ro', properties: '{"deletable": false}'},
				{id: 8, name: 'Ghete', type: 'category', lang: 'ro', properties: '{"deletable": false}'},
				{id: 9, name: 'Bocanci', type: 'category', lang: 'ro', properties: '{"deletable": false}'},
				{id: 10, name: 'White', type: 'color', lang: 'en', properties: '{"bgColor": "#ffffff", "default":  true}'},
				{id: 11, name: 'Grey', type: 'color', lang: 'en', properties: '{"bgColor": "#B1B1B1", "default": true}'},
				{id: 12, name: 'Black', type: 'color', lang: 'en', properties: '{"bgColor": "#000000", "fontColor": "#ffffff", "default":  true}'},
				{id: 13, name: 'Cream', type: 'color', lang: 'en', properties: '{"bgColor": "#e7d192", "default":  true}'},
				{id: 14, name: 'Brown', type: 'color', lang: 'en', properties: '{"bgColor": "#b45f06", "default":  true}'},
				{id: 15, name: 'Yellow', type: 'color', lang: 'en', properties: '{"bgColor": "#fffaa0", "default":  true}'},
				{id: 16, name: 'Red', type: 'color', lang: 'en', properties: '{"bgColor": "#FF0000", "default":  true}'},
				{id: 17, name: 'Blue', type: 'color', lang: 'en', properties: '{"bgColor": "#5d5dff", "default":  true}'},
				{id: 18, name: 'Green', type: 'color', lang: 'en', properties: '{"bgColor": "#50C878", "default":  true}'},
				{id: 19, name: 'Orange', type: 'color', lang: 'en', properties: '{"bgColor": "#ffa500", "default":  false}'},
				{id: 20, name: 'Pink', type: 'color', lang: 'en', properties: '{"bgColor": "#ffc0cb", "default":  false}'},
				{id: 21, name: 'Purple', type: 'color', lang: 'en', properties: '{"bgColor": "#800080", "default":  false}'},
				{id: 22, name: 'Silver', type: 'color', lang: 'en', properties: '{"bgColor": "#C0C0C0", "default":  false}'},
				{id: 23, name: 'Gold', type: 'color', lang: 'en', properties: '{"bgColor": "#FFD700", "default":  false}'},
				{id: 24, name: 'Mix color', type: 'color', lang: 'en', properties: '{"bgColor": "#ffffff", "default": false, "fontColor": "#800080"}'},
				{id: 25, name: 'Alb', type: 'color', lang: 'ro', properties: '{"bgColor": "#ffffff", "default":  true, "plural":"albi,albe"}'},
				{id: 26, name: 'Gri', type: 'color', lang: 'ro', properties: '{"bgColor": "#B1B1B1", "default": true, "plural":"grey"}'},
				{id: 27, name: 'Negru', type: 'color', lang: 'ro', properties: '{"bgColor": "#000000", "fontColor": "#ffffff", "default":  true, "plural":"negri,negre"}'},
				{id: 28, name: 'Crem', type: 'color', lang: 'ro', properties: '{"bgColor": "#e7d192", "default": true, "plural":"crem,creme"}'},
				{id: 29, name: 'Maro', type: 'color', lang: 'ro', properties: '{"bgColor": "#b45f06", "default":  true, "plural":"maro"}'},
				{id: 30, name: 'Galben', type: 'color', lang: 'ro', properties: '{"bgColor": "#fffaa0", "default": true, "plural":"galbene"}'},
				{id: 31, name: 'Rosu', type: 'color', lang: 'ro', properties: '{"bgColor": "#FF0000", "default": true, "plural":"rosii"}'},
				{id: 32, name: 'Albastru', type: 'color', lang: 'ro', properties: '{"bgColor": "#5d5dff", "default": true, "plural":"albastri,albastre"}'},
				{id: 33, name: 'Verde', type: 'color', lang: 'ro', properties: '{"bgColor": "#50C878", "default": true, "plural":"verzi"}'},
				{id: 34, name: 'Portocaliu', type: 'color', lang: 'ro', properties: '{"bgColor": "#ffa500", "default": false, "plural":"portocalii"}'},
				{id: 35, name: 'Roz', type: 'color', lang: 'ro', properties: '{"bgColor": "#ffc0cb", "default": false, "plural":"roz"}'},
				{id: 36, name: 'Mov', type: 'color', lang: 'ro', properties: '{"bgColor": "#800080", "default":  false, "plural":"mov"}'},
				{id: 37, name: 'Argintiu', type: 'color', lang: 'ro', properties: '{"bgColor": "#C0C0C0", "default": false, "plural":"argintii"}'},
				{id: 38, name: 'Auriu', type: 'color', lang: 'ro', properties: '{"bgColor": "#FFD700", "default": false, "plural":"aurii"}'},
				{id: 39, name: 'Mix culori', type: 'color', lang: 'ro', properties: '{"bgColor": "#ffffff", "default": false, "fontColor": "#800080", "plural":"mix"}'}
			];
			let arrvalues: any[] = [];

			DATA_TYPES.reduce((acc, el) => {
				acc.push(`(${el.id}, "${el.name}", "${el.type}", "${el.lang}", '${el.properties}')`);
				return acc;
			}, arrvalues);

			await tx.executeSqlAsync(`INSERT INTO ${Tables.PROPERTIES}
                                      VALUES ${arrvalues}`, []);
		}

	}, false);
}

export const insertProduct = async (data: RecordModel) => {
	return await database.transactionAsync(async tx => {

		const {colors = '', userId = 1, categories = '', containerIdentifier = '', description = '', imgUri = '', searchKeys = '', season = ''} = data;
		await tx.executeSqlAsync(`INSERT INTO ${Tables.PRODUCTS}
                                      (colors, userId, categories, containerIdentifier, description, imgUri, searchKeys, season)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[colors, userId, categories, containerIdentifier, description, imgUri, searchKeys, season]);

	}, false);
}

export const updateProduct = async (data: RecordModel) => {
	if (data.id == null) {
		return;
	}
	return await database.transactionAsync(async tx => {

		const {colors = '', userId = 1, categories = '', containerIdentifier = '', description = '', imgUri = '', searchKeys = '', season = '', id} = data;
		await tx.executeSqlAsync(`UPDATE ${Tables.PRODUCTS}
                                             SET  colors = ?, userId = ?, categories =?, containerIdentifier =? , description = ?, imgUri = ?, searchKeys = ?, season = ?
											 WHERE id =?`,
			[colors, userId, categories, containerIdentifier, description, imgUri, searchKeys, season, id ?? 0]);

	}, false);
}

export const initDatabase = async (userNicknameDefault: string): Promise<void> => {

	try {
		//	await deleteCategory();
		//await dropTables(Tables.PRODUCTS);
		//await dropTables(Tables.PROPERTIES);
		await createTables(userNicknameDefault);
	} catch (err: unknown) {
		throw err;
	}
}
export const insertProperty = (name: string, language: string, type= 'category'): Promise<SQLResultSet> => {
	return new Promise((resolve, reject) =>
		database.transaction((tx) => {
			tx.executeSql(
				`INSERT INTO ${Tables.PROPERTIES} (name, type, lang, properties)
                 VALUES (?, ?, ?, ?)`,
				[name ?? '-', type, language, JSON.stringify({deletable: true})],
				(tr, resultSet) => resolve(resultSet),
				(tr: SQLTransaction, error): any => {
					reject(error)
				}
			);
		})
	);
}

export const insertUser= (name: string): Promise<SQLResultSet> => {
	return new Promise((resolve, reject) =>
		database.transaction((tx) => {
			tx.executeSql(
				`INSERT INTO ${Tables.USERS} (nickname)
                 VALUES (?)`,
				[name],
				(tr, resultSet) => resolve(resultSet),
				(tr: SQLTransaction, error): any => {
					reject(error)
				}
			);
		})
	);
}

export const updateUser = async (id: number, name: string) => {
	try {
		await database.transactionAsync(async tx => {
			const {rows} = await tx.executeSqlAsync(`UPDATE  ${Tables.USERS}
													 SET nickname = ?
                                                     WHERE id = ?`, [name, id]);
		}, false);
	}
	catch (err) {
		throw err;
	}
}

export const deleteUser = async (id: number) => {
	try {
		await database.transactionAsync(async tx => {
			const {rows} = await tx.executeSqlAsync(`DELETE
                                                     FROM ${Tables.USERS}
                                                     WHERE id = ?
                                                     AND isDefault == 0`, [id]);
		}, false);
	}
	catch (err) {
		throw err;
	}
}

export const deleteCategory = async (name: string, lang: string) => {
	await database.transactionAsync(async tx => {
		const nameSQL = name?.length ? "AND name='?' " : '';
		const {rows} = await tx.executeSqlAsync(`DELETE
                                                 FROM ${Tables.PROPERTIES}
                                                 WHERE type = 'category'${nameSQL}AND json_extract(properties,'$.deletable')=true AND lang=${lang}`, [name ?? '']);
	}, false);
}

export const deleteFromTable = async (ids: number [], table: Tables) => {

	try {
		await database.transactionAsync(async tx => {
			try {
				await tx.executeSqlAsync(`DELETE
                                          FROM ${table}
                                          WHERE id IN (${ids.join(' , ')})`, []);
			} catch (err) {
				throw err;
			}

		}, false);
	}
	catch (err) {
		throw err;
	}
}


export const fetchAllData = (table: Tables, where: string = '', args?:  SQLStatementArg[]): Promise<SQLResultSet> => {

	return new Promise((resolve, reject) =>
		database.transaction((tx) => {
			tx.executeSql(
				`SELECT *
                 from ${table} ${where}`,
				args,
				(tr, resultSet) => resolve(resultSet),
				(tr: SQLTransaction, error): any => {
					reject(error)
				}
			);
		})
	);
}

export const loadPropertiedData = async (language: string, where: string = '') : Promise<any> => {
	try {
		const {rows}: SQLResultSet = await fetchAllData(Tables.PROPERTIES, where);
		if (rows) {
			return (rows._array ?? []).filter((data: PropertiesDatabaseRecord) => data.lang == language);
		}

		return [];
	}
	catch (err) {
		throw err;
	}
};
