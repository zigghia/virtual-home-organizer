import React, { ComponentType } from 'react';
import {StaticDataContext} from '@/context/StaticDataContext';

export interface WithContextProp {
	context?: React.ContextType<typeof StaticDataContext>
}
export default function withStaticDataContext<T extends WithContextProp = WithContextProp>(Component: ComponentType<T>) {

	return (props: any) =>
		<StaticDataContext.Consumer>
			{(context) => {
				return <Component {...props as T} context={context}/>
			}}
		</StaticDataContext.Consumer>
}
