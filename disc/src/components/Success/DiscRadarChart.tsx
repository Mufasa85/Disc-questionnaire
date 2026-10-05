import ReactApexChart from 'react-apexcharts'
import type { Profile } from '../../types'
import { PROFILES } from '../../utils/profiles'

/**
 * Radar chart DISC avec ApexCharts.
 * Reproduit le design : axes pointilles, polygones colores, emojis + scores.
 */
export function DiscRadarChart({ scores }: { scores: Record<Profile, number> }) {
  const keys: Profile[] = ['D', 'I', 'S', 'C']

  const series = [
    {
      name: 'Score',
      data: keys.map((k) => scores[k] || 0),
    },
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar' as const,
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'transparent',
    },
    // Couleurs distinctes par point (D, I, S, C)
    colors: [PROFILES.D.color, PROFILES.I.color, PROFILES.S.color, PROFILES.C.color],
    stroke: {
      width: 2,
      colors: [PROFILES.D.color, PROFILES.I.color, PROFILES.S.color, PROFILES.C.color],
    },
    fill: {
      opacity: 0.12,
      type: 'solid',
    },
    markers: {
      size: 6,
      strokeWidth: 0,
      strokeColors: '#fff',
      colors: [PROFILES.D.color, PROFILES.I.color, PROFILES.S.color, PROFILES.C.color],
      hover: { size: 8 },
    },
    // Labels : emoji en grand + "X - N" en dessous
    labels: keys.map((k) => `${PROFILES[k].emoji}\n${k} - ${scores[k] || 0}`),
    xaxis: {
      labels: {
        style: {
          fontSize: '13px',
          fontWeight: 600,
          colors: '#0F2D5C',
        },
      },
    },
    yaxis: {
      show: false,
      min: 0,
      max: 25,
    },
    // Quadrillage en pointilles (comme sur l'image)
    grid: {
      borderColor: '#CBD5E1',
      strokeDashArray: 4,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#CBD5E1',
          connectorColors: '#CBD5E1',
          fill: {
            colors: ['transparent'],
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val} / 25`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 320 },
          xaxis: { labels: { style: { fontSize: '11px' } } },
        },
      },
    ],
  }

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="radar"
        height={420}
        width="100%"
      />
    </div>
  )
}
