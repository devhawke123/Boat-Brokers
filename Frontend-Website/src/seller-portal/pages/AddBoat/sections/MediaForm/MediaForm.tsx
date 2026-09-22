import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { PHOTOS_MIN } from '../../scoring'
import anchorIcon from '../../../../assets/AddBoat/media/anchor-icon.svg'
import uploadPhotosIcon from '../../../../assets/AddBoat/media/upload-photos-icon.svg'
import photoEditIcon from '../../../../assets/AddBoat/media/photo-edit-icon.svg'
import photoDeleteIcon from '../../../../assets/AddBoat/media/photo-delete-icon.svg'
import pdfIcon from '../../../../assets/AddBoat/media/pdf-icon.svg'
import uploadPdfIcon from '../../../../assets/AddBoat/media/upload-pdf-icon.svg'
import infoIconSmall from '../../../../assets/AddBoat/media/info-icon-small.svg'
import linkIcon from '../../../../assets/AddBoat/media/link-icon.svg'
import youtubeIcon from '../../../../assets/AddBoat/media/youtube-icon.svg'
import infoIcon from '../../../../assets/AddBoat/media/info-icon.svg'

export type MediaPhoto = {
  id: string
  url: string
  name: string
  file: File | null
}

export type MediaValues = {
  photos: MediaPhoto[]
  videoUrl: string
  brochure: File | null
  virtualTourUrl: string
}

export const initialMediaValues: MediaValues = {
  photos: [],
  videoUrl: '',
  brochure: null,
  virtualTourUrl: '',
}

const CATEGORY_OPTIONS = [
  'Front View',
  'Rear View',
  'Cockpit',
  'Interior',
  'Engine',
  'Cabin',
  'Dashboard',
  'Hull (Side View)',
  'Aerial View',
  'Trailer (if applicable)',
]

type MediaFormProps = {
  values: MediaValues
  onPhotosAdd: (files: File[]) => void
  onPhotoRemove: (id: string) => void
  onSetMainPhoto: (id: string) => void
  onVideoUrlChange: (value: string) => void
  onBrochureChange: (file: File | null) => void
  onVirtualTourUrlChange: (value: string) => void
  photosError?: string | null
}

export default function MediaForm({
  values,
  onPhotosAdd,
  onPhotoRemove,
  onSetMainPhoto,
  onVideoUrlChange,
  onBrochureChange,
  onVirtualTourUrlChange,
  photosError,
}: MediaFormProps) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const brochureInputRef = useRef<HTMLInputElement>(null)
  const [isPhotoDragOver, setIsPhotoDragOver] = useState(false)
  const [isBrochureDragOver, setIsBrochureDragOver] = useState(false)
  const [brochureError, setBrochureError] = useState<string | null>(null)

  const [mainPhoto, ...otherPhotos] = values.photos

  function handlePhotoInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) onPhotosAdd(Array.from(e.target.files))
    e.target.value = ''
  }

  function handlePhotoDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsPhotoDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onPhotosAdd(files)
  }

  function isPdfFile(file: File) {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  }

  function applyBrochureFile(file: File) {
    if (!isPdfFile(file)) {
      setBrochureError('Only PDF files are supported.')
      return
    }
    setBrochureError(null)
    onBrochureChange(file)
  }

  function handleBrochureInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) applyBrochureFile(file)
    e.target.value = ''
  }

  function handleBrochureDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsBrochureDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) applyBrochureFile(file)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#0e2136]">
          Photos <span className="text-red-500">*</span>
          <span className="pl-1 font-normal text-[#64748b]">(minimum {PHOTOS_MIN} required)</span>
        </span>
        <span className="text-[12px] font-medium text-[#64748b]">{values.photos.length}/{PHOTOS_MIN} uploaded</span>
      </div>
      {photosError && <p className="text-[11px] font-medium text-[#ef4444]">{photosError}</p>}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsPhotoDragOver(true)
          }}
          onDragLeave={() => setIsPhotoDragOver(false)}
          onDrop={handlePhotoDrop}
          className={`flex h-[229px] flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-6 text-center transition-colors ${
            isPhotoDragOver ? 'border-[#2f8fd1] bg-[#2f8fd1]/5' : 'border-[#e2e8f0] bg-[#f5f8fb]/50'
          }`}
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-[#2f8fd1]/10">
            <img src={anchorIcon} alt="" aria-hidden="true" className="h-5 w-6" />
          </div>
          <p className="text-[16px] font-semibold text-[#0e2136]">Drag and drop your photos here</p>
          <p className="text-[13px] text-[#64748b]">Supports JPG, PNG, WEBP (Max 20MB per file)</p>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-5 py-2 text-[13px] font-medium text-[#0e2136] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
          >
            <img src={uploadPhotosIcon} alt="" aria-hidden="true" className="h-3 w-4" />
            Upload Photos
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handlePhotoInputChange}
          />
        </div>

        <div className="flex flex-row gap-3 lg:w-[132px] lg:flex-col">
          {mainPhoto ? (
            <div className="group relative h-[86px] w-[123px] shrink-0 overflow-hidden rounded-lg border-2 border-[#2f8fd1] lg:w-full">
              <img src={mainPhoto.url} alt={mainPhoto.name} className="h-full w-full object-cover" />
              <span className="absolute top-2 left-2 rounded bg-[#0e2136] px-2 py-0.5 text-[9px] font-bold tracking-wide text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                MAIN PHOTO
              </span>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#0e2136]/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  aria-label="Add another photo"
                  className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <img src={photoEditIcon} alt="" aria-hidden="true" className="size-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onPhotoRemove(mainPhoto.id)}
                  aria-label="Remove main photo"
                  className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <img src={photoDeleteIcon} alt="" aria-hidden="true" className="size-2.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[86px] w-[123px] shrink-0 rounded-lg border border-dashed border-[#e2e8f0] lg:w-full" />
          )}

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex h-[86px] w-[123px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] lg:w-full"
          >
            <span className="text-[20px] leading-none font-light">+</span>
            <span className="text-[11px] font-medium">Add More</span>
          </button>
        </div>
      </div>

      {otherPhotos.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {otherPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative h-[86px] w-[123px] overflow-hidden rounded-lg border border-[#e2e8f0]"
            >
              <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#0e2136]/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onSetMainPhoto(photo.id)}
                  aria-label="Set as main photo"
                  className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <img src={photoEditIcon} alt="" aria-hidden="true" className="size-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onPhotoRemove(photo.id)}
                  aria-label="Remove photo"
                  className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <img src={photoDeleteIcon} alt="" aria-hidden="true" className="size-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg bg-[#f5f8fb]/50 px-4 py-4">
        <h3 className="font-display text-[16px] text-[#0e2136]">Tips for a great listing</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {CATEGORY_OPTIONS.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-[#073040]" />
              <span className="text-[13px] text-[#8e8e8e]">{category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg bg-[#f5f8fb]/50 px-4 py-5">
        <h3 className="font-display text-[18px] text-[#0e2136]">Video Tour</h3>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-[#0e2136]">Video URL (YouTube or Vimeo)</span>
          <div className="relative flex h-11 items-center rounded-lg border border-[#e2e8f0] bg-white">
            <img src={youtubeIcon} alt="" aria-hidden="true" className="ml-3.5 h-4 w-[18px] shrink-0" />
            <input
              type="text"
              value={values.videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="h-full w-full rounded-lg bg-transparent px-3 text-[14px] text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <img src={infoIcon} alt="" aria-hidden="true" className="size-2.5" />
            <span className="text-[11px] text-[#64748b]">
              Paste a link to a walkthrough or sea trial video to give buyers a better perspective.
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg bg-[#f5f8fb]/50 px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-display text-[17px] text-[#0e2136]">Boat Brochure</h3>
          <p className="text-[13px] text-[#64748b]">Upload a PDF brochure to give buyers a complete overview.</p>
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsBrochureDragOver(true)
          }}
          onDragLeave={() => setIsBrochureDragOver(false)}
          onDrop={handleBrochureDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-7 text-center transition-colors ${
            isBrochureDragOver ? 'border-[#2f8fd1] bg-[#2f8fd1]/5' : 'border-[#e2e8f0] bg-[#f5f8fb]/50'
          }`}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-[#ef4444]/[0.08]">
            <img src={pdfIcon} alt="" aria-hidden="true" className="h-[26px] w-[22px]" />
          </div>
          {values.brochure ? (
            <>
              <p className="max-w-full truncate text-[13px] font-semibold text-[#0e2136]">{values.brochure.name}</p>
              <p className="text-[11px] text-[#64748b]">{(values.brochure.size / (1024 * 1024)).toFixed(1)} MB</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => brochureInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-4 py-1.5 text-[12px] font-medium text-[#0e2136] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBrochureError(null)
                    onBrochureChange(null)
                  }}
                  className="text-[12px] font-medium text-[#ef4444]"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[13px] font-semibold text-[#0e2136]">Drag &amp; drop your brochure here</p>
              <p className="text-[11px] text-[#64748b]">PDF only · Max 20MB</p>
              <button
                type="button"
                onClick={() => brochureInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-4 py-1.5 text-[12px] font-medium text-[#0e2136] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
              >
                <img src={uploadPdfIcon} alt="" aria-hidden="true" className="size-3" />
                Upload PDF
              </button>
            </>
          )}
          <input
            ref={brochureInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleBrochureInputChange}
          />
        </div>
        {brochureError && <p className="text-[11px] font-medium text-[#ef4444]">{brochureError}</p>}
        <div className="flex items-center gap-1.5">
          <img src={infoIconSmall} alt="" aria-hidden="true" className="size-2.5" />
          <span className="text-[10px] text-[#64748b]">
            A well-formatted brochure increases buyer confidence and speeds up the sale.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg bg-[#f5f8fb]/50 px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-display text-[17px] text-[#0e2136]">Virtual Tour</h3>
          <p className="text-[13px] text-[#64748b]">Add a 360° or virtual walkthrough link so buyers can explore remotely.</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-[#0e2136]">Virtual View URL</span>
          <div className="relative flex h-11 items-center rounded-lg border border-[#e2e8f0] bg-white">
            <img src={linkIcon} alt="" aria-hidden="true" className="ml-3 size-4 shrink-0" />
            <input
              type="text"
              value={values.virtualTourUrl}
              onChange={(e) => onVirtualTourUrlChange(e.target.value)}
              placeholder="https://my360tour.com/boat-xyz..."
              className="h-full w-full rounded-lg bg-transparent px-3 text-[14px] text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <img src={infoIcon} alt="" aria-hidden="true" className="size-2.5" />
          <span className="text-[11px] text-[#64748b]">
            Supports Matterport, Kuula, 360° platform links or any virtual walkthrough URL.
          </span>
        </div>
      </div>
    </div>
  )
}
