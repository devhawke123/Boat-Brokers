import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

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

const variantClasses: Record<ButtonVariant, string> = {
  dark: 'border-2 border-transparent bg-navy-dark text-white hover:border-navy-dark hover:bg-white hover:text-navy-dark',
  light: 'border-2 border-transparent bg-white text-black hover:border-black hover:bg-black hover:text-white',
  'outline-white': 'border-2 border-white bg-transparent text-white hover:bg-white hover:text-navy-dark',
  'outline-dark': 'border-2 border-navy-dark bg-transparent text-navy-dark hover:bg-navy-dark hover:text-white',
}

function ArrowRightIcon() {
  return (
    <svg
      className="size-[18px] shrink-0"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.8125 9H15.1875"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.125 3.9375L15.1875 9L10.125 14.0625"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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
    'inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 whitespace-nowrap shadow-btn transition-[transform,background-color,color,border-color] duration-300 ease-out active:scale-[0.98]',
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <span className="flex flex-col items-start leading-[1.2]">
        <span className="font-body text-base font-semibold">{label}</span>
        {sublabel && <span className="font-body text-caption font-normal">{sublabel}</span>}
      </span>
      {icon === 'arrow-right' && <ArrowRightIcon />}
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
