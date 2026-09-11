import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ColorModeProvider } from '@/shared/themes/color-mode-context';
import { AuthThemeProvider } from '../../themes/auth-color-mode-context';
import RegisterForm from './RegisterForm';

const meta: Meta<typeof RegisterForm> = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
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
    onLogin: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof RegisterForm>;

export const Default: Story = {};


export const ConError: Story = {
  args: {
    errorMessage: 'Ese correo ya está registrado.',
  },
};

export const Cargando: Story = {
  args: {
    isLoading: true,
  },
};

/** Interaction test*/
export const ContrasenasNoCoinciden: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('Nombre completo'), 'Ana Pérez');
    await userEvent.type(canvas.getByLabelText('Correo electrónico'), 'ana@example.com');
    await userEvent.type(canvas.getByLabelText('Contraseña'), 'password123');
    await userEvent.type(canvas.getByLabelText('Confirmar contraseña'), 'otra-distinta');
    await userEvent.click(canvas.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(canvas.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    });
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};


export const RegistroExitoso: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('Nombre completo'), 'Ana Pérez');
    await userEvent.type(canvas.getByLabelText('Correo electrónico'), 'ana@example.com');
    await userEvent.type(canvas.getByLabelText('Contraseña'), 'password123');
    await userEvent.type(canvas.getByLabelText('Confirmar contraseña'), 'password123');
    await userEvent.click(canvas.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledWith({
        name: 'Ana Pérez',
        email: 'ana@example.com',
        password: 'password123',
      });
    });
  },
};