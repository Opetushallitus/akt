import { TFunction } from 'i18next';

export class Utils {
  static isEmptyString(str: string) {
    return !str || str.length === 0;
  }

  static createMapFromArray(
    array: Array<string>,
    t: TFunction | undefined = undefined,
    prefix: string | undefined = undefined
  ) {
    const prfxKey = prefix ? `${prefix}.` : '';
    return new Map(array.map((i) => [t ? `${t(`${prfxKey}${i}`)}` : i, i]));
  }
}
