import React, { ComponentProps } from "react";
import withModal from '@/hoc/withModal';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button/Button';
import { themeColors, themeDefaults } from '@/constants/app.constants';
import backHandler from '../../.expo/metro/shims/react-native-web/dist/exports/BackHandler';
import commonStyle from '@/utils/common.style';

const AlertComponent = ({message, title, onPressNo, onPressOK}: ComponentProps<any>) => {
	const [t] = useTranslation();


	return (
		<View style={{
			flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
			alignItems: 'center', justifyContent: 'center', padding: 20,
		}}>
			<View style={[{backgroundColor: '#fff', minWidth: 300, borderTopLeftRadius: 10, borderTopRightRadius: 10}]}>
				<View style={{borderBottomWidth: 1, borderColor: themeColors.darkGrey,
					backgroundColor:  themeColors.disabled, alignItems: 'center',
					borderTopLeftRadius: 10, borderTopRightRadius: 10}}>

					<Text style={{fontSize: themeDefaults.fontHeader3, color: themeColors.header, padding: 20, fontWeight: 'bold'}}>
						{title.toUpperCase()}
					</Text>

				</View>
				<View style={{paddingHorizontal: 20, paddingVertical: 30}}>
					<Text style={{fontSize: themeDefaults.fontHeader4, textAlign: 'center'}}>{message}</Text>
				</View>

					<View style={{height: themeDefaults.buttonHeight, flexDirection: 'row', marginBottom: 20, paddingHorizontal: 20}}>
						<Button text={t('common:no')} onPress={onPressNo} isLeft/>
						<Button text={t('common:yes')} onPress={onPressOK}/>
					</View>

			</View>
		</View>
	);
}

export default withModal(AlertComponent, true, 'fade');
