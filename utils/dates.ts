import dayjs from 'dayjs'
import 'dayjs/locale/es'

// eslint-disable-next-line import/no-named-as-default-member
dayjs.locale('es')

export function datesAreDifferents(
	dateOne: string | Date,
	dateTwo: string | Date,
) {
	return dayjs(dateOne).diff(dateTwo) !== 0
}
