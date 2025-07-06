'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { leadService } from '@/lib/supabase/lead.service'

// Add message field to the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  linkedinUrl: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  message: z.string().optional(), // Add message field
})

type FormValues = z.infer<typeof formSchema>

export function LeadForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      linkedinUrl: '',
      message: '',
    },
  })

  // Watch form values
  const name = watch('name')
  const role = watch('role')
  const company = watch('company')

  // Generate message using OpenAI
  const generateMessage = async () => {
    if (!name || !role || !company) {
      alert('Please fill in name, role, and company first')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role, company }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate message')
      }

      const data = await response.json()
      setValue('message', data.message)
    } catch (error) {
      console.error('Error generating message:', error)
      alert('Failed to generate message. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const leadData = {
        name: data.name,
        role: data.role,
        company: data.company,
        linkedin_url: data.linkedinUrl || null,
        message: data.message || null,
        status: 'Draft' as const
      }
  
      await leadService.createLead(leadData)
      alert('Lead saved successfully!')
      reset()
    } catch (error) {
      console.error('Error saving lead:', error)
      alert('Failed to save lead. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold mb-6">Add New Lead</h2>
        
        <div className="space-y-4">
          {/* Existing form fields remain the same */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.name ? "border-red-500" : "border-gray-300"
              )}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              id="role"
              type="text"
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.role ? "border-red-500" : "border-gray-300"
              )}
              {...register("role")}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.company ? "border-red-500" : "border-gray-300"
              )}
              {...register("company")}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL (Optional)
            </label>
            <input
              id="linkedinUrl"
              type="url"
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.linkedinUrl ? "border-red-500" : "border-gray-300"
              )}
              placeholder="https://linkedin.com/in/username"
              {...register("linkedinUrl")}
            />
            {errors.linkedinUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl.message}</p>
            )}
          </div>

          {/* Add message generation section */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Outreach Message
              </label>
              <button
                type="button"
                onClick={generateMessage}
                disabled={isGenerating || !name || !role || !company}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <textarea
              id="message"
              rows={4}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.message ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Click 'Generate with AI' to create a personalized message or type your own"
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}