// SearchBar.js
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, Pressable } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { themeColors } from '@/constants/app.constants';

const SearchBar = ({onSearch}: { onSearch: (q: string) => void }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const [clicked, setClicked] = useState(false);

	const search = (value: string) => {
		setSearchQuery(value);
		onSearch(value);
	}

	return (
		<View style={styles.container}>
			<View style={clicked ? styles.searchBar__clicked : styles.searchBar__unclicked}>
				<Feather name="search" size={20} color="black" style={{marginLeft: 1}}/>

				<TextInput
					style={styles.input}
					placeholder='Cauta'
					clearButtonMode="while-editing"
					value={searchQuery}
					onChangeText={search}
					onBlur={() => {setClicked(false); Keyboard.dismiss();}}
					onFocus={() => setClicked(true)}
				/>

				{/*{clicked && (*/}
				{/*	<Pressable onPress={() => {Keyboard.dismiss(); search('');}}>*/}
				{/*		<Entypo*/}
				{/*			name="cross"*/}
				{/*			size={20}*/}
				{/*			color="black"*/}

				{/*		/>*/}
				{/*	</Pressable>*/}
				{/*)}*/}
			</View>
		</View>
	);
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		marginHorizontal: 5,
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",
		zIndex: 500
	},
	searchBar__unclicked: {
		padding: 10,
		flexDirection: "row",
		width: "100%",
		backgroundColor: "#d9dbda",
		borderRadius: 5,
		alignItems: "center",
	},
	searchBar__clicked: {
		padding: 10,
		flexDirection: "row",
		//width: "80%",
		backgroundColor: themeColors.disabled,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	input: {
		fontSize: 20,
		marginLeft: 10,
		flex: 1
	},
});
