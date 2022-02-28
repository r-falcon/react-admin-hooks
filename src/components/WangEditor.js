import React, { useEffect } from 'react'
import E from 'wangeditor'

/**
 * 这里用函数式组件
 */

let editor = null
function App({ value, onChange }) {
  // const { value, onChange } = props

  useEffect(() => {
    // 注：class写法需要在componentDidMount 创建编辑器
    editor = new E('#div1')

    editor.config.onchange = newHtml => {
      onChange(newHtml)
    }

    // 需要展示的菜单
    editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      'todo',
      'justify',
      'quote',
      'table',
      'splitLine',
      'undo',
      'redo'
    ]

    /**一定要创建 */
    editor.create()

    return () => {
      // 组件销毁时销毁编辑器 注：class写法需要在componentWillUnmount中调用
      editor.destroy()
    }

    // 这里一定要加上下面的这个注释
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (editor) {
      editor.txt.html(value)
    }
  }, [value])

  return (
    <div>
      <div id="div1"></div>
    </div>
  )
}

App.displayName = 'App'
export default App
