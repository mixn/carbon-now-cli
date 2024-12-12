const defaultSettings: CarbonCLIPresetInterface = {
  theme: 'seti',
  backgroundColor: '#ADB7C1',
  windowTheme: 'none',
  windowControls: true,
  fontFamily: 'Hack',
  fontSize: '18px',
  lineNumbers: false,
  language: 'auto',
  firstLineNumber: 1,
  dropShadow: false,
  dropShadowOffsetY: '20px',
  dropShadowBlurRadius: '68px',
  selectedLines: '*',
  widthAdjustment: true,
  width: '20000px',
  lineHeight: '133%',
  paddingVertical: '48px',
  paddingHorizontal: '32px',
  squaredImage: false,
  watermark: false,
  exportSize: '2x',
  // Export type
  // This is not supported as a URL parameter by Carbon,
  // instead used as a default setting on my part
  type: 'png',
};

export default defaultSettings;
