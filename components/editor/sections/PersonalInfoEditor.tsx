'use client'

import { useRef } from 'react'
import { Camera, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SectionBlock } from '@/components/editor/SectionBlock'
import { WritingTips } from '@/components/editor/WritingTips'
import { usePersonal } from '@/hooks/useResumeData'
import { useResumeActions } from '@/hooks/useResumeActions'

export function PersonalInfoEditor() {
  const personal = usePersonal()
  const { updatePersonal } = useResumeActions()
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updatePersonal({ photo: reader.result as string })
    reader.readAsDataURL(file)
  }

  function field(key: keyof typeof personal) {
    return {
      value: personal[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updatePersonal({ [key]: e.target.value }),
    }
  }

  return (
    <SectionBlock sectionKey="personal" title="Personal Information" hideable={false}>
      <WritingTips sectionKey="personal" />
      {/* Photo upload */}
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          aria-label="Upload profile photo"
          className="relative w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors group p-0"
          onClick={() => fileRef.current?.click()}
        >
          {personal.photo ? (
            <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          )}
        </button>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            {personal.photo ? 'Change photo' : 'Upload photo'}
          </button>
          {personal.photo && (
            <button
              type="button"
              onClick={() => updatePersonal({ photo: '' })}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"
            >
              <X size={10} /> Remove
            </button>
          )}
          <p className="text-xs text-gray-400">JPG, PNG, WebP</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Input label="Full Name" placeholder="e.g. John Smith" {...field('fullName')} />
        </div>
        <div className="col-span-2">
          <Input label="Job Title" placeholder="e.g. Software Engineer" {...field('jobTitle')} />
        </div>
        <Input label="Email" type="email" placeholder="john@example.com" {...field('email')} />
        <Input label="Phone" type="tel" placeholder="+1 234 567 890" {...field('phone')} />
        <div className="col-span-2">
          <Input label="Location" placeholder="City, Country" {...field('location')} />
        </div>
        <Input label="LinkedIn" placeholder="linkedin.com/in/..." {...field('linkedin')} />
        <Input label="GitHub" placeholder="github.com/..." {...field('github')} />
        <div className="col-span-2">
          <Input label="Portfolio" placeholder="yourwebsite.com" {...field('portfolio')} />
        </div>
      </div>
    </SectionBlock>
  )
}
