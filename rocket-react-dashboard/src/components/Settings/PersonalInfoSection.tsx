import { useState } from 'react'
import { Clock, FileText, Mail, User, Video } from 'lucide-react'
import { FormRow } from './FormRow'
import { FileDropzone } from './FileDropzone'
import { IconSelect } from './IconSelect'
import { BioEditor } from './BioEditor'
import { UploadedFile } from './UploadedFile'

const countryOptions = [
  { value: 'us', flag: '🇺🇸', name: 'United States' },
  { value: 'br', flag: '🇧🇷', name: 'Brazil' },
  { value: 'ca', flag: '🇨🇦', name: 'Canada' },
  { value: 'gb', flag: '🇬🇧', name: 'United Kingdom' },
].map((option) => ({
  value: option.value,
  flag: option.flag,
  label: `${option.flag} ${option.name}`,
}))

const timezoneOptions = [
  { value: 'pst', label: 'Pacific Standard Time (PST) UTC-08:00' },
  { value: 'est', label: 'Eastern Standard Time (EST) UTC-05:00' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT) UTC+00:00' },
  { value: 'brt', label: 'Brasília Time (BRT) UTC-03:00' },
]

const BIO_MAX_LENGTH = 400

export function PersonalInfoSection() {
  const [firstName, setFirstName] = useState('Olivia')
  const [lastName, setLastName] = useState('Rhye')
  const [email, setEmail] = useState('olivia@untitledui.com')
  const [role, setRole] = useState('Product Designer')
  const [country, setCountry] = useState('us')
  const [timezone, setTimezone] = useState('pst')
  const [bio, setBio] = useState(
    "I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.",
  )
  const [files, setFiles] = useState([
    {
      id: 'tech-design-requirements',
      icon: FileText,
      name: 'Tech design requirements.pdf',
      size: '200 KB',
      progress: 100,
      complete: true,
    },
    {
      id: 'dashboard-prototype-recording',
      icon: Video,
      name: 'Dashboard prototype recording.mp4',
      size: '16 MB',
      progress: 40,
      complete: false,
    },
    {
      id: 'dashboard-prototype-final',
      icon: FileText,
      name: 'Dashboard prototype FINAL.fig',
      size: '4.2 MB',
      progress: 80,
      complete: false,
    },
  ])

  function removeFile(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id))
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Personal info
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your photo and personal details here.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mt-4">
        <FormRow label="Name">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            />
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            />
          </div>
        </FormRow>

        <FormRow label="Email address">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400">
            <Mail className="size-4 shrink-0 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full text-sm text-gray-900 outline-none"
            />
          </div>
        </FormRow>

        <FormRow
          label="Your photo"
          description="This will be displayed on your profile."
        >
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <User className="size-8" />
            </div>
            <FileDropzone className="flex-1" />
          </div>
        </FormRow>

        <FormRow label="Role">
          <input
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          />
        </FormRow>

        <FormRow label="Country">
          <IconSelect
            icon={
              <span>
                {countryOptions.find((option) => option.value === country)
                  ?.flag ?? '🌐'}
              </span>
            }
            value={country}
            onChange={setCountry}
            options={countryOptions}
          />
        </FormRow>

        <FormRow label="Timezone">
          <IconSelect
            icon={<Clock className="size-4" />}
            value={timezone}
            onChange={setTimezone}
            options={timezoneOptions}
          />
        </FormRow>

        <FormRow label="Bio" description="Write a short introduction.">
          <BioEditor value={bio} onChange={setBio} maxLength={BIO_MAX_LENGTH} />
        </FormRow>

        <FormRow
          label="Portfolio projects"
          description="Share a few snippets of your work."
        >
          <div className="flex flex-col gap-4">
            <FileDropzone hint="PDF, MP4, FIG, PNG or JPG (max. 20MB)" />
            {files.map((file) => (
              <UploadedFile
                key={file.id}
                icon={file.icon}
                name={file.name}
                size={file.size}
                progress={file.progress}
                complete={file.complete}
                onRemove={() => removeFile(file.id)}
              />
            ))}
          </div>
        </FormRow>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Save
        </button>
      </div>
    </div>
  )
}
