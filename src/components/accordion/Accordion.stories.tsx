import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '.'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  render: (args: any) => ({
    components: { Accordion, AccordionContent, AccordionItem, AccordionTrigger },
    setup() {
      return { args }
    },
    template: `
      <Accordion v-bind="args">
        <AccordionItem v-for="i in 3" :key="i">
          <AccordionTrigger>
            Accordion Header
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nulla officia error sapiente unde
            assumenda amet repudiandae harum atque quasi voluptatem voluptate sed earum omnis accusantium,
            modi vitae veniam tempora!
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
  tags: ['autodocs'],

  argTypes: {
    variant: {
      type: 'string',
      control: 'select',
      options: ['ladder', 'default', 'light', 'outline'],
    },
    orientation: { type: 'string', control: 'select', options: ['vertical', 'horizontal'] },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {},
}
