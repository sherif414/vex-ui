import type { Ref } from 'vue'

export type Fn = () => void

export type Getter<T> = () => T
export type Setter<T> = (value: T) => T

export type MaybeGetter<T> = Getter<T> | T
export type MaybeSetter<T> = Setter<T> | T

export type RefOrGetter<T> = Ref<T> | Getter<T>

export type MaybeRefOrGetter<T> = RefOrGetter<T> | T
