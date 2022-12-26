/**
 * Converts list.
 *
 * @param {Array} results Raw JMH output.
 * @param {function(benchmark: string, params: string)} extractor
 * @returns {Array} Converted list composed of extracted fields and pm (primaryMetric).
 */
export function exportDataTable(
  results: any[],
  extractor: (benchmark: string, params: any) => any
) {
  return results.map((value) => {
    const dimensions = extractor(value.benchmark, value.params);
    dimensions.pm = value.primaryMetric;
    return dimensions;
  });
}

export type JmhExtractorFunc = (pm: any) => number;
export interface JmhExtractorFuncHolder {
  func: JmhExtractorFunc | null;
}
export const EmptyJmhExtractorFuncHolder: JmhExtractorFuncHolder = {
  func: null,
};

export interface JmhAxisValueEx {
  name: string;
  value: string;
}
export type JmhAxisValue = string | JmhAxisValueEx;

export interface JmhAxisDescriptor {
  title: string;
  prop: string;
  values: JmhAxisValue[];
}

const nameOf = (av: JmhAxisValue): string => {
  const v = av as any;
  const { name = v } = v;
  return name;
};

const valueOf = (av: JmhAxisValue): string => {
  const v = av as any;
  const { value = v } = v;
  return value;
};

export type JmhDataValue = string | number;

/**
 * Convert data from list to a 2-dimensional array (table).
 *
 * @param {Array} list List of objects.
 * @param {function(pm)} extractByTimeUnitFunc Function to extract metric from primaryMetric object.
 * @param {{title: string, prop: string, values: [string|{name:string,value:string}]}} xDesc Descriptor for x-axis.
 * @param {{title: string, prop: string, values: [string|{name:string,value:string}]}} yDesc Descriptor for y-axis.
 * @returns {Array} 2-dimensional array (table) with data. First row is the header, 1 column (or 0) is header as well.
 */
export function buildData(
  list: any[],
  extractByTimeUnitFunc: JmhExtractorFunc,
  xDesc: JmhAxisDescriptor,
  yDesc: JmhAxisDescriptor
): JmhDataValue[][] {
  const result: JmhDataValue[][] = [];

  const header = [yDesc.title];
  xDesc.values.forEach((v) => {
    header.push(nameOf(v));
  });
  result.push(header);

  yDesc.values.forEach((y) => {
    const yName = nameOf(y);
    const yValue = valueOf(y);
    const dataForThisLine = list.filter((v) => v[yDesc.prop] === yValue);
    const line: JmhDataValue[] = [yName];
    xDesc.values.forEach((x) => {
      const xValue = valueOf(x);
      const d = dataForThisLine.find((v) => v[xDesc.prop] === xValue) || {
        pm: { scorePercentiles: {} },
      };
      line.push(Math.floor(extractByTimeUnitFunc(d.pm) || NaN));
    });
    if (line.slice(1).filter((v) => !Number.isNaN(v)).length > 0) {
      result.push(line);
    }
  });

  return result;
}
