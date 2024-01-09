export type TNextPage<ParamsAlias extends string | never = never, SearchParams extends string[] = []> = {
  params: ParamsAlias extends never ? never : Record<ParamsAlias, string>
  searchParams: Record<SearchParams[number], string | null>
}

export function objectEntries<O extends object>(obj?: O) {
  return Object.entries(obj ?? {}) as [keyof O, O[keyof O]][]
}

export type TOmit<T extends { [K in string]: unknown }, K extends keyof T> = Omit<T, K>

export async function wait(seconds: number) {
  return new Promise((res) => setTimeout(res, seconds * 1000))
}

export function classes(...classes: (string | false | undefined)[]): string | undefined {
  const cleaned = classes.filter(Boolean) as string[]
  if (cleaned.length === 0) return
  return cleaned.reduce((total, next) => `${total} ${next}`)
}

export function randomFromArray<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function assignObject<T extends {} | undefined>(obj: T, newObj: T) {
  obj ? Object.assign(obj, newObj) : () => (obj = newObj)
}

export type TRedefineObject<T, P extends Partial<Record<keyof T, unknown>>> = {
  [K in keyof T]: K extends keyof P ? P[K] : T[K]
}

export function deleteExtension(string: string) {
  return string.replace(/(\.[^.]*)$/, '')
}
