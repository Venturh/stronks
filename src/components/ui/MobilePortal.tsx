import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
	id?: string;
	children: React.ReactElement;
};

export default function MobilePortal({ id = 'mobile-side', children }: Props) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);
	const el = document.getElementById(id);
	return mounted ? (
		<>
			<div className="hidden lg:block">{children}</div>
			{el && <div className="lg:hidden">{createPortal(children, el)}</div>}
		</>
	) : null;
}
