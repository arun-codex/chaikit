/**
 * Client-side QR generation for UPI payment links.
 * Zero external network calls. Crisp, high-contrast SVG output.
 */

import { renderSVG } from 'uqr';
import type { QrOptions } from '../types/index.js';

/**
 * Generates an SVG string representation of a QR code for the given UPI URI or text data.
 */
export function generateQrSvg(data: string, options: QrOptions = {}): string {
  if (!data || typeof data !== 'string') {
    throw new Error('QR data must be a non-empty string.');
  }

  const {
    size = 220,
    margin = 3,
    foreground = '#1B1410',
    background = '#FFFFFF',
    ecc = 'M',
  } = options;

  // Render SVG using lightweight uqr
  const svg = renderSVG(data, {
    border: margin,
    ecc,
    blackColor: foreground,
    whiteColor: background,
  });

  // Ensure width/height attributes are set on root svg element without duplicating viewBox
  if (svg.startsWith('<svg')) {
    return svg.replace(
      '<svg',
      `<svg width="${size}" height="${size}" shape-rendering="crispEdges" aria-label="UPI Payment QR Code" role="img"`
    );
  }

  return svg;
}

/**
 * Converts an SVG string into a browser-safe Data URL.
 */
export function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
