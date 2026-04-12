interface RelationPickerProps {
  label: string
  available: string[]
  selected: string[]
  onAdd: (name: string) => void
  onRemove: (name: string) => void
}

export default function RelationPicker({ label, available, selected, onAdd, onRemove }: RelationPickerProps) {
  const options = available.filter((n) => !selected.includes(n))

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 bg-[#ede8ee] border border-[#d67ec9] text-[#8c2d9c] px-3 py-0.5 rounded-full text-sm font-medium"
            >
              {name}
              <button
                type="button"
                onClick={() => onRemove(name)}
                className="ml-1 text-[#8c2d9c] hover:text-[#5a1a6a] leading-none"
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {options.length > 0 ? (
        <select
          defaultValue=""
          onChange={(e) => { if (e.target.value) { onAdd(e.target.value); e.target.value = '' } }}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]"
        >
          <option value="" disabled>Select to add…</option>
          {options.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      ) : (
        <p className="text-xs text-gray-400 italic">
          {available.length === 0 ? 'No items in catalog yet.' : 'All available items selected.'}
        </p>
      )}
    </div>
  )
}
