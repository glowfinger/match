export function handleResponse(response: any) {
	if (!response.data.values) {
		return [];
	}
	response.data.values.shift();
	return response.data.values;
}
