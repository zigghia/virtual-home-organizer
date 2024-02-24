import React, { isValidElement, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Button, Platform, Dimensions } from 'react-native';

import Animated, { SlideInRight, SlideInUp, SlideOutLeft, SlideOutUp, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';



const Filters = (props: any) => {
	 const height = useRef(Platform.OS === "ios"
		 ? Dimensions.get("window").height
		 : require("react-native-extra-dimensions-android").get(
			 "REAL_WINDOW_HEIGHT"
		 ));
	const translateX = useSharedValue(Dimensions.get("window").width);

	useEffect(() =>{
		!props.isVisible && (translateX.value = Dimensions.get("window").width);
		props.isVisible && (translateX.value = 0);
	},[props.isVisible])

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ translateX: withSpring(translateX.value ) }],
	}));


	return (
		<View style={{ position: 'relative', zIndex: 200}}>
			<Animated.View style={[styles.box, animatedStyles, {height: height.current}]} >
				<Text>aaaaaaaaaaaaaa</Text>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		// alignItems: 'center',
		// justifyContent: 'center',
		// backgroundColor: 'red'
	},
	box: {
		position: 'absolute',
		width: Dimensions.get("window").width,
		height: 100,
		zIndex: 500,
		backgroundColor: 'blue',
	},
});
export default Filters;
