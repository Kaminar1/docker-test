import axios from "axios"
import { Paths } from "../settings/paths.js"
import { Logme } from "./logging.js"
import path from "path"
import fs from "fs"
import { spawn } from "child_process"
import { settings } from "../settings/config.js"

const { archiveRootDir, downloaderCLI } = settings

/**
 * function to download video thumbnails
 * @param  {string} url - url to download
 * @param  {string | number} video_id
 * @param  {string} channelName - channel name in which to save it. Should be Channel.name
 */
const downloadThumbnail = async (url, video_id, channelName) => {
  const dirs = Paths(channelName)
  const image_path = path.join(dirs.thumbnailsDir, `${video_id}.jpg`)

  //sauce: https://stackoverflow.com/a/51624229
  axios({
    url,
    responseType: "stream",
  })
    .then(
      (response) =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(image_path))
            .on("finish", () => resolve())
            .on("error", (e) => reject(e))
        })
    )
    .catch(
      async (error) =>
        await Logme.error(
          error,
          `Thumbnail download error for video_id=${video_id} from url=${url}`
        )
    )
}

const downloadVod = async (channelName, video_id) => {
  const dirs = Paths(channelName)

  const args = [
    "--mode VideoDownload",
    `--output ${path.join(dirs.channelDir, video_id + ".mp4")}`,
    `--id ${video_id}`,
    `--temp-path ${path.join(archiveRootDir, "temp")}`,
    `--ffmpeg-path ${path.join(path.dirname(downloaderCLI), "ffmpeg")}`,
  ]
  return new Promise(async (resolve, reject) => {
    try {
      await Logme.debug(`Spawning ${downloaderCLI} ${args.join(" ")}`)
      const child = spawn(downloaderCLI, args, {
        cwd: __dirname,
      })

      let stages = [
        "[STATUS] - Finalizing MP4 (3/3)",
        "[STATUS] - Combining Parts (2/3)",
        "[STATUS] - Downloading 100% (1/3)",
        "[STATUS] - Downloading 75% (1/3)",
        "[STATUS] - Downloading 50% (1/3)",
        "[STATUS] - Downloading 25% (1/3)",
        "[STATUS] - Downloading 0% (1/3)",
      ]
      child.stdout.on("data", async (data) => {
        // console.log(`stdout: ${JSON.stringify(data.toString().trim())}`)
        const output = data.toString().trim()

        if (stages.includes(output)) {
          if (output === stages[6])
            await Logme.info(`Download started. video_id='${video_id}'`)

          await Logme.debug(output)
          stages.pop()
        }
      })

      child.stderr.on(
        "data",
        async (data) =>
          await Logme.error(
            "TwitchDownloaderCLI child",
            `stderr on spawn=${child}, data=${data}`
          )
      )

      child.on("close", async (code) => {
        if (code === 0) {
          await Logme.info(
            `Child process for VideoDownload finished successfully.`
          )
          resolve(true)
        } else {
          await Logme.error(
            `TwitchDownloaderCLI VideoDownload child`,
            `child process closed with code ${code}`
          )
          return reject(false)
        }
      })
    } catch (error) {
      //fixme: this does not get logged
      await Logme.error(
        error,
        `Exception: TwitchDownloaderCLI --mode VideoDownload location=${downloaderCLI}, `
      )
      throw error
    }
  })
}
/** Start to download the chatlog for a vod
 * @param  {string} channelName
 * @param  {string | number} video_id
 */
const downloadChatLog = async (channelName, video_id) => {
  const dirs = Paths(channelName)

  const args = [
    "--mode ChatDownload --embed-emotes",
    `--output ${path.join(dirs.chatlogDir, video_id)}.json`,
    `--id ${video_id}`,
    `--temp-path ${path.join(archiveRootDir, "temp")}`,
  ]

  return new Promise(async (resolve, reject) => {
    try {
      await Logme.debug(`Spawning ${downloaderCLI} ${args.join(" ")}`)

      const child = spawn(downloaderCLI, args, {
        cwd: downloaderCLI,
      })

      // child.stdout.on("data", (data) => {
      //   const output = data.toString().trim()
      //   await Logme.debug(output)
      // })

      child.stderr.on(
        "data",
        async (data) =>
          await Logme.error(
            "TwitchDownloaderCLI child",
            `stderr on spawn=${child}, data=${data}`
          )
      )

      child.on("close", async (code) => {
        if (code === 0) {
          await Logme.info(
            `Child process for ChatDownload finished successfully.`
          )
          resolve(true)
        } else {
          await Logme.error(
            `TwitchDownloaderCLI ChatDownload child`,
            `child process closed with code ${code}`
          )
          return reject(false)
        }
      })
    } catch (error) {
      //fixme: this does not get logged
      await Logme.error(
        error,
        `Exception: TwitchDownloaderCLI.exe --mode ChatDownload location=${downloaderCLI}, `
      )
      throw error
    }
  })
}

// test
// downloadChatLog(Channels.ria.name, "1443128160")
//   .then(console.log)
//   .catch(console.error("something went wrong"))

export { downloadVod, downloadThumbnail, downloadChatLog }
