import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ColorModeProvider } from '@/shared/themes/color-mode-context';
import { AuthThemeProvider } from '../../themes/auth-color-mode-context';
import LoginForm from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Formulario de inicio de sesión con validación de correo/contraseña, ' +
          'mostrar/ocultar contraseña, "Recuérdame", link a recuperación de contraseña y a registro.',
      },
    },
  },
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
    onForgotPassword: fn(),
    onRegister: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;


export const Default: Story = {};


export const ConError: Story = {
  args: {
    errorMessage: 'Correo o contraseña incorrectos.',
  },
};

/** Estado de carga tras enviar el formulario */
export const Cargando: Story = {
  args: {
    isLoading: true,
  },
};

/**
 * Interaction test
 */
export const ValidacionYEnvio: Story = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Intentar enviar vacío muestra errores de validación', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /iniciar sesión/i }));
      await waitFor(() => {
        expect(canvas.getByText('Ingresa un correo válido.')).toBeInTheDocument();
      });
    });

    await step('Completar con datos válidos y enviar', async () => {
      await userEvent.type(canvas.getByLabelText('Correo electrónico'), 'ana@example.com');
      await userEvent.type(canvas.getByLabelText('Contraseña'), 'supersecreta');
      await userEvent.click(canvas.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({
          email: 'ana@example.com',
          password: 'supersecreta',
          remember: false,
        });
      });
    });
  },
};

/** Interaction test */
export const MostrarContrasena: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = canvas.getByLabelText('Contraseña') as HTMLInputElement;

    expect(passwordInput.type).toBe('password');

    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar contraseña' }));
    await waitFor(() => {
      expect(passwordInput.type).toBe('text');
    });
  },
};