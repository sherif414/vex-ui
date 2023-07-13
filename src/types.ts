import type { Ref } from 'vue'

export type Getter<T> = () => T
export type RefOrGetter<T> = Ref<T> | Getter<T>
