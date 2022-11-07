import fs from "fs"
import { appendFile, open } from "fs/promises"
import path from "path"
import { settings } from "../settings/config.js"
import { formatDateLong } from "./dateFormatter.js"
import { ensureDirExists } from "./fileHandler.js"

const { logsDir } = settings

const loggingTypes = {
  info: "INFO",
  error: "ERROR",
  debug: "DEBUG",
  fatalError: "FATAL ERROR",
}

//funtion that should write this to file with timestamps
const logme = async (loggingType, message) => {
  await ensureDirExists(logsDir)

  const filePath = path.join(logsDir, "test.log")
  const s = `[${formatDateLong(new Date())}][${loggingType}] ${message}`
  // console.log(s)
  // append to log file
  await appendFile(filePath, `\n${s}`).catch((error) => {
    console.error("Could not append to file :c")
    throw new Error(error)
  })
}

export const Logme = {
  error: (error, message) => {
    logme(
      loggingTypes.error,
      `${JSON.stringify({
        message: error?.message,
        options: error?.options,
        fileName: error?.fileName,
        lineNumber: error?.lineNumber,
        columnNumber: error?.columnNumber,
        stack: error?.stack,
      })}${JSON.stringify({ message })}`
    )
    console.error(error)
  },
  info: (message) => {
    logme(
      loggingTypes.info,
      `${JSON.stringify({
        message,
      })}`
    )
    console.log(message)
  },
  debug: (message) => {
    logme(
      loggingTypes.debug,
      `${JSON.stringify({
        message,
      })}`
    )
    console.log(message)
  },
  debugc: (message) => {
    logme(loggingTypes.debug, message)
    console.log(message)
  },
}

//? add log entries to database?
