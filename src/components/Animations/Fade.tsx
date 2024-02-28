import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

const Fade = ({isVisible, style, children}: PropsWithChildren<{ style?: { [key: string]: string }, isVisible: boolean }>) => {
	const [visible, setVisible] = useState(isVisible);
	const animation = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

	useEffect(() => {

		setVisible(isVisible);

		Animated.timing(animation, {
			toValue: isVisible ? 1 : 0,
			duration: 600,
			useNativeDriver: true
		}).start(() => {
			setVisible(isVisible);
		});
	}, [isVisible])

	const containerStyle = {
		opacity: animation.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1]
		}),
		transform: [
			{
				scale: animation.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 1],
				}),
			},
		],
	};

	const combinedStyle = [containerStyle, style]

	return (
		<Animated.View style={visible ? combinedStyle : containerStyle}>
			{visible ? children : null}
		</Animated.View>
	);
}

export default Fade;
