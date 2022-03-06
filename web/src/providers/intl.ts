export class IntlProvider {
	public convertDateTime(timestamp: number | string): string {
		const datetime = new Date(timestamp);
		return Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: false,
			timeZone: 'Europe/London',
		}).format(datetime);
	}
}

export default new IntlProvider();
