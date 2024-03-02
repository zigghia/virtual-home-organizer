import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { debounce } from '@/utils/utils';

const Fade = ({isVisible, style, children}: PropsWithChildren<{ style?: { [key: string]: string | number }, isVisible: boolean }>) => {

	return isVisible ?  <Animated.View entering={FadeIn} exiting={FadeOut} style ={style}>
						{ children }
					</Animated.View>
			:null;


}

export default Fade;
