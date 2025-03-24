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
import { createTask } from "../../lib/fetchers";

type TaskCardCreateProps = {
  onClose: () => void
}

export const TaskCardCreate: FC<TaskCardCreateProps> = ({ onClose }) => {
  const [ status, setStatus ] = useState<TaskStatusEnum>(TaskStatusEnum.NEW)
  const [ name, setName ] = useState<string>("")
  const [ desc, setDesc ] = useState<string>("")
  const [ deadline, setDeadline ] = useState<Date>(new Date(Date.now()))

  const createCard = () => {
    createTask({
      status: status,
      name: name,
      description: desc,
      deadline: deadline
    })
    onClose()
  }

  return (
    <Card className="mt-6 max-w-[400px] w-full h-[500px]">
      <CardHeader floated={false} shadow={false} className="rounded-none min-h-fit">
        <StatusButtons
          status={status}
          canBeClicked={true}
          setStatus={setStatus}
        />
      </CardHeader>
      <CardBody className="contents">
        <div className="px-6 mt-2">
          <Input
            name="name"
            label="Name"
            value={name}
            // labelProps={}
            onChange={(val) => setName(val.currentTarget.value)}
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
            value={desc}
            onChange={(val) => setDesc(val.currentTarget.value)}
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
              startDate: deadline,
              endDate: deadline
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
            displayFormat="YYYY-MM-DD"
            popoverDirection="up"
            onChange={(val) => val?.startDate && setDeadline(val?.startDate)}
          />
        </div>
        <ButtonGroup fullWidth>
          <Button onClick={createCard}>Create</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
