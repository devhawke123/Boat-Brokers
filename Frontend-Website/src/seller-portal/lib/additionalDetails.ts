export type AdditionalDetail = { id: string; name: string; description: string }

export function getAdditionalDetails(value: unknown): AdditionalDetail[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      id: typeof item.id === 'string' ? item.id : `detail-${index}`,
      name: typeof item.name === 'string' ? item.name : '',
      description: typeof item.description === 'string' ? item.description : '',
    }))
}

export function completedAdditionalDetails(value: unknown): AdditionalDetail[] {
  return getAdditionalDetails(value)
    .filter((item) => item.name.trim() && item.description.trim())
    .map((item) => ({ ...item, name: item.name.trim(), description: item.description.trim() }))
}

export function hasIncompleteAdditionalDetails(value: unknown) {
  return getAdditionalDetails(value).some((item) => Boolean(item.name.trim()) !== Boolean(item.description.trim()))
}
