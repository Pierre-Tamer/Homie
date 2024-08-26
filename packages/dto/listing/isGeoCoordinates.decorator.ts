import { ValidationOptions, registerDecorator } from 'class-validator';
import validator from 'validator';
export const ARRAY_IS_COORDINATE = 'arrayIsCoordinate';
/**
 * Checks if a value is string in format a "latitude,longitude".
 */
export function isLatLong(value: string): boolean {
  return typeof value === 'string' && validator.isLatLong(value);
}
/**
 * Checks if a given value is a longitude.
 */
export function isLongitude(value: number): boolean {
  return typeof value === 'number' && isLatLong(`0,${value}`);
}

/**
 * Checks if a given value is a latitude.
 */
export function isLatitude(value: number): boolean {
  return typeof value === 'number' && isLatLong(`${value},0`);
}
/**
 * Checks if array contains a GeoJson valid values.
 * If null or undefined is given then this function returns false.
 */
export function arrayIsCoordinate(value: any) {
  if (!Array.isArray(value)) {
    return false;
  }
  if (value.length !== 2) {
    return false;
  }

  const isValidLongitude = isLongitude(value[0]);
  const isValidLatitude = isLatitude(value[1]);
  return isValidLatitude && isValidLongitude;
}

export const isPoint = (value: any) => value === 'Point';

/**
 * Checks if array contains all values from the given array of values.
 * If null or undefined is given then this function returns false.
 */
export function IsGeoCoordinates(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'arrayIsCoordinate',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args) {
          return isPoint(value.type) && arrayIsCoordinate(value.coordinates);
        },
      },
    });
  };
}
