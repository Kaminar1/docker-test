/** @type {credentials} */
const creds = {
  client_id: "",
  client_secret: "",
}
const DATABASE_URL = ""

/** @type {Settings} */
const settings = {
  apiUrl: "/api",
  archiveRootDir: "archive",
  logsDir: "logs",
  downloaderCLI: "./TwitchDownloaderCLI",
  downloadsToRun: 10,
}

/** streamers to download vods from
 *
 * use https://api.twitch.tv/helix/users?login=username endpoint to find user_id.
 */
/** @type {StreamersFilter} */
const streamers = {
  Ria: {
    user_id: 560363490,
    include: ["*"],
    exclude: null,
  },
}

export { creds, DATABASE_URL, settings, streamers }
