import { DeadlineActionTypes, TaskStatusActionTypes, Actions } from '../actions'
import { StateType } from '../types'


export function reducer(state: StateType, action: Actions) {
  switch (action.type) {
    case DeadlineActionTypes.SET_DEADLINE:
      return {
        ...state,
        deadline: action.payload,
      }

    case TaskStatusActionTypes.SET_STATUS:
      return {
        ...state,
        status: action.payload,
      }

    default:
      return state;
  }
}