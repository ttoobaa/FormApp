import countriesData from './countries.json';

export interface Country {
  name: string;
  dialCode: string;
}

export const countries: Country[] = countriesData;

// export const countryOptions: string[] = countries.map(
//   (c) => `${c.name} (${c.dialCode})`
// );

export const countryOptions: string[] = countries.map(
  (c) => c.name
);

// export function getDialCode(countryValue: string): string {
//   const match = countryValue.match(/\(([^)]+)\)$/);
//   return match ? match[1] : '';
// }

export function getDialCode(countryName: string): string {
  const country = countries.find((c) => c.name === countryName);
  return country ? country.dialCode : '';
}
