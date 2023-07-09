import './index.css'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import LazyHydrate from 'react-lazy-hydration'
import { Suspense } from 'react'

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
        return (
          <LazyHydrate whenVisible key={index}>
            {/* <Suspense> */}
            <MarkdownBlock>{paragraph}</MarkdownBlock>
            {/* </Suspense> */}
          </LazyHydrate>
        )
      })}
    </div>
  )
}

// <Suspense>
// 1) that part of the app is going to be hydrated concurrently
// 2) upon an interaction (click, keypress, but not mousemove), that part of the app
//    will switch to old immediate hydration → and it will handle that click or keypress
