import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { useState, type ReactNode } from 'react';
import { SidebarBehaviorProvider } from '@/shared/themes/sidebar-behavior-context';
import Navbar from './Navbar';
import { DEFAULT_ITEMS, type NavItem } from './defaultNavItems';
import type { ThemePreference } from './Navbar';

const withSidebarBehavior = (Story: () => ReactNode) => (
  <SidebarBehaviorProvider>
    <Story />
  </SidebarBehaviorProvider>
);

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  decorators: [withSidebarBehavior],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sidebar that expands on hover and collapses when the pointer leaves (icon-only ↔ icons + text). ' +
          'A pin button locks it open. Includes a floating active indicator with glow, tooltips in collapsed ' +
          'mode, and a user menu (settings, theme segment, logout) from the avatar / more button.',
      },
    },
  },
  argTypes: {
    activeItem: {
      control: 'select',
      options: DEFAULT_ITEMS.map((item) => item.id),
      mapping: Object.fromEntries(DEFAULT_ITEMS.map((item) => [item.id, item.titleKey])),
      description: 'Currently selected item id.',
      table: { category: 'Navigation' },
    },
    onItemClick: {
      control: false,
      table: { category: 'Navigation' },
    },
    items: {
      
      control: 'object',
      description: 'Overrides the default nav items. Each item is an object: { id, titleKey, url, icon }.',
      table: { category: 'Navigation' },
    },
    logo: {
      control: false,
      table: { category: 'Appearance' },
    },
    isExpanded: {
      control: 'boolean',
      description: 'Controls whether the sidebar is expanded (with labels).',
      table: { category: 'Expand/Collapse' },
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Initial state when uncontrolled.',
      table: { category: 'Expand/Collapse', defaultValue: { summary: 'false' } },
    },
    onExpandedChange: {
      control: false,
      table: { category: 'Expand/Collapse' },
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Resolved palette applied to the sidebar (light/dark).',
      table: { category: 'Theme' },
    },
    themePreference: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'User preference including automatic (system).',
      table: { category: 'Theme', defaultValue: { summary: "'system'" } },
    },
    defaultTheme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Initial resolved theme when uncontrolled.',
      table: { category: 'Theme', defaultValue: { summary: "'light'" } },
    },
    onThemeChange: {
      control: false,
      table: { category: 'Theme' },
    },
  },
  args: {
    onItemClick: fn(),
    onExpandedChange: fn(),
    onThemeChange: fn(),
    userName: 'Juan',
    userRole: 'Admin',
    userEmail: 'root@answertic.co',
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Collapsed: Story = {
  render: (args) => (
    <div style={{ height: '100vh', background: '#0d0e12' }}>
      <Navbar {...args} />
    </div>
  ),
};

export const Expanded: Story = {
  args: {
    defaultExpanded: true,
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0d0e12' }}>
      <Navbar {...args} />
    </div>
  ),
};

export const LightTheme: Story = {
  args: {
    defaultTheme: 'light',
    defaultExpanded: true,
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#f7f5f1' }}>
      <Navbar {...args} />
    </div>
  ),
};

export const PaymentsActive: Story = {
  args: {
    activeItem: 'pagos',
    defaultExpanded: true,
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0d0e12' }}>
      <Navbar {...args} />
    </div>
  ),
};

/**
 * Interaction test: hovering over the sidebar expands it, and moving the
 * pointer away collapses it back — the gesture requested for the real app.
 */
export const HoverToExpand: Story = {
  args: {
    defaultExpanded: false,
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0d0e12' }}>
      <Navbar {...args} />
    </div>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByLabelText('Navegación principal');

    await step('Hover expands the sidebar', async () => {
      await userEvent.hover(sidebar);
      await waitFor(() => {
        expect(args.onExpandedChange).toHaveBeenCalledWith(true);
      });
    });

    await step('Moving away collapses it back', async () => {
      await userEvent.unhover(sidebar);
      await waitFor(() => {
        expect(args.onExpandedChange).toHaveBeenCalledWith(false);
      });
    });
  },
};

/**
 * Interaction test: clicking the pin button locks the sidebar expanded,
 * so it stays open even after the pointer leaves.
 */
export const PinToKeepOpen: Story = {
  render: (args) => (
    <div style={{ height: '100vh', background: '#0d0e12' }}>
      <Navbar {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByLabelText('Navegación principal');
    const pinButton = canvas.getByRole('button', { name: 'Anclar menú abierto' });

    await userEvent.hover(sidebar);
    await userEvent.click(pinButton);
    await userEvent.unhover(sidebar);

    await waitFor(() => {
      expect(args.onExpandedChange).toHaveBeenLastCalledWith(true);
    });
  },
};

export const ToggleTheme: Story = {
  args: {
    themePreference: 'system',
    defaultTheme: 'dark',
    defaultExpanded: true,
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0d0e12' }}>
      <Navbar {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const moreButton = canvas.getByRole('button', { name: 'Menú de usuario' });

    await userEvent.click(moreButton);
    const lightModeButton = canvas.getByRole('button', { name: 'Modo claro' });
    await userEvent.click(lightModeButton);

    await waitFor(() => {
      expect(args.onThemeChange).toHaveBeenCalledWith('light');
    });
  },
};

function ControlledNavbar() {
  const [active, setActive] = useState<string>('inicio');
  const [expanded, setExpanded] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const resolvedTheme =
    themePreference === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : themePreference;

  const handleItemClick = (item: NavItem) => {
    setActive(item.id);
  };

  return (
    <div
      style={{
        height: '100vh',
        background: resolvedTheme === 'dark' ? '#0d0e12' : '#f7f5f1',
        transition: 'background 0.3s ease',
      }}
    >
      <Navbar
        activeItem={active}
        onItemClick={handleItemClick}
        isExpanded={expanded}
        onExpandedChange={setExpanded}
        theme={resolvedTheme}
        themePreference={themePreference}
        onThemeChange={setThemePreference}
        logo={
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#1C1F26',
            }}
          />
        }
      />
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledNavbar />,
};