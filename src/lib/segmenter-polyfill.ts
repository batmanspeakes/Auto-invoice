/**
 * Simple polyfill for Intl.Segmenter for browsers that don't support it
 * Splits text into grapheme clusters (characters) as closely as possible
 */
export function splitIntoGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    // Use native Intl.Segmenter if available
    try {
      // @ts-ignore - TypeScript might not recognize Segmenter yet
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), segment => segment.segment);
    } catch (e) {
      console.warn("Intl.Segmenter failed, falling back to Array.from", e);
    }
  }
  
  // Fallback to Array.from which works for many basic cases
  // Note: This won't properly handle emoji sequences and some complex scripts
  return Array.from(text);
} 