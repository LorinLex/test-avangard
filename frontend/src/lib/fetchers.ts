import { get_axios_config } from "../core/httpClient"
import { Fetcher } from 'swr'
import axios from "axios"
import { getEnumKeyByEnumValue } from "../core/utils"
import { AuthError, SignInError } from "./error"
import { DeadlineEnum, TaskStatusEnum } from "./state/types"


type UserAuth = {
    email: string
    password: string
}

type UserCreate = UserAuth & {
  username: string
}

type UserPublic = {
    id: number
    email: string
    username: string
}


export const authFetch: Fetcher<void, UserAuth> = async (data) => {
  try {
    const response = await axios.post("/user/auth", data, get_axios_config())
    const token = response.data["token"]
    if (token) {
      localStorage.setItem("Authorization", token)
    } else {
      console.log("No auth token from backend!")
    }
  } catch (e) {
    throw new AuthError("Bad email or password!")
  }
}

export const signInFetch: Fetcher<void, UserCreate> = async (data) => {
  try {
    await axios.post("/user/register", data, get_axios_config())
  } catch (e) {
    throw new SignInError("Bad credentials!")
  }
}

export const meFetch: Fetcher<UserPublic> = async () => {
  try {
    const response = await axios.get("/user/me", get_axios_config())
    return response.data
  } catch (e) {
    throw new SignInError("Bad credentials!")
  }
}

type TaskRaw = {
  id: number
  name: string
  description: string
  status: string,
  deadline: string
}

type Task = {
  id: number
  name: string
  description: string
  status: TaskStatusEnum,
  deadline: Date
}

export type TaskCreate = {
  name: string
  description: string
  status: TaskStatusEnum,
  deadline: Date
}

export type TaskEdit = {
  name?: string
  description?: string
  status?: TaskStatusEnum,
  deadline?: Date
}

type TaskListPaginatedRaw = {
  page: number,
  size: number,
  total: number,
  data: TaskRaw[]
}

type TaskListPaginated = {
  page: number,
  size: number,
  total: number,
  data: Task[]
}

export const getTaskList: Fetcher<
  TaskListPaginated,
  {
    page: number,
    status: TaskStatusEnum,
    deadline: DeadlineEnum,
    search_query: string
  }
> = async ({ page, status, deadline }) => {
  const page_size = 10
  let url = `/task?page=${page}&size=${page_size}`
  if (status !== TaskStatusEnum.ALL)
    url += `&status=${status}`
  if (deadline !== DeadlineEnum.ALL)
    url += `&deadline=${deadline}`

  const response = await axios.get<TaskListPaginatedRaw>(url, get_axios_config())
  const processedTasksData: Task[] = response.data.data.map((value) => {
    return {
      ...value,
      status: TaskStatusEnum[getEnumKeyByEnumValue(TaskStatusEnum, value.status)],
      deadline: new Date(value.deadline)
    }
  })
  return {
    ...response.data,
    data: processedTasksData
  }
}

export const createTask: Fetcher<void, TaskCreate> = async (data) => {
  const url = '/task'

  try {
    await axios.post(url, {
      ...data,
      deadline: data.deadline.toISOString().split('T')[0]
    }, get_axios_config())
  } catch (e) {
    console.error(e)
  }
}

export const editTask: Fetcher<void, {
  id: number, data: TaskEdit
}> = async ({ id, data }) => {
  const url = `/task/${id}`
  let processed_data;
  if ("deadline" in data && data.deadline !== undefined) {
    processed_data = {
      ...data,
      deadline: data.deadline.toISOString().split('T')[0]
    }
  } else {
    processed_data = data
  }

  try {
    await axios.put(url, processed_data, get_axios_config())
  } catch (e) {
    console.error(e)
  }
}

export const deleteTask: Fetcher<void, { id: number }> = async ({ id }) => {
  const url = `/task/${id}`

  try {
    await axios.delete(url, get_axios_config())
  } catch (e) {
    console.error(e)
  }
}