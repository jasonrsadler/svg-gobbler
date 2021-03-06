import { closeIcon, gobLogo, feedbackIcon } from './icons'
import { createCards } from './create-card'
import { globalActions } from './global'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

// Element creation helper
function createElement(el, elClass) {
  const i = document.createElement(el)
  i.className = elClass
  return i
}

const struct = {
  // Foundation
  globalContainer: 'gob',
  header: 'gob__header',
  container: 'gob__container',
  overlay: 'gob__overlay',
  logoContainer: 'gob__logoCont',
  countContainer: 'gob__countCont',
  // Header
  logo: 'gob__logo',
  count: 'gob__count--svg',
  downloadAll: 'gob__download',
  feedback: 'gob__feedback',
  close: 'gob__close',
}

export const createUI = svgInfo => {
  const gobbler = createElement('div', struct.globalContainer)
  document.body.insertAdjacentElement('beforebegin', gobbler)

  // Create structure
  const header = createElement('div', struct.header)
  const container = createElement('div', struct.container)
  const overlay = createElement('div', struct.overlay)
  const logoCont = createElement('div', struct.logoContainer)
  const countCont = createElement('div', struct.countContainer)

  // Form structure
  gobbler.appendChild(header)
  gobbler.appendChild(container)
  gobbler.appendChild(overlay)
  header.appendChild(logoCont)
  header.appendChild(countCont)

  // Create SVG Counter
  function isPlural() {
    return svgInfo.length === 1
      ? `Download the ${svgInfo.length} SVG`
      : `Download all ${svgInfo.length} SVGs`
  }

  // Create header
  const gobLogoEl = createElement('div', struct.logo)
  gobLogoEl.innerHTML = gobLogo
  logoCont.appendChild(gobLogoEl)
  const gobCount = createElement('button', struct.count)
  gobCount.innerHTML = isPlural()
  countCont.appendChild(gobCount)
  gobCount.addEventListener('click', () => {
    var zip = new JSZip()
    svgInfo.forEach((svg, index) => {
      zip.file(`svg-${index}.svg`, svg.svgString)
    })
    zip.generateAsync({ type: 'blob' }).then(function(content) {
      FileSaver.saveAs(content, 'gobbled_svgs.zip')
    })
  })
  const gobFeedback = createElement('div', struct.feedback)
  gobFeedback.innerHTML = feedbackIcon
  countCont.appendChild(gobFeedback)
  const gobClose = createElement('div', struct.close)
  gobClose.innerHTML = closeIcon
  countCont.appendChild(gobClose)

  // Smooth load header
  setTimeout(() => {
    header.classList.add('gob__header--show')
  }, 80)

  createCards(svgInfo, container)
  globalActions()
}
