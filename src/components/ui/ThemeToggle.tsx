import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Switch from './Switch';

export default function ThemeSwitch() {
	const [enabled, setEnabled] = useState(false);

	const { resolvedTheme, setTheme } = useTheme();

	useEffect(() => {
		setEnabled(resolvedTheme === 'dark' ? true : false);
	}, [resolvedTheme]);

	function toggle() {
		setEnabled(!enabled);
		setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
	}

	return (
		<Switch
			label="Dark Mode"
			// description="Switch between light and dark mode"
			checked={enabled}
			onChange={() => toggle()}
		/>
	);
}
