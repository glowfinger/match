import { DateTime } from 'luxon';

export function convertTime(timeString: string) {
	if (!timeString) {
		return '';
	}

	const H = +timeString.substring(0, 2);
	const h = H % 12 || 12;
	const ampm = H < 12 || H === 24 ? 'am' : 'pm';
	return h + timeString.substring(2, 5) + ampm;
}

export function matchDate(dateString: string) {
	if (!dateString) {
		return 'DATE: NOT SET';
	}

	const date = DateTime.fromSQL(dateString);

	if (!date.isValid) {
		return '';
	}
	return fullDate(date);
}

function fullDate(date: DateTime) {
	return [date.toFormat('cccc'), dayOfTheWeek(date), date.toFormat('LLLL')].join(' ');
}

function dayOfTheWeek(date: DateTime) {
	return date.toFormat('d') + getNumberSuffix(date.toFormat('d'));
}

function getNumberSuffix(num: string) {
	const th = 'th';
	const rd = 'rd';
	const nd = 'nd';
	const st = 'st';

	if (num === '11' || num === '12' || num === '13') {
		return th;
	}

	const lastDigit = num.toString().slice(-1);

	switch (lastDigit) {
		case '1':
			return st;
		case '2':
			return nd;
		case '3':
			return rd;
		default:
			return th;
	}
}
