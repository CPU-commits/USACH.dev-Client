export default {
	required: (field: string) => `El campo ${field} es requerido`,
	min: (field: string, minimum: number) =>
		`El campo ${field} debe tener mínimo ${minimum} cárac.`,
	max: (field: string, miximum: number) =>
		`El campo ${field} debe tener máximo ${miximum} cárac.`,
	email: (field: string) => `El campo ${field} debe ser un email válido`,
	format: (field: string) => `El campo ${field} tiene formato inválido`,
}
