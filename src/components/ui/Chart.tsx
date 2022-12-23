import clsx from 'clsx';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import Skeleton from './Skeleton';

const ApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
	loading: () => <Skeleton color="accent" height={140} />,
});

type Props = {
	type: 'line' | 'area';
	series?: [{ data: any[] }];
	withDisplay?: boolean;
	unit: string;
	loading?: boolean;
	min?: number;
	max?: number;
	hideXAxis?: boolean;
	hideYAxis?: boolean;
	onTimeRangeChange?: (day: number) => void;
};

export default function Chart({
	series,
	type = 'line',
	hideXAxis = false,
	hideYAxis = false,
	loading = false,
	min,
	max,
	onTimeRangeChange,
	unit,
}: Props) {
	const { theme } = useTheme();
	const [day, setDay] = useState(30);

	function color(color: string) {
		const value = window.getComputedStyle(document.body).getPropertyValue(`--${color}`);
		return `rgb(${value})`;
	}

	const options: ApexCharts.ApexOptions = {
		chart: {
			type,
			height: 350,
			background: color('bg-secondary'),
			foreColor: color('text-secondary'),
			zoom: {
				enabled: false,
			},
			toolbar: { show: false },
		},
		dataLabels: {
			enabled: false,
		},
		fill:
			type === 'area'
				? {
						type: 'gradient',
						gradient: {
							shade: 'light',
							type: 'vertical',
							shadeIntensity: 0,
							opacityFrom: 0.7,
							opacityTo: 0.01,
							stops: [50],
						},
				  }
				: {},
		stroke: {
			curve: 'smooth',
			width: 2,
		},
		grid: {
			borderColor: color('accent-primary'),
		},

		noData: {
			text: 'No Data available',
			align: 'center',
			verticalAlign: 'middle',
		},
		xaxis: {
			axisBorder: { color: color('accent-primary') },
			tooltip: { enabled: false },
			labels: {
				show: true,
				style: {
					colors: color('text-secondary'),
					fontSize: '11px',
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 400,
					cssClass: 'apexcharts-xaxis-label',
				},
			},
			type: 'datetime',
			axisTicks: {
				show: !hideXAxis,
				borderType: 'solid',
				color: color('accent-primary'),
				height: 6,
				offsetX: 0,
				offsetY: 0,
			},
		},
		yaxis: {
			min,
			max,
			show: !hideYAxis,
			axisBorder: { color: color('accent-primary') },
			decimalsInFloat: 2,
			labels: {
				formatter: (value) => {
					return `${value.toFixed(0)} ${unit}`;
				},
				style: {
					colors: color('text-secondary'),
					fontSize: '11px',
					fontFamily: 'Helvetica, Arial, sans-serif',
					fontWeight: 400,
					cssClass: 'apexcharts-yaxis-label',
				},
			},
		},
		tooltip: {
			x: {
				show: true,
				format: 'dd MMM - hh:mm',
				formatter: undefined,
			},
			y: {
				formatter: (value) => `${value.toFixed(2)}${unit}`,
				title: {
					formatter: (seriesName) => '',
				},
			},
			theme,
			shared: false,
		},
		colors: [color('brand-primary')],
		legend: {
			show: false,
		},
	};

	return (
		<div>
			<div className="pt-4 rounded-lg bg-secondary">
				<div className="flex flex-col justify-between px-2 md:mb-2 md:items-center md:flex-row">
					<TimeRange
						className="hidden md:flex"
						timeRange={day}
						onChange={(val) => {
							setDay(val);
							onTimeRangeChange && onTimeRangeChange(val);
						}}
					/>
				</div>

				{loading ? (
					<div className="px-2 pb-2">
						<Skeleton color="accent" height={200} />
					</div>
				) : (
					<ApexChart options={options} series={series} width="100%" height="100%" />
				)}
			</div>
			<TimeRange
				className="flex mt-4 md:hidden"
				timeRange={day}
				onChange={(val) => {
					setDay(val);
					onTimeRangeChange && onTimeRangeChange(val);
				}}
			/>
		</div>
	);
}

function TimeRange({
	timeRange,
	onChange,
	className,
}: {
	timeRange: number;
	onChange: (range: number) => void;
	className?: string;
}) {
	const timeRanges = [
		{ label: 'Week', value: 7 },
		{ label: 'Month', value: 30 },
		{ label: 'Year', value: 360 },
	];
	return (
		<div
			className={clsx(
				' flex-shrink-0 p-1 space-x-1 bg-secondary ring-accent-primary ring-1 rounded-lg',
				className
			)}
		>
			{timeRanges.map(({ label, value }) => (
				<button
					onClick={() => {
						onChange(value);
					}}
					key={value}
					className={clsx(
						'w-full py-0.5 md:py-2 text-xs px-4  leading-5 font-medium text-secondary rounded-lg',
						'focus:outline-none',
						value === timeRange
							? 'bg-accent-primary text-primary'
							: 'text-secondary hover:text-primary '
					)}
				>
					{label}
				</button>
			))}
		</div>
	);
}
