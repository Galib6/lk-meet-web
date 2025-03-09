import dayjs, { Dayjs } from 'dayjs';

export class $$ {
  public static toCapitalizeText(text: string): string {
    return text?.charAt(0)?.toUpperCase() + text?.slice(1)?.toLowerCase();
  }

  public static appendPagination(path: string, page = 1, limit = 10) {
    return `${path}?page=${page}&limit=${limit}`;
  }

  public static sort<T = any>(data: T[], sortBy: string, sortOrder: 'ASC' | 'DESC'): T[] {
    if (data?.length <= 0) return data;

    const sortByType = typeof data?.[0]?.[sortBy];

    if (sortByType === 'string') {
      if (sortOrder === 'ASC')
        return data.sort(function (a, b) {
          const textA = a[sortBy].toUpperCase();
          const textB = b[sortBy].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

      return data.sort(function (a, b) {
        const textA = a[sortBy].toUpperCase();
        const textB = b[sortBy].toUpperCase();
        return textA < textB ? 1 : textA > textB ? -1 : 0;
      });
    }

    if (sortOrder === 'ASC') return data?.sort((a, b) => a[sortBy] - b[sortBy]);
    return data?.sort((a, b) => b[sortBy] - a[sortBy]);
  }

  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  public static isValidArray(value: any): boolean {
    return Array.isArray(value) && value.length > 0;
  }

  public static isValidObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  public static toSafeValue(value: any): any {
    if (this.isNotEmpty(value)) {
      return value;
    }
    return null;
  }

  public static randomString(length: number, type: 'lower' | 'upper' | 'numeric'): string {
    let result = '';
    const characters =
      type === 'lower'
        ? 'abcdefghijklmnopqrstuvwxyz'
        : type === 'upper'
          ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          : type === 'numeric'
            ? '0123456789'
            : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public static isValidString(value: any): boolean {
    return typeof value === 'string' && value.length > 0;
  }

  public static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  public static isValidBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  //is not empty
  public static isNotEmpty(value: any): boolean {
    if (value === null || value === undefined || value === '' || value.length === 0) {
      return false;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).length > 0;
    }
    return true;
  }

  public static toNumber(value: any): number {
    return Number(value);
  }

  //safety convert to number
  public static toSafeNumber(value: any): number {
    if (this.isNotEmpty(value)) {
      return Number(value);
    }
    return 0;
  }

  //safety convert to string
  public static toSafeString(value: any): string {
    if (this.isNotEmpty(value)) {
      return value.toString();
    }
    return '';
  }

  public static toSafeObject(value: any): any {
    if (this.isNotEmpty(value)) {
      return value;
    }
    return {};
  }

  //safety convert to boolean
  public static toBooleanSafe(value: any): boolean {
    if (this.isNotEmpty(value)) {
      return value.toString() === 'true';
    }
    return false;
  }

  public static findMax(array: number[]): number {
    return Math.max.apply(null, array);
  }

  public static findMin(array: number[]): number {
    return Math.min.apply(null, array);
  }

  public static findAverage(array: number[]): number {
    let sum = 0;
    for (const value of array) {
      sum += value;
    }
    return sum / array.length;
  }

  public static findMedian(array: number[]): number {
    const sorted = array.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  public static isEmpty(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) ||
      value === 'null' ||
      value === 'undefined'
    );
  }

  //to safe array
  public static toSafeArray(value: any): any[] {
    if (this.isNotEmpty(value)) {
      return value;
    }
    return [];
  }

  public static toCleanObject(obj: { [key: string]: any }): any {
    if (this.isValidObject(obj)) {
      Object.keys(obj).forEach((key) => {
        if (this.isEmpty(obj[key])) {
          delete obj[key];
        }
      });
    }
    return this.toSafeObject(obj);
  }
  public static parseQueryParams<T = any>(url: string): T {
    const queryString = url.split('?')[1];
    if (!queryString) return {} as T;

    const query = {};
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (!Number.isNaN(Number(value))) {
        query[decodeURIComponent(key)] = Number(value);
      } else if (key === 'sort') {
        query[decodeURIComponent(key)] = JSON.parse(decodeURIComponent(value || ''));
      } else {
        query[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }
    return query as T;
  }
  public static toQueryString(params: any): string {
    if (this.isValidObject(params)) {
      return Object.keys(params)
        .map((key) => {
          return key + '=' + params[key];
        })
        .join('&');
    }
    return '';
  }

  public static queryNormalizer = (options: any) => {
    const pureOption = this.toCleanObject(options);

    if (pureOption?.query) {
      return options.query;
    }
    const queries: any = [];
    Object.entries(pureOption).map(([key, value]: any) => {
      const valueType = Array.isArray(value) ? 'array' : typeof value;
      if (valueType === 'array') {
        return queries.push(`${key}=${JSON.stringify(value)}`);
      }
      //  else if (valueType === 'array' && key === 'filter') {
      //   return value.map((fOption) => {
      //     return queries.push(`${key}=${fOption}`);
      //   });
      // } else if (valueType === 'array') {
      //   return queries.push(`${key}=${JSON.stringify(value)}`);
      // }
      else if (valueType === 'object') {
        return queries.push(`${key}=${JSON.stringify(value)}`);
      } else {
        return queries.push(`${key}=${value}`);
      }
    });
    return queries.join('&');

    //   if (options?.query) {
    //     return options.query;
    //   }
    //   if (options) {
    //     const items = {};
    //     Object.keys(options).map((x) => {
    //       if (Boolean(options[x])) {
    //         items[x] = options[x];
    //       }
    //     });
    //     return Object.keys(items)
    //       .map((x) => {
    //         const propertyName = x;
    //         const propertyValue = items[x];
    //         const propertyValueType = typeof items[x];
    //         if (propertyValueType === 'object') {
    //           return `${propertyName}=${JSON.stringify(propertyValue)}`;
    //         } else {
    //           return `${propertyName}=${propertyValue}`;
    //         }
    //       })
    //       .join('&');
    //   }

    //   return '';
    // };
  };

  // is valid browser url
  public static isValidBrowserUrl(url: string): boolean {
    // check is string
    if (typeof url !== 'string') {
      return false;
    }
    return url?.startsWith('http://') || url?.startsWith('https://');
  }

  // check url ending extension
  public static isValidSvgUrl(url: string): boolean {
    // check is string
    if (typeof url !== 'string') {
      return false;
    }
    return url?.toLocaleLowerCase()?.endsWith('.svg');
  }

  // amount prefix with currency symbol
  public static withCurrency = (amount: number, symbol: string = '৳'): string => {
    return symbol + this.toSafeNumber(amount);
  };

  // is json string
  public static isJsonString = (str: string): boolean => {
    try {
      JSON.parse(str);
    } catch {
      return false;
    }
    return true;
  };

  // purify data if json stringify object
  public static jsonParser = (data: any): any => {
    const r = this.isJsonString(data);
    return r ? JSON.parse(data) : data;
  };

  // clean svg code from xml version tag
  public static cleanSvgCode = (svgCode: string): string => {
    return svgCode.replace(/<\?xml[^>]*>/g, '');
  };

  // get month end date from date
  public static getMonthEndDate = (date: Date | Dayjs): Date => {
    return dayjs(date).endOf('month').toDate();
  };

  // get ago
  // public static getAgo = (date: Date | Dayjs): string => {
  //   return dayjs(date).fromNow();
  // };

  // get age
  public static getAge = (date: Date | Dayjs | string) => {
    return dayjs().diff(date, 'years');
  };

  public static toDayjs = (date: string, format = 'YYYY-MM-DD'): Dayjs => {
    return date ? dayjs(date, format) : null;
  };

  public static dayjsToStr = (date: string, format = 'YYYY-MM-DD'): string => {
    return date ? dayjs(date).format(format) : null;
  };

  public static orderStatusBgColorGen = (status?: 'PLACED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED') => {
    switch (status) {
      case 'PLACED':
        return '#FFA500';
      case 'CONFIRMED':
        return '#2CADD6';
      case 'COMPLETED':
        return '#00AC26';
      case 'CANCELED':
        return '#D62C2C';
      default:
        return '#00AC26';
    }
  };
  public static convertObjectToArray(object) {
    const modifiedArray = [];

    for (const key in object) {
      const title = object[key];
      const item = { title: title, code: key };
      modifiedArray.push(item);
    }

    return modifiedArray;
  }

  public static addPrefixToObject<T = any>(prefix: string, object: T): T {
    const modifiedObject: Partial<{ [key: string]: string }> = {};
    for (const key in object) {
      modifiedObject[key] = prefix + object[key];
    }
    return modifiedObject as T;
  }

  public static async asyncForEach<T = any>(array: T[], callback: (item: T, index: number, self: T[]) => void) {
    if (!Array.isArray(array)) {
      throw Error('Expected an array');
    }
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  public static countWordsInString(inputString): number {
    const wordsArray = inputString?.trim()?.split(/\s+/);
    const filteredWords = wordsArray.filter((word) => word?.length > 0);
    return filteredWords?.length;
  }

  public static hexToRgb(hex) {
    hex = hex?.replace(/^#/, '');

    const bigint = parseInt(hex, 16);
    // Extract the RGB components
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  }

  public static adjustColor(hex, percent) {
    const rgb = $$.hexToRgb(hex);

    // Calculate the new RGB values
    const newR = Math.round(rgb.r + (255 - rgb.r) * percent);
    const newG = Math.round(rgb.g + (255 - rgb.g) * percent);
    const newB = Math.round(rgb.b + (255 - rgb.b) * percent);

    // Ensure values are within 0-255 range
    const adjustedR = Math.max(0, Math.min(255, newR));
    const adjustedG = Math.max(0, Math.min(255, newG));
    const adjustedB = Math.max(0, Math.min(255, newB));

    // Convert the new RGB values back to hex
    const newHex = `#${((adjustedR << 16) | (adjustedG << 8) | adjustedB).toString(16).padStart(6, '0')}`;

    return newHex;
  }

  public static shuffleArray = (array: any[]) => {
    const arr = array
      ?.map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    return arr;
  };

  public static exportCSV(
    fileName: string,
    data: object[],
    headers?: string[],
    isFieldNameCapitalize: boolean = false,
  ) {
    function convertToCSV(data: object[], headers?: string[]): string {
      const csvHeaders = headers || Object.keys(data[0]);
      const csvRows = data.map((row) =>
        csvHeaders.map((fieldName) => JSON.stringify(row[fieldName], (_, value) => value ?? '')).join(','),
      );

      return [
        isFieldNameCapitalize
          ? csvHeaders.map((csvHeader) => $$.toCapitalizeText(csvHeader)).join(',')
          : csvHeaders.join(','),
        ...csvRows,
      ].join('\r\n');
    }

    function triggerDownload(fileName: string, content: string) {
      const csvData = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const csvURL = URL.createObjectURL(csvData);
      const link = document.createElement('a');
      link.href = csvURL;
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    const csvString = convertToCSV(data, headers);
    triggerDownload(fileName, csvString);
  }

  public static generateSlug(selector: string): string {
    const sanitizeSelector = selector.replace(/[^a-zA-Z0-9\s]+/g, '');
    const trimSelector = sanitizeSelector.trim();

    return trimSelector.trim().toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').split("'").join('');
  }

  public static toDeepProperty(data: { [key: string]: any } | any[], propertyPath: string): any {
    return propertyPath.split('.').reduce((acc, current) => {
      if (Array.isArray(acc)) {
        const idxMatch = current.match(/\[(\d+)\]/);

        if (idxMatch) {
          const idx = parseInt(idxMatch[1], 10);
          return acc[idx];
        } else {
          return acc.map((elem) => elem[current]);
        }
      } else {
        return acc && acc[current];
      }
    }, data);
  }

  public static groupByProperty(
    data: object[],
    propertyPath: string,
    propertyKeyword: string = '',
    searchPropertyPath: string = '',
    searchKeyword: string = '',
  ): object[] {
    return Object.values(
      data.reduce((acc, current) => {
        const propertyKey = $$.toDeepProperty(current, propertyPath);
        const searchPropertyKey = searchPropertyPath && $$.toDeepProperty(current, searchPropertyPath).toLowerCase();

        if (!acc[propertyKey]) acc[propertyKey] = { name: propertyKey, values: [] };

        const matchesProperty = !propertyKeyword || propertyKey === propertyKeyword;
        const matchesSearch =
          !searchPropertyPath || !searchKeyword || searchPropertyKey.includes(searchKeyword.toLowerCase());

        if (matchesProperty && matchesSearch) acc[propertyKey].values.push(current);

        return acc;
      }, {}),
    );
  }

  public static toAddQueryParam(url: string, paramName: string, paramValue: string): string {
    const urlParts = url.split('?');
    let updatedUrl = urlParts[0];

    if (urlParts.length >= 2) {
      const queryString = urlParts[1];

      updatedUrl += `?${queryString}&${paramName}=${paramValue}`;
    } else {
      updatedUrl += `?${paramName}=${paramValue}`;
    }

    return updatedUrl;
  }

  public static toRemoveQueryParam(url: string, paramName: string): string {
    const urlParts = url.split('?');

    if (urlParts.length >= 2) {
      const queryString = urlParts[1];
      const params = queryString.split('&');

      const updatedParams = params.filter((param) => {
        const [key] = param.split('=');

        return key !== paramName;
      });

      const updatedQueryString = updatedParams.length > 0 ? updatedParams.join('&') : '';
      const updatedUrl = urlParts[0] + (updatedQueryString ? '?' + updatedQueryString : '');

      return updatedUrl;
    } else {
      return url;
    }
  }
}
