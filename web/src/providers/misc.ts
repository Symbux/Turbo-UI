export default class MiscProvider {

	/**
	 * This method is used to get a list of properties and only include the unique items.
	 *
	 * @param items Array of objects.
	 * @param prop The prop name you want to use.
	 */
	public getUniqueProperties(items: Array<any>, prop: string): Array<string> {
		const props: Array<string> = items.map((trigger) => trigger[prop]);
		const uniqueProps: Array<string> = [];
		for (const index in props) {
			if (!uniqueProps.includes(props[index])) {
				uniqueProps.push(props[index]);
			}
		}
		return uniqueProps;
	}

	/**
	 * This function will take an object and deep clone it to prevent any kind of pass
	 * by reference.
	 *
	 * @param obj Object to clone.
	 */
	public deepClone(obj: any): any {
		return JSON.parse(JSON.stringify(obj));
	}

	/**
	 * Taking some information will attempt to do a lookup of an array based on the given
	 * property and value to find a match and return the array index.
	 *
	 * @param list The array of items.
	 * @param property The property to search for.
	 * @param value The value of the property inside of the list to find.
	 */
	public findObjectByProperty(list: Array<any>, property: string, value: any): number {
		for (const index in list) {
			if (list[index][property] === value) {
				return parseInt(index);
			}
		}
		return -1;
	}

	/**
	 * This will attempt to capitalise a string, by capitalising the first letter or if
	 * given the "all" flag, which will then split the string and capitalise each word.
	 *
	 * @param str The string value to capitalise.
	 * @param all Whether to capitalise all words.
	 */
	public capitalise(str: string, all = false): string {
		if (all) {
			return `${str.substring(0, 1).toUpperCase()}${str.substring(1).toLowerCase()}`;
		} else {
			return str.split(' ').map((part: string) => {
				return `${part.substring(0, 1).toUpperCase()}${part.substring(1).toLowerCase()}`;
			}).join(' ');
		}
	}

	/**
	 * This function takes a string, and will essentially clean it into a alphanumeric only
	 * string to be used for
	 * @param value The string to clean.
	 */
	public cleanString(value: string): string {
		return value.replace(/[^0-9A-Z]+/gi, '').toLowerCase();
	}
}
