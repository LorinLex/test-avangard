import { createContext, FC, PropsWithChildren, useReducer } from 'react';
import { ActionTypes } from './actions';
import { reducer } from './reducers';
import { DeadlineEnum, StateType, TaskStatusEnum } from './types';

export type StateContextType = {
  state: StateType,
  dispatch: React.Dispatch<ActionTypes>,
};

const initialState: StateType = {
  status: TaskStatusEnum.ALL,
  deadline: DeadlineEnum.ALL,
  search_query: ""
}

export const StateContext = createContext<StateContextType>({
  state: initialState,
  dispatch: () => null
})

export const StateContextProvider: FC<PropsWithChildren> = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  )
}
