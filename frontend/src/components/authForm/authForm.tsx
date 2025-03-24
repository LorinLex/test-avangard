import { FC, useState } from "react"
import { Card, Tabs, TabsHeader, Tab, TabsBody, TabPanel } from "@material-tailwind/react";
import { LoginForm } from "./loginForm";
import { SignInForm } from "./signInForm";


enum FormTypeEnum {
  LOGIN = "login",
  SIGN_IN = "sign in"
}


export const AuthForm: FC<{
  onLogin: () => void
}> = ({ onLogin }) => {
  const [ formType, setFormType ] = useState<FormTypeEnum>(FormTypeEnum.SIGN_IN)

  return (
    <Card className="w-96">
      <Tabs value={formType} className="">
        <TabsHeader className="">
          <Tab
            value={FormTypeEnum.LOGIN}
            onClick={() => setFormType(FormTypeEnum.LOGIN)}
          >
            Login
          </Tab>
          <Tab
            value={FormTypeEnum.SIGN_IN}
            onClick={() => setFormType(FormTypeEnum.SIGN_IN)}
          >
            Sign in
          </Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value={FormTypeEnum.LOGIN}>
            <LoginForm successClb={onLogin} />
          </TabPanel>
          <TabPanel value={FormTypeEnum.SIGN_IN}>
            <SignInForm successClb={() => setFormType(FormTypeEnum.LOGIN)}/>
          </TabPanel>
        </TabsBody>
      </Tabs>
    </Card>
  )
}
