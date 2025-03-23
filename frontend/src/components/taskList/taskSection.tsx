import { FC, useContext, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import useSWR from "swr";
import { getTaskList } from "../../lib/fetchers";
import { Pagination } from "./pagination";
import { StateContext } from "../../lib/state/context";
import { SearchAndFilter } from "./search";

const TABLE_HEAD = [
  "name",
  "description",
  "status",
  "deadline"
]

export const TaskSection: FC = () => {
  const [ page, setPage ] = useState(1)

  const { state } = useContext(StateContext)

  const { data: tasks, isLoading, error, mutate } = useSWR(
    ["/tasks", page, state],
    ([ _, page, state]) => getTaskList({
      page,
      status: state.status,
      deadline: state.deadline
    })
  )

  let total_pages = 1
  if (tasks !== undefined) {
    total_pages = tasks.total / tasks.size
  }

  return (
    <Card className="h-full w-full flex px-6 py-6">
      <SearchAndFilter />
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className={[
                "border-b",
                "border-gray-300",
                "pb-4",
                "pt-10",
                head === "description" ? "hidden sm:table-cell" : ""
              ].join(" ")}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks?.data.map(({ id, name, description, status, deadline }, index) => {
            const isLast = index === tasks?.data.length - 1;
            const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";

            return (
              <tr key={name} className="hover:bg-gray-50">
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={`${classes} hidden sm:table-cell`}>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {description}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {status}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {deadline}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="self-center mt-auto">
        <Pagination total_pages={total_pages} current={page} setCurrent={setPage} />
      </div>
    </Card>
  )
}