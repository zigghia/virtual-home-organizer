import React, {  PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from "react-native-gesture-handler/Swipeable";
import { FontAwesome } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import { SwipeContext } from '@/context/SwipeProvider';
import { useTranslation } from 'react-i18next';

enum ActionType {
	EDIT,
	DELETE,
	HIDE
}

interface SwipeableRowProps {
	onDelete: () => void,
	onEdit: () => void,
	itemKey: string
}

 const SwipeableItem = ({children, onDelete, onEdit, itemKey}: PropsWithChildren<SwipeableRowProps>) => {
	const swipeableRow = useRef<Swipeable | null>(null);
	const {openedItemKey, setOpenedItemKey} = useContext(SwipeContext);
	const {t} = useTranslation();

	 useEffect(() => {
		 if (openedItemKey && itemKey !== openedItemKey) {
			close();
		 }
	 }, [itemKey, openedItemKey]);

	 const handleSwipe = () => {
		 setOpenedItemKey(itemKey);
	 }

	const renderRightActions = () => {
		const pressHandler = (type :  ActionType) => {
			close();
			if ( type == ActionType.DELETE ) {
				onDelete();
				return;
			}

			if ( type == ActionType.EDIT ) {
				onEdit();
			}
		};
		return(
			<View
				style={{
					width: 200,
					flexDirection: 'row',
				}}>
				<RectButton
					style={[styles.rightAction, {backgroundColor: themeColors.secondary}]}
					onPress={() => pressHandler(ActionType.EDIT)}>
					<FontAwesome name={'edit'} size={30} color="white"/>
					<Text style={styles.actionText}>{t('search:edit')}</Text>
				</RectButton>
				<RectButton
					style={[styles.rightAction, {backgroundColor: themeColors.header}]}
					onPress={() => pressHandler(ActionType.DELETE)}>
					<FontAwesome name={'trash-o'} size={30} color="white"/>
					<Text style={styles.actionText}>{t('search:delete')}</Text>
				</RectButton>
			</View>
	)};

	const close = () => {
		swipeableRow.current &&  swipeableRow.current.close();
	};


		return (<Swipeable
						ref= {(ref) => swipeableRow.current = ref}
						enableTrackpadTwoFingerGesture
						rightThreshold={30}
						friction={4}
						onSwipeableWillOpen={handleSwipe}
						renderRightActions={renderRightActions}
					>
						{children}
					</Swipeable>
		)
}

const styles = StyleSheet.create({
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

export default SwipeableItem;
