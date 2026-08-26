'use client'

import { TAGS, type TagId } from '@/lib/battery'
import { cn } from '@/lib/utils'

type Props = {
  selected: TagId | null
  onSelect: (id: TagId) => void
  disabled?: boolean
  poppingId: TagId | null
}

export function TagChips({ selected, onSelect, disabled, poppingId }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="피로 원인 선택"
      className="flex flex-wrap justify-center gap-2.5"
    >
      {TAGS.map((tag) => {
        const active = selected === tag.id
        return (
          <button
            key={tag.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onSelect(tag.id)}
            className={cn(
              'font-doodle inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-lg leading-none transition-all duration-150',
              'focus-visible:ring-foreground/25 focus-visible:outline-none focus-visible:ring-4',
              'disabled:cursor-not-allowed disabled:opacity-55',
              active
                ? 'border-foreground bg-primary text-primary-foreground -translate-y-0.5 shadow-[0_4px_0_0_var(--foreground)]'
                : 'border-border bg-card text-secondary-foreground hover:border-foreground/45 hover:-translate-y-0.5 shadow-[0_2px_0_0_rgba(90,70,54,0.22)]',
              poppingId === tag.id && 'bt-chip-pop',
            )}
          >
            <span aria-hidden="true">{tag.emoji}</span>
            {tag.label}
          </button>
        )
      })}
    </div>
  )
}
