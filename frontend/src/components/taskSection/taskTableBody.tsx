import { FC, PropsWithChildren } from "react";

export const TaskTableBody: FC<PropsWithChildren> = ({ children }) =>
    <tbody className="overflow-y-auto block min-h-1 h-full">
      {children}
    </tbody>
