import fs, { read } from "fs"
import { readdir, access } from "fs/promises"
import mkdirp from "mkdirp"
import path from "path"
import { settings } from "../settings/config.js"
import { Logme } from "./logging.js"

const { archiveRootDir } = settings

// read archive folder -> return list of vod_id's that's finished downloading
export const getArchiveIds = async (channel) => {
  // archive dir per channel
  const channelDir = path.join(archiveRootDir, channel.name)

  // make directory for channel and chatlogs archive. this is recursive, so don't need channelDir first.
  const chatlogsDir = path.join(channelDir, "chatlogs")
  await ensureDirExists(chatlogsDir).catch((error) =>
    Logme.error(
      JSON.stringify({ stack: error?.stack, error: error }),
      `Could not create chatlogsDir=${chatlogsDir}.`
    )
  )

  // make thumbnail folder
  const thumbDir = path.join(channelDir, "thumbnails")
  await ensureDirExists(thumbDir).catch((error) =>
    Logme.error(
      JSON.stringify({ stack: error?.stack, error: error }),
      `Could not create chatlogsDir=${thumbDir}.`
    )
  )

  // read archive directory
  let files = await readdir(channelDir).catch(Logme.error)

  // filter out the files that are not .mp4 AND is a valid id as name. eg: 28347283947.mp4
  files = files
    .filter(
      (file) =>
        path.extname(file) === ".mp4" && /^[0-9]+$/.test(file.split(".mp4")[0])
    )
    .map((file) => file.split(".mp4")[0])

  // return list: ["28347283947", "345345345234"]
  return files
}

// function to create a directory if it does not exist
export const ensureDirExists = async (directory) => {
  await mkdirp(directory)
    .then((made) => {
      if (made)
        Logme.info(
          `Successfuly created dir. directory=${directory}, response=${made}`
        )
      // else Logme.debug(`Directory exists. directory=${directory}`)
    })
    .catch((error) =>
      Logme.error(
        JSON.stringify({ stack: error?.stack, error: error }),
        `Could not create directory=${directory}.`
      )
    )
}

/**
 * Check if a file exists
 * @param {string} file - file path
 * @returns {Promise<boolean>}
 */
export const checkFileExists = async (file) => {
  return access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
