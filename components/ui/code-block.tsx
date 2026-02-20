"use client"

import React, { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
}

export function CodeBlock({ code, language = 'typescript', filename, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function highlight() {
      try {
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: 'github-dark',
        })
        setHtml(highlighted)
      } catch (error) {
        console.error('Failed to highlight code:', error)
        // Fallback to plain code
        setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }
    highlight()
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (isLoading) {
    return (
      <div className={cn("rounded-lg border bg-slate-950 p-4", className)}>
        <div className="animate-pulse text-sm text-slate-400">Loading code...</div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border bg-slate-950 overflow-hidden relative group", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        {filename ? (
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="text-slate-500">📄</span>
            {filename}
          </div>
        ) : (
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            Code
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <div 
        className="overflow-x-auto p-4 [&>pre]:m-0 [&>pre]:bg-transparent [&>pre]:overflow-x-auto [&>pre]:text-sm [&_code]:text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

function escapeHtml(text: string): string {
  if (typeof document === 'undefined') {
    // Server-side fallback
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
