import transformToQueryParams from '../../src/utils/transform-to-query-params.util.js';

const verminalPreset: CarbonCLIPresetInterface = {
  theme: 'verminal',
  backgroundColor: '#F30C96',
  windowTheme: 'bw',
  windowControls: true,
  fontFamily: 'Anonymous Pro',
  fontSize: '18px',
  lineNumbers: false,
  firstLineNumber: 1,
  dropShadow: false,
  selectedLines: '*',
  dropShadowOffsetY: '20px',
  dropShadowBlurRadius: '68px',
  widthAdjustment: true,
  width: '20000px',
  lineHeight: '133%',
  paddingVertical: '30px',
  paddingHorizontal: '30px',
  squaredImage: false,
  watermark: false,
  exportSize: '2x',
  type: 'png',
  titleBar: '_unfold.js',
};

describe('transformToQueryParams', () => {
  it('should map all keys of a preset to corresponding Carbon query params', async () => {
    expect(transformToQueryParams(verminalPreset)).toEqual({
      t: 'verminal',
      bg: '#F30C96',
      wt: 'bw',
      wc: true,
      fm: 'Anonymous Pro',
      fs: '18px',
      ln: false,
      fl: 1,
      ds: false,
      sl: '*',
      dsyoff: '20px',
      dsblur: '68px',
      wa: true,
      width: '20000px',
      lh: '133%',
      pv: '30px',
      ph: '30px',
      si: false,
      wm: false,
      es: '2x',
      type: 'png',
      tb: '_unfold.js',
    });
  });

  it('should work with any amount of mappable data', async () => {
    expect(
      transformToQueryParams({
        lineNumbers: false,
        firstLineNumber: 1,
        dropShadow: false,
        selectedLines: '*',
      } as CarbonCLIPresetInterface),
    ).toEqual({
      ln: false,
      fl: 1,
      ds: false,
      sl: '*',
    });
  });

  it('should simply pass on unmappable data', async () => {
    expect(
      transformToQueryParams({
        lineNumbers: false,
        firstLineNumber: 1,
        nothing: 'nothing',
        toTransformHere: 'transformable found',
      } as any),
    ).toEqual({
      ln: false,
      fl: 1,
      nothing: 'nothing',
      toTransformHere: 'transformable found',
    });
  });
});
