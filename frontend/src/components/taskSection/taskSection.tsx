/*
That is too large component!
TODO: make hook for handling websockets
TODO: make alert manager
*/
import { FC, useContext, useEffect, useState } from "react";
import { Card, IconButton } from "@material-tailwind/react";
import useSWR from "swr";
import { getTaskList, TaskListPaginated, TaskRaw } from "../../lib/fetchers";
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
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription";
import { getWebSocket } from "../../core/webClient";
import { TaskStatusEnum } from "../../lib/state/types";
import { getEnumKeyByEnumValue } from "../../core/utils";
import { AlertHandler, Alert } from "../alert";

enum WsActionEnum {
  CREATED = "Created",
  UPDATED = "Updated",
  DELETED = "Deleted",
}

enum AlertType {
  NONE = "None",
  SUCCESS = "Success",
  ERROR = "Error"
}

type WsDataType = {
  action: WsActionEnum,
  data: TaskRaw | { id: number }
}


export const TaskSection: FC<{ userId: number }> = ({ userId }) => {
  const [ page, setPage ] = useState<number>(1)
  const [ openedId, setOpenedId ] = useState<number | undefined>()
  const [ isCreating, setCreating ] = useState<boolean>(false)
  const [ alertType, setAlertType ] = useState<AlertType>(AlertType.NONE)

  const { state } = useContext(StateContext)

  const { data: tasks, mutate: mutateTasks, isLoading } = useSWR(
    ["/tasks", page, state],
    ([ _, page, state]) => getTaskList({
      page,
      status: state.status,
      deadline: state.deadline,
      search_query: state.search_query
    })
  )

  const { data: wsData, error: wsError } = useSWRSubscription(
    () => "/ws/" + userId,
    (_, { next }: SWRSubscriptionOptions<WsDataType, Error>) => {
      const socket = getWebSocket(userId)
      socket.addEventListener('message', (event) => next(null, JSON.parse(event.data)))
      socket.addEventListener('error', (event) => next(event.error))
      return () => {
        // socket.close()
      }
    }
  )

  useEffect(() => {
    console.log(wsData)
    if (wsData === undefined || tasks === undefined) return
    switch (wsData.action) {
      case WsActionEnum.CREATED: {
        if ("deadline" in wsData.data) {
          mutateTasks({
            ...tasks,
            data: [
              ...tasks.data,
              {
                ...wsData.data,
                status: TaskStatusEnum[getEnumKeyByEnumValue(TaskStatusEnum, wsData.data.status)],
                deadline: new Date(wsData.data.deadline)
              }
            ]
          } as TaskListPaginated)
        }
        break;
      }

      case WsActionEnum.UPDATED:
        if ("deadline" in wsData.data) {
          const tasksWithoutUpdated = tasks.data.filter(
            (value) => value.id !== wsData.data.id
          )
          const data = {
            ...tasks,
            data: [
              ...tasksWithoutUpdated,
              {
                ...wsData.data,
                status: TaskStatusEnum[getEnumKeyByEnumValue(TaskStatusEnum, wsData.data.status)],
                deadline: new Date(wsData.data.deadline)
              }
            ]
          } as TaskListPaginated
          mutateTasks(data)
        }
        break;

      case WsActionEnum.DELETED:
        if (!("deadline" in wsData.data)) {
          const tasksWithoutDeleted = tasks.data.filter(
            (value) => value.id !== wsData.data.id
          )
          mutateTasks({
            ...tasks,
            data: tasksWithoutDeleted
          } as TaskListPaginated)
        }
        break;

      default:
        break;
    }

  }, [wsData])

  const getTaskData = (id: number) => {
    const task = tasks?.data.find((value) => value.id === id)
    console.log(typeof task)
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
      {openedId !== undefined && !isLoading ?
        <SingleCardWrapper onClose={() => setOpenedId(undefined)}>
          <TaskCard
            {...getTaskData(openedId)}
            onClose={() => setOpenedId(undefined)}
            onSuccess={() => setAlertType(AlertType.SUCCESS)}
          />
        </SingleCardWrapper>
      : ""}
      {isCreating ?
        <SingleCardWrapper onClose={() => setCreating(false)}>
          <TaskCardCreate onClose={() => setCreating(false)}/>
        </SingleCardWrapper>
      : ""}
      {alertType === AlertType.SUCCESS ? (
        <AlertHandler liveTime={1500} closeClb={() => setAlertType(AlertType.NONE)}>
          <Alert className="bg-green-600">Success!</Alert>
        </AlertHandler>
      ) : ""}
      {alertType === AlertType.ERROR ? (
        <AlertHandler liveTime={1500} closeClb={() => setAlertType(AlertType.NONE)}>
          <Alert className="bg-red-600">Error!</Alert>
        </AlertHandler>
      ) : ""}
      <div className="right-6 bottom-6 fixed">
        <IconButton size="lg" onClick={() => setCreating(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>
      </div>
    </>
  )
}