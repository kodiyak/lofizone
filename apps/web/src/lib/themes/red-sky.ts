import type { UiTheme } from '../controllers/ui.controller';
import Bg from '@/assets/images/img-1.webp';
import MenuBg from '@/assets/images/img-7.jpg';

export const redSky: UiTheme = {
  title: 'Red Sky',
  description: 'A serene theme with a red sky and soft gradients.',
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
          'bg-background bg-gradient-to-l from-transparent via-background/30 to-background',
      },
      {
        className:
          'bg-background bg-gradient-to-t from-transparent via-background/80 to-background',
      },
    ],
  },
};
