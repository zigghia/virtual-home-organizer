import React, { ComponentType, useEffect, useState } from "react";
import { View, Text } from 'react-native';
import { SelectColorItemModel } from '@/utils/models';
export interface WithTemplateListProps {
	WrappedComponent: React.ComponentType,
	items: unknown[]
}

export interface WithTemplateListPropsSimple  extends WithTemplateListProps{
	list: []
}
const withTemplateList =  <T extends WithTemplateListProps = WithTemplateListProps>(WrappedComponent: ComponentType<T>, cols =2) => {


	return (props: any) => {
		const [list, setLines] = useState<[][]>([]);
console.log(props.items);
		useEffect((() => {
			const cp = [...props.items];
			setLines(
				(cp ?? []).reduce((acc: any, el: Partial<SelectColorItemModel>, ind: number) => {
					if ( ind % cols == 0 ) {
						acc.a[ind / cols] = [];
						acc.i++
					}
					acc.a[acc.i].push(el);
					return acc
				}, {a: [], i: -1}).a);


		}), [props.items]);


		return <WrappedComponent {...props} list={list}></WrappedComponent>
	};
}

export default withTemplateList;
