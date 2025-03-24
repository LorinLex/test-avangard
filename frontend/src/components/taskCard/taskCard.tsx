import { FC, useState } from "react"
import { TaskStatusEnum } from "../../lib/state/types"
import { TaskCardRead } from "./taskCardRead";
import { TaskCardEdit } from "./taskCardEdit";
import { deleteTask, editTask, TaskEdit } from "../../lib/fetchers";

type TaskCardProps = {
    id: number
    name: string
    description: string
    status: TaskStatusEnum
    deadline: Date
    onClose: () => void
    onSuccess: () => void
}

export const TaskCard: FC<TaskCardProps> = ({
  id,
  name,
  description,
  status,
  deadline,
  onClose,
  onSuccess
}) => {
  const [ isEdit, setIsEdit ] = useState<boolean>(false)

  const onSave = (data: TaskEdit) => {
    const fn = async () => await editTask({ id, data })
    fn()
    setIsEdit(false)
    onSuccess()
    onClose()
  }

  if (!isEdit) {
    return (
      <TaskCardRead
        id={id}
        name={name}
        description={description}
        status={status}
        deadline={deadline}
        onEdit={() => setIsEdit(true)}
        onDelete={() => {
          deleteTask({ id: id })
          onSuccess()
          onClose()
        }}
      />
    )
  }
  return (
    <TaskCardEdit
      id={id}
      name={name}
      description={description}
      status={status}
      deadline={deadline}
      onSave={onSave}
    />
  )
}
