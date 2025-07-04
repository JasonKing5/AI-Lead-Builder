import { LeadForm } from '@/components/lead-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Lead Builder</h1>
          <p className="mt-2 text-lg text-gray-600">Generate and manage your leads</p>
        </div>
        <LeadForm />
      </div>
    </main>
  )
}