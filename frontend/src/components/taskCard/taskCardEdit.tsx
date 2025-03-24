import { FC, useState } from "react"
import { TaskStatusEnum } from "../../lib/state/types"
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  CardHeader,
  ButtonGroup,
  Input,
  Textarea
} from "@material-tailwind/react";
import { StatusButtons } from "./statusButtons";
import Datepicker from "react-tailwindcss-datepicker";
import { TaskEdit } from "../../lib/fetchers";

type TaskCardEditProps = {
    id: number
    name: string
    description: string
    status: TaskStatusEnum
    deadline: Date
    onSave: (data: TaskEdit) => void
}

export const TaskCardEdit: FC<TaskCardEditProps> = ({
  name,
  description,
  status,
  deadline,
  onSave
}) => {
  const [ newStatus, setNewStatus ] = useState<TaskStatusEnum>(status)
  const [ newName, setNewName ] = useState<string>(name)
  const [ newDesc, setNewDesc ] = useState<string>(description)
  const [ newDeadline, setNewDeadline ] = useState<Date | null>(deadline)

  const saveCard = () => {
    onSave({
      status: newStatus,
      name: newName,
      description: newDesc,
      deadline: newDeadline || undefined
    })
  }

  return (
    <Card className="mt-6 max-w-[400px] w-full h-[500px]">
      <CardHeader floated={false} shadow={false} className="rounded-none min-h-fit">
        <StatusButtons
          status={newStatus}
          canBeClicked={true}
          setStatus={setNewStatus}
        />
      </CardHeader>
      <CardBody className="contents">
        <div className="px-6 mt-2">
          <Input
            name="name"
            placeholder="Name"
            label="Name"
            value={newName}
            onChange={(val) => setNewName(val.currentTarget.value)}
            className="!text-xl font-semibold leading-snug tracking-normal"
            variant="standard"
            containerProps={{
              className: "!min-w-0"
            }}
          />
        </div>
        <div className="mt-2 mb-6 px-6 h-full">
          <Textarea
            name="description"
            label="Description"
            value={newDesc}
            onChange={(val) => setNewDesc(val.currentTarget.value)}
            variant="standard"
            className="h-full mt-0 !text-base"
            containerProps={{
              className: "h-full w-full"
            }}
            labelProps={{
              className: "top-0 pb-1.5"
            }}
          />
        </div>
      </CardBody>
      <CardFooter className="pt-0 mt-auto">
        <div className="mb-4">
          <Typography>
            Deadline:
          </Typography>
          <Datepicker
            asSingle={true}
            useRange={false}
            value={{
              startDate: newDeadline,
              endDate: newDeadline
            }}
            inputClassName={[
              "transition-all",
              "duration-300",
              "py-2.5",
              "pr-14",
              "pl-0",
              "w-full",
              "border-b",
              "border-gray-400",
              "tracking-wide",
              "font-light",
              "text-sm",
              "placeholder-gray-400",
            ].join(" ")}
            readOnly={true}
            displayFormat="DD/MM/YYYY"
            onChange={(val) => setNewDeadline(val?.startDate || null)}
          />
        </div>
        <ButtonGroup fullWidth>
          <Button onClick={saveCard}>Save</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
