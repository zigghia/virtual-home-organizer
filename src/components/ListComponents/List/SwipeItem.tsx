import React, { Component, PropsWithChildren } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { FontAwesome } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';

enum ActionType {
	EDIT,
	DELETE,
	HIDE
}

interface SwipeableRowProps {
	onDelete: () => void,
	onEdit: () => void,
}

export default class SwipeableItem extends Component<PropsWithChildren<SwipeableRowProps>> {
	private renderLeftActions = (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
		const trans = dragX.interpolate({
			inputRange: [0, 50, 100, 101],
			outputRange: [-20, 0, 0, 1],
			extrapolate: 'clamp',
		});
		return (
			<RectButton style={styles.leftAction} onPress={this.close}>
				<Animated.Text
					style={[
						styles.actionText,
						{
							transform: [{translateX: trans}],
						},
					]}>
					Archive
				</Animated.Text>
			</RectButton>
		);
	};
	private renderRightAction = (
		text: string,
		color: string,
		type: ActionType,
		icon: string,
		x: number,
		progress: Animated.AnimatedInterpolation<number>
	) => {
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [x, 0],
		});
		const pressHandler = () => {
			this.close();
			if ( type == ActionType.DELETE ) {
				this.props.onDelete();
				return;
			}

			if ( type == ActionType.EDIT ) {
				this.props.onEdit();
			}
		};

		return (
			<Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
				<RectButton
					style={[styles.rightAction, {backgroundColor: color}]}
					onPress={pressHandler}>
					{
						icon ? <FontAwesome name={icon as 'trash-o' | 'edit'} size={30} color="white"/> : null
					}
					<Text style={styles.actionText}>{text}</Text>
				</RectButton>
			</Animated.View>
		);
	};

	private renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		_dragAnimatedValue: Animated.AnimatedInterpolation<number>
	) => (
		<View
			style={{
				width: 200,
				flexDirection: 'row',
			}}>
			{this.renderRightAction('Edit', themeColors.secondary, ActionType.EDIT, 'edit', 101, progress)}
			{this.renderRightAction('Delete', themeColors.header, ActionType.DELETE, 'trash-o', 100, progress)}
		</View>
	);

	private swipeableRow?: Swipeable;

	private updateRef = (ref: Swipeable) => {
		this.swipeableRow = ref;
	};
	private close = () => {
		this.swipeableRow?.close();
	};

	render() {
		const {children} = this.props;

		return (<Swipeable
				ref={this.updateRef}
				friction={2}
				enableTrackpadTwoFingerGesture
				leftThreshold={30}
				rightThreshold={40}
				renderRightActions={this.renderRightActions}
			>
				{children}
			</Swipeable>
		);
	}
}

const styles = StyleSheet.create({
	leftAction: {
		flex: 1,
		backgroundColor: '#497AFC',
		justifyContent: 'center',
	},
	actionText: {
		color: 'white',
		fontSize: 16,
		backgroundColor: 'transparent',
		padding: 10,
	},
	rightAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
});
