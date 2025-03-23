import { get_axios_config, get_headers } from "../core/httpClient"
import useSWR, { Fetcher } from 'swr'
import axios from "axios"
import { setCookie } from "../core/utils"
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

type Task = {
  id: number
  name: string
  description: string
  status: string,
  deadline: string
}

type TaskListPaginated = {
  page: number,
  size: number,
  total: number,
  data: Task[]
}


export const getTaskList: Fetcher<
  TaskListPaginated, {
    page: number,
    status: TaskStatusEnum,
    deadline: DeadlineEnum,
    search_query: string
  }> = async ({ page, status, deadline }) => {
    const page_size = 5
    let url = `/task?page=${page}&size=${page_size}`
    if (status !== TaskStatusEnum.ALL)
      url += `&status=${status}`
    if (deadline !== DeadlineEnum.ALL)
      url += `&deadline=${deadline}`

    try {
      const response = await axios.get(url, get_axios_config())
      return response.data
    } catch (e) {
      console.error(e)
    }
  }