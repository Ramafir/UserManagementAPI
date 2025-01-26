import isPlainObject from 'lodash/isPlainObject';

export const isMergeableObject = (value: object) => Array.isArray(value) || isPlainObject(value);
