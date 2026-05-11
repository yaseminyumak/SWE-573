import { useState } from 'react'

export const SPECIAL_DAYS = [
  'Birthday',
  'Anniversary',
  'Wedding Day',
  'Baby Shower',
  'Bridal Shower',
  'Graduation Day',
  'Retirement Party',
  'Housewarming',
  'New Year\'s Eve',
  'New Year\'s Day',
  'Valentine\'s Day',
  'Mother\'s Day',
  'Father\'s Day',
  'Easter Sunday',
  'Thanksgiving',
  'Christmas Eve',
  'Christmas Day',
  'Hanukkah',
  'Ramadan Feast (Eid al-Fitr)',
  'Eid al-Adha',
  'Passover',
  'Diwali',
  'Chinese New Year',
  'Halloween',
  'Independence Day',
  'Memorial Day',
  'Labor Day',
  'Mardi Gras',
  'St. Patrick\'s Day',
  'Super Bowl Sunday',
  'Game Night',
  'Potluck Dinner',
  'Sunday Brunch',
  'Date Night',
  'Family Reunion',
  'Picnic',
  'Barbecue',
  'Office Party',
  'Holiday Party',
  'Cocktail Party',
  'Dinner Party',
  'Kids\' Party',
  'School Event',
  'Book Club',
  'Movie Night',
  'Camping Trip',
  'Beach Day',
  'Breakfast in Bed',
  'National Food Day',
  'Ramadan (Iftar)',
]

interface Props {
  selected: string[]
  onAdd: (day: string) => void
  onRemove: (day: string) => void
}

export default function SpecialDaysPicker({ selected, onAdd, onRemove }: Props) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = SPECIAL_DAYS.filter(
    (d) => d.toLowerCase().includes(search.toLowerCase()) && !selected.includes(d)
  )

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Special Days</label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((day) => (
            <span key={day} className="inline-flex items-center gap-1 bg-[#ede8ee] border border-[#d67ec9] text-[#8c2d9c] px-2.5 py-0.5 rounded-full text-sm font-medium">
              {day}
              <button type="button" onClick={() => onRemove(day)}
                className="text-[#8c2d9c] hover:text-[#7a2589] leading-none ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={search}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
          placeholder="Search special days…"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto shadow-md">
            {filtered.map((day) => (
              <li key={day}>
                <button
                  type="button"
                  onMouseDown={() => { onAdd(day); setSearch(''); setOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#ede8ee] text-gray-700"
                >
                  {day}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
