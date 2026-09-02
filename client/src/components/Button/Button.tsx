import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import arrowRightWhite from '../../assets/icons/arrow-right-white.svg'
import arrowRightDark from '../../assets/icons/arrow-right-dark.svg'

export type ButtonVariant = 'dark' | 'light' | 'outline-white' | 'outline-dark'

type CommonProps = {
  variant?: ButtonVariant
  label: string
  sublabel?: string
  icon?: 'arrow-right' | 'none'
  className?: string
  children?: ReactNode
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const arrowByVariant: Record<ButtonVariant, string> = {
  dark: arrowRightWhite,
  light: arrowRightDark,
  'outline-white': arrowRightDark,
  'outline-dark': arrowRightDark,
}

const variantClasses: Record<ButtonVariant, string> = {
  dark: 'border-none bg-navy-dark text-white',
  light: 'border-none bg-white text-black',
  'outline-white': 'border-2 border-white bg-transparent text-white',
  'outline-dark': 'border-2 border-navy-dark bg-transparent text-navy-dark',
}

export default function Button({
  variant = 'dark',
  label,
  sublabel,
  icon = 'arrow-right',
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 whitespace-nowrap shadow-btn transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.98]',
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <span className="flex flex-col items-start leading-[1.2]">
        <span className="font-body text-base font-semibold">{label}</span>
        {sublabel && <span className="font-body text-[8px] font-normal">{sublabel}</span>}
      </span>
      {icon === 'arrow-right' && (
        <img className="size-[18px] shrink-0" src={arrowByVariant[variant]} alt="" aria-hidden="true" />
      )}
    </>
  )

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor
    return (
      <a className={classes} href={href} {...anchorRest}>
        {content}
      </a>
    )
  }

  return (
    <button className={classes} type="button" {...(rest as ButtonAsButton)}>
      {content}
    </button>
  )
}
