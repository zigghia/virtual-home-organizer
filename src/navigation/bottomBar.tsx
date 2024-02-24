import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {scale} from 'react-native-size-scaling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {StyleSheet} from 'react-native-size-scaling';

import MainScreen from '@/containers/MainScreen';
import CreateEntryScreen from '@/containers/CreateEntryScreen/CreateEntryScreen';
import SettingsScreen from '@/containers/Settings/SettingsScreen';

export const tabBar = () => {
	const _renderIcon = (routeName: string, selectedTab: string) => {
		let icon = '';

		switch (routeName) {
			case 'title1':
				icon = 'ios-home-outline';
				break;
			case 'title2':
				icon = 'settings-outline';
				break;
		}

		return (
			<Ionicons
				name={icon}
				size={scale(25)}
				color={routeName === selectedTab ? 'white' : '#8DEEEE'}
			/>
		);
	};
	const renderTabBar = ({routeName, selectedTab, navigate}: any) => {
		return (
			<TouchableOpacity
				onPress={() => navigate(routeName)}
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				{_renderIcon(routeName, selectedTab)}
			</TouchableOpacity>
		);
	};

	const linkChanelGithub = () => {
		Linking.openURL(
			'https://github.com/hoaphantn7604/react-native-template-components',
		);
	};

	return (
		<CurvedBottomBar.Navigator
			style={styles.bottomBar}
			height={55}
			circleWidth={50}
			bgColor="#79CDCD"
			initialRouteName="title1"
			borderTopLeftRight
			renderCircle={() => (
				<View style={styles.btnCircle}>
					<TouchableOpacity
						style={{
							flex: 1,
							justifyContent: 'center',
						}}
						onPress={linkChanelGithub}>
						<FontAwesome name={'github-alt'} color="white" size={scale(25)} />
					</TouchableOpacity>
				</View>
			)}
			tabBar={renderTabBar}>
			<CurvedBottomBar.Screen
				options={{headerShown: false}}
				name="title1"
				position="LEFT"
				component={() => <MainScreen />}
			/>
			<CurvedBottomBar.Screen
				options={{headerShown: false}}
				name="title2"
				component={() => <SettingsScreen />}
				position="RIGHT"
			/>
		</CurvedBottomBar.Navigator>
	);
};




export const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	button: {
		marginVertical: 5,
	},
	bottomBar: {},
	btnCircle: {
		width: 60,
		height: 60,
		borderRadius: 35,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#79CDCD',
		padding: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0.5,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 1,
		bottom: 30,
	},
	imgCircle: {
		width: 30,
		height: 30,
		tintColor: 'gray',
	},
	img: {
		width: 30,
		height: 30,
	},
});
