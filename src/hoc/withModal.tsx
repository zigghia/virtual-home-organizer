import React from "react";
import { Dimensions, Platform, View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
	Platform.OS === "ios"
		? Dimensions.get("window").height
		: require("react-native-extra-dimensions-android").get(
			"REAL_WINDOW_HEIGHT"
		);

const animations = {
	full: {in: 'slideInUp', out: 'slideOutDown'},
	bottom: {in: 'slideInUp', out: 'slideOutDown'},
	alert: {in: 'slideInDown', out: 'slideOutDown'},
	filter: {in: 'slideInDown', out: 'slideOutDown'},

}
export type ModalProps = {
	position: 'full' | 'bottom' | 'alert' | 'filter';
	height?: number
}

type animType = 'slideInUp' | 'slideOutDown' | 'slideInDown';
const withModal = <P extends object>(WrappedComponent: React.ComponentType<P>, mp: ModalProps) => {
	return (props: any) => {
		const closeModal = () => {
			 props.closeModal();
		}

		return <Modal
			backdropTransitionOutTiming={0}
			style={styles[mp.position]}
			deviceWidth={deviceWidth}
			backdropOpacity={0.5}
			hasBackdrop={true}
			animationIn={animations[mp.position]?.in as animType}
			animationOut={animations[mp.position]?.out as animType}
			swipeDirection="down"
			onSwipeComplete={closeModal}
			onBackdropPress={closeModal}
			avoidKeyboard={true}
			deviceHeight={deviceHeight}
			isVisible={props.isVisible}>
			<View style={[styles.modalContent,
				mp.position == 'alert' ? styles.borderRadius4 : null,
				mp.position == 'bottom' ? styles.borderRadius1 : null,
				{height: mp.height}]}>

				{mp.position == 'bottom' && <View style={{borderBottomColor: themeColors.disabled, borderBottomWidth: 2, marginBottom: 5, width: 50, alignSelf: 'center'}}/>}

				<TouchableOpacity style={{zIndex: 100, marginBottom: 10, alignSelf: 'flex-end'}}
								  hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
								  onPress={closeModal}>
					<Ionicons name="close" size={25} color="black"/>
				</TouchableOpacity>

				<WrappedComponent {...props} width={deviceWidth}/>

			</View>
		</Modal>
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		backgroundColor: 'lightblue',
		padding: 12,
		margin: 16,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
	},
	alert: {
		padding: 0,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingVertical: 10
	},
	borderRadius4: {
		borderRadius: 20
	},
	borderRadius1: {
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20
	},
	full: {},
	bottom: {
		justifyContent: 'flex-end',
		paddingBottom: 0,
		margin: 0,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20
	},
	filter: {

	}
});

export default withModal;
