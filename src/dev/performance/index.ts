let perf: Performance | undefined;

if (typeof window !== 'undefined') {
  perf = performance;
}

export function startMeasure(mark: string) {
  if (!perf) return;

  perf.mark(`${mark} Start`);
}

export function endMeasure(mark: string) {
  if (!perf) return;
  
  perf.mark(`${mark} End`);
  perf.measure(mark, `${mark} Start`, `${mark} End`);
}