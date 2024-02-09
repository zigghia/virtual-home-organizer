import React, { useEffect, useState } from "react";
import { Alert, Image, Linking, Platform, Text, View } from 'react-native';
import { launchCameraAsync } from 'expo-image-picker';
import { s } from './UserImagePicker.style';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '@/components/Button/Button';
import RecordContext from '@/context/RecordContext';
import * as ImagePicker from 'expo-image-picker';
import { useAppPermissions } from '@/utils/permissions';
import { useTranslation } from 'react-i18next';
import { themeDefaults } from '@/constants/app.constants';


interface UserImagePickerProps {
	imgUri: string | undefined,
	onSaveData: (value: string) => void
}

const UserImagePicker = ({ imgUri, onSaveData}: UserImagePickerProps) => {
	const [image, setImage] = useState<string | null>();
	const [cameraPermission, settingsHandler] = useAppPermissions();
	const {t, i18n} = useTranslation();

	useEffect(() => {
		setImage(imgUri);
	}, []);
	const takePicture = async () => {

		if ( !cameraPermission ) {
			settingsHandler();
			return;
		}

		const result = await launchCameraAsync({
			allowsEditing: true,
			aspect: [3, 4],
			quality: 0.5
		});


		if ( result?.canceled ) {
			return;
		}

		const imgUri = result?.assets?.[0]?.uri;

		setImage(imgUri);
		onSaveData(imgUri);
	}

	const pickImage = async () => {

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});


		if ( result?.canceled ) {
			return;
		}

		const imgUri = result?.assets?.[0]?.uri;

		setImage(imgUri);
		onSaveData(imgUri);
	}

	let imagePreview = <Text style={{fontSize: themeDefaults.fontSize}}>{t('createEntry:picture.subtitle')}</Text>;

	image && (imagePreview = <Image source={{uri: image}} style={s.image}/>)

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

export default UserImagePicker;
