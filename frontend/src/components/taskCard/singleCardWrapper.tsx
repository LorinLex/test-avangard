import { FC, PropsWithChildren } from "react";

type SingleCardWrapperProps = PropsWithChildren<{
  onClose: () => void
}>

export const SingleCardWrapper: FC<SingleCardWrapperProps> = ({
  children, onClose
}) =>
  <div className={[
    "absolute",
    "w-screen",
    "h-screen",
    "flex",
    "place-content-center",
    "place-items-center",
  ].join(" ")}>
    <div
      className={[
        "absolute",
        "h-screen",
        "w-screen",
        "bg-gray-900/50"
      ].join(" ")}
      onClick={onClose}
    />
    {children}
  </div>
