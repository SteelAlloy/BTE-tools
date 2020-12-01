/**
 * Coverts XML string to JSON
 * Ignores attributes
 * @param {JS String || java.util.String} xml
 */
export default function xmlToJson (xml) {
  // Create the return objects
  const obj = {}
  let copy = ''
  if (typeof xml === 'object') {
    // Convert to JS String
    copy = '' + xml
  } else {
    copy = xml
  }

  // copy = trimNewLine(copy)
  copy = copy.trim()

  // Remove xml prolog
  if (copy.startsWith('<?') || copy.startsWith('<!')) {
    let t = 0
    for (; t < copy.length; t++) {
      if (copy.charAt(t) === '>') { // ASCII Dec: 62 (>)
        break
      }
    }
    copy = copy.slice(t + 1, copy.length)
    copy = trimNewLine(copy)
    copy = copy.trim()
  }

  // Get tag name
  const first = getFirst(copy)

  // Get first tag with attributes
  let remove = getFirstTag(copy)

  // Remove first tag
  copy = copy.slice(remove.length, copy.length)
  copy = copy.trim()

  // Remove ending tag
  remove = '</' + first + '>'
  copy = copy.slice(0, copy.length - remove.length - 1)
  copy = copy.trim()

  copy = trimNewLine(copy)
  copy = copy.trim()

  // Contains childs
  if (copy.charAt(0) === '<') { // ASCII Dec: 60 (<)
    copy = trimNewLine(copy)
    obj[first] = {}
    obj[first] = getChildren(copy)
  } else {
    copy = trimNewLine(copy)
    obj[first] = copy.trim()
  }

  return obj
}

function getChildren (copy2) {
  const children = []
  const obj2 = {}
  copy2 = copy2.trim()
  copy2 = trimNewLine(copy2)
  while (copy2.startsWith('<')) {
    const first = getFirst(copy2)
    const firstTag = getFirstTag(copy2)

    // Remove first tag
    copy2 = trimNewLine(copy2)
    copy2 = copy2.slice(firstTag.length, copy2.length)
    copy2 = copy2.trim()
    copy2 = trimNewLine(copy2)

    const lastTag = '</' + first + '>'
    let lastIndex = -1
    let tagIndex = 0
    for (let f = 0; f < copy2.length; f++) {
      if (copy2[f] === lastTag[tagIndex]) {
        if (lastIndex === -1) {
          lastIndex = f
        }
        tagIndex += 1
        if (tagIndex === lastTag.length - 1) {
          break
        }
      } else {
        tagIndex = 0
        lastIndex = -1
      }
    }

    // Get first value
    let firstValue = copy2.slice(0, lastIndex)
    // Remove first value
    copy2 = copy2.slice(firstValue.length, copy2.length)
    // Remove lastTag
    copy2 = copy2.slice(lastTag.length, copy2.length)

    // Trim spaces and new lines
    copy2 = copy2.trim()
    copy2 = trimNewLine(copy2)
    firstValue.trim()
    firstValue = trimNewLine(firstValue)

    children.push({ tag: first, val: firstValue })
  }

  for (let c = 0; c < children.length; c++) {
    if (children[c].val.startsWith('<')) {
      if (typeof obj2[children[c].tag] === 'undefined') {
        obj2[children[c].tag] = getChildren(children[c].val)
      } else {
        if (typeof obj2[children[c].tag].push === 'undefined') {
          const prev = obj2[children[c].tag]
          obj2[children[c].tag] = []
          obj2[children[c].tag].push(prev)
        }
        obj2[children[c].tag].push(getChildren(children[c].val))
      }
    } else {
      obj2[children[c].tag] = children[c].val
    }
  }

  return obj2
}

function getFirst (copy3) {
  let first = ''
  for (let f = 1; f < copy3.length; f++) {
    if (copy3.charAt(f) === ' ' || (copy3.charAt(f - 1) !== ' ' && copy3.charAt(f) === '>')) { // ASCII Dec: 32 (Space) Dec: 62 (>)
      break
    }
    first += copy3.charAt(f).toString()
  }
  return first
}

function getFirstTag (copy4) {
  let firstTag = ''
  for (let f = 0; f < copy4.length; f++) {
    firstTag += copy4.charAt(f).toString()
    if (copy4.charAt(f) === '>') { // ASCII Dec: 62 (>)
      break
    }
  }
  return firstTag
}

function trimNewLine (value) {
  if (value !== ' ' || value.charAt(0) === '\n' || value.charAt(value.length() - 1) === '\n') { // ASCII Dec: 10 (NL)
    // Remove if new line at start
    if (value.charAt(0) === '\n') { // ASCII Dec: 10 (NL)
      value = value.slice(1, value.length)
    }
    if (value.charAt(value.length - 1) === '\n') { // ASCII Dec: 10 (NL)
      value = value.slice(0, value.length - 1)
      value = value.trim()
    }
    value = value.trim()
  } else {
    value = ''
  }
  return value
}
