const fs = require('fs');

String.prototype.stripSuffixThrowing = function (suffix) {
  const index = this.lastIndexOf(suffix);
  if (index === -1 || index + suffix.length !== this.length) {
    throw new Error(`String '${this}' doesn't ends with ${suffix}`);
  }
  return this.substring(0, index);
};

buildStaticConfig();
buildBlogIndex();
buildWhatIReadIndex();
copyMarkdownToString('./static/about.md', 'src/content/AboutMarkdown.js');
copyMarkdownToString('./static/powered.md', 'src/content/PoweredMarkdown.js');
buildFeedXml();

function copyMarkdownToString(source, destination) {
  const markdown = fs.readFileSync(source, 'utf-8');
  writeJsonToFile(destination, JSON.stringify(markdown));
  console.log(`Copied content of ${source} to ${destination}`);
}

function buildStaticConfig() {
  writeJsonToFile('./src/content/StaticConfig.js', readConfigJson());
  console.log(`Copied content config.json to StaticConfig.js`);
}

function buildBlogIndex() {
  const posts = getAllBlogPosts();

  console.log(`Found ${posts.length} Blog posts`);

  writeJsonToFile('./src/content/BlogPosts.js', `[\n${posts.map(p => JSON.stringify(p, null, 2)).join(',\n')}\n]`);
}

function getAllBlogPosts() {
  const rootDir = './public/data/posts';
  const dirs = fs.readdirSync(rootDir);

  dirs.sort();
  dirs.reverse();

  return dirs
    .filter(name => fs.statSync(`${rootDir}/${name}`).isDirectory())
    .map(name => {
      const dir = `${rootDir}/${name}`;
      const metadata = fs.readFileSync(`${dir}/metadata.json`);
      const markdownFile = fs.readdirSync(`${dir}`).find(fn => fn.endsWith('.md'));
      if (!markdownFile) {
        throw new Error(`Failed to find .md file in ${dir}`);
      }
      const md = JSON.parse(metadata);
      md.url = markdownFile.stripSuffixThrowing('.md');
      md.source = `data/posts/${name}/${markdownFile}`;
      return md;
    });
}

function buildWhatIReadIndex() {
  const files = fs.readdirSync('./public/data/what-i-read');

  console.log(`Found ${files.length} What I Read files`);

  files.sort();
  files.reverse();

  const months = files
    .map(d => d.stripSuffixThrowing('.md'))
    .map(d => JSON.stringify(d));

  writeJsonToFile('./src/content/WirMonths.js', `[\n${months.join(',')}\n]`);
}

function buildFeedXml() {
  const posts = getAllBlogPosts()
    .filter(p => !p.draft);
  const config = JSON.parse(readConfigJson());
  const absoluteUrl = `${config.domain}${config.baseUrl}`;

  let content = '';

  content += '<?xml version="1.0" encoding="UTF-8"?>';
  content += `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.title}</title>
    <description>${config.description || config.title}</description>
    <link>${absoluteUrl}</link>
    <atom:link href="${absoluteUrl}feed.xml" rel="self" type="application/rss+xml" />
    <pubDate>${new Date(posts[0].date).toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`;

  posts.forEach(post => {
    const tags = (post.tags || []).map(t => `<category>${t}</category>`).join('\n        ');
    const postDescription = post.description && post.description.length ? post.description : post.title;
    const postUrl = `${absoluteUrl}p/${post.url}`;
    content += `
    <item>
      <title>${post.title}</title>
      <description>${postDescription}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      ${tags}
    </item>`
  });

  content += `
  </channel>
</rss>
`;

  fs.writeFileSync('./public/feed.xml', content);
}

function readConfigJson() {
  return fs.readFileSync('./static/config.json', 'utf-8');
}

function writeJsonToFile(file, json) {
  const content = `// this file is generated automatically by build.js!
export default ${json};
`;

  fs.writeFileSync(file, content);
}
