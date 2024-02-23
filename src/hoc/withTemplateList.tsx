import React, { ComponentType,  useCallback, useEffect, useState } from "react";
import { SelectColorItemModel } from '@/utils/models';

export interface WithTemplateListProps {
	WrappedComponent: React.ComponentType,
	items: unknown[]
}

export interface WithTemplateListPropsSimple extends WithTemplateListProps {
	list: []
}

const withTemplateList = <T extends WithTemplateListProps = WithTemplateListProps>(WrappedComponent: ComponentType<T>, cols = 2) => {
	return (props: any) => {
		const [list, setLines] = useState<[][]>([]);

		useEffect((() => {
			if ( !props.items.length ) {
				setLines([]);
			}

			const fc = (cp: any[]) => {
				return (cp ?? []).reduce((acc: any, el: Partial<SelectColorItemModel>, ind: number) => {
					if ( ind % cols == 0 ) {
						acc.a[ind / cols] = [];
						acc.i++
					}
					acc.a[acc.i].push(el);
					return acc
				}, {a: [], i: -1}).a
			};

			setLines(fc([...props.items ?? []]));

		}), [props.items]);

       if (props.items == null || !props.items?.length) {
		   return [];
	   }

		return <WrappedComponent {...props} list={list}></WrappedComponent>
	};
}

export default withTemplateList;
