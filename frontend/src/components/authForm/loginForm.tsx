import { FC, useState } from "react"
import { Button, Card, Typography, Input, CardBody, CardFooter } from "@material-tailwind/react";
import { authFetch } from "../../lib/fetchers";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { EMAIL_REGEXP } from "../../core/utils";
import { AuthError } from "../../lib/error";

type LoginFormInput = {
  email: string
  password: string
}

export const LoginForm: FC = () => {
  const [ errorMsg, setErrorMsg ] = useState<string | undefined>()
  const [ success, setSuccess ] = useState<boolean>(false)

  const methods = useForm<LoginFormInput>({
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  })

  const {
    control,
    handleSubmit,
    formState: { isValid, isLoading },
  } = methods
  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      await authFetch(data)
      setSuccess(true)
      setErrorMsg(undefined)
    } catch (e) {
      if (e instanceof AuthError) {
        setSuccess(false)
        setErrorMsg(e.message)
      } else {
        setSuccess(false)
        setErrorMsg("Something went wrong...")
        console.error(e)
      }
    }
  }

  return (
    <Card className="w-full" color="transparent" shadow={false}>
      <FormProvider {...methods}>
        <CardBody className="flex flex-col gap-4">
          <Controller
            name="email"
            control={control}
            rules={{ required: true, pattern: EMAIL_REGEXP }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                label="Email"
                size="lg"
                error={invalid}
                {...field}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: true, pattern: /.+/ }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                label="Password"
                size="lg"
                error={invalid}
                {...field}
              />
            )}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" color="green">{success && "Success!"}</Typography>
          <Typography variant="small" color="red">{errorMsg}</Typography>
          <Button
            disabled={!isValid}
            loading={isLoading}
            variant="gradient"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            Login
          </Button>
        </CardFooter>
      </FormProvider>
    </Card>
  )
}
