import { FC, PropsWithChildren } from "react";

export const TaskTable: FC<PropsWithChildren> = ({ children }) =>
  <div className="h-full min-h-1">
    <table className="h-full table-fixed text-left text-nowrap">
      {children}
    </table>
  </div>