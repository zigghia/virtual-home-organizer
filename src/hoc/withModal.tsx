import React, { useRef, useState } from "react";
import { Modal, View } from 'react-native';
import Button from '@/components/Button/Button';

const withModal = (WrappedComponent: React.ComponentType, isTransparent=false, animation = 'slide') => {

	return (props: any) => {
		const currentValue = useRef(null);

		return <Modal visible={props.setVisible} animationType= {animation} transparent={isTransparent}>
			<View style={{flex: 1, justifyContent: 'space-around'}}>
				<WrappedComponent {...props} handleStateFunction={(value: any) => currentValue.current =  value}></WrappedComponent>
				{props.closeModal && props.cancelText &&
						<View style={{padding: 30, flexDirection: 'row', marginBottom: 30}}>
							 <Button text={props.cancelText} onPress={props.closeModal}/>
						</View>
				}
			</View>
		</Modal>
	};
}

export default withModal;
