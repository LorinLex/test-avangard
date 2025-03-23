export { DeadlineActionTypes } from './deadline'
export { TaskStatusActionTypes } from './taskStatus'
import { SetDeadlineAction } from "./deadline";
import { SetTaskStatusAction } from "./taskStatus";

export type Actions =
  | SetTaskStatusAction
  | SetDeadlineAction
