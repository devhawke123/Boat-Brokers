import { createPortal } from 'react-dom'
import Button from '../../../components/Button/Button'
import checkCircle from '../../assets/AddBoat/review/check-circle.svg'

type PublishSuccessModalProps = {
  isEditing: boolean
}

export default function PublishSuccessModal({ isEditing }: PublishSuccessModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-[26rem] flex-col items-center gap-5 rounded-2xl bg-white p-8 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:p-10">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5]">
          <img src={checkCircle} alt="" aria-hidden="true" className="size-8" />
        </span>

        <div className="flex flex-col gap-2">
          <h2 className="font-display text-h3 capitalize text-ink">Thank You!</h2>
          <p className="text-body text-text-body">
            {isEditing
              ? 'Your listing has been updated successfully. Our team will review your changes shortly.'
              : "Your boat listing has been submitted successfully. Our team will review it and it'll be live for buyers to see soon."}
          </p>
        </div>

        <Button variant="dark" label="Go to Dashboard" href="/seller-portal/dashboard" className="w-full" />
      </div>
    </div>,
    document.body,
  )
}
