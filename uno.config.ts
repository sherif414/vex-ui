import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  transformers: [transformerVariantGroup(), transformerDirectives()],
  content: {
    pipeline: {
      include: ['./playground/**/*.{ts,vue}'],
    },
  },
})
