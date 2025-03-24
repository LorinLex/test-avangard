import { Alert as MTAlert } from "@material-tailwind/react";
import { FC, PropsWithChildren } from "react";

type AlertProps = {
  className: string
}

export const Alert: FC<PropsWithChildren<AlertProps>> = ({ children, className = "" }) =>
  <div className={[
    "absolute",
    "h-screen",
    "w-screen",
    "flex",
    "place-content-center",
    "place-items-center",
  ].join(" ")}>
    <MTAlert className={`w-48 justify-end ${className}`}>{children}</MTAlert>
  </div>
