import { format } from "date-fns"

export const formatTime = (date) => format(new Date(date), "h:mm b")
export const formatDate = (date) => format(new Date(date), "EE dd-MM-yyyy")
