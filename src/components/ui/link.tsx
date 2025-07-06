import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

export function CustomLink({ href, children, className, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className={cn('text-blue-600 hover:underline', className)}
      {...props}
    >
      {children}
    </Link>
  )
}