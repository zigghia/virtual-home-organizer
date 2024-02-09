import { Alert, Linking, Platform } from "react-native";
import { PermissionStatus, useCameraPermissions } from "expo-camera/next";
import React from "react";
import { useTranslation } from 'react-i18next';

const openSettings = () => {
	if ( Platform.OS === 'ios' ) {
		return Linking.openURL('app-settings:');
	} else {
		return Linking.openSettings();
	}
};

export const useAppPermissions = (): [boolean, () => void] => {
	const [cameraPermission, reqCameraPermission] = useCameraPermissions();
	const [t] = useTranslation();

	let permission: PermissionStatus | undefined = cameraPermission?.status;

	if ( cameraPermission?.status === PermissionStatus.UNDETERMINED ) {
		const s = async () => await reqCameraPermission();
		s().then(result => permission = result.status).catch(err => console.log(err))
	}

	if ( cameraPermission?.status == PermissionStatus.DENIED ) {
		return [false, () => {
			Alert.alert(t('common:permission.camera.title'),
				t('common:permission.camera.message'),
				[
					{
						text: t('common:permission.camera.no'),
						style: 'cancel',
					},
					{
						text: t('common:permission.camera.yes'),
						onPress: () => openSettings().then(() => {})
					},
				]);
		}];

	}

	return [true, () => {}];
}
