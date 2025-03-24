import { getEnumKeyByEnumValue } from "../../../core/utils";
import { DeadlineEnum, TaskStatusEnum } from "../types";

export enum DeadlineActionTypes {
  SET_DEADLINE = "SET_DEADLINE",
}

export type SetDeadlineActionType = {
    type: DeadlineActionTypes.SET_DEADLINE;
    payload: DeadlineEnum;
}

export const setDeadlineActionCreator = (
  deadline: string
): SetDeadlineActionType => {
  return {
    type: DeadlineActionTypes.SET_DEADLINE,
    payload: DeadlineEnum[getEnumKeyByEnumValue(DeadlineEnum, deadline)]
  }
}

export enum TaskStatusActionTypes {
  SET_STATUS = "SET_STATUS",
}

export type SetTaskStatusActionType = {
  type: TaskStatusActionTypes.SET_STATUS;
  payload: TaskStatusEnum;
}

export const setTaskStatusActionCreator = (
  status: string
): SetTaskStatusActionType => {
  return {
    type: TaskStatusActionTypes.SET_STATUS,
    payload: TaskStatusEnum[getEnumKeyByEnumValue(TaskStatusEnum, status)]
  }
}

export enum SearchActionTypes {
  SET_SEARCH_QUERY = "SET_SEARCH_QUERY",
}

export type SetSearchQueryActionType = {
  type: SearchActionTypes.SET_SEARCH_QUERY;
  payload: string;
}

export const setSearchQueryActionCreator = (
  query: string
): SetSearchQueryActionType => {
  return {
    type: SearchActionTypes.SET_SEARCH_QUERY,
    payload: query
  }
}

export type ActionTypes =
  | SetTaskStatusActionType
  | SetDeadlineActionType
  | SetSearchQueryActionType
