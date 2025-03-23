import useSWR from 'swr'
import { AuthForm } from './components/authForm/authForm'
import { meFetch } from './lib/fetchers'
import { TaskSection } from './components/taskList'
import { Spinner } from '@material-tailwind/react'

function App() {
  const { data: user, isLoading, mutate, error } = useSWR("/user/me", meFetch, {
    shouldRetryOnError: false
  })
  return (
    <div className={[
      "h-screen",
      "w-screen",
      "flex",
      "place-content-center",
      "place-items-center"
    ].join(" ")}>
      {isLoading && (
        <div className={[
          "absolute",
          "h-screen",
          "w-screen",
          "flex",
          "place-content-center",
          "place-items-center",
          "z-50",
          "bg-white/80"
        ].join(" ")}>
          <Spinner className="h-12 w-12" />
        </div>
      )}
      {user !== undefined ? <TaskSection /> : (
        <AuthForm onLogin={() => mutate()} />
      )}
    </div>
  )
}

export default App
