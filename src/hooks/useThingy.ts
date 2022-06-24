import { TabItem } from 'components/ui/Tabs';
import { throttle } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

export function useThingy(items: any) {
	const dateRefs = useRef<HTMLDivElement[]>([]);

	const tabs: TabItem[] = [...new Set(Object.keys(items ?? {}).map((key) => key))].map((month) => ({
		label: month.toLowerCase(),
		onClick: ({ index }) => {
			setSelectedTab(index);
			dateRefs.current[index].scrollIntoView({
				block: 'start',
				inline: 'nearest',
				behavior: 'smooth',
			});
		},
	}));
	const [selectedTab, setSelectedTab] = useState(0);
	const entry = useIntersectionObserver(dateRefs, {
		threshold: [0.4],
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			throttle(() => setSelectedTab(tabs.findIndex((tab) => tab.label === entry.target.id)), 500);
		}
	}, [entry]);

	return { dateRefs, tabs, selectedTab };
}

export default useThingy;
