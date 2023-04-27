// Keys here are based on the corresponding Carbon query params,
// so we can avoid further string mapping, e.g., `dropShadow` ➝ `ds`
const defaultSettings: CarbonCLIPresetInterface = {
  // Theme
  t: 'seti',
  // Background
  bg: '#ADB7C1',
  // Window theme
  // none, sharp, bw
  wt: 'none',
  // Window controls
  wc: true,
  // Font family
  fm: 'Hack',
  // Font size
  fs: '18px',
  // Line numbers
  ln: false,
  // Drop shadow
  ds: false,
  // Drop shadow offset
  dsyoff: '20px',
  // Drop shadow blur
  dsblur: '68px',
  // Selected lines aka. highlighted lines
  sl: '*',
  // Auto adjust width
  wa: true,
  // Line height
  lh: '133%',
  // Padding vertical
  pv: '48px',
  // Padding horizontal
  ph: '32px',
  // Squared image
  si: false,
  // Watermark
  wm: false,
  // Export size
  // 1x, 2x, 4x
  es: '2x',
  // Export type
  // This is not supported as a URL parameter by Carbon,
  // instead used as a default setting on my part
  // 'png', 'svg'
  type: 'png',
};

export default defaultSettings;
