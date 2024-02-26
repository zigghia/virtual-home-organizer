import React, { useRef } from "react";
import { Image, ImageBackground, Text, View } from 'react-native';
import { themeColors } from '@/constants/app.constants';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
const Intro = () => {
	const shoeIcon = useRef(require('./../../assets/background.png')).current;
	const arrow = useRef(require('./../../assets/arrow.png')).current;

	const offset = useSharedValue(20);

	React.useEffect(() => {
			offset.value = withRepeat(
			withTiming(-offset.value, { duration: 1500 }),
			-1,
			true
		);
	}, []);

	const animatedStyles1 = useAnimatedStyle(() => ({
		transform: [{ translateY: offset.value }],
	}));

	return (
		<View style={{flex: 1, padding: 10}}>
			<ImageBackground source={shoeIcon} style={{flex: 1, justifyContent: 'flex-end', marginBottom: 40,
				alignItems: 'center'}} resizeMode="contain" tintColor={themeColors.disabled}>
				<Animated.View style={animatedStyles1}>
					<View>
						<Image source={arrow} width={200} height={200} tintColor={themeColors.secondary} style={{
							shadowColor: "#000000",
							shadowOffset: {
								width: 0,
								height: 4,
							},
							shadowOpacity: 0.19,
							shadowRadius: 5.62
						}}/>
						<Text style={{alignSelf: 'center'}}>Click to add</Text>
					</View>
				</Animated.View>
			</ImageBackground>
		</View>
	);
}

export default Intro;
