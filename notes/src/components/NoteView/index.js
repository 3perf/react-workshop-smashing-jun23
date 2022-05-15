import './index.css'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

const MarkdownBlock = ({ children }) => {
  return (
    <div
      className="note-view__markdown-block"
      ref={(element) => {
        if (!element) return
        // Increase the opacity to 1 to indicate that the element has been hydrated
        element.style.opacity = 1
      }}
    >
      <ReactMarkdown remarkPlugins={[gfm]}>{children}</ReactMarkdown>
    </div>
  )
}

export default function NoteView({ text }) {
  const textWithHeader = '## ' + text

  const paragraphs = textWithHeader.split('\n\n')

  return (
    <div className="note-view">
      {paragraphs.map((paragraph, index) => {
        return <MarkdownBlock key={index}>{paragraph}</MarkdownBlock>
      })}
    </div>
  )
}
