import React, { PropsWithChildren, useEffect } from "react";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const Slide = ({ children}: PropsWithChildren<{ style?: { [key: string]: string } }>) => {

	const animation  = useSharedValue(15);


	useEffect(() => {
		animation.value = withRepeat(withTiming(-animation.value, { duration: 1000}), 10, true);
	}, [])

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(animation.value, [-15, 15], [1, 0]),
		transform: [
				{translateX: animation.value}
		],
	}));

	return (
		<Animated.View style={animatedStyle}>
			{children }
		</Animated.View>
	);
}

export default Slide;
