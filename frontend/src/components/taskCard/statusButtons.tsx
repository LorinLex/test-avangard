import { Button, ButtonGroup } from "@material-tailwind/react"
import { FC } from "react"
import { TaskStatusEnum } from "../../lib/state/types"

type StatusButtonsProps = {
  status: TaskStatusEnum
  canBeClicked: boolean
  setStatus?: (status: TaskStatusEnum) => void
}

export const StatusButtons: FC<StatusButtonsProps> = ({
  status,
  canBeClicked,
  setStatus = () => {}
}) => {
  const activeClasses = [
    "bg-black",
    "text-white",
    "!opacity-100"
  ].join(" ")
  return (
    <ButtonGroup
      ripple={false}
      variant="outlined"
      fullWidth
      className="justify-between"
      size="sm"
    >
      <Button
        className={status === TaskStatusEnum.NEW ? activeClasses : ""}
        disabled={!canBeClicked}
        onClick={() => setStatus(TaskStatusEnum.NEW)}
      >
        New
      </Button>
      <Button
        className={status === TaskStatusEnum.IN_PROGRESS ? activeClasses : ""}
        disabled={!canBeClicked}
        onClick={() => setStatus(TaskStatusEnum.IN_PROGRESS)}
      >
        In progress
      </Button>
      <Button
        className={status === TaskStatusEnum.DONE ? activeClasses : ""}
        disabled={!canBeClicked}
        onClick={() => setStatus(TaskStatusEnum.DONE)}
      >
        Done
      </Button>
    </ButtonGroup>
  )
}