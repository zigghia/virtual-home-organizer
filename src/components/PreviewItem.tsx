import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View, Text } from "react-native";
import withModal from '@/hoc/withModal';
import { FormRecordModel, RecordModel, SelectColorItemModel } from '@/utils/models';
import { themeColors } from '@/constants/app.constants';
import { FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import RenderColors from '@/components/RenderColorsBullet';
import { DataContext, SeasonIconsType } from '@/context/StaticDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chip } from '@rneui/themed';

interface PreviewItemProps {
	formValues: FormRecordModel,
	closeModal: () => void
}

const PreviewItem = ({formValues, closeModal}: PreviewItemProps) => {
	const [colors, setColors] = useState<SelectColorItemModel[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const {users, seasons} = useContext(DataContext)!;
	const [user, setUser] = useState<string | null>(null);

	useEffect(() => {
		setColors((formValues.selectColors ?? []).filter((c:SelectColorItemModel) => c.selected) ?? []);
		if (formValues.selectCategories) {
            setCategories(formValues.selectCategories.map(c => c.name));
		}
		else {
			setCategories((formValues?.categories ?? '').split(','));
		}

		if (users.length > 1) {
			setUser(formValues?.userName ?? (formValues?.userID ? (users.find(u => u.id == formValues.userID)?.nickname ?? null ): null));
		}

		if (formValues.categories) {
			setCategories(formValues.categories.split(','));
		}
		else {
			setCategories((formValues.selectCategories ?? []).filter(c => c.selected).map(c => c.name));
		}

	}, [])

	return (
		<View>
			<View style={{backgroundColor: themeColors.secondary}}>
				<FontAwesome5 name="box-open" size={70} color='white' style={s.boxNo}>
					<Text style={{color: 'white', fontSize: 70}}>{formValues?.containerIdentifier ?? '?'}</Text>
				</FontAwesome5>
			</View>
			{formValues?.description && <View style={s.rowView}>
				<MaterialIcons  name="door-sliding" size={24} color={themeColors.header} />
					<Text style={s.text}>{formValues.description.toLowerCase()}</Text>
				</View>
			}
			{formValues?.season && <View style={s.rowView}>
				<Ionicons name={(Object.keys(seasons).find((k: string )=> seasons[k as SeasonIconsType] == formValues.season)) as SeasonIconsType}
						  size={24}
						  color={themeColors.header}/>
				<Text style={s.text}>{formValues.season.toLowerCase()}</Text>
			</View>
			}
			{user && <View style={s.rowView}>
				<Ionicons name="body" size={24}  color={themeColors.header}/>
				<Text style={s.text}>{user.toLowerCase()}</Text>
			</View>
			}
			{categories && <View style={s.rowView}>
				{
					categories.map((c: string, ind: number) =>
						                <Chip title={c}
											  key = {'previewCategory' + ind}
											  titleStyle = {{color: themeColors.header}}
											  buttonStyle = {{borderWidth: 1, borderColor: themeColors.disabled, marginRight: 5}}
											  containerStyle = {{borderWidth: 0}}
											  color = {themeColors.disabled}
											  type={ 'solid'}/>)
				}

			</View>
			}

			{colors.length ?
				<>
					<RenderColors items={colors} size={30}/>
					<Text>{colors.map(c => c.name).join(', ')}</Text>
				</>
				: null}

			<Pressable style={[s.item, {justifyContent: 'center', marginVertical: 10}]} onPress={closeModal}>
				{formValues?.imgUri?.length && <Image source={{uri: formValues.imgUri}} style={s.image}/>}
			</Pressable>

		</View>

	);
}

export const s = StyleSheet.create({
	colorsContainer: {
		paddingVertical: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	rowView: {
		flexDirection: 'row',
		paddingVertical: 5,
	},
	boxNo: {
		verticalAlign: 'bottom',
		alignItems: 'center',
		alignSelf: 'center',
		padding: 10,
	},
	categoriesContainer: {
		marginVertical: 10,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexWrap: 'wrap'
	},
	categoriesStyle: {
		flexDirection: 'row',
		borderRightWidth: StyleSheet.hairlineWidth,
		borderColor: themeColors.disabled,
		borderLeftWidth: StyleSheet.hairlineWidth
	},
	text: {
		fontSize: 20,
		color: themeColors.header,
		alignItems: 'flex-start',
		marginLeft: 10
	},
	image: {
		minHeight: 250,
	},
	item: {
		backgroundColor: '#fefefe',

	}
});

export default withModal(PreviewItem, {position: 'full'});
