import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, } from 'react-native';
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

const OFFSET = Dimensions.get("window").width;

const a = (save: string, cancel: string) => {
	return <View style={{flexDirection: 'row'}}>
		<Button disabled text={save} isLeft/>
		<Button isSecondary text={cancel}/>
	</View>
}
const Filters = (props: any) => {
	const {t} = useTranslation();
	const {users, data, dispatch} = useContext(DataContext)!;
	const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
	const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
	const [colors, setColors] = useState<number[]>([]);

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{translateX: withSpring(props.isVisible ? -OFFSET : 0)}],
	}));

	const reset = () => {
		dispatch({type: 'reset'});
		setSelectedUserIndex(null);
		setSelectedSeason(null);
	}
	const setSearch = () => {
		const c = data.colors.filter(c => colors.includes(c.id)).map(c => c.name).join(' ').trim();
		const user = users.find(u => u.id == selectedUserIndex)?.nickname;
		const season = selectedSeason?.toLowerCase() ?? '';
		props.search([c, user, season].filter(e => e).join(' ').trim().toLowerCase());
	}

	const DATA = [{
		title: t('common:colors'),
		component: <SelectColors bulletSize={20}
								 items={data.colors}
								 updateData={(id: number) => {
									 if ( colors.includes(id) ) {
										 setColors(colors.filter(c => c != id));
										 return;
									 }
									 setColors([...colors, id]);
								 }}
								 selectedIs={colors}/>
	}, {
		title: t('common:season'),
		component: <SeasonComponent selectedSeason={selectedSeason} updateData={setSelectedSeason}/>
	}, {
		title: t('common:family'),
		component: <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
			{
				users.map((user, index) => {
					return <CheckBox checked={selectedUserIndex == index}
									 checkedColor={themeColors.secondary}
									 checkedIcon="dot-circle-o"
									 onPress={() => setSelectedUserIndex(index == selectedUserIndex ? null : index)}
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
					<FlatList data={DATA}
							  style={{height: 400}}
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
						<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10}}>
							<Pressable onPress={reset}>
								<Text style={{textDecorationLine: 'underline', fontSize: themeDefaults.fontHeader4}}> {t('search:resetFilters')}</Text>
							</Pressable>
							<Pressable onPress={props.cancel}>
								<Text style={{textDecorationLine: 'underline', fontSize: themeDefaults.fontHeader4}}> {t('search:cancelFilters')} </Text>
							</Pressable>
						</View>
						<Divider style={s.divider}/>
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
