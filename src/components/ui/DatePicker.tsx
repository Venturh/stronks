import { ComponentProps, forwardRef, useRef, useState } from 'react';
import dayjs from 'dayjs';

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import ReactDatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';

import Button from './Button';

import { toNormalDate, toNormalDateTime } from 'utils/date';

interface Props extends ComponentProps<'input'> {
	minDate?: Date;
	withTime?: boolean;
	label?: string;
	placeholder?: string;
	range?: boolean;
	excludeFutureDates?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, Props>(
	(
		{
			value,
			defaultValue,
			name,
			withTime = false,
			label,
			placeholder,
			minDate,
			range = false,
			onChange,
			excludeFutureDates = false,
		},
		ref
	) => {
		const { control } = useFormContext();
		const dateRef = useRef(null);

		const [date, setDate] = useState(
			value
				? new Date(value as string)
				: defaultValue
				? new Date(defaultValue! as string)
				: undefined
		);
		const [endDate, setEndDate] = useState(null);

		const [open, setOpen] = useState(false);

		function display() {
			if (placeholder && !date) return placeholder;
			if (range) {
				return `${toNormalDate(date)}  ${endDate ? `-${toNormalDate(endDate)}` : ''}`;
			} else {
				return withTime ? toNormalDateTime(date) : toNormalDate(date);
			}
		}

		const filterfutureTime = (time) => {
			const currentDate = new Date();
			const selectedDate = new Date(time);

			return currentDate.getTime() > selectedDate.getTime();
		};

		return (
			<div className="relative">
				<Controller
					name={name!}
					control={control}
					render={({ field: {} }) => {
						return (
							<>
								<ReactDatePicker
									ref={dateRef}
									onChange={(d) => {
										if (Array.isArray(d)) {
											const [start, end] = d;
											setDate(start);
											setEndDate(end);
											if (start && end) onChange!(`${start}- ${end}`);
											return;
										}
										setDate(d as Date);
									}}
									selected={range ? undefined : date}
									nextMonthButtonLabel={<ChevronRightIcon className="w-4 h-4 text-secondary" />}
									previousMonthButtonLabel={<ChevronLeftIcon className="w-4 h-4 text-secondary" />}
									minDate={minDate}
									timeInputLabel="Time"
									dateFormat="MM/dd/yyyy h:mm aa"
									calendarStartDay={1}
									// showTimeInput={withTime}
									shouldCloseOnSelect={false}
									inline
									selectsRange={range}
									startDate={date}
									maxDate={excludeFutureDates ? new Date() : undefined}
									endDate={range ? endDate : undefined}
								/>
							</>
						);
					}}
				/>
			</div>
		);
	}
);

export default DatePicker;

DatePicker.displayName = 'DatePicker';
