import React, { PropsWithChildren } from "react";
import { Card, Text } from '@rneui/base';
import { s } from '@/containers/CreateEntryScreen/CreateEntry.style';
import { View } from 'react-native';
import Button from '@/components/Button/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { RecordModel } from '@/utils/models';
import { themeColors, themeDefaults } from '@/constants/app.constants';

interface EntryCardProps {
	record?: Partial<RecordModel>,
	title: string,
	subtitle?: string,
	footerText?: string,
	buttonHandler?: () => void,
	containerStyle? : { [key:string]: string | number },
	buttonDisabled?: boolean
}

const EntryCard = ({title, subtitle, footerText, buttonHandler, containerStyle, children, buttonDisabled}: PropsWithChildren<EntryCardProps>) => {
	const eStyle = Object.keys(containerStyle ?? {}).length? containerStyle : null;

	return (
		<Card containerStyle={[s.container, {...eStyle}]}>
			<Card.Title style={{fontSize: themeDefaults.fontHeader3, justifyContent: 'space-evenly', alignItems: 'flex-start'}}>
				{title.toUpperCase()}
			</Card.Title>
				<Card.Divider/>
			{subtitle && <Text style={s.fonts}>{subtitle}</Text>}
			{children}
			{footerText && (
				<>
					<Card.Divider style={s.divider}/>
					<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
						<Text style={{flex: 10, justifyContent: 'center', alignItems: 'center'}}>{footerText}</Text>
						{  buttonHandler&& <Button buttonStyle={{width: 30, justifyContent: 'center', alignItems: 'center'}}
												   onPress={buttonHandler}
												   disabled = {buttonDisabled}>
							                       <MaterialIcons name="library-add" size={24} color="white"/>
						                   </Button>
						}
					</View>
				</>
			)}
		</Card>
	);
}

export default EntryCard;
