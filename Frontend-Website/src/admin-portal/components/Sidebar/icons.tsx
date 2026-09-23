import type { SVGProps } from 'react'

export function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.3405 8.95161V0.619153C11.3405 0.283468 11.6016 0 11.9372 0C16.5511 0 20.2921 3.74103 20.2921 8.35484C20.2921 8.69052 20.0086 8.95161 19.6729 8.95161H11.3405ZM1.19531 10.1452C1.19531 5.62087 4.5559 1.87611 8.91608 1.27933C9.25922 1.23085 9.55015 1.50685 9.55015 1.85373V10.7419L15.3873 16.5791C15.6372 16.829 15.6186 17.2393 15.3314 17.4407C13.8693 18.4851 12.079 19.0968 10.1469 19.0968C5.20489 19.0968 1.19531 15.0909 1.19531 10.1452ZM20.8292 10.7419C21.1761 10.7419 21.4483 11.0329 21.4036 11.376C21.1164 13.461 20.1131 15.3147 18.6472 16.6836C18.4234 16.8924 18.0728 16.8775 17.8565 16.6575L11.9372 10.7419H20.8292Z" fill="currentColor" />
    </svg>
  )
}

// Placeholder icons — swap for real artwork when each module gets built.

export function LeadsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 5H17M3 10H17M3 15H11" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" />
    </svg>
  )
}

export function ListingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 3.5L16 3.5V16.5L4 16.5V3.5Z" stroke="currentColor" strokeWidth="1.6667" strokeLinejoin="round" />
      <path d="M7.5 8L12.5 8M7.5 11.5L10.5 11.5" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" />
    </svg>
  )
}

export function BoatsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3 12.5L4.5 16.5H15.5L17 12.5H3Z"
        stroke="currentColor"
        strokeWidth="1.6667"
        strokeLinejoin="round"
      />
      <path d="M5.5 12.5V5.5H12.5L14.5 12.5" stroke="currentColor" strokeWidth="1.6667" strokeLinejoin="round" />
      <path d="M8 5.5V3.5" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" />
    </svg>
  )
}

export function SellersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="6.5" r="3.3" stroke="currentColor" strokeWidth="1.6667" />
      <path d="M3.5 17C3.5 13.4101 6.41015 10.5 10 10.5C13.5899 10.5 16.5 13.4101 16.5 17" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" />
    </svg>
  )
}

export function BuyersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="7.5" cy="5" r="2.9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="5" r="2.9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 17C1 13.134 3.91015 10 7.5 10C9.19332 10 10.7351 10.6966 11.8919 11.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.8919 11.8333C13.0487 10.6966 14.5905 10 16.2838 10C19.8736 10 22 13.134 22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function SalesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="5" width="16" height="10.5" rx="1.6667" stroke="currentColor" strokeWidth="1.6667" />
      <circle cx="10" cy="10.25" r="2.25" stroke="currentColor" strokeWidth="1.6667" />
    </svg>
  )
}

export function BlogsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 2.5H12.5L16 6V17.5H4V2.5Z" stroke="currentColor" strokeWidth="1.6667" strokeLinejoin="round" />
      <path d="M7 10H13M7 13.5H13" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" />
    </svg>
  )
}

export function AvailabilityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.5" y="4" width="15" height="13.5" rx="1.6667" stroke="currentColor" strokeWidth="1.6667" />
      <path d="M2.5 8H17.5" stroke="currentColor" strokeWidth="1.6667" />
      <path d="M6 2V5.5M14 2V5.5" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" />
    </svg>
  )
}

export function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.5 2.5H4.16667C3.72464 2.5 3.30072 2.67559 2.98816 2.98816C2.67559 3.30072 2.5 3.72464 2.5 4.16667V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5"
        stroke="currentColor"
        strokeWidth="1.6667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5"
        stroke="currentColor"
        strokeWidth="1.6667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke="currentColor"
        strokeWidth="1.6667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
