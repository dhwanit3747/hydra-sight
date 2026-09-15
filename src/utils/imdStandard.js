/**
 * Official India Meteorological Department (IMD) Standard 24-Hour Rainfall Intensity & Risk Standards
 * Ref: IMD Hydromet & Operational Weather Forecasting Standards
 */

export const IMD_RAINFALL_THRESHOLDS = [
  {
    code: 'VERY_LIGHT',
    label: 'Very Light Rain',
    range: '0.1 – 2.4 mm',
    min: 0.1,
    max: 2.4,
    risk: 'LOW',
    colorClass: 'text-slate-600 bg-slate-100 border-slate-200',
    dotColor: '#94a3b8'
  },
  {
    code: 'LIGHT',
    label: 'Light Rain',
    range: '2.5 – 15.5 mm',
    min: 2.5,
    max: 15.5,
    risk: 'LOW',
    colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
    dotColor: '#0284c7'
  },
  {
    code: 'MODERATE',
    label: 'Moderate Rain',
    range: '15.6 – 64.4 mm',
    min: 15.6,
    max: 64.4,
    risk: 'MODERATE',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    dotColor: '#d97706'
  },
  {
    code: 'HEAVY',
    label: 'Heavy Rain',
    range: '64.5 – 115.5 mm',
    min: 64.5,
    max: 115.5,
    risk: 'HIGH',
    colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
    dotColor: '#ea580c'
  },
  {
    code: 'VERY_HEAVY',
    label: 'Very Heavy Rain',
    range: '115.6 – 204.4 mm',
    min: 115.6,
    max: 204.4,
    risk: 'HIGH',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    dotColor: '#e11d48'
  },
  {
    code: 'EXTREMELY_HEAVY',
    label: 'Extremely Heavy Rain',
    range: '≥ 204.5 mm',
    min: 204.5,
    max: Infinity,
    risk: 'CRITICAL',
    colorClass: 'text-red-700 bg-red-100 border-red-300',
    dotColor: '#dc2626'
  }
];

export function getIMDRainfallCategory(rainfallMm) {
  const mm = Number(rainfallMm) || 0;
  if (mm < 2.5) {
    return {
      code: 'VERY_LIGHT',
      category: 'Very Light Rain',
      risk: 'LOW',
      range: '0.1 – 2.4 mm',
      hint: 'IMD: Very Light Rain (<2.5 mm)',
      colorClass: 'text-slate-600 bg-slate-100 border-slate-200',
      dotColor: '#94a3b8'
    };
  }
  if (mm <= 15.5) {
    return {
      code: 'LIGHT',
      category: 'Light Rain',
      risk: 'LOW',
      range: '2.5 – 15.5 mm',
      hint: 'IMD: Light Rain (Low Risk)',
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
      dotColor: '#0284c7'
    };
  }
  if (mm <= 64.4) {
    return {
      code: 'MODERATE',
      category: 'Moderate Rain',
      risk: 'MODERATE',
      range: '15.6 – 64.4 mm',
      hint: 'IMD: Moderate Rain (15.6 - 64.4 mm)',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
      dotColor: '#d97706'
    };
  }
  if (mm <= 115.5) {
    return {
      code: 'HEAVY',
      category: 'Heavy Rain',
      risk: 'HIGH',
      range: '64.5 – 115.5 mm',
      hint: 'IMD: Heavy Rain (High Risk)',
      colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
      dotColor: '#ea580c'
    };
  }
  if (mm <= 204.4) {
    return {
      code: 'VERY_HEAVY',
      category: 'Very Heavy Rain',
      risk: 'HIGH',
      range: '115.6 – 204.4 mm',
      hint: 'IMD: Very Heavy Rain (High Risk)',
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
      dotColor: '#e11d48'
    };
  }
  return {
    code: 'EXTREMELY_HEAVY',
    category: 'Extremely Heavy Rain',
    risk: 'CRITICAL',
    range: '≥ 204.5 mm',
    hint: 'IMD: Extremely Heavy Rain (Critical)',
    colorClass: 'text-red-700 bg-red-100 border-red-300',
    dotColor: '#dc2626'
  };
}
