import type { Ref } from 'vue'

export type Fn = () => void

// signal reactivity types
export type Get<T> = () => T
export type ComputedGet<T> = (compute?: (v: T) => T) => T

export type Set<T> = (value: T) => void
export type ComputedSet<T> = Set<((v: T) => T) | T>

export type Signal<T> = [ComputedGet<T>, ComputedSet<T>]

// vue reactivity types
export type MaybeRef<T> = Ref<T> | T
export type MaybeGetter<T> = ComputedGet<T> | T
export type RefOrGetter<T> = Ref<T> | ComputedGet<T>
export type MaybeRefOrGetter<T> = RefOrGetter<T> | T
