import dayjs from 'dayjs'
import 'dayjs/locale/es'

// eslint-disable-next-line import/no-named-as-default-member
dayjs.locale('es')

export function formatDate(date: string | Date) {
	return dayjs(date).format('DD/MM/YYYY')
}

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export function isValidUsername(username: string) {
	const regex = /^[a-z]+(?:\.[a-z]+)?(?:\.[a-z]+)?(?:@usach\.cl)?$/i

	return regex.test(username)
}
