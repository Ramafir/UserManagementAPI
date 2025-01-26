import uniq from "lodash/uniq";
import flattenDeep from "lodash/flattenDeep";

import { NestedKey } from "@shared/types/NestedKey";

export const getUniqueValuesFromCollection = <T extends object, Y>(
  collection: T[],
  property: NestedKey<T>
): Y[] => {
  const splitKey = property.split(".");

  const fixedCollection = collection
    .filter(element => !!getValueFromKey(splitKey, element))
    .map(element => <Y>getValueFromKey(splitKey, element));

  return uniq(flattenDeep(fixedCollection));
};

function getValueFromKey<T>(splitKey: string[], element: T) {
  const [firstKey] = splitKey;

  let result = element[firstKey as keyof unknown];

  splitKey.reduce((accumulator, value) => {
    result = result[value as keyof unknown];

    accumulator = value;

    return accumulator;
  }, '');

  return result;
}
