import Alert from './Alert.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  render: (args) => ({
    components: { Alert },
    setup() {
      return () => (
        <Alert {...args} header="alert header">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nulla officia error sapiente
          unde assumenda amet repudiandae harum atque quasi voluptatem voluptate sed earum omnis
          accusantium.
        </Alert>
      )
    },
  }),
  tags: ['autodocs'],
  args: { color: 'primary' },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
