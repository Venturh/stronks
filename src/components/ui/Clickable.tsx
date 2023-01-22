import Link, { LinkProps } from 'next/link';
import { ComponentProps, ElementType, forwardRef } from 'react';

type ComponentProp = ComponentProps<'button'> & ComponentProps<'a'>;

export interface ClickableProps extends Omit<ComponentProp, 'href'> {
	out?: boolean;
	ref?: any;
	href?: LinkProps['href'] | string;
	as?: ElementType;
	scroll?: boolean;
}

const Clickable = forwardRef<any, ClickableProps>(
	({ out, href, as, ...props }: ClickableProps, ref) => {
		const isLink = typeof href !== 'undefined';
		const Clickable = as ? as : isLink ? 'a' : 'button';
		const content = (
			<Clickable
				ref={ref}
				target={out ? '_blank' : undefined}
				rel={out ? 'noopener noreferrer' : undefined}
				{...props}
			/>
		);
		if (isLink) {
			return (
				<Link href={href} {...props} legacyBehavior>
					{content}
				</Link>
			);
		}
		return content;
	}
);

export default Clickable;
Clickable.displayName = 'Clickable';
