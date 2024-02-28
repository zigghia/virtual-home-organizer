import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const Fade = ({isVisible, style, children}: PropsWithChildren<{ style?: { [key: string]: string }, isVisible: boolean }>) => {

	return isVisible ?  <Animated.View entering={FadeIn.duration(800)} exiting={FadeOut.duration(800)}>
						{isVisible ? children : null}
					</Animated.View>
			:null;


}

export default Fade;
