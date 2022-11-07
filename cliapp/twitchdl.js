import { downloadChatLog } from "./utils/downloader.js"
import { Logme } from "./utils/logging.js"

console.log("🚀 starting...")

await downloadChatLog("Ria", "1645400243").catch(async (e) => {
  await Logme.error(e)
})
