const formatDate = (date) => {
  let hours = date.getHours()
  let mins = date.getMinutes()

  hours = (hours < 10 ? "0" : "") + hours
  mins = (mins < 10 ? "0" : "") + mins
  return `${hours}:${mins}`
}
const formatDateLong = (date) => {
  let dd = date.getDate()
  dd < 10 ? (dd = `0${dd}`) : null
  let mm = date.getMonth() + 1
  mm < 10 ? (mm = `0${mm}`) : null
  const yy = date.getFullYear().toString().substr(2)

  let hours = date.getHours()
  let mins = date.getMinutes()

  hours = (hours < 10 ? "0" : "") + hours
  mins = (mins < 10 ? "0" : "") + mins

  return `${dd}.${mm}.${yy} ${hours}:${mins}`
}
export { formatDate, formatDateLong }
