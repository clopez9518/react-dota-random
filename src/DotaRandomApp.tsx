import { RouterProvider } from "react-router"
import { appRouter } from "./app.router"

export const DotaRandomApp = () => {
  return (
    <RouterProvider router={appRouter} />
  )
}
