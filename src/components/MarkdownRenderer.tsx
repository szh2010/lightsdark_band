import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  contentPath: string
}

export default function MarkdownRenderer({ contentPath }: MarkdownRendererProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(contentPath)
      .then((res) => {
        if (!res.ok) throw new Error('内容加载失败')
        return res.text()
      })
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [contentPath])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div
          className="h-8 rounded w-1/3"
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div
          className="h-4 rounded w-full"
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div
          className="h-4 rounded w-5/6"
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div
          className="h-4 rounded w-2/3"
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--color-text-muted)' }}>
          内容加载失败，请稍后再试
        </p>
      </div>
    )
  }

  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
