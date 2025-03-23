export const getCookie = (name: string) =>
  document.cookie.split('; ')
    .filter(row => row.startsWith(`${name}=`))
    .map(c=>c.split('=')[1])[0]


export const setCookie = (name: string, value: string) =>
  document.cookie = `${name}=${value}`

export const EMAIL_REGEXP = /[\d\w\._\-%+-]+@[\d\w\._-]+\.[\w]{2,}/

export function getEnumKeyByEnumValue<
  TEnumKey extends string,
  TEnumVal extends string | number
>(
  myEnum: { [key in TEnumKey]: TEnumVal },
  enumValue: TEnumVal
): TEnumKey {
  const keys = (Object.keys(myEnum) as TEnumKey[]).filter(
    (x) => myEnum[x] === enumValue,
  );
  if (keys.length > 0)
    return keys[0]
  throw new Error()
}