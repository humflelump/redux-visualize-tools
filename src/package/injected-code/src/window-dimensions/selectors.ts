import { State } from "../store";

export const windowWidth = (state: State) => state.Window.width;
export const windowHeight = (state: State) => state.Window.height;