
export const isObjectEmpty = (object) => {
  for (let o in object)
    return false
  return true
}