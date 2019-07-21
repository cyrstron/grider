let perf: Performance | undefined;

if (typeof window !== 'undefined') {
  perf = performance;
}

export function startMeasure(mark: string) {
  if (!perf) return;

  perf.mark(`${mark} Start`);
}

export function endMeasure(mark: string, info?: string) {
  if (!perf) return;

  const markInfo = info ? `${mark}: ${info}` : mark;
  
  perf.mark(`${mark} End`);
  perf.measure(markInfo, `${mark} Start`, `${mark} End`);
}