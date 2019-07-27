import { IState } from '../store';

export const windowWidth = (state: IState) => state.Window.width;
export const windowHeight = (state: IState) => state.Window.height;
