import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

// Optional: tweak background/foreground CSS vars for the preview to better see variants
const style = document.createElement("style");
style.innerHTML = `
  :root { --background: #ffffff; --foreground: #171717; }
  @media (prefers-color-scheme: dark) {
    :root { --background: #0a0a0a; --foreground: #ededed; }
  }
`;
document.head.appendChild(style);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
