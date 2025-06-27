import type { UiTheme } from './controllers/ui.controller';
import { blueSky } from './themes/blue-sky';
import { nightCoffeeShop } from './themes/night-coffee-shop';
import { redSky } from './themes/red-sky';

const themes: UiTheme[] = [redSky, blueSky, nightCoffeeShop];

export { themes };
