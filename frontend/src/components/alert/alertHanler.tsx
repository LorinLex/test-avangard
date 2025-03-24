import { FC, PropsWithChildren, useEffect } from "react";

type AlertHandlerProps = {
  liveTime: number
  closeClb: () => void
}

export const AlertHandler: FC<PropsWithChildren<AlertHandlerProps>> = ({
  liveTime,
  closeClb,
  children
}) => {
  useEffect(() => {
    setTimeout(closeClb, liveTime)
  }, [])

  return children
}
