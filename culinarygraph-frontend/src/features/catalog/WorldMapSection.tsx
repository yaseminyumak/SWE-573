import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import type { IngredientResponse, TechniqueResponse } from './catalogApi'
import type { RecipeResponse } from '../recipe/recipeApi'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json'

// All countries from COUNTRIES list — geographic centroids [lon, lat]
const COUNTRY_COORDS: Record<string, [number, number]> = {
  'Afghanistan':               [67.7,  33.9],
  'Albania':                   [20.2,  41.2],
  'Algeria':                   [2.6,   28.0],
  'Andorra':                   [1.6,   42.5],
  'Angola':                    [17.9, -11.2],
  'Antigua and Barbuda':       [-61.8, 17.1],
  'Argentina':                 [-63.6,-38.4],
  'Armenia':                   [45.0,  40.1],
  'Australia':                 [133.8,-25.3],
  'Austria':                   [14.6,  47.7],
  'Azerbaijan':                [47.6,  40.1],
  'Bahamas':                   [-77.4, 25.0],
  'Bahrain':                   [50.6,  26.0],
  'Bangladesh':                [90.4,  23.7],
  'Barbados':                  [-59.6, 13.2],
  'Belarus':                   [28.0,  53.7],
  'Belgium':                   [4.5,   50.5],
  'Belize':                    [-88.5, 17.2],
  'Benin':                     [2.3,    9.3],
  'Bhutan':                    [90.4,  27.5],
  'Bolivia':                   [-64.9,-16.3],
  'Bosnia and Herzegovina':    [17.7,  44.0],
  'Botswana':                  [24.7, -22.3],
  'Brazil':                    [-51.9,-14.2],
  'Brunei':                    [114.7,  4.5],
  'Bulgaria':                  [25.5,  42.8],
  'Burkina Faso':              [-1.6,  12.4],
  'Burundi':                   [29.9,  -3.4],
  'Cabo Verde':                [-24.0, 16.0],
  'Cambodia':                  [104.9, 12.6],
  'Cameroon':                  [12.4,   3.9],
  'Canada':                    [-96.8, 56.1],
  'Central African Republic':  [20.9,   6.6],
  'Chad':                      [18.7,  15.5],
  'Chile':                     [-71.5,-35.7],
  'China':                     [104.2, 35.9],
  'Colombia':                  [-74.3,  4.1],
  'Comoros':                   [43.9, -11.6],
  'Congo':                     [15.8,  -0.2],
  'Costa Rica':                [-84.2,  9.7],
  'Croatia':                   [15.5,  45.1],
  'Cuba':                      [-79.5, 21.5],
  'Cyprus':                    [33.4,  35.1],
  'Czech Republic':            [15.5,  49.8],
  'Denmark':                   [9.5,   56.3],
  'Djibouti':                  [42.6,  11.8],
  'Dominica':                  [-61.4, 15.4],
  'Dominican Republic':        [-70.2, 18.7],
  'Ecuador':                   [-77.8,  -1.8],
  'Egypt':                     [30.8,  26.8],
  'El Salvador':               [-88.9, 13.8],
  'Equatorial Guinea':         [10.3,   1.7],
  'Eritrea':                   [39.8,  15.2],
  'Estonia':                   [25.0,  58.7],
  'Eswatini':                  [31.5, -26.5],
  'Ethiopia':                  [40.5,   9.1],
  'Fiji':                      [178.1,-17.7],
  'Finland':                   [25.7,  64.0],
  'France':                    [2.3,   46.2],
  'Gabon':                     [11.6,  -0.8],
  'Gambia':                    [-15.3, 13.4],
  'Georgia':                   [43.4,  42.3],
  'Germany':                   [10.5,  51.2],
  'Ghana':                     [-1.0,   7.9],
  'Greece':                    [21.8,  39.1],
  'Grenada':                   [-61.7, 12.1],
  'Guatemala':                 [-90.2, 15.8],
  'Guinea':                    [-11.3, 11.0],
  'Guinea-Bissau':             [-15.2, 11.8],
  'Guyana':                    [-58.9,  4.9],
  'Haiti':                     [-72.3, 19.0],
  'Honduras':                  [-86.6, 15.2],
  'Hungary':                   [19.5,  47.0],
  'Iceland':                   [-18.5, 64.9],
  'India':                     [78.9,  20.6],
  'Indonesia':                 [113.9, -0.8],
  'Iran':                      [53.7,  32.4],
  'Iraq':                      [43.7,  33.2],
  'Ireland':                   [-8.2,  53.2],
  'Israel':                    [34.9,  31.5],
  'Italy':                     [12.5,  42.5],
  'Jamaica':                   [-77.3, 18.1],
  'Japan':                     [138.3, 36.2],
  'Jordan':                    [36.2,  30.6],
  'Kazakhstan':                [66.9,  48.0],
  'Kenya':                     [37.9,   0.0],
  'Kiribati':                  [-168.7, 1.9],
  'Kuwait':                    [47.5,  29.3],
  'Kyrgyzstan':                [74.6,  41.2],
  'Laos':                      [102.5, 17.9],
  'Latvia':                    [24.9,  56.9],
  'Lebanon':                   [35.9,  33.9],
  'Lesotho':                   [28.2, -29.6],
  'Liberia':                   [-9.4,   6.4],
  'Libya':                     [17.2,  26.3],
  'Liechtenstein':             [9.6,   47.2],
  'Lithuania':                 [23.9,  55.9],
  'Luxembourg':                [6.1,   49.8],
  'Madagascar':                [46.9, -18.8],
  'Malawi':                    [34.3, -13.3],
  'Malaysia':                  [109.7,  4.2],
  'Maldives':                  [73.2,   3.2],
  'Mali':                      [-1.7,  17.6],
  'Malta':                     [14.4,  35.9],
  'Marshall Islands':          [168.7,  7.1],
  'Mauritania':                [-10.9, 20.3],
  'Mauritius':                 [57.6, -20.3],
  'Mexico':                    [-102.6, 23.6],
  'Micronesia':                [150.5,  6.9],
  'Moldova':                   [28.4,  47.4],
  'Monaco':                    [7.4,   43.7],
  'Mongolia':                  [103.8, 46.9],
  'Montenegro':                [19.4,  42.7],
  'Morocco':                   [-7.1,  31.8],
  'Mozambique':                [35.5, -18.7],
  'Myanmar':                   [96.7,  19.2],
  'Namibia':                   [18.5, -22.0],
  'Nauru':                     [166.9, -0.5],
  'Nepal':                     [84.1,  28.4],
  'Netherlands':               [5.3,   52.1],
  'New Zealand':               [172.8,-41.0],
  'Nicaragua':                 [-85.0, 12.8],
  'Niger':                     [8.1,   16.1],
  'Nigeria':                   [8.7,    9.1],
  'North Korea':               [127.5, 40.3],
  'North Macedonia':           [21.7,  41.6],
  'Norway':                    [8.5,   65.5],
  'Oman':                      [57.6,  21.5],
  'Pakistan':                  [69.3,  30.4],
  'Palau':                     [134.6,  7.5],
  'Palestine':                 [35.3,  31.9],
  'Panama':                    [-80.0,  8.6],
  'Papua New Guinea':          [143.9, -6.3],
  'Paraguay':                  [-58.4,-23.4],
  'Peru':                      [-75.0,  -9.2],
  'Philippines':               [122.9, 12.9],
  'Poland':                    [19.1,  51.9],
  'Portugal':                  [-8.2,  39.4],
  'Qatar':                     [51.2,  25.4],
  'Romania':                   [25.0,  46.0],
  'Russia':                    [105.3, 61.5],
  'Rwanda':                    [29.9,  -1.9],
  'Saudi Arabia':              [45.1,  24.0],
  'Senegal':                   [-14.5, 14.5],
  'Serbia':                    [21.0,  44.0],
  'Seychelles':                [55.5,  -4.6],
  'Sierra Leone':              [-11.8,  8.6],
  'Singapore':                 [103.8,  1.3],
  'Slovakia':                  [19.7,  48.7],
  'Slovenia':                  [14.8,  46.1],
  'Solomon Islands':           [160.2, -9.6],
  'Somalia':                   [46.2,   6.1],
  'South Africa':              [25.1, -29.0],
  'South Korea':               [127.8, 36.0],
  'South Sudan':               [31.3,   7.0],
  'Spain':                     [-3.7,  40.4],
  'Sri Lanka':                 [80.7,   7.9],
  'Sudan':                     [29.9,  12.9],
  'Suriname':                  [-56.0,  4.0],
  'Sweden':                    [18.6,  60.1],
  'Switzerland':               [8.2,   46.8],
  'Syria':                     [38.5,  35.0],
  'Taiwan':                    [121.0, 23.7],
  'Tajikistan':                [71.3,  38.9],
  'Tanzania':                  [34.9,  -6.4],
  'Thailand':                  [100.5, 15.9],
  'Timor-Leste':               [125.7, -8.9],
  'Togo':                      [0.8,    8.6],
  'Tonga':                     [-175.2,-20.0],
  'Trinidad and Tobago':       [-61.2, 10.7],
  'Tunisia':                   [9.0,   34.0],
  'Turkey':                    [35.2,  38.9],
  'Turkmenistan':              [59.0,  39.0],
  'Tuvalu':                    [178.1, -8.5],
  'Uganda':                    [32.3,   1.4],
  'Ukraine':                   [31.2,  48.4],
  'United Arab Emirates':      [53.8,  24.0],
  'United Kingdom':            [-3.4,  55.4],
  'United States':             [-95.7, 37.1],
  'Uruguay':                   [-55.8,-33.0],
  'Uzbekistan':                [63.9,  41.4],
  'Vanuatu':                   [167.0,-15.4],
  'Vatican City':              [12.5,  41.9],
  'Venezuela':                 [-66.6,  7.1],
  'Vietnam':                   [108.3, 14.1],
  'Yemen':                     [47.6,  15.6],
  'Zambia':                    [27.8, -13.1],
  'Zimbabwe':                  [29.9, -20.0],
}

const COUNTRY_EMOJI: Record<string, string> = {
  'Afghanistan': '🫓', 'Albania': '🫒', 'Algeria': '🫕', 'Andorra': '🧀',
  'Angola': '🍲', 'Antigua and Barbuda': '🦞', 'Argentina': '🥩', 'Armenia': '🍇',
  'Australia': '🦘', 'Austria': '🥨', 'Azerbaijan': '🍢', 'Bahamas': '🦞',
  'Bahrain': '🐟', 'Bangladesh': '🐟', 'Barbados': '🦞', 'Belarus': '🥔',
  'Belgium': '🍟', 'Belize': '🌽', 'Benin': '🍲', 'Bhutan': '🌶️',
  'Bolivia': '🌽', 'Bosnia and Herzegovina': '🥩', 'Botswana': '🥩', 'Brazil': '🥩',
  'Brunei': '🍚', 'Bulgaria': '🥗', 'Burkina Faso': '🍲', 'Burundi': '🍌',
  'Cabo Verde': '🐟', 'Cambodia': '🍜', 'Cameroon': '🍲', 'Canada': '🍁',
  'Central African Republic': '🍲', 'Chad': '🍲', 'Chile': '🌶️', 'China': '🥟',
  'Colombia': '🌮', 'Comoros': '🌴', 'Congo': '🍲', 'Costa Rica': '🌮',
  'Croatia': '🐟', 'Cuba': '🥃', 'Cyprus': '🧀', 'Czech Republic': '🥨',
  'Denmark': '🥐', 'Djibouti': '🍲', 'Dominica': '🌴', 'Dominican Republic': '🌴',
  'Ecuador': '🍌', 'Egypt': '🧅', 'El Salvador': '🌮', 'Equatorial Guinea': '🍲',
  'Eritrea': '🫓', 'Estonia': '🐟', 'Eswatini': '🍲', 'Ethiopia': '🫓',
  'Fiji': '🌴', 'Finland': '🐟', 'France': '🥖', 'Gabon': '🍲',
  'Gambia': '🍲', 'Georgia': '🍷', 'Germany': '🥨', 'Ghana': '🍲',
  'Greece': '🫒', 'Grenada': '🌶️', 'Guatemala': '🌮', 'Guinea': '🍲',
  'Guinea-Bissau': '🍲', 'Guyana': '🍚', 'Haiti': '🍲', 'Honduras': '🌮',
  'Hungary': '🥘', 'Iceland': '🐟', 'India': '🍛', 'Indonesia': '🍚',
  'Iran': '🍚', 'Iraq': '🫓', 'Ireland': '🥔', 'Israel': '🧆',
  'Italy': '🍕', 'Jamaica': '🌶️', 'Japan': '🍣', 'Jordan': '🧆',
  'Kazakhstan': '🥩', 'Kenya': '🫕', 'Kiribati': '🐟', 'Kuwait': '🫕',
  'Kyrgyzstan': '🥩', 'Laos': '🍚', 'Latvia': '🐟', 'Lebanon': '🧆',
  'Lesotho': '🍲', 'Liberia': '🍚', 'Libya': '🫕', 'Liechtenstein': '🧀',
  'Lithuania': '🥔', 'Luxembourg': '🥩', 'Madagascar': '🍚', 'Malawi': '🍲',
  'Malaysia': '🍜', 'Maldives': '🐟', 'Mali': '🍲', 'Malta': '🐟',
  'Marshall Islands': '🐟', 'Mauritania': '🫕', 'Mauritius': '🍚', 'Mexico': '🌮',
  'Micronesia': '🐟', 'Moldova': '🍷', 'Monaco': '🥐', 'Mongolia': '🥩',
  'Montenegro': '🐟', 'Morocco': '🫕', 'Mozambique': '🐟', 'Myanmar': '🍜',
  'Namibia': '🥩', 'Nauru': '🐟', 'Nepal': '🫕', 'Netherlands': '🧀',
  'New Zealand': '🐑', 'Nicaragua': '🌮', 'Niger': '🍲', 'Nigeria': '🍲',
  'North Korea': '🍚', 'North Macedonia': '🫒', 'Norway': '🐟', 'Oman': '🫕',
  'Pakistan': '🫓', 'Palau': '🐟', 'Palestine': '🫒', 'Panama': '🌮',
  'Papua New Guinea': '🍠', 'Paraguay': '🥩', 'Peru': '🍋', 'Philippines': '🍖',
  'Poland': '🥣', 'Portugal': '🐟', 'Qatar': '🫕', 'Romania': '🥘',
  'Russia': '🥣', 'Rwanda': '🍲', 'Saudi Arabia': '🫕', 'Senegal': '🐟',
  'Serbia': '🥩', 'Seychelles': '🐟', 'Sierra Leone': '🍚', 'Singapore': '🍜',
  'Slovakia': '🥣', 'Slovenia': '🧀', 'Solomon Islands': '🐟', 'Somalia': '🍚',
  'South Africa': '🥩', 'South Korea': '🥩', 'South Sudan': '🍲', 'Spain': '🥘',
  'Sri Lanka': '🍛', 'Sudan': '🫕', 'Suriname': '🍚', 'Sweden': '🐟',
  'Switzerland': '🧀', 'Syria': '🫓', 'Taiwan': '🍜', 'Tajikistan': '🫓',
  'Tanzania': '🍲', 'Thailand': '🍜', 'Timor-Leste': '🍚', 'Togo': '🍲',
  'Tonga': '🌴', 'Trinidad and Tobago': '🌶️', 'Tunisia': '🫕', 'Turkey': '🍳',
  'Turkmenistan': '🫓', 'Tuvalu': '🐟', 'Uganda': '🍌', 'Ukraine': '🥣',
  'United Arab Emirates': '🫕', 'United Kingdom': '🐟', 'United States': '🍔',
  'Uruguay': '🥩', 'Uzbekistan': '🫓', 'Vanuatu': '🌴', 'Vatican City': '🍷',
  'Venezuela': '🌮', 'Vietnam': '🍲', 'Yemen': '🫕', 'Zambia': '🍲',
  'Zimbabwe': '🍲',
}

interface ContentByCountry {
  recipes: RecipeResponse[]
  ingredients: IngredientResponse[]
  techniques: TechniqueResponse[]
}

interface Props {
  recipes: RecipeResponse[]
  ingredients: IngredientResponse[]
  techniques: TechniqueResponse[]
}

interface TooltipState {
  x: number
  y: number
  country: string
  content: ContentByCountry
}

export default function WorldMapSection({ recipes, ingredients, techniques }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const contentByCountry: Record<string, ContentByCountry> = {}
  recipes.forEach((r) => {
    if (!r.country) return
    if (!contentByCountry[r.country]) contentByCountry[r.country] = { recipes: [], ingredients: [], techniques: [] }
    contentByCountry[r.country].recipes.push(r)
  })
  ingredients.forEach((i) => {
    if (!i.country) return
    if (!contentByCountry[i.country]) contentByCountry[i.country] = { recipes: [], ingredients: [], techniques: [] }
    contentByCountry[i.country].ingredients.push(i)
  })
  techniques.forEach((t) => {
    if (!t.country) return
    if (!contentByCountry[t.country]) contentByCountry[t.country] = { recipes: [], ingredients: [], techniques: [] }
    contentByCountry[t.country].techniques.push(t)
  })

  const activeCountries = Object.keys(contentByCountry).filter((c) => COUNTRY_COORDS[c])

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }

  const scheduleHide = () => {
    clearHideTimer()
    hideTimer.current = setTimeout(() => setTooltip(null), 220)
  }

  const handleMarkerEnter = useCallback((e: React.MouseEvent, country: string) => {
    clearHideTimer()
    const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect()
    const markerRect = (e.currentTarget as SVGElement).getBoundingClientRect()
    if (!rect) return
    setTooltip({
      x: markerRect.left - rect.left + markerRect.width / 2,
      y: markerRect.top - rect.top,
      country,
      content: contentByCountry[country],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentByCountry])

  const totalCount = (c: ContentByCountry) => c.recipes.length + c.ingredients.length + c.techniques.length

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-[#171433]">World Food Map</h2>
        <span className="text-xs text-gray-400">{activeCountries.length} countries with content</span>
      </div>

      <div className="relative border border-[#d67ec9] rounded-xl bg-white overflow-hidden shadow-sm">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [15, 20] }}
          style={{ width: '100%', height: 'auto' }}
          viewBox="0 0 800 420"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: '#f0eaf2', stroke: '#d67ec9', strokeWidth: 0.4, outline: 'none' },
                    hover:   { fill: '#ede8ee', stroke: '#8c2d9c', strokeWidth: 0.6, outline: 'none' },
                    pressed: { fill: '#d67ec9', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {activeCountries.map((country) => {
            const [lon, lat] = COUNTRY_COORDS[country]
            const emoji = COUNTRY_EMOJI[country] ?? '🍽️'
            return (
              <Marker key={country} coordinates={[lon, lat]}>
                <circle
                  r={10}
                  fill="#8c2d9c"
                  fillOpacity={0.15}
                  stroke="#8c2d9c"
                  strokeWidth={1}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => handleMarkerEnter(e, country)}
                  onMouseLeave={scheduleHide}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}
                >
                  {emoji}
                </text>
              </Marker>
            )
          })}
        </ComposableMap>

        {tooltip && (
          <div
            className="absolute z-10"
            style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, calc(-100% - 12px))' }}
            onMouseEnter={clearHideTimer}
            onMouseLeave={scheduleHide}
          >
            <div className="bg-white border border-[#d67ec9] rounded-xl shadow-lg px-4 py-3 min-w-[180px] max-w-[240px]">
              <p className="font-bold text-sm text-[#171433] mb-2">
                {COUNTRY_EMOJI[tooltip.country] ?? '🍽️'} {tooltip.country}
              </p>

              {tooltip.content.recipes.length > 0 && (
                <div className="mb-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Recipes</p>
                  {tooltip.content.recipes.slice(0, 3).map((r) => (
                    <Link
                      key={r.id}
                      to={`/recipes/${r.id}`}
                      className="block text-xs text-gray-700 hover:text-[#8c2d9c] truncate py-0.5"
                    >
                      • {r.title}
                    </Link>
                  ))}
                </div>
              )}

              {tooltip.content.ingredients.length > 0 && (
                <div className="mb-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Ingredients</p>
                  {tooltip.content.ingredients.slice(0, 3).map((i) => (
                    <Link
                      key={i.id}
                      to={`/catalog/ingredients/${i.id}`}
                      className="block text-xs text-gray-700 hover:text-[#8c2d9c] truncate py-0.5"
                    >
                      • {i.name}
                    </Link>
                  ))}
                </div>
              )}

              {tooltip.content.techniques.length > 0 && (
                <div className="mb-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Techniques</p>
                  {tooltip.content.techniques.slice(0, 3).map((t) => (
                    <Link
                      key={t.id}
                      to={`/catalog/techniques/${t.id}`}
                      className="block text-xs text-gray-700 hover:text-[#8c2d9c] truncate py-0.5"
                    >
                      • {t.name}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                to={`/search?q=${encodeURIComponent(tooltip.country)}`}
                className="mt-2 flex items-center justify-between text-xs font-semibold text-[#8c2d9c] hover:text-[#7a2589] border-t border-gray-100 pt-2"
              >
                <span>{totalCount(tooltip.content)} item{totalCount(tooltip.content) !== 1 ? 's' : ''}</span>
                <span>Explore {tooltip.country} →</span>
              </Link>
            </div>
            <div className="w-3 h-3 bg-white border-r border-b border-[#d67ec9] rotate-45 mx-auto -mt-1.5" />
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-[#8c2d9c] opacity-60" />
          <span className="text-xs text-gray-500">Hover a marker to preview · click to explore</span>
        </div>
      </div>
    </section>
  )
}
