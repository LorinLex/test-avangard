import { DeadlineEnum } from "../types";

export enum DeadlineActionTypes {
  SET_DEADLINE = "SET_DEADLINE",
}

export type SetDeadlineAction = {
    type: "SET_DEADLINE";
    payload: DeadlineEnum;
}
