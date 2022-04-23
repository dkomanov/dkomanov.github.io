// Support of image import
// https://stackoverflow.com/a/57176553
declare module '*.jpg';
declare module '*.png';

type Tag = {
  value: string;
  count: number;
};

export interface JmhBenchmarkPrimaryMetric {
  score: number;
  scoreError: number;
  scoreConfidence: number[];
  scorePercentiles: {
    [percentile: string]: number;
  };
  scoreUnit: string;
  rawData: number[][];
}

export interface JmhBenchmarkRun {
  benchmark: string;
  mode: string;
  params?: {
    [name: string]: string;
  };
  primaryMetric: JmhBenchmarkPrimaryMetric;
  secondaryMetrics: any;
}
