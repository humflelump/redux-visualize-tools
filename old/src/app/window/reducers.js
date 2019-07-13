const initialState = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const Window = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_WINDOW_DIMENSIONS':
            return { 
                ...state, 
                width: action.width,
                height: action.height,
            };
        default:
            return state
    }
};


export default Window;