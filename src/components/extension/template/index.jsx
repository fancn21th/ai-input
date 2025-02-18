import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { SWITCH_TYPE_TEMPLATE } from './list.jsx'
import { useTabSwitch, useContent } from './hook.js'

/**
 * react组件实现可编辑模板
 * @param {Object} node - 节点对象
 * @param {Function} updateAttributes - 更新节点属性的函数
 * @returns {JSX.Element} - 返回自定义模板节点组件
 */
const CustomInlineComponent = ({ node, updateAttributes, deleteNode }) => {
  const { type, label = '模板' } = node.attrs
  const template = SWITCH_TYPE_TEMPLATE(label)

  const { delectHandel, updateText } = useContent(type, updateAttributes, deleteNode)

  const { handleKeyDown } = useTabSwitch(type)

  return (
    <NodeViewWrapper as="span" onKeyDown={handleKeyDown}>
      <NodeViewContent
        as="span"
        className="outline-none text-sm font-normal text-gray-70 leading-5"
        contentEditable
        suppressContentEditableWarning={true}
        data-node-type={type}
        onKeyDown={delectHandel}
        onInput={(e) => {
          updateText(Array.from(e.target.children))
        }}
      >
        {template?.[type] ?? null}
      </NodeViewContent>
    </NodeViewWrapper>
  )
}

/**
 * 自定义模板节点
 */
 const templateCom = Node.create({
  name: 'customInline',

  group: 'inline',
  inline: true,
  selectable: true,
  addAttributes() {
    return {
      type: {
        default: null,
      },
      label: {
        default: null,
      },
      content: {
        default: '',
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'custom-inline',
        getAttrs: (element) => ({
          id: element.getAttribute('id'),
          type: element.getAttribute('type'),
          label: element.getAttribute('label'),
        }),
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['custom-inline', mergeAttributes(HTMLAttributes)]
  },
  renderText({ node }) {
    const { type, content } = node.attrs
    return content
  },
  addNodeView() {
    return ReactNodeViewRenderer(CustomInlineComponent)
  },
})

export default templateCom