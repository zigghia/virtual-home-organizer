import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity, } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button/Button';
import { DataContext } from '@/context/StaticDataContext';
import SelectColors from '@/components/CreateNewRecord/SelectColors/SelectColorsComponent';
import { CheckBox, Divider } from '@rneui/base';
import { themeColors, themeDefaults } from '@/constants/app.constants';
import FlatList = Animated.FlatList;
import SeasonComponent from '@/components/CreateNewRecord/SeasonComponent';
import commonStyle from '@/utils/common.style';
import { SelectColorItemModel } from '@/utils/models';
import { Ionicons } from '@expo/vector-icons';

const OFFSET = Dimensions.get("window").width;

const a = (save: string, cancel: string) => {
	return <View style={{flexDirection: 'row'}}>
		<Button disabled text={save} isLeft/>
		<Button isSecondary text={cancel}/>
	</View>
}
const Filters = (props: any) => {
	const {t} = useTranslation();
	const {users, data} = useContext(DataContext)!;
	const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
	const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
	const [colors, setColors] = useState<SelectColorItemModel[]>([...data.colors]);

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{translateX: withSpring(props.isVisible ? -OFFSET : 0)}],
	}));

	const reset = () => {
		setSelectedUserIndex(null);
		setSelectedSeason(null);
	}
	const setSearch = () => {
		const c = data.colors.filter(c => c.selected).map(c => c.name).join(' ').trim();
		const user = users.find(u => u.id == selectedUserIndex)?.nickname;
		const season = selectedSeason?.toLowerCase() ?? '';
		props.search([c, user, season].filter(e => e).join(' ').trim().toLowerCase());
	}

	const DATA = [{
		title: t('common:colors'),
		component: <SelectColors bulletSize={20}
								 items={colors}
								 updateData={(color: SelectColorItemModel) => {
									 const c = colors.find(c => c.id == color.id);
									 if ( !c ) {
										 return;
									 }
									 c.selected = !color.selected;
									 setColors([...colors]);
								 }}/>
	}, {
		title: t('common:season'),
		component: <SeasonComponent selectedSeason={selectedSeason} updateData={setSelectedSeason}/>
	}, {
		title: t('common:family'),
		component: <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
			{
				users.map((user, index) => {
					return <CheckBox checked={selectedUserIndex == user.id}
									 checkedColor={themeColors.secondary}
									 checkedIcon="dot-circle-o"
									 onPress={() => setSelectedUserIndex(user.id == selectedUserIndex ? null : user.id)}
									 uncheckedIcon="circle-o"
									 title={user.nickname}
									 key={'userFilterCheckbox' + index}/>
				})
			}
		</View>
	}]
	return (
		<View style={s.container}>
			<Animated.View style={[s.box, props.isVisible != null ? animatedStyles : null]}>
				<View style={s.flatContainer}>

					<View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 20, margin: 0}}>
						<TouchableOpacity onPress={reset}>
							<Text style={{textDecorationLine: 'underline', fontSize: themeDefaults.fontHeader4}}> {t('search:resetFilters')}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{zIndex: 100, alignSelf: 'flex-end'}}
										  hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
										  onPress={props.cancel}>
							<Ionicons name="close" size={25} color="black"/>
						</TouchableOpacity>
					</View>

					<FlatList data={DATA}
							  style={{height: 350}}
							  keyExtractor={(item, index) => 'filters' + index}
							  renderItem={({item, index}) => {
								  return <>
									  <Text style={s.title}>{item.title}</Text>
									  {item.component}
									  <Divider subHeader={index == 2 ? '' : ' + '} style={s.divider}/>
								  </>
							  }}
					/>
					<View style={{paddingVertical: 10}}>
						<Button text={t('search:applyFilters')} isLeft onPress={setSearch}/>
					</View>
				</View>

			</Animated.View>
		</View>
	)
}

const s = StyleSheet.create({
	container: {
		zIndex: 500,
	},
	flatContainer: {
		backgroundColor: 'white',
		paddingVertical: 10,
		borderBottomEndRadius: 30,
		paddingHorizontal: 10,
		borderBottomStartRadius: 30,
		...commonStyle.shadow
	},
	box: {
		left: Dimensions.get("window").width,
		position: 'absolute',
		backgroundColor: 'white'
	},
	title: {
		fontSize: themeDefaults.fontHeader4,
		padding: 0,
		marginVertical: 0
	},
	divider: {
		marginVertical: 10
	}

});
export default Filters;
