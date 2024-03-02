import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity, Platform, } from 'react-native';
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

const Filters = (props: any) => {
	const {t} = useTranslation();
	const {users, data} = useContext(DataContext)!;
	const [selectedUsersIndex, setSelectedUsersIndex] = useState<number[] >([]);
	const [selectedSeasons, setSelectedSeason] = useState<string[]>([]);
	const [colors, setColors] = useState<SelectColorItemModel[]>(JSON.parse(JSON.stringify(data.colors)));

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{translateX: withSpring(props.isVisible ? -OFFSET : 0)}],
	}));

	useEffect(() => {
		if (!props.hasFilters) {
			reset();
		}
	}, [props.hasFilters])
	const reset = () => {
		setSelectedUsersIndex([]);
		setSelectedSeason([]);
		setColors(JSON.parse(JSON.stringify(data.colors)));
	}
	const setSearch = () => {
		props.search([selectedSeasons.map(s =>s.toLowerCase()),
			          colors.filter(c => c.selected).map(c =>  [c.name.toLowerCase(), c.plural?.replace(',', ' ')]).flat(),
			          users.filter(user => selectedUsersIndex.includes(user.id)).map(u => u.nickname.toLowerCase())].filter(e => e.length));
	}

	const DATA = [{
		title: t('common:colors'),
		component: <SelectColors bulletSize={25}
								 items={colors}
								 spacer={t('common:or')}
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
		component: <SeasonComponent selectedSeasons={selectedSeasons}
									multiple
									updateData={(season: string, isDelete) => setSelectedSeason(isDelete ?
										[...selectedSeasons.filter(s => s != season)] : [...selectedSeasons, season])}/>
	}, {
		title: t('common:family'),
		component: <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
			{
				users.map((user, index) => {
					const isSelected = selectedUsersIndex?.includes(user.id);
					return <View key={`type${index}`} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
								<View
									style={[commonStyle.containerListItem, {marginRight: 0}, isSelected && commonStyle.listIemSelected]}>
									<TouchableOpacity
										onPress={() => {
												setSelectedUsersIndex(isSelected ? [...selectedUsersIndex?.filter(u => u != user.id)] : [...selectedUsersIndex, user.id]);
										}}
										style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
										<Text style={{color: isSelected ? 'white' : themeColors.header}}>{user?.nickname} </Text>
									</TouchableOpacity>
								</View>
								{(index < users.length - 1) && <Text style={{paddingHorizontal: 3, fontSize: 8}}>{t('common:or')}</Text>}
					</View> })
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
									  <Divider subHeader={index == 2 ? '' :  t('common:and')} style={s.divider}/>
								  </>
							  }}
					/>
					<View style={{paddingVertical: 10}}>
						<Button text={t('search:applyFilters')} isLeft onPress={setSearch}/>
					</View>
				</View>
				<Pressable style={{backgroundColor: 'black',
					width: Dimensions.get('window').width,
					marginTop: -200, zIndex: 0, height: Dimensions.get('window').height/2, opacity: 0.5, position: 'relative', borderRadius: 30}}
                   onPress = {props.cancel}
						   />
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
		borderBottomStartRadius: 30,
		paddingHorizontal: 10,
		opacity: 1,
		zIndex: 100,
		...commonStyle.shadow
	},
	box: {
		left: Dimensions.get("window").width,
		position: 'absolute',
	},
	title: {
		fontSize: themeDefaults.fontHeader4,
		paddingVertical: 10,
		marginVertical: 0
	},
	divider: {
		marginVertical: 10
	}

});
export default Filters;
