import { DeadlineActionTypes, TaskStatusActionTypes, ActionTypes, SearchActionTypes } from '../actions'
import { StateType } from '../types'


export function reducer(state: StateType, action: ActionTypes) {
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

    case SearchActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        search_query: action.payload,
      }

    default:
      return state;
  }
}