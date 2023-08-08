import type { Ref } from 'vue'

export type Fn = () => void

// signal reactivity types
export type Getter<T> = () => T
export type ComputedGet<T> = (compute?: (v: T) => T) => T

export type Setter<T> = (value: T) => void
export type ComputedSet<T> = Setter<((v: T) => T) | T>

export type Signal<T> = [ComputedGet<T>, ComputedSet<T>]

// vue reactivity types
export type MaybeRef<T> = Ref<T> | T
export type MaybeGetter<T> = ComputedGet<T> | T
export type RefOrGetter<T> = Ref<T> | ComputedGet<T>
export type MaybeRefOrGetter<T> = RefOrGetter<T> | T
