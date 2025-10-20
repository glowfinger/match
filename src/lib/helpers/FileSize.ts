export function bytesToHumanReadable(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const index = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, index)).toFixed(2) + ' ' + units[index];
}
