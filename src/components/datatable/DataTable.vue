<script setup lang="ts">
import { FlexRender, getCoreRowModel, useVueTable, createColumnHelper } from './adapter'
import { computed, h, ref } from 'vue'
import { type Data, makeData } from './mockData'
import { formatDate } from '@vueuse/core'
import { Tag } from '..'

const defaultData: Data[] = makeData(10)

const columnHelper = createColumnHelper<Data>()

const toMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format

const columns = [
  columnHelper.display({
    header: '#',
    cell: (col) => col.row.index,
  }),

  columnHelper.accessor('date created', {
    header: () => 'date created',
    cell: (col) => formatDate(col.getValue(), 'DD MMM YYYY'),
  }),

  columnHelper.accessor('date initiated', {
    header: () => 'date initiated',
    cell: (col) => formatDate(col.getValue(), 'DD MMM YYYY'),
  }),

  columnHelper.accessor('type', {
    header: 'type',
  }),

  columnHelper.accessor('amount', {
    header: 'amount',
    cell: (col) => {
      const isUp = col.row.original.type === 'credit'
      return h(
        Tag,
        { color: isUp ? 'success' : 'danger' },
        () => (isUp ? '+' : '-') + toMoney(col.getValue())
      )
    },
  }),
]

const data = ref(defaultData)

const rerender = () => {
  data.value = defaultData
}

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
})

const headers = computed(() => table.getFlatHeaders())
</script>

<template>
  <div class="vex-datatable-wrapper">
    <table class="vex-datatable">
      <thead class="vex-datatable-head">
        <tr class="vex-datatable-head-row">
          <th
            class="vex-datatable-head-cell"
            v-for="header in headers"
            :key="header.id"
            :colSpan="header.colSpan"
            :class="{ '--placeholder': header.isPlaceholder, '--id': header.index === 0 }"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </thead>
      <tbody class="vex-datatable-body">
        <tr class="vex-datatable-body-row" v-for="row in table.getRowModel().rows" :key="row.id">
          <td class="vex-datatable-body-cell" v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
      <tfoot class="vex-datatable-tfoot">
        <tr
          class="vex-datatable-tr"
          v-for="footerGroup in table.getFooterGroups()"
          :key="footerGroup.id"
        >
          <th
            class="vex-datatable-th"
            v-for="header in footerGroup.headers"
            :key="header.id"
            :colSpan="header.colSpan"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.footer"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style></style>
