import { useMemo, useState } from 'react'
import { groupTermsByLetter, jargonTerms } from '../../../../data/jargon'
import { IconChevronDown, IconSearch } from './icons'

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

export default function JargonGlossary() {
  const [query, setQuery] = useState('')

  const availableLetters = useMemo(
    () => new Set(groupTermsByLetter(jargonTerms).map((group) => group.letter)),
    [],
  )

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return jargonTerms
    return jargonTerms.filter(
      (entry) => entry.term.toLowerCase().includes(q) || entry.definition.toLowerCase().includes(q),
    )
  }, [query])

  const groups = useMemo(() => groupTermsByLetter(filteredTerms), [filteredTerms])

  const scrollToLetter = (letter: string) => {
    document.getElementById(`jargon-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="flex flex-col items-center px-6 py-14 sm:px-16 sm:py-20">
      <div className="flex w-full max-w-[52rem] flex-col items-center gap-4 text-center">
        <h2 className="font-display text-[2.5rem] leading-[1.2] tracking-[-2px] text-[#020f17] capitalize sm:text-[3.5rem]">
          How well do you know your port to your starboard?
        </h2>
        <p className="max-w-[46rem] text-base leading-[1.625rem] text-[#475569]">
          Do you know the difference between an on-line and off-line mooring? If not, search or
          browse the terms below to understand what people mean when they talk about canal boats.
        </p>
      </div>

      <div className="mt-10 flex w-full max-w-[32.5rem] flex-col items-center gap-4">
        <div className="relative w-full">
          <IconSearch className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-[#64767e]/50" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms (e.g. 'Hull', 'Bilge'...)"
            className="w-full rounded-lg border border-[#d6eef8] bg-white py-4 pr-6 pl-12 text-base text-[#0b2436] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] placeholder:text-[#64767e]/50"
          />
        </div>
        <p className="text-sm font-medium tracking-[0.35px] text-[#64767e]">
          {filteredTerms.length} of {jargonTerms.length} terms
        </p>
      </div>

      <div className="mt-8 flex w-full max-w-[65rem] flex-wrap items-center justify-center gap-2">
        {ALPHABET.map((letter) => {
          const enabled = availableLetters.has(letter)
          return (
            <button
              key={letter}
              type="button"
              disabled={!enabled}
              onClick={() => scrollToLetter(letter)}
              className={
                enabled
                  ? 'flex size-10 items-center justify-center rounded-full border border-[#f1ecdf] bg-white text-base font-medium text-[#16262f] transition-colors duration-150 hover:border-blue hover:text-navy-dark'
                  : 'flex size-10 items-center justify-center rounded-full text-base font-medium text-[#64767e]/30'
              }
            >
              {letter}
            </button>
          )
        })}
      </div>

      <div className="mt-12 flex w-full max-w-[65rem] flex-col gap-10">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.letter} id={`jargon-${group.letter}`} className="flex scroll-mt-8 flex-col gap-6">
              <div className="flex items-center gap-6">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy-dark font-display text-2xl text-white">
                  {group.letter}
                </span>
                <div className="h-px flex-1 bg-blue/[0.54]" />
              </div>
              <div className="flex flex-col gap-4">
                {group.items.map((item) => (
                  <div
                    key={item.term}
                    className="flex items-center justify-between gap-6 rounded-lg border border-[#e3f7ff] bg-white p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-2xl leading-[1.3] text-[#0b2436] capitalize">{item.term}</h3>
                      <p className="text-sm leading-[1.4] text-[#64767e] italic">{item.definition}</p>
                    </div>
                    <IconChevronDown className="size-4 shrink-0 -rotate-90 text-[#9ca3af]" />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] py-16 text-center text-[#6b7280]">
            <p>No terms match &lsquo;{query}&rsquo;. Try a different search.</p>
          </div>
        )}
      </div>
    </section>
  )
}
