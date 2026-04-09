import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { TextInput } from './text-input';

const meta = {
  title: 'Input/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    value: 'secret123',
    type: 'password',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'not-an-email',
    error: 'Please enter a valid email address.',
  },
};

export const PasswordWithError: Story = {
  args: {
    label: 'Password',
    value: '',
    type: 'password',
    error: 'Password is required.',
  },
};
