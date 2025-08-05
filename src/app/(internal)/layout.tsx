import InternalLayout from '../internal-layout'

export default function InternalPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <InternalLayout>
      {children}
    </InternalLayout>
  )
} 