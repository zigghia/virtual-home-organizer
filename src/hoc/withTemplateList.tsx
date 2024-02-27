import React, { ComponentType,  useCallback, useEffect, useState } from "react";
import { ListItemModel, SelectColorItemModel } from '@/utils/models';

type P = ListItemModel | SelectColorItemModel;
export interface WithTemplateListProps<P> {
	WrappedComponent: React.ComponentType;
	items: Array<P>;
}

const withTemplateList = <T extends WithTemplateListProps<P> = WithTemplateListProps<P>>(WrappedComponent: ComponentType<T>, cols = 2) => {
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


		return <WrappedComponent {...props} list={list}></WrappedComponent>
	};
}

export default withTemplateList;
