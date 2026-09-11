import type { Preview, StoryContext } from '@storybook/react-vite';
import React from 'react';
import '../src/shared/i18n/i18n';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'dark', value: '#0B0C0F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    docs: {
      toc: true,
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Tema del lienzo (fondo detrás del componente)',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'dark', icon: 'circle', title: 'Oscuro' },
          { value: 'light', icon: 'circlehollow', title: 'Claro' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story: React.ComponentType, context: StoryContext) => {
      const isDark = (context.globals?.theme as string) !== 'light';
      return (
        <div
          style={{
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            background: isDark ? '#0d0e12' : '#f4f5f7',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            transition: 'background 0.2s ease',
          }}
        >
          <Story />
        </div>
      );
    },
  ],

  beforeEach: async () => {
    document.title = 'Navbar · Storybook';
  },
};

export default preview;
