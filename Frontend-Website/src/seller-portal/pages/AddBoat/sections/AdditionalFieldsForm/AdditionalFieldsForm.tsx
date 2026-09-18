import addFieldIcon from '../../../../assets/AddBoat/add-field-icon.svg'
import { FieldRow, TextField } from '../../../../components/FormField/FormField'
import Button from '../../../../../components/Button/Button'

// `id` is a client-side React key only — it is never sent to the server, which
// derives ordering from array position instead.
export type CustomFieldRow = {
  id: string
  label: string
  value: string
}

export type AdditionalFieldsValues = {
  fields: CustomFieldRow[]
}

export const initialAdditionalFieldsValues: AdditionalFieldsValues = {
  fields: [],
}

type AdditionalFieldsFormProps = {
  values: AdditionalFieldsValues
  onAdd: () => void
  onRemove: (id: string) => void
  onChange: (id: string, key: 'label' | 'value', value: string) => void
}

export default function AdditionalFieldsForm({ values, onAdd, onRemove, onChange }: AdditionalFieldsFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-[14px] text-[#64748b]">
        Add any extra details that don&rsquo;t fit the sections above &mdash; mooring arrangements, warranties,
        included extras, and anything else buyers should know.
      </p>

      {values.fields.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[#e2e8f0] px-6 py-10 text-center">
          <p className="text-[14px] text-[#64748b]">No additional fields yet.</p>
          <p className="text-[13px] text-[#94a3b8]">
            For example: &ldquo;Mooring included&rdquo; &mdash; &ldquo;Yes, until March 2027&rdquo;
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {values.fields.map((field) => (
            <div key={field.id} className="flex items-end gap-3">
              <FieldRow>
                <TextField
                  label="Field name"
                  placeholder="e.g. Mooring included"
                  value={field.label}
                  onChange={(v) => onChange(field.id, 'label', v)}
                />
                <TextField
                  label="Detail"
                  placeholder="e.g. Yes, until March 2027"
                  value={field.value}
                  onChange={(v) => onChange(field.id, 'value', v)}
                />
              </FieldRow>
              <Button
                variant="light"
                icon="none"
                label="Delete"
                onClick={() => onRemove(field.id)}
                aria-label={`Delete ${field.label || 'field'}`}
                // border-solid because the `light` variant sets border-style: none, and the
                // span override because Button hardcodes text-base while this form uses 14px.
                className="h-11 shrink-0 border border-solid border-[#e2e8f0] px-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] [&_span]:text-[14px]"
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-fit items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
      >
        <img src={addFieldIcon} alt="" aria-hidden="true" className="h-3.5 w-3" />
        <span className="text-[14px] font-semibold tracking-[0.041px] text-[#243b53]">Add another field</span>
      </button>
    </div>
  )
}
