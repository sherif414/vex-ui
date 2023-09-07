import { faker } from '@faker-js/faker'

export type Data = {
  'date initiated': Date
  'date created': Date
  type: 'debit' | 'credit'
  amount: number
  subRows?: Data[]
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Data => {
  return {
    'date created': faker.date.recent({ days: 1 }),
    'date initiated': faker.date.recent({ days: 1 }),
    type: faker.helpers.shuffle(['debit', 'credit'] as const)[0]!,
    amount: faker.number.int({ max: 100_000, min: 10_000 }),
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Data[] => {
    const len = lens[depth]!
    return range(len).map((d): Data => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
