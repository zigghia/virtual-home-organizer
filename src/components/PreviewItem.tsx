import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View, Text } from "react-native";
import withModal from '@/hoc/withModal';
import { FormRecordModel, RecordModel, SelectColorItemModel } from '@/utils/models';
import { themeColors } from '@/constants/app.constants';
import { FontAwesome5 } from '@expo/vector-icons';
import RenderColors from '@/components/RenderColorsBullet';
import { DataContext } from '@/context/StaticDataContext';

interface PreviewItemProps {
	formValues: FormRecordModel,
	closeModal: () => void
}

const PreviewItem = ({formValues, closeModal}: PreviewItemProps) => {
	const [colors, setColors] = useState<SelectColorItemModel[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const {users} = useContext(DataContext)!;

	useEffect(() => {
		setColors((formValues.selectColors ?? []).filter((c:SelectColorItemModel) => c.selected) ?? []);
		if (formValues.selectCategories) {
            setCategories(formValues.selectCategories.map(c => c.name));
		}
		else {
			setCategories((formValues?.categories ?? '').split(','));
		}

	}, [])

	return (
		<View style={s.container}>
			<View style={{backgroundColor: themeColors.secondary}}>
				<FontAwesome5 name="box-open" size={80} color='white' style={s.boxNo}>
					<Text style={{color: 'white', fontSize: 80,}}>{formValues?.containerIdentifier ?? '?'}</Text>
				</FontAwesome5>
			</View>
			{formValues?.userID && <View style={{paddingVertical: 5, paddingLeft: 5}}><Text style={s.text}>{users.find(u => u.id === formValues?.userID)?.nickname}</Text></View>}
			{formValues?.description && <View style={{paddingVertical: 5, paddingLeft: 5}}><Text style={s.text}>{formValues.description.toUpperCase()}</Text></View>}
			{formValues?.season && <View style={{paddingVertical: 5, paddingLeft: 5}}><Text style={s.text}>{formValues.season.toLowerCase()}</Text></View>}
			{categories.length ? <View style={s.categoriesContainer}>
				{
					categories.map((c, index) =>
						<View key={'category' + index} style={s.categoriesStyle}>
							<Text lineBreakMode={'clip'} style={[s.text, {padding: 5}]}>{c}</Text>
						</View>)
				}
			</View> : null
			}

			{colors.length ?
				<>
					<RenderColors items={colors}/>
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
	container: {
		margin: 5,
		padding: 5
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
		fontSize: 25,
		color: themeColors.header
	},
	image: {
		minHeight: 250,
	},
	item: {
		backgroundColor: '#fefefe',

	}
});

export default withModal(PreviewItem, {position: 'full'});
