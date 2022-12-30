import { useEffect, useState } from 'react';

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import ReactDatePicker from 'react-datepicker';

import { toNormalDate } from 'utils/date';
import Button from './Button';
import Modal from './Modal';

interface Props {
	startDate?: Date;
	endDate?: Date;
	minDate?: Date;
	label?: string;
	range?: boolean;
	excludeFutureDates?: boolean;
	placeholder?: string;
	onDateChange: (from?: Date, to?: Date) => void;
}

export default function DatePicker({
	startDate,
	endDate,
	minDate,
	excludeFutureDates,
	range,
	onDateChange,
	label,
	placeholder = 'Select date',
}: Props) {
	const [open, setOpen] = useState(false);
	const [_startDate, setStartDate] = useState(startDate);
	const [_endDate, setEndDate] = useState(endDate);

	function display() {
		if (placeholder && !startDate) return placeholder;
		if (range) {
			return `${toNormalDate(startDate)}  ${endDate ? `-${toNormalDate(endDate)}` : ''}`;
		}
	}

	useEffect(() => {
		setStartDate(startDate);
		setEndDate(endDate);
	}, [startDate, endDate]);

	return (
		<>
			<Button
				type="button"
				label={label}
				className="w-full font-normal text-left"
				size="md"
				color="brand"
				variant="oppacity"
				position="left"
				leftIcon={<CalendarIcon />}
				onClick={() => setOpen(!open)}
			>
				{display()}
			</Button>
			{open && (
				<Modal open={open} setOpen={(open) => setOpen(open)} title="Select date" closable>
					<div className="relative">
						<ReactDatePicker
							onChange={(date) => {
								if (Array.isArray(date)) {
									const [start, end] = date;
									console.log(start, end);
									setStartDate(start as Date);
									setEndDate(end ? (end as Date) : undefined);
									return;
								}
								setStartDate(date as Date);
							}}
							selected={range ? undefined : _startDate}
							nextMonthButtonLabel={<ChevronRightIcon className="w-4 h-4 text-secondary" />}
							previousMonthButtonLabel={<ChevronLeftIcon className="w-4 h-4 text-secondary" />}
							minDate={minDate}
							timeInputLabel="Time"
							dateFormat="MM/dd/yyyy h:mm aa"
							calendarStartDay={1}
							shouldCloseOnSelect={false}
							inline
							selectsRange={range}
							startDate={_startDate}
							maxDate={excludeFutureDates ? new Date() : undefined}
							endDate={range ? _endDate : undefined}
						/>

						<div className="mt-4 space-y-2">
							<Button
								type="button"
								variant="solid"
								className="inline-flex justify-center w-full"
								disabled={range ? !_endDate : !_startDate}
								onClick={() => {
									onDateChange(_startDate, _endDate);
									setOpen(false);
								}}
							>
								Continue
							</Button>
							{range && (
								<Button
									type="button"
									color="error"
									variant="ghost"
									className="inline-flex justify-center w-full"
									onClick={() => {
										setStartDate(undefined);
										setEndDate(undefined);
										setOpen(false);
										onDateChange(undefined, undefined);
									}}
								>
									Reset
								</Button>
							)}
						</div>
					</div>
				</Modal>
			)}
		</>
	);
}
