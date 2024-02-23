import React, { useEffect, useState } from "react";
import { Alert, Image, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { launchCameraAsync, launchImageLibraryAsync, PermissionStatus } from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '@/components/Button/Button';
import { useTranslation } from 'react-i18next';
import { themeDefaults } from '@/constants/app.constants';
import { useCameraPermissions } from 'expo-camera/next';
import * as MediaLibrary from 'expo-media-library';
import Loading from '@/components/Loading/Loading';

interface UserImagePickerProps {
	onSaveData: (value: string) => void,
	imgUri?: string;
	oldImgUri?: string;
}

const UserImagePickerComponent = ({onSaveData, imgUri}: UserImagePickerProps) => {
	const [image, setImage] = useState<string | undefined>(imgUri);
	const [cameraPermission, reqCameraPermission] = useCameraPermissions();
	const [mediaPermission, reqMediaPermission] = MediaLibrary.usePermissions();
	const [loading, setLoading] = useState(false);
	const [t] = useTranslation();

	const takePicture = async () => {
		let permission: PermissionStatus | undefined = cameraPermission?.status;

		if ( cameraPermission?.status === PermissionStatus.UNDETERMINED ) {
			permission = (await reqCameraPermission())?.status || PermissionStatus.DENIED;
		}

		if ( permission == PermissionStatus.DENIED ) {

			Alert.alert(t('common:permission.camera.title'),
				t('common:permission.camera.message'),
				[
					{
						text: t('common:permission.camera.no'),
						style: 'cancel',
					},
					{
						text: t('common:permission.camera.yes'),
						onPress: () => openSettings().then(() => {
						})
					},
				]);
			return;
		}

		if (permission != PermissionStatus.GRANTED) {
			return;
		}

		setLoading(true);
		const result = await launchCameraAsync({
			allowsEditing: true,
			aspect: [3, 4],
			quality: 0.5
		});


		if ( result?.canceled ) {
			setLoading(false);
			return;
		}

		const imgUri = result?.assets?.[0]?.uri;

		setImage(imgUri);
		onSaveData(imgUri);
		setLoading(false);
	}

	const pickImage = async () => {
		let permission: MediaLibrary.PermissionResponse | null = mediaPermission;

		if ( permission?.status == PermissionStatus.UNDETERMINED ) {
			permission = (await reqMediaPermission()) ?? PermissionStatus.DENIED;
		}

		if ( !permission?.canAskAgain || permission?.status === PermissionStatus.DENIED ) {
			Alert.alert(t('common:permission.camera.title'),
				t('common:permission.camera.message'),
				[
					{
						text: t('common:permission.camera.no'),
						style: 'cancel',
					},
					{
						text: t('common:permission.camera.yes'),
						onPress: () => openSettings().then(() => {
						})
					},
				]);
			return;
		}

		if (!permission?.granted) {
			return;
		}
		setLoading(true);
		let result = await launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [3, 4],
			quality: 0.5,
		});

		if ( result?.canceled ) {
			setLoading(false);
			return;
		}

		const imgUri = result?.assets?.[0]?.uri;

		setImage(imgUri);
		onSaveData(imgUri);
		setLoading(false);
	}

	let imagePreview = <Text style={{fontSize: themeDefaults.fontSize}}>{t('createEntry:picture.subtitle')}</Text>;

	image && (imagePreview = <Image source={{uri: image}} style={s.image}/>)

	if(loading) {
		return <Loading/>
	}

	return (
		<View style={s.container}>
			<View>
				{imagePreview}
			</View>
			<View style={s.buttons}>
				<Button onPress={takePicture} text={t('createEntry:picture.takeButton')} isLeft>
					<MaterialIcons name="add-a-photo" size={30} color="white"/>
				</Button>
				<Button onPress={pickImage} text={t('createEntry:picture.openButton')}>
					<MaterialIcons name="add-photo-alternate" size={35} color="white"/>
				</Button>
			</View>
		</View>
	);
}

const openSettings = async () => {
	if ( Platform.OS === 'ios' ) {
		return Linking.openURL('app-settings:');
	} else {
		return Linking.openSettings();
	}
};

export const s = StyleSheet.create({
	container: {
		flex: 1
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20
	},
	image: {
		height: 200,
		width: '100%'
	}
});

export default UserImagePickerComponent;
