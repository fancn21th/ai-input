import { useRef, useEffect } from 'react'

/**
 * // 交互-首次进入模板是，光标在第一个模板框内。且tab键可以切换文本框的选择
 * @returns
 */
export const useTabSwitch = (type) => {
  const emptyTextSpans = useRef([])
  const forceIndex = useRef(0)

  const forceHandel = () => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(emptyTextSpans.current[forceIndex.current])
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') return
    event.preventDefault()
    event.stopPropagation()

    const length = emptyTextSpans.current.length
    if (forceIndex.current < length - 1) forceIndex.current += 1
    else forceIndex.current = 0
    forceHandel()
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      emptyTextSpans.current = Array.from(document.querySelectorAll('[data-empty-text-span]'))
      if (emptyTextSpans.current.length <= 0) return
      forceHandel()
    }, 100)
    return () => {
      clearTimeout(timeout)
    }
  }, [type])

  return { handleKeyDown }
}

/**
 * content内容相关，为了editor.getText()
 */
export const useContent = (type, updateAttributes) => {
  // 特殊处理模板里面的span标签（带边框的模拟input输入框）删除最后一个字符的时候span也被删除了 应该是删除最后一个字符显示占位符 再删除才删除span
  const delectHandel = (e) => {
    if (e.key === 'Backspace') {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const element = range.startContainer
      const borderSpan = element.parentElement?.closest('.lastnotdeleted')
      if (borderSpan && borderSpan.textContent.length <= 1) {
        e.preventDefault()
        borderSpan.textContent = ''
      }
    }
  }
  const updateText = (children) => {
    const texts = children.map((child) => {
      const emptyText = child.getAttribute('data-empty-text-span')
      if (child.tagName === 'SPAN' && !child.hasAttribute('contentEditable')) return child.textContent || emptyText
      return ''
    })
    const content = texts.filter((text) => text).join(' ')

    updateAttributes({ content })
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.querySelector(`[data-node-type="${type}"]`)
      if (element) {
        const spans = element.querySelectorAll('span:not([contenteditable="false"])')
        const spanData = Array.from(spans).map((span) => ({
          content: span.textContent,
          emptyText: span.getAttribute('data-empty-text-span'),
        }))

        const content = spanData.reduce((acc, item, index) => {
          return acc + (item.content || item.emptyText)
        }, '')

        updateAttributes({ content })
      }
    }, 150)

    return () => {
      clearTimeout(timer)
    }
  }, [type, updateAttributes])

  return { delectHandel, updateText }
}
