import path from "path"
import { ensureDirExists } from "../utils/fileHandler.js"
import { settings } from "./config.js"

const { archiveRootDir, logsDir } = settings

//make sure directories exist
;(async () => {
  await ensureDirExists(logsDir)
  await ensureDirExists(archiveRootDir)
})()

/** Object to get paths from channelName
 * @param {string} channelName
 * @property {string} channelDir
 * @property {string} chatlogDir
 * @property {string} thumbnailsDir
 */
const Paths = (channelName) => ({
  channelDir: path.join(archiveRootDir, channelName),
  chatlogDir: path.join(archiveRootDir, channelName, "chatlogs"),
  thumbnailsDir: path.join(archiveRootDir, channelName, "thumbnails"),
})

export { Paths }
