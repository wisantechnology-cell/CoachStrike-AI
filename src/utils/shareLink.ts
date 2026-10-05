import { AssessmentResult } from '../types';

/**
 * Encodes an AssessmentResult object into a URL-safe compact string.
 */
export function encodeReportToUrl(result: AssessmentResult): string {
  try {
    const jsonStr = JSON.stringify(result);
    // UTF-8 safe base64 encoding
    const encoded = btoa(
      encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    // Make URL-safe (replace +, / and trim =)
    return encodeURIComponent(encoded);
  } catch (err) {
    console.error('Failed to encode report for URL:', err);
    return '';
  }
}

/**
 * Decodes an encoded string back to an AssessmentResult object.
 */
export function decodeReportFromUrl(encodedStr: string): AssessmentResult | null {
  try {
    const raw = decodeURIComponent(encodedStr);
    const decodedJson = decodeURIComponent(
      Array.prototype.map
        .call(atob(raw), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const parsed = JSON.parse(decodedJson);
    if (parsed && parsed.playerName && parsed.primaryPosition && parsed.skills) {
      return parsed as AssessmentResult;
    }
    return null;
  } catch (err) {
    console.error('Failed to decode report from URL:', err);
    return null;
  }
}

/**
 * Builds the full absolute URL for sharing the full report.
 */
export function buildReportShareUrl(result: AssessmentResult): string {
  if (typeof window === 'undefined') return '';
  const token = encodeReportToUrl(result);
  const base = window.location.origin + window.location.pathname;
  return `${base}?report=${token}`;
}

/**
 * Copies the full report link to clipboard.
 */
export async function copyReportLinkToClipboard(result: AssessmentResult): Promise<{ success: boolean; url: string }> {
  try {
    const url = buildReportShareUrl(result);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('textarea');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    return { success: true, url };
  } catch (e) {
    console.error('Error copying report URL:', e);
    const fallbackUrl = buildReportShareUrl(result);
    return { success: false, url: fallbackUrl };
  }
}
