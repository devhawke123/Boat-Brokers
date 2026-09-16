import { FieldRow, SelectField, TextField, TextareaField } from '../../../../components/FormField/FormField'

export type BasicInformationValues = {
  length: string
  berths: string
  engine: string
  year: string
  stern: string
  steel: string
  hullBuilder: string
  lastService: string
  boatSafety: string
  fitOut: string
  blacking: string
  recentSurvey: string
  price: string
  overview: string
}

export const initialBasicInformationValues: BasicInformationValues = {
  length: '',
  berths: '',
  engine: '',
  year: '',
  stern: '',
  steel: '',
  hullBuilder: '',
  lastService: '',
  boatSafety: '',
  fitOut: '',
  blacking: '',
  recentSurvey: '',
  price: '',
  overview: '',
}

const BERTH_OPTIONS = ['1', '2', '2 + 2', '3', '4', '4 + 2', '5', '6+']
const OVERVIEW_MAX_LENGTH = 1000

type BasicInformationFormProps = {
  values: BasicInformationValues
  onChange: (field: keyof BasicInformationValues, value: string) => void
}

export default function BasicInformationForm({ values, onChange }: BasicInformationFormProps) {
  return (
    <>
      <FieldRow>
        <SelectField
          label="Berths"
          placeholder="Select berths"
          options={BERTH_OPTIONS}
          value={values.berths}
          onChange={(v) => onChange('berths', v)}
        />
        <TextField
          label="Stern"
          required
          placeholder="e.g. Cruiser Stern"
          value={values.stern}
          onChange={(v) => onChange('stern', v)}
        />
        <TextField
          label="Engine"
          required
          placeholder="e.g. BMC 1.5 Diesel"
          value={values.engine}
          onChange={(v) => onChange('engine', v)}
        />
      </FieldRow>

      <FieldRow>
        <TextField
          label="Hull builder"
          required
          placeholder="e.g. Sea Ray"
          value={values.hullBuilder}
          onChange={(v) => onChange('hullBuilder', v)}
        />
        <TextField
          label="Last service"
          required
          placeholder="e.g. 2024"
          value={values.lastService}
          onChange={(v) => onChange('lastService', v)}
        />
        <TextField
          label="Fit out"
          placeholder="e.g. Liveaboard"
          value={values.fitOut}
          onChange={(v) => onChange('fitOut', v)}
        />
      </FieldRow>

      <FieldRow>
        <TextField
          label="Blacking"
          placeholder="e.g. 2023"
          value={values.blacking}
          onChange={(v) => onChange('blacking', v)}
        />
        <TextField label="Year" placeholder="e.g. 2020" value={values.year} onChange={(v) => onChange('year', v)} />
        <TextField
          label="Boat safety"
          placeholder="e.g. Valid to 2026"
          value={values.boatSafety}
          onChange={(v) => onChange('boatSafety', v)}
        />
      </FieldRow>

      <FieldRow>
        <TextField
          label="Recent survey"
          placeholder="e.g. N/A"
          value={values.recentSurvey}
          onChange={(v) => onChange('recentSurvey', v)}
        />
        <TextField
          label="Steel"
          placeholder="e.g. 6mm/4mm/3mm"
          value={values.steel}
          onChange={(v) => onChange('steel', v)}
        />
        <TextField
          label="Length"
          placeholder="e.g. 70ft"
          suffix="ft"
          value={values.length}
          onChange={(v) => onChange('length', v)}
        />
      </FieldRow>

      <FieldRow>
        <TextField
          label="Price"
          placeholder="e.g. 32,310"
          prefix="$"
          value={values.price}
          onChange={(v) => onChange('price', v)}
        />
      </FieldRow>

      <TextareaField
        label="Overview"
        maxLength={OVERVIEW_MAX_LENGTH}
        placeholder="This stunning 2020 Sea Ray Sundancer 320 is the ultimate cruiser for those looking to combine sport performance with luxury comfort..."
        value={values.overview}
        onChange={(v) => onChange('overview', v)}
      />
    </>
  )
}
