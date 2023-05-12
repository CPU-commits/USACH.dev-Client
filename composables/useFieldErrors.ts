export default function () {
	return useState('fields', () => new Map<string, string>())
}
