import { TaskStatusEnum } from "../types";

export enum TaskStatusActionTypes {
  SET_STATUS = "SET_STATUS",
}

export type SetTaskStatusAction = {
  type: "SET_STATUS";
  payload: TaskStatusEnum;
}