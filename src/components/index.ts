export { default as Article } from './Article/Article';
export { default as BlogPostList } from './BlogPostList/BlogPostList';
export { default as Button } from './Button/Button';
export { default as Changelog } from './Changelog/Changelog';
export { default as ChartAndTable } from './ChartAndTable/ChartAndTable';
export { default as Choose } from './Choose/Choose';
export { default as ErrorMessage } from './ErrorMessage/ErrorMessage';
export { default as EpisodeCard } from './EpisodeCard/EpisodeCard';
export { default as GoogleChart } from './GoogleChart/GoogleChart';
export { default as JmhChartPage } from './JmhChartPage/JmhChartPage';
export type { JmhChartComponentProps } from './JmhChartPage/JmhChartPage';
export { default as Loader } from './Loader/Loader';
export { default as Layout } from './Layout/Layout';
export { default as Markdown } from './Markdown/Markdown';
export { default as PageFooter } from './PageFooter/PageFooter';
export { default as Seo } from './Seo/Seo';
export { default as ShareButtons } from './ShareButtons/ShareButtons';
export { default as SiteMenu } from './SiteMenu/SiteMenu';
export { default as TagCloud } from './TagCloud/TagCloud';
export { default as Tags } from './Tags/Tags';
export { default as TeaserImage } from './TeaserImage/TeaserImage';
export { default as TimeUnits } from './TimeUnits/TimeUnits';

export type JdkVersion = 'openjdk-17' | 'openjdk-11' | 'openjdk-8';
export const Jdks: JdkVersion[] = ['openjdk-17', 'openjdk-11', 'openjdk-8'];

export function getChooseItems(
  values: string[],
  isDefault: (value: string, index: number) => boolean
) {
  return values.map((v, index) => {
    return {
      label: v,
      value: v,
      default: isDefault(v, index),
    };
  });
}
