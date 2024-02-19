import React, { PropsWithChildren } from "react";
import { Card, Text, TooltipProps } from '@rneui/base';
import { s } from '@/containers/CreateEntryScreen/CreateEntry.style';
import { View } from 'react-native';
import Button from '@/components/Button/Button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RecordModel } from '@/utils/models';
import { themeColors, themeDefaults } from '@/constants/app.constants';
import { Tooltip } from '@rneui/themed';


const ControlledTooltip = (props: PropsWithChildren<TooltipProps>) => {
	const [open, setOpen] = React.useState(false);
	return (
		<Tooltip
			visible={open}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);

			}}
			{...(props as any)}
		/>
	);
};

interface EntryCardProps {
	record?: Partial<RecordModel>,
	title: string,
	subtitle?: string,
	footerText?: string,
	buttonHandler?: () => void,
	containerStyle?: { [key: string]: string | number },
	buttonDisabled?: boolean,
	tooltipText?: string
}

const EntryCard = ({title, subtitle, footerText, buttonHandler, containerStyle, children, buttonDisabled, tooltipText}: PropsWithChildren<EntryCardProps>) => {
	const eStyle = Object.keys(containerStyle ?? {}).length ? containerStyle : null;

	return (
		<Card containerStyle={[s.container, {...eStyle}]}>
			<View style={{  flexDirection: 'row', flex: 1, alignContent: 'space-between', justifyContent: 'space-between', paddingVertical: 10}}>
				<View  style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<Text  style={{fontSize: themeDefaults.fontHeader3}}>
						{title.toUpperCase()}
					</Text>
				</View>
				<View>
					{
						tooltipText && <ControlledTooltip
							backgroundColor={themeColors.secondary}
							containerStyle={{  height: 100, padding: 10 }}
							popover={
								<Text style={{color: 'white'}}>{tooltipText}</Text>
							}>
							<Ionicons name="information-circle-outline" size={24} color="black"/>
						</ControlledTooltip>
					}
				</View>
			</View>
			<Card.Divider/>
			{subtitle && <Text style={s.fonts}>{subtitle}</Text>}
			{children}
			{footerText && (
				<>
					<Card.Divider style={s.divider}/>
					<View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
						<Text style={{flex: 10, justifyContent: 'center', alignItems: 'center'}}>{footerText}</Text>
						{buttonHandler && <Button buttonStyle={{width: 30, justifyContent: 'center', alignItems: 'center'}}
												  onPress={buttonHandler}
												  disabled={buttonDisabled}>
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
