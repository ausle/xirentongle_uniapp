type SvgNode = [string, Record<string, string>]

const iconMap = {
  'arrow-left': [
    ['path', { d: 'm12 19-7-7 7-7' }],
    ['path', { d: 'M19 12H5' }],
  ],
  bookmark: [['path', { d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' }]],
  'book-open': [
    ['path', { d: 'M12 7v14' }],
    [
      'path',
      {
        d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
      },
    ],
  ],
  calendar: [
    ['path', { d: 'M8 2v4' }],
    ['path', { d: 'M16 2v4' }],
    ['rect', { width: '18', height: '18', x: '3', y: '4', rx: '2' }],
    ['path', { d: 'M3 10h18' }],
  ],
  camera: [
    [
      'path',
      {
        d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
      },
    ],
    ['circle', { cx: '12', cy: '13', r: '3' }],
  ],
  'chevron-left': [['path', { d: 'm15 18-6-6 6-6' }]],
  'chevron-right': [['path', { d: 'm9 18 6-6-6-6' }]],
  'chevrons-up': [
    ['path', { d: 'm17 11-5-5-5 5' }],
    ['path', { d: 'm17 18-5-5-5 5' }],
  ],
  clock: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['polyline', { points: '12 6 12 12 16 14' }],
  ],
  'code-2': [
    ['path', { d: 'm18 16 4-4-4-4' }],
    ['path', { d: 'm6 8-4 4 4 4' }],
    ['path', { d: 'm14.5 4-5 16' }],
  ],
  eye: [
    [
      'path',
      {
        d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
      },
    ],
    ['circle', { cx: '12', cy: '12', r: '3' }],
  ],
  'external-link': [
    ['path', { d: 'M15 3h6v6' }],
    ['path', { d: 'M10 14 21 3' }],
    ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }],
  ],
  'file-text': [
    ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }],
    ['path', { d: 'M10 9H8' }],
    ['path', { d: 'M16 13H8' }],
    ['path', { d: 'M16 17H8' }],
  ],
  flame: [
    [
      'path',
      {
        d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
      },
    ],
  ],
  'git-fork': [
    ['circle', { cx: '12', cy: '18', r: '3' }],
    ['circle', { cx: '6', cy: '6', r: '3' }],
    ['circle', { cx: '18', cy: '6', r: '3' }],
    ['path', { d: 'M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9' }],
    ['path', { d: 'M12 12v3' }],
  ],
  heart: [
    [
      'path',
      {
        d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
      },
    ],
  ],
  history: [
    ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }],
    ['path', { d: 'M3 3v5h5' }],
    ['path', { d: 'M12 7v5l4 2' }],
  ],
  list: [
    ['path', { d: 'M3 12h.01' }],
    ['path', { d: 'M3 18h.01' }],
    ['path', { d: 'M3 6h.01' }],
    ['path', { d: 'M8 12h13' }],
    ['path', { d: 'M8 18h13' }],
    ['path', { d: 'M8 6h13' }],
  ],
  'log-out': [
    ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }],
    ['polyline', { points: '16 17 21 12 16 7' }],
    ['line', { x1: '21', x2: '9', y1: '12', y2: '12' }],
  ],
  phone: [
    [
      'path',
      {
        d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
      },
    ],
  ],
  scale: [
    ['path', { d: 'm16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' }],
    ['path', { d: 'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' }],
    ['path', { d: 'M7 21h10' }],
    ['path', { d: 'M12 3v18' }],
    ['path', { d: 'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2' }],
  ],
  search: [
    ['circle', { cx: '11', cy: '11', r: '8' }],
    ['path', { d: 'm21 21-4.3-4.3' }],
  ],
  'share-2': [
    ['circle', { cx: '18', cy: '5', r: '3' }],
    ['circle', { cx: '6', cy: '12', r: '3' }],
    ['circle', { cx: '18', cy: '19', r: '3' }],
    ['line', { x1: '8.59', x2: '15.42', y1: '13.51', y2: '17.49' }],
    ['line', { x1: '15.41', x2: '8.59', y1: '6.51', y2: '10.49' }],
  ],
  sparkles: [
    [
      'path',
      {
        d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
      },
    ],
    ['path', { d: 'M20 3v4' }],
    ['path', { d: 'M22 5h-4' }],
    ['path', { d: 'M4 17v2' }],
    ['path', { d: 'M5 18H3' }],
  ],
  star: [
    [
      'path',
      {
        d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
      },
    ],
  ],
  tag: [
    [
      'path',
      {
        d: 'M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z',
      },
    ],
    ['circle', { cx: '7.5', cy: '7.5', r: '.5', fill: 'currentColor' }],
  ],
  'trash-2': [
    ['path', { d: 'M3 6h18' }],
    ['path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }],
    ['path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }],
    ['line', { x1: '10', x2: '10', y1: '11', y2: '17' }],
    ['line', { x1: '14', x2: '14', y1: '11', y2: '17' }],
  ],
  user: [
    ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }],
    ['circle', { cx: '12', cy: '7', r: '4' }],
  ],
  x: [
    ['path', { d: 'M18 6 6 18' }],
    ['path', { d: 'm6 6 12 12' }],
  ],
} as const satisfies Record<string, SvgNode[]>

export type IconName = keyof typeof iconMap

interface BuildOptions {
  color?: string
  size?: number
  strokeWidth?: number
  filled?: boolean
}

function encode(value: string) {
  return encodeURIComponent(value)
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
}

function renderNode([tag, attrs]: SvgNode, color: string, filled: boolean) {
  const merged = {
    ...attrs,
    fill:
      attrs.fill === 'currentColor'
        ? color
        : tag === 'path' && filled
          ? color
          : attrs.fill ?? 'none',
  }
  const attrText = Object.entries(merged)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')
  return `<${tag} ${attrText} />`
}

export function buildIconDataUri(name: IconName, options: BuildOptions = {}) {
  const color = options.color ?? '#6B5757'
  const size = options.size ?? 16
  const strokeWidth = options.strokeWidth ?? 2
  const filled = options.filled ?? false
  const nodes = iconMap[name]
    .map((node) => renderNode(node, color, filled))
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${nodes}</svg>`
  return `data:image/svg+xml;utf8,${encode(svg)}`
}
