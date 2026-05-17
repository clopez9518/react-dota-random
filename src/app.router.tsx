import { createBrowserRouter } from "react-router";
import { HomePage } from "./app/pages/HomePage";


export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    }
])