import React, { useContext, useEffect, useRef, useState } from "react";
import { GestureResponderEvent, Keyboard, KeyboardAvoidingView, KeyboardType, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { StyleSheet } from "react-native";
import { Text } from '@rneui/base';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { themeColors } from '@/constants/app.constants';
import commonStyle from '@/utils/common.style';

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


const InfoTextFieldComponent = ({value, onValueSaved, maxLen, isRequired, minLen, isValid, keyboardType, editDisabled}: CreateDescriptionProp) => {
	const [error, setError] = useState<null | string>(null);
	const [currentValue, setCurrentValue] = useState(value);
	const [editMode, setEditMode] = useState(true);
	const [autoFocus, setAutofocus] = useState(false);
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
		if ( value?.length ) {
			setEditMode(false);
		}
	}, []);

	useEffect(() => {
		if ( value == undefined ) {
			return;
		}
		validate(value ?? '');
		isValid && isValid(error == null);

	}, [value]);

	const finishEdit = (event?: GestureResponderEvent) => {

		validate(currentValue ?? '');
		if ( error || !currentValue) {
			return;
		}
		currentValue.length && setEditMode(false);
		setAutofocus(false);
		isValid && isValid(true);
		onValueSaved && onValueSaved(currentValue);
	}

	const editValue = () => {
		setEditMode(true);
		setAutofocus(true);
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
			<TouchableOpacity onPress={editValue} disabled={editDisabled}>
				<View style={{
					flexDirection: 'row',
					// flex: 1,
					width: '100%'
				}}>

					<View style={s.text}>
						<View style={{
							paddingHorizontal: 15,
							alignItems: 'center',
							flex: 1
						}}>
							<Text style={{fontSize: 25}}> {currentValue}</Text>
						</View>

						<FontAwesome name="pencil-square" size={40} color={editDisabled ? themeColors.disabled : themeColors.secondary}/>
					</View>
				</View>
			</TouchableOpacity>
		);
	}


	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={s.container}
		>
			<TouchableWithoutFeedback onPress={(event) => {
				currentValue?.length && setEditMode(false);
				isValid && isValid(true);
				onValueSaved && onValueSaved(currentValue);
				Keyboard.dismiss();
			}}>
				<View style={s.inner} hitSlop={{top: 30, bottom: 30, left: 10, right: 10}}>
					<TextInput
						autoFocus={autoFocus}
						onBlur={(event) => finishEdit()}
						onFocus={() => setError(null)}
						keyboardType={keyboardType || 'default'}
						clearButtonMode='always'
						style={commonStyle.input}
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

export const s = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row'
	},
	inner: {
		flex: 1,
		marginHorizontal: 5,
		justifyContent: 'flex-start'
	},
	text: {
		height: 60,
		backgroundColor: themeColors.disabled,
		padding: 10,
		borderRadius: 20,
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	error: {
		color: '#cc0000',
		marginTop: 20
	},
	closeIcon: {
		justifyContent: 'flex-end',
		position: "absolute",
		right: 10,
		top: -20
	},
	checkmark: {
		justifyContent: 'flex-end',
		right: 0,
		top: 0,
		width: 30
	}
});

export default InfoTextFieldComponent;
