import { Card, Input, Select } from "@material-tailwind/react"
import { FC, useContext } from "react"
import { DeadlineEnum, TaskStatusEnum } from "../../lib/state/types"
import { StateContext, StateContextType } from "../../lib/state/context";
import SelectOption from "@material-tailwind/react/components/Select/SelectOption";
import { getEnumKeyByEnumValue } from "../../core/utils";

export const SearchAndFilter: FC = () => {
  const { state, dispatch } = useContext<StateContextType>(StateContext)

  const setDeadline = (deadline: string) =>
    dispatch({
      type: "SET_DEADLINE",
      payload: DeadlineEnum[getEnumKeyByEnumValue(DeadlineEnum, deadline)]
    })

  const setStatus = (status: string) =>
    dispatch({
      type: "SET_STATUS",
      payload: TaskStatusEnum[getEnumKeyByEnumValue(TaskStatusEnum, status)]
    })

  return (
    <Card className="max-w-full">
      <div className={[
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-[1fr_210px_210px]",
        "grid-rows-3",
        "sm:grid-rows-2",
        "md:grid-rows-1"
      ].join(" ")}>
        <div className={[
          "w-full",
          "col-span-1",
          "sm:col-span-2",
          "md:col-span-1",
          "row-start-1",
          "row-end-1"
        ].join(" ")}>
          <Input name="search" label="Search" placeholder="name or description..."/>
        </div>
        <div className={[
          "col-start-1",
          "col-end-1",
          "md:col-start-2",
          "md:col-end-2",
          "row-start-2",
          "row-end-2",
          "md:row-start-1",
          "md:row-end-1",
        ].join(" ")}>
          <Select
            value={state.status}
            onChange={(value) => value && setStatus(value)}
            name="status"
            label="status"
          >
            <SelectOption value={TaskStatusEnum.ALL}>All</SelectOption>
            <SelectOption value={TaskStatusEnum.NEW}>New</SelectOption>
            <SelectOption value={TaskStatusEnum.IN_PROGRESS}>In progress</SelectOption>
            <SelectOption value={TaskStatusEnum.DONE}>Done</SelectOption>
          </Select>
        </div>
        <div className={[
          "col-start-1",
          "col-end-1",
          "sm:col-start-2",
          "sm:col-end-2",
          "md:col-start-3",
          "md:col-end-3",
          "row-start-3",
          "row-end-3",
          "sm:row-start-2",
          "sm:row-end-2",
          "md:row-start-1",
          "md:row-end-1"
        ].join(" ")}>
        <Select
          value={state.deadline}
          onChange={(value) => value && setDeadline(value)}
          name="deadline"
          label="deadline"
        >
          <SelectOption value={DeadlineEnum.ALL}>All</SelectOption>
          <SelectOption value={DeadlineEnum.ACTUAL}>Actual</SelectOption>
          <SelectOption value={DeadlineEnum.MISSED}>Missed</SelectOption>
        </Select>
        </div>
      </div>
    </Card>
  )
}