import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

// eslint-disable-next-line import/no-named-as-default-member
dayjs.locale('es')
// Plugins
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(relativeTime)

export function datesAreDifferents(
	dateOne: string | Date,
	dateTwo: string | Date,
) {
	return dayjs(dateOne).diff(dateTwo) !== 0
}

export function timeAgo(date: string | Date) {
	return dayjs(date).fromNow()
}
