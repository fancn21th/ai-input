export const SWITCH_TYPE_TEMPLATE = (label) => ({
  // load form api or local storage
  dynamic: jsxFactory("姓名是{{姓名}}，年龄是{{年龄}}"),
  workprogress: (
    <>
      <span>作为一位</span>
      <span
        data-empty-text-span="岗位"
        className="min-w-[40px] inline-block px-1 border-b border-blue-500 pb-1  outline-none mx-1 lastnotdeleted leading-4"
      ></span>
      <span>，请帮我总结本周的工作进展。本周完成的工作有</span>
      <span
        data-empty-text-span="工作内容"
        className="min-w-[40px] inline-block px-1 border-b border-blue-500 pb-1  outline-none mx-1 lastnotdeleted leading-4"
      ></span>
      <span>，要求</span>
      <span
        data-empty-text-span="简明扼要"
        className="min-w-[40px] inline-block px-1 border-b border-blue-500 pb-1  outline-none mx-1 lastnotdeleted leading-4"
      ></span>
      。
    </>
  ),
})

export const jsxFactory = (text) => {
  const arr = text.split(/{{|}}/)
  return arr.map((item, index) => {
    if (index % 2 === 0) {
      return <span key={index}>{item}</span>
    } else {
      return (
        <span
          data-empty-text-span={item}
          key={item}
          className="min-w-[40px] inline-block px-1 border-b border-blue-500 pb-1  outline-none mx-1 lastnotdeleted leading-4"
        ></span>
      )
    }
  })
}