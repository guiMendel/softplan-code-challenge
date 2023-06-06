export interface Highlightable {
  text: string
  startIndex?: number
  length?: number
}

export const highlight = (highlightable: Highlightable) => {
  if (
    highlightable.startIndex == undefined ||
    highlightable.startIndex < 0 ||
    highlightable.length == undefined ||
    highlightable.length <= 0
  )
    return highlightable.text

  return `${highlightable.text.slice(
    0,
    highlightable.startIndex
  )}<em class="highlight">${highlightable.text.slice(
    highlightable.startIndex,
    highlightable.startIndex + highlightable.length
  )}</em>${highlightable.text.slice(highlightable.startIndex + highlightable.length)}`
}
