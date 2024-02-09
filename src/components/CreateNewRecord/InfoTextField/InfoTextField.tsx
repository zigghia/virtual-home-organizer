import React, { useContext, useEffect, useRef, useState } from "react";
import { GestureResponderEvent, Keyboard, KeyboardAvoidingView, KeyboardType, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { s } from './InfoTextField.style';
import { Text } from '@rneui/base';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';

interface CreateDescriptionProp {
	value?: string;
	isRequired?: { message: string };
	minLen?: { value: number, message: string };
	maxLen?: { value: number, message: string };
	isValid?: (valid: boolean) => void,
	onValueSaved?: (value: number | string | undefined) => void,
	keyboardType?: KeyboardType
}

const validation = {
	isRequired: (val: string) => val.length,
	maxLen: (val: string, max: number) => val && val.length <= max,
	minLen: (val: string, min: number) => val && val.length >= min,
}


const InfoTextField = ({value, onValueSaved, maxLen, isRequired, minLen, isValid, keyboardType}: CreateDescriptionProp) => {
	const [error, setError] = useState<null | string>(null);
	const [currentValue, setCurrentValue] = useState(value ?? '');
	const [editMode, setEditMode] = useState(true);
	const isTouched = useRef(false);
	const ml = maxLen?.value ?? 100;
	const validate = (v: string) => {

		if ( maxLen?.message && maxLen?.value && !validation.maxLen(v, Number(maxLen.value)) ) {
			setError(maxLen?.message ?? 'ERROR');
			return;
		}

		if ( minLen?.message && minLen?.value && !validation.maxLen(v, Number(minLen.value)) ) {
			setError(minLen?.message ?? 'ERROR');
			return;
		}

		if ( isRequired?.message && !validation.isRequired(v) ) {
			setError(isRequired?.message ?? 'ERROR');
			return;
		}
		setError(null);
	};

	useEffect(() => {
		validate(value ?? '');
		isValid && isValid(false);
	}, []);

	const finishEdit = (event?: GestureResponderEvent) => {
		event?.stopPropagation();
		validate(currentValue);

		if ( error ) {
			return;
		}
		setEditMode(false);
		onValueSaved && onValueSaved(currentValue);
		isValid && isValid(true);
	}

	const editValue = () => {
		setEditMode(true);
		setError(null);
		onValueSaved && onValueSaved(undefined);
		isValid && isValid(false);
	}
	const updateCurrentValue = (v: string, event?: GestureResponderEvent) => {
		event && event.stopPropagation();
		isTouched.current = true;
		validate(v);
		setCurrentValue(v);
	}


	if ( !editMode ) {
		return (
			<View style={{justifyContent: 'center', padding: 10,
				flexDirection: 'row', flex: 1, alignItems: 'flex-start'}}>

				<View style={s.text}>
					<Text style={{
						fontSize: 25, lineHeight: 30, flex: 1,
						fontStyle: 'italic',
						alignSelf: 'center',
					}}> {currentValue}</Text>
					<TouchableOpacity onPress={editValue}>
						<Ionicons name="add-circle" size={40} color={themeColors.secondary}/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={s.container}
		>
			<TouchableWithoutFeedback onPress={(event) => {
				Keyboard.dismiss();
			}}>
				<View style={s.inner}>
					<TextInput
						onBlur={(event) => finishEdit()}
						onFocus={() => setError(null)}
						keyboardType={keyboardType || 'default'}
						clearButtonMode='always'
						style={s.input}
						maxLength={ml}
						onChangeText={updateCurrentValue}
						value={currentValue}
					/>
					{
						error && isTouched.current && <Text style={s.error}>{error}</Text>
					}
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
export default InfoTextField;
