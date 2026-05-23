/**
 * Highly precise currency formatting utility for the Ghanaian Cedi market.
 * Conforms strictly to the hackathon specification of integer minor units (pesewas).
 */

/**
 * Converts minor currency units (pesewas) into a formatted Cedi string.
 * Example: 85000 -> "GH₵ 850.00"
 */
export const formatMinorToCedi = (pesewas: number): string => {
  if (isNaN(pesewas) || pesewas < 0) return 'GH₵ 0.00';
  
  const cedis = Math.floor(pesewas / 100);
  const remainingPesewas = pesewas % 100;
  
  // Pad single-digit pesewas with a leading zero (e.g., 5 pesewas -> "05")
  const paddedPesewas = remainingPesewas.toString().padStart(2, '0');
  
  return `GH₵ ${cedis}.${paddedPesewas}`;
};

/**
 * Converts a standard decimal Cedi number back into safe integer pesewas for API payloads.
 * Example: 850.55 -> 85055
 */
export const cediToMinor = (cedis: number): number => {
  if (isNaN(cedis) || cedis < 0) return 0;
  return Math.round(cedis * 100);
};
