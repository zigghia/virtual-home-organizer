import React, { useContext, useEffect, useRef, useState } from "react";
import { GestureResponderEvent, Keyboard, KeyboardAvoidingView, KeyboardType, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { s } from './InfoTextField.style';
import { StyleSheet } from "react-native";
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
	keyboardType?: KeyboardType,
	editDisabled?: boolean
}

const validation = {
	isRequired: (val: string) => val.length,
	maxLen: (val: string, max: number) => val && val.length <= max,
	minLen: (val: string, min: number) => val && val.length >= min,
}


const InfoTextField = ({value, onValueSaved, maxLen, isRequired, minLen, isValid, keyboardType, editDisabled}: CreateDescriptionProp) => {
	const [error, setError] = useState<null | string>(null);
	const [currentValue, setCurrentValue] = useState('');
	const [editMode, setEditMode] = useState(true);
	const isTouched = useRef(false);
	const ml = maxLen?.value ?? 100;
	const validate = (v: string) => {

		if ( v.length && maxLen?.message && maxLen?.value && !validation.maxLen(v, Number(maxLen.value)) ) {
			setError(maxLen?.message ?? 'ERROR');
			return;
		}

		if ( v.length && minLen?.message && minLen?.value && !validation.maxLen(v, Number(minLen.value)) ) {
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
		if ( value != undefined ) {
			setCurrentValue(value);
		}
		setEditMode(value?.length == 0);
		validate(value ?? '');
		isValid && isValid(error == null);

	}, [value]);

	const finishEdit = (event?: GestureResponderEvent) => {

		validate(currentValue);
		if ( error ) {
			return;
		}
		currentValue.length && setEditMode(false);
		isValid && isValid(true);
		onValueSaved && onValueSaved(currentValue);
	}

	const editValue = () => {
		setEditMode(true);
		setError(null);
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
			<View style={{
				flexDirection: 'row',
				flex: 1
			}}>
				<View style={s.text}>
					<View style={{
						paddingHorizontal: 15,
						alignItems: 'center',
						flex: 1
					}}>
						<Text style={{fontSize: 25}}> {currentValue}</Text>
					</View>
					<TouchableOpacity onPress={editValue} disabled={editDisabled}>
						<Ionicons name="add-circle" size={40} color={editDisabled ? themeColors.disabled : themeColors.secondary}/>
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

					currentValue.length && setEditMode(false);
					isValid && isValid(true);
					onValueSaved && onValueSaved(currentValue);
				Keyboard.dismiss();
			}}>
				<View style={s.inner} hitSlop={{top: 10, bottom: 30, left: 10, right: 10}}>
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
