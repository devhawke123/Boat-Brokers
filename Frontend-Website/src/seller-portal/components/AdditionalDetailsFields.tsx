import { useContext, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ListPlus, Plus, Trash2 } from 'lucide-react'
import { Field, SectionCard, TextAreaField } from './WizardFields'
import { getAdditionalDetails, type AdditionalDetail } from '../lib/additionalDetails'
import { EASE, quick } from '../lib/motion'
import { WizardThemeContext } from '../context/WizardTheme'

type AdditionalDetailsFieldsProps = {
  value: AdditionalDetail[]
  onChange: (event: { target: { name: 'additionalDetails'; value: AdditionalDetail[] } }) => void
  showValidation: boolean
}

export default function AdditionalDetailsFields({ value, onChange, showValidation }: AdditionalDetailsFieldsProps) {
  const v2 = useContext(WizardThemeContext)
  const items = getAdditionalDetails(value)
  const containerRef = useRef<HTMLDivElement>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const focusId = useRef<string | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!focusId.current) return
    const row = Array.from(containerRef.current?.querySelectorAll<HTMLFieldSetElement>('fieldset') || []).find(
      (element) => element.dataset.detailId === focusId.current,
    )
    row?.querySelector('input')?.focus()
    focusId.current = null
  }, [value])

  useEffect(() => {
    if (showValidation) containerRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [showValidation])

  function update(id: string, key: 'name' | 'description', text: string) {
    onChange({ target: { name: 'additionalDetails', value: items.map((item) => (item.id === id ? { ...item, [key]: text } : item)) } })
  }

  function addDetail() {
    const id = crypto.randomUUID()
    focusId.current = id
    onChange({ target: { name: 'additionalDetails', value: [...items, { id, name: '', description: '' }] } })
  }

  function removeDetail(id: string, index: number) {
    focusId.current = items[index + 1]?.id || items[index - 1]?.id || null
    if (!focusId.current) addRef.current?.focus()
    onChange({ target: { name: 'additionalDetails', value: items.filter((item) => item.id !== id) } })
  }

  return (
    <SectionCard
      number="01"
      title="Anything else to add?"
      description="Add details that haven’t been covered, such as mooring arrangements, warranties or included extras."
      aside={
        <span className="mt-4 inline-flex rounded-md bg-sp-surface-soft px-2 py-1 text-[11px] font-medium text-sp-body">Optional</span>
      }
    >
      <div ref={containerRef}>
        {!items.length && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: EASE }}
            className="wizard-additional-empty rounded-[10px] border border-dashed border-[#cbdde7] bg-[#f6fafc] px-5 py-6"
          >
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-[10px] bg-[#e2f2fa] text-sp-brand">
              <ListPlus aria-hidden="true" size={20} />
            </span>
            <p className="text-[14px] font-semibold text-sp-brand-deep">Make room for the little details</p>
            <p className="mt-2 max-w-sm text-[12px] leading-5 text-sp-body">
              Give each extra detail a short name and a description. You can add as many as you need, or continue without adding any.
            </p>
            <motion.button
              ref={addRef}
              type="button"
              onClick={addDetail}
              initial={v2 ? 'rest' : false}
              animate={v2 ? 'rest' : undefined}
              whileHover={v2 ? 'hover' : undefined}
              whileFocus={v2 ? 'hover' : undefined}
              variants={v2 ? { rest: { backgroundColor: '#e7f1f9' }, hover: { backgroundColor: '#ffffff' } } : undefined}
              transition={quick}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              className="wizard-additional-add mt-5 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-white px-3.5 text-[12px] font-semibold text-sp-brand-deep hover:bg-sp-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand tactile-control"
            >
              <Plus aria-hidden="true" size={16} />
              Add a detail
            </motion.button>
          </motion.div>
        )}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <motion.fieldset
              key={item.id}
              layout="position"
              data-detail-id={item.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.26, ease: EASE }}
              className="wizard-additional-detail min-w-0 rounded-[10px] border border-sp-hairline bg-[#f9fbfc] p-4 sm:p-5"
            >
              <legend className="sr-only">Additional detail {index + 1}</legend>
              <div className="wizard-additional-heading mb-4 flex items-center justify-between gap-3">
                <span className="wizard-additional-number text-[12px] font-semibold text-sp-body">
                  Detail {String(index + 1).padStart(2, '0')}
                </span>
                <motion.button
                  type="button"
                  aria-label={`Remove ${item.name.trim() || `detail ${index + 1}`}`}
                  onClick={() => removeDetail(item.id, index)}
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                  initial={v2 ? 'rest' : false}
                  animate={v2 ? 'rest' : undefined}
                  whileHover={v2 ? 'hover' : undefined}
                  whileFocus={v2 ? 'hover' : undefined}
                  variants={
                    v2
                      ? {
                          rest: { backgroundColor: '#eaf3fa00', color: '#607d93' },
                          hover: { backgroundColor: '#e2eef8', color: '#234f6d' },
                        }
                      : undefined
                  }
                  transition={quick}
                  className="wizard-additional-remove inline-flex min-h-9 items-center gap-1.5 rounded-[7px] px-2 text-[11px] font-semibold text-sp-body hover:bg-[#fceced] hover:text-[#a51f36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand"
                >
                  <Trash2 aria-hidden="true" size={14} />
                  Remove
                </motion.button>
              </div>
              <div className="space-y-4">
                <Field
                  label="Detail name"
                  name={`additional-${item.id}-name`}
                  value={item.name}
                  onChange={(event) => update(item.id, 'name', event.target.value)}
                  placeholder="e.g. Mooring arrangements"
                  error={showValidation && item.description.trim() && !item.name.trim() ? 'Give this detail a name.' : undefined}
                />
                <TextAreaField
                  label="Description"
                  name={`additional-${item.id}-description`}
                  value={item.description}
                  onChange={(event) => update(item.id, 'description', event.target.value)}
                  placeholder="Describe what buyers should know…"
                  rows={3}
                  error={showValidation && item.name.trim() && !item.description.trim() ? 'Add a description for this detail.' : undefined}
                />
              </div>
            </motion.fieldset>
          ))}
        </div>
        {items.length > 0 && (
          <motion.button
            ref={addRef}
            type="button"
            onClick={addDetail}
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, ...(v2 ? { backgroundColor: '#e7f1f9' } : {}) }}
            whileHover={v2 ? { backgroundColor: '#ffffff' } : undefined}
            whileFocus={v2 ? { backgroundColor: '#ffffff' } : undefined}
            transition={quick}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            className="wizard-additional-add mt-4 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-white px-3.5 text-[12px] font-semibold text-sp-brand-deep hover:bg-sp-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand tactile-control"
          >
            <Plus aria-hidden="true" size={16} />
            Add another detail
          </motion.button>
        )}
      </div>
    </SectionCard>
  )
}
