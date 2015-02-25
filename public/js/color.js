'use strict';

// http://d.hatena.ne.jp/ja9/20100907/1283840213

/**
 * RGB を HLS へ変換します
 *
 * @param   {Number}  r         red値   ※ 0～255 の数値
 * @param   {Number}  g         green値 ※ 0～255 の数値
 * @param   {Number}  b         blue値  ※ 0～255 の数値
 * @return  {Object}  {h, l, s} ※ h は 0～360の数値、l/s は 0～1 の数値
 */
function RGBtoHLS(r, g, b) {
  var h, // 0..360
      l, s; // 0..1

  // 0..1 に変換
  r = r / 255;
  g = g / 255;
  b = b / 255;
  var max = Math.max(Math.max(r, g), b),
      min = Math.min(Math.min(r, g), b);

  // hue の計算
  if (max == min) {
    h = 0; // 本来は定義されないが、仮に0を代入
  } else if (max == r) {
    h = 60 * (g - b) / (max - min) + 0;
  } else if (max == g) {
    h = (60 * (b - r) / (max - min)) + 120;
  } else {
    h = (60 * (r - g) / (max - min)) + 240;
  }

  while (h < 0) {
    h += 360;
  }

  // Lightness の計算
  l = (max + min) / 2;

  // Saturation の計算
  if (max == min) {
    s = 0;
  } else {
    s = (l < 0.5)
      ? (max - min) / (max + min)
      : (max - min) / (2.0 - max - min);
  }

  return {'h': h, 'l': l, 's': s, 'type': 'HLS'};
}

/**
 * HLS を RGB へ変換します
 *
 * @param   {Number}  h         hue値        ※ 0～360の数値
 * @param   {Number}  l         lightness値  ※ 0～1 の数値
 * @param   {Number}  s         saturation値 ※ 0～1 の数値
 * @return  {Object}  {r, g, b} ※ r/g/b は 0～255 の数値
 */
function HLStoRGB(h, l, s) {
  var r, g, b; // 0..255

  while (h < 0) {
    h += 360;
  }
  h = h % 360;

  // 特別な場合 saturation = 0
  if (s == 0) {
    // → RGB は V に等しい
    l = Math.round(l * 255);
    return {'r': l, 'g': l, 'b': l, 'type': 'RGB'};
  }

  var m2 = (l < 0.5) ? l * (1 + s) : l + s - l * s,
      m1 = l * 2 - m2,
      tmp;

  tmp = h + 120;
  if (tmp > 360) {
    tmp = tmp - 360
  }

  if (tmp < 60) {
    r = (m1 + (m2 - m1) * tmp / 60);
  } else if (tmp < 180) {
    r = m2;
  } else if (tmp < 240) {
    r = m1 + (m2 - m1) * (240 - tmp) / 60;
  } else {
    r = m1;
  }

  tmp = h;
  if (tmp < 60) {
    g = m1 + (m2 - m1) * tmp / 60;
  } else if (tmp < 180) {
    g = m2;
  } else if (tmp < 240) {
    g = m1 + (m2 - m1) * (240 - tmp) / 60;
  } else {
    g = m1;
  }

  tmp = h - 120;
  if (tmp < 0) {
    tmp = tmp + 360
  }
  if (tmp < 60) {
    b = m1 + (m2 - m1) * tmp / 60;
  } else if (tmp < 180) {
    b = m2;
  } else if (tmp < 240) {
    b = m1 + (m2 - m1) * (240 - tmp) / 60;
  } else {
    b = m1;
  }

  return {'r': Math.round(r * 255), 'g': Math.round(g * 255), 'b': Math.round(b * 255), 'type': 'RGB'};
}