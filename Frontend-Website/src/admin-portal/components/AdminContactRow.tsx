import type { ComponentType } from 'react'
import ContactCopyButton from './ContactCopyButton'

type AdminContactRowProps = {
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>
  value?: string | null
  kind?: 'email' | 'phone'
  owner?: string
}

export default function AdminContactRow({ label, icon: Icon, value, kind, owner = 'seller' }: AdminContactRowProps) {
  return <div><dt><Icon size={15} strokeWidth={1.5} aria-hidden="true" />{label}</dt><dd>{kind && value ? <><a href={kind === 'email' ? 'mailto:' + value : 'tel:' + value.replace(/[^+\d]/g, '')}>{value}</a><ContactCopyButton value={value} label={'Copy ' + owner + (kind === 'email' ? ' email' : ' phone number')} copiedLabel={kind === 'email' ? 'Email copied' : 'Phone number copied'} /></> : value || 'Not provided'}</dd></div>
}
