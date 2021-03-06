import { findSVGs } from './find-svgs'

class SVG {
  constructor(ele, url = null, type) {
    this.ele = ele
    this.url = url
    this.type = type
  }

  // get svg XML info from el with URL
  async getXML() {
    let serializer = new XMLSerializer()
    let parser = new DOMParser()

    if (this.url) {
      let response = await fetch(this.url, { mode: 'no-cors' })

      if (response.type === 'opaque') {
        this.svgString = ''
        this.svgXml = this.ele
        return
      }

      const xml = parser.parseFromString(response.text(), 'image/svg+xml')
        .children[0]
      const string = serializer.serializeToString(xml)
      this.svgString = string
      this.svgXml = xml
    } else {
      this.svgString = this.ele.eleString
      this.svgXml = this.ele
    }
  }

  // Set size attributes to svg viewBox attr dynamically for better render in card
  async cleanupXML() {
    let viewBoxHeight
    let viewBoxWidth

    if (this.svgXml.viewBox) {
      viewBoxWidth = this.svgXml.viewBox.baseVal.width
      viewBoxHeight = this.svgXml.viewBox.baseVal.height
    } else {
      viewBoxWidth = this.ele.width
      viewBoxHeight = this.ele.height
      console.log(`${viewBoxWidth}x${viewBoxHeight}`)
    }

    this.rects = `${viewBoxWidth}x${viewBoxHeight}`
    this.cleanXml = this.svgXml.cloneNode(true)
    this.cleanXml.setAttribute('class', 'gob__card__svg__trick')
    this.cleanXml.removeAttribute('height')
    this.cleanXml.removeAttribute('width')
    this.cleanXml.removeAttribute('style')
    this.cleanXml.hasAttribute('viewBox')
      ? ''
      : this.cleanXml.setAttribute(
          'viewBox',
          `0 0 ${viewBoxHeight} ${viewBoxWidth}`
        )
    this.cleanXml.getAttribute('viewBox') === '0 0 0 0'
      ? this.cleanXml.setAttribute('viewBox', `0 0 24 24`)
      : null
    this.cleanXml.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  }

  async checkForWhite() {
    const whiteStrings = ['white', '#FFF', '#FFFFFF', '#fff', '#ffffff']
    for (const string of whiteStrings) {
      this.svgString.includes(string) ? (this.hasWhite = true) : null
    }
  }

  async checkForFill() {
    if (
      this.svgString.includes('fill=') &&
      !this.svgString.includes('fill="none"')
    ) {
      null
    } else {
      this.cleanXml.setAttribute('fill', '#232323')
    }
  }
}

export async function organizeSVGs() {
  let allSVGs = findSVGs()

  // Create SVG classes
  allSVGs = allSVGs.map(async i => {
    const newEl = new SVG(i, i.url, i.type)
    await newEl.getXML()
    await newEl.cleanupXML()
    await newEl.checkForWhite()
    await newEl.checkForFill()
    return newEl
  })
  allSVGs = await Promise.all(allSVGs)
  // console.log(allSVGs)
  return allSVGs
}
