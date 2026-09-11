import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ColorModeProvider } from '@/shared/themes/color-mode-context';
import { AuthThemeProvider } from '../../themes/auth-color-mode-context';
import ForgotPasswordForm from '../../components/ForgotPassword/ForgotPasswordForm';

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Auth/ForgotPasswordForm',
  component: ForgotPasswordForm,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ColorModeProvider>
        <AuthThemeProvider>
          <Story />
        </AuthThemeProvider>
      </ColorModeProvider>
    ),
  ],
  args: {
    onSubmit: fn(),
    onBackToLogin: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ForgotPasswordForm>;


export const Default: Story = {};


export const ConError: Story = {
  args: {
    errorMessage: 'No encontramos una cuenta con ese correo.',
  },
};


export const Cargando: Story = {
  args: {
    isLoading: true,
  },
};

/** Confirmation Screen */
export const CorreoEnviado: Story = {
  args: {
    emailSent: true,
  },
};

/** Interaction test */
export const ValidacionDeCorreo: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText('Correo electrónico');

    await userEvent.type(emailInput, 'correo-invalido');
    await userEvent.click(canvas.getByRole('button', { name: /enviar enlace/i }));

    await waitFor(() => {
      expect(canvas.getByText('Ingresa un correo válido.')).toBeInTheDocument();
    });
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};