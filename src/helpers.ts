/** Random array element */
export const arrRand = <T>(arr: readonly T[]) =>
	arr[Math.floor(Math.random() * arr.length)]

type Falsy = false | "" | 0 | null | undefined

/** Returns true and type guards if the value is truthy */
export function isTruthy<T>(value: T | Falsy): value is T {
	return !!value
}
