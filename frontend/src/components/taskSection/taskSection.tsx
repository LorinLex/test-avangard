import { FC, useContext, useState } from "react";
import { Card, IconButton } from "@material-tailwind/react";
import useSWR from "swr";
import { getTaskList } from "../../lib/fetchers";
import { Pagination } from "./pagination";
import { StateContext } from "../../lib/state/context";
import { SearchAndFilter } from "./search";
import { TaskTable } from "./taskTable";
import { TaskTableHeader } from "./taskTableHeader";
import { TaskTableBody } from "./taskTableBody";
import { TaskTableRow } from "./taskTableRow";
import { SingleCardWrapper, TaskCard } from "../taskCard";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TaskCardCreate } from "../taskCard/taskCardCreate";

export const TaskSection: FC = () => {
  const [ page, setPage ] = useState<number>(1)
  const [ openedId, setOpenedId ] = useState<number | undefined>()
  const [ isCreating, setCreating ] = useState<boolean>(false)

  const { state } = useContext(StateContext)

  const { data: tasks } = useSWR(
    ["/tasks", page, state],
    ([ _, page, state]) => getTaskList({
      page,
      status: state.status,
      deadline: state.deadline,
      search_query: state.search_query
    })
  )

  const getTaskData = (id: number) => {
    const task = tasks?.data.find((value) => value.id === id)
    if (task === undefined)
      throw new Error("Tasks not loaded")
    return task
  }

  let total_pages = 1
  if (tasks !== undefined) {
    total_pages = tasks.total / tasks.size
  }

  return (
    <>
      <Card className="h-full w-full flex px-6 py-6">
        <SearchAndFilter />
        <TaskTable>
          <TaskTableHeader />
          <TaskTableBody>
            {tasks?.data.map((taskData, index) =>
              <TaskTableRow
                key={`${taskData.id}_${taskData.name}_task`}
                {...taskData}
                isLast={index === tasks?.data.length - 1}
                onClick={() => setOpenedId(taskData.id)}
              />
            )}
          </TaskTableBody>
        </TaskTable>
        <div className="self-center mt-auto pt-4">
          <Pagination total_pages={total_pages} current={page} setCurrent={setPage} />
        </div>
      </Card>
      {openedId !== undefined ?
        <SingleCardWrapper onClose={() => setOpenedId(undefined)}>
          <TaskCard {...getTaskData(openedId)} onClose={() => setOpenedId(undefined)}/>
        </SingleCardWrapper>
      : ""}
      {isCreating ?
        <SingleCardWrapper onClose={() => setCreating(false)}>
          <TaskCardCreate onClose={() => setCreating(false)}/>
        </SingleCardWrapper>
      : ""}
      <div className="right-6 bottom-6 fixed">
        <IconButton size="lg" onClick={() => setCreating(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>
      </div>
    </>
  )
}