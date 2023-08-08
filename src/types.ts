import type { Ref } from 'vue'

export type Fn = () => void

// signal reactivity types
export type Get<T> = () => T
export type Getter<T> = (compute?: (v: T) => T) => T

export type Set<T> = (value: T) => void
export type Setter<T> = Set<((v: T) => T) | T>

export type Signal<T> = [Getter<T>, Setter<T>]

// vue reactivity types
export type MaybeRef<T> = Ref<T> | T
export type MaybeGetter<T> = Getter<T> | T
export type RefOrGetter<T> = Ref<T> | Getter<T>
export type MaybeRefOrGetter<T> = RefOrGetter<T> | T
