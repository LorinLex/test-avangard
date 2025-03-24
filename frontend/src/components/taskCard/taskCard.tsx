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
}

export const TaskCard: FC<TaskCardProps> = ({
  id,
  name,
  description,
  status,
  deadline,
  onClose
}) => {
  const [ isEdit, setIsEdit ] = useState<boolean>(false)

  const onSave = (data: TaskEdit) => {
    const fn = async () => await editTask({ id, data })
    fn()
    setIsEdit(false)
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
