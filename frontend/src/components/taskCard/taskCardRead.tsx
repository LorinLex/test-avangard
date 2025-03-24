import { FC } from "react"
import { TaskStatusEnum } from "../../lib/state/types"
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  CardHeader,
  ButtonGroup,
  Input
} from "@material-tailwind/react";
import { StatusButtons } from "./statusButtons";

type TaskCardReadProps = {
    id: number
    name: string
    description: string
    status: TaskStatusEnum
    deadline: Date
    onEdit: (id: number) => void
    onDelete: (id: number) => void
}

export const TaskCardRead: FC<TaskCardReadProps> = ({
  id,
  name,
  description,
  status,
  deadline,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="mt-6 max-w-[400px] w-full h-[500px]">
      <CardHeader floated={false} shadow={false} className="rounded-none min-h-fit">
        <StatusButtons status={status} canBeClicked={false} />
      </CardHeader>
      <CardBody className="contents">
        <Typography variant="h5" color="blue-gray" className="px-6 pt-6 mb-2">
          {name}
        </Typography>
        <Typography className="mx-6 mb-6 break-all sm:break-words overflow-y-auto max-h-full">
          {description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 mt-auto">
        <div className="mb-4">
          <Typography>
            Deadline:
          </Typography>
          <Input variant="standard" value={deadline.toISOString().split('T')[0]} readOnly/>
        </div>
        <ButtonGroup fullWidth>
          <Button onClick={() => onEdit(id)}>Edit</Button>
          <Button onClick={() => onDelete(id)}>Delete</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
