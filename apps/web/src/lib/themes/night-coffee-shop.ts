import type { UiTheme } from '../controllers/ui.controller';
import Bg from '@/assets/images/night-coffee-bg.png';
import MenuBg from '@/assets/images/night-coffee-sidebar.webp';

export const nightCoffeeShop: UiTheme = {
  title: 'Night Coffee Shop',
  description: 'A serene theme with a blue sky and soft gradients.',
  backgroundState: 'hidden',
  mode: 'dark',
  background: {
    src: Bg.src,
    className: 'absolute -z-10 h-screen w-auto right-0 bottom-0',
    imgClassName: 'object-cover h-full w-full',
    gradients: [
      { className: 'bg-gradient-to-b from-transparent to-background' },
      {
        className:
          'bg-background bg-gradient-to-l from-transparent via-background/30 to-background',
      },
      {
        className:
          'bg-background bg-gradient-to-br from-transparent to-pink-900/20',
      },
      {
        className:
          'bg-background bg-gradient-to-t from-transparent via-background/80 to-background',
      },
    ],
  },
  membersBackground: {
    src: MenuBg.src,
    className: 'absolute size-full inset-0 -z-10',
    imgClassName: 'h-full w-full object-cover',
    gradients: [
      { className: 'bg-gradient-to-b from-transparent to-background' },
      {
        className:
          'bg-background bg-gradient-to-r from-transparent to-pink-800/20',
      },
      {
        className:
          'bg-background bg-gradient-to-t from-transparent via-background/15 to-background/50',
      },
    ],
  },
};
