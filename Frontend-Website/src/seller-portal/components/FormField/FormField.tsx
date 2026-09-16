import type { ChangeEvent, ReactNode } from 'react'
import selectChevron from '../../assets/AddBoat/select-chevron.svg'

export function Label({ children, required }: { children: string; required?: boolean }) {
  return (
    <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
      {children} {required && <span className="text-[#ef4444]">*</span>}
    </span>
  )
}

export function TextField({
  label,
  required,
  placeholder,
  value,
  onChange,
  suffix,
  prefix,
}: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  prefix?: string
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <Label required={required}>{label}</Label>
      <div className="relative flex h-11 w-full items-center rounded-lg border border-[#e2e8f0] bg-white">
        {prefix && <span className="pl-4 text-[16px] text-[#94a3b8]">{prefix}</span>}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className={`h-full w-full rounded-lg bg-transparent text-[16px] text-[#0f172a] placeholder:text-[#c2c4c8] focus:outline-none ${prefix ? 'pl-1' : 'px-4'} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 text-[12px] font-medium tracking-[0.1px] text-[#94a3b8]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export function SelectField({
  label,
  required,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string
  required?: boolean
  placeholder: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <Label required={required}>{label}</Label>
      <div className="relative flex h-11 w-full items-center rounded-lg border border-[#e2e8f0] bg-white">
        <select
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className="h-full w-full appearance-none rounded-lg bg-transparent px-4 pr-10 text-[16px] text-[#0f172a] focus:outline-none"
        >
          <option value="" disabled className="text-[#c2c4c8]">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <img
          src={selectChevron}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-4 size-3"
        />
      </div>
    </div>
  )
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <textarea
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-32 w-full resize-none rounded-lg border border-[#e2e8f0] bg-white p-4 text-[16px] text-[#0f172a] placeholder:text-[#c2c4c8] focus:outline-none"
      />
      <div className="flex justify-end">
        <span className="text-[12px] font-medium tracking-[-0.06px] text-[#94a3b8]">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  )
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 md:flex-row">{children}</div>
}
