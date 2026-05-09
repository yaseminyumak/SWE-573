declare module 'react-simple-maps' {
  import type { ReactNode, SVGProps } from 'react'

  interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string
    projectionConfig?: Record<string, unknown>
    viewBox?: string
    style?: React.CSSProperties
    children?: ReactNode
  }
  export function ComposableMap(props: ComposableMapProps): JSX.Element

  interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    children?: ReactNode
  }
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element

  interface GeographiesProps {
    geography: string | Record<string, unknown>
    children: (args: { geographies: GeoFeature[] }) => ReactNode
  }
  export function Geographies(props: GeographiesProps): JSX.Element

  interface GeoFeature {
    rsmKey: string
    [key: string]: unknown
  }

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: GeoFeature
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
  }
  export function Geography(props: GeographyProps): JSX.Element

  interface MarkerProps extends SVGProps<SVGGElement> {
    coordinates: [number, number]
    children?: ReactNode
  }
  export function Marker(props: MarkerProps): JSX.Element
}
