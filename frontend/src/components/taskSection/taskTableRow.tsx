import { Typography } from "@material-tailwind/react";
import { FC, PropsWithChildren } from "react";
import { TaskStatusEnum } from "../../lib/state/types";

type TaskTableRowProps = {
  id: number
  name: string
  description: string
  status: TaskStatusEnum
  deadline: Date
  isLast: boolean
  onClick: () => void
}

export const TaskTableRow: FC<TaskTableRowProps> = ({
  id,
  name,
  description,
  status,
  deadline,
  isLast,
  onClick
}) => {
  const tdClasses = [
    "py-4",
    "px-2",
    isLast ? "" : "border-b border-gray-300"
  ].join(" ")

  const typoClasses = [
    "overflow-ellipsis",
    "overflow-hidden",
  ].join(" ")

  return (
    <tr key={name} className="hover:bg-gray-50 table table-fixed w-full" onClick={onClick}>
      <td className={`${tdClasses} w-[50%] sm:w-[25%]`}>
        <Typography
          variant="small"
          color="blue-gray"
          className={`font-bold ${typoClasses}`}
        >
          {name}
        </Typography>
      </td>
      <td className={`${tdClasses} hidden sm:table-cell`}>
        <Typography
          variant="small"
          className={`font-normal text-gray-600 ${typoClasses}`}
        >
          {description}
        </Typography>
      </td>
      <td className={`${tdClasses} w-[25%] sm:w-[15%]`}>
        <Typography
          variant="small"
          className={`font-normal text-gray-600 ${typoClasses}`}
        >
          {status}
        </Typography>
      </td>
      <td className={`${tdClasses} w-[25%] sm:w-[15%]`}>
        <Typography
          variant="small"
          className={`font-normal text-gray-600 ${typoClasses}`}
        >
          {deadline.toISOString().split('T')[0]}
        </Typography>
      </td>
    </tr>
  )
}
