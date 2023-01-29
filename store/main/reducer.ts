import { SET_CREDIT, SET_USER_INFO } from "./actions";

export interface MainState {
  userInfo: any;
  credit: number | string;
}

const INITIAL_STATE: MainState = {
  userInfo: null,
  credit: 0,
};

export default function main(
  state = INITIAL_STATE,
  action: { type: any; payload: any }
) {
  switch (action.type) {
    case SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case SET_CREDIT:
      return { ...state, credit: action.payload };
    default:
      return state;
  }
}
