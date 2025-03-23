// import { Enum } from "react"

export enum DeadlineEnum {
  ALL = "All",
  ACTUAL = "Actual",
  MISSED = "Missed"
}

export enum TaskStatusEnum {
  ALL = "All",
  NEW = "New",
  IN_PROGRESS = "In progress",
  DONE = "Done"
}

export type StateType = {
  status: TaskStatusEnum,
  deadline: DeadlineEnum
}