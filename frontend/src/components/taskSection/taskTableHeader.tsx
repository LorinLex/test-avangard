import { Typography } from "@material-tailwind/react";
import { FC } from "react";

export const TaskTableHeader: FC = () => {
  const classes = [
    "border-b",
    "border-gray-300",
    "pb-4",
    "pt-10",
    "px-2",
  ].join(" ")
  return (
    <thead>
      <tr className="table table-fixed w-full">
        <th className={`${classes} w-[50%] sm:w-[25%]`}>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-bold leading-none"
          >
            Name
          </Typography>
        </th>
        <th className={`${classes} hidden sm:table-cell`}>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-bold leading-none"
          >
            Description
          </Typography>
        </th>
        <th className={`${classes} w-[25%] sm:w-[15%]`}>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-bold leading-none"
          >
            Status
          </Typography>
        </th>
        <th className={`${classes} w-[25%] sm:w-[15%]`}>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-bold leading-none"
          >
            Deadline
          </Typography>
        </th>
      </tr>
    </thead>
  )
}
