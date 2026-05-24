import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function AboutPage() {
  const headerRef = useScrollReveal()
  const contentRef = useScrollReveal()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-6">
      <div ref={headerRef} className="reveal mb-10 text-center">
        <h1
          className="text-3xl sm:text-4xl font-display font-bold mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          乐队信息
        </h1>
        <p
          className="font-scifi text-xs tracking-[0.3em] uppercase"
          style={{ color: 'var(--color-accent)', opacity: 0.6 }}
        >
          About Lightsdark Band
        </p>
      </div>

      <div
        ref={contentRef}
        className="reveal glass-card rounded-2xl p-8 sm:p-10"
      >
        <MarkdownRenderer contentPath="/content/band-info.md" />
      </div>
    </div>
  )
}