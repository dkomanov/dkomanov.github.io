const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
import { collectGQLFragments } from './collect-fragments.js';

exports.createPages = async ({ graphql, actions }) => {
  // https://github.com/gatsbyjs/gatsby/discussions/12155#discussioncomment-100921
  const fragments = await collectGQLFragments(
    path.resolve(__dirname, 'src/fragments')
  );

  const { createPage, createRedirect } = actions;

  createBlogByTagPages(createPage, await queryTags(graphql));
  createBlogPages(createPage, await queryMarkdowns(graphql, 'blog'));
  createStaticPages(createPage, await queryMarkdowns(graphql, 'static'));
  createWhatIReadPages(createPage, await queryMonths(graphql));
  createWhatIListenPages(createPage, await queryEpisodes(graphql, fragments));
  createAllOldRedirects(createRedirect);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const name = 'slug';
    const value = createFilePath({ node, getNode });
    switch (node.frontmatter.type) {
      case 'static':
        createNodeField({ name, node, value: value });
        break;

      case 'what-i-read':
        const yearMonth = value.split('/')[1];
        createNodeField({ name, node, value: `/what-i-read${value}` });
        createNodeField({ name: 'yearMonth', node, value: yearMonth });
        break;

      case 'what-i-listen':
        const [, slug] = value.match('/\\d{4}/(.*)/');
        createNodeField({ name, node, value: `/what-i-listen/${slug}` });
        break;

      case 'blog':
        if (!/\d{4}-\d{2}-\d{2}_/.test(value)) {
          throw new Error(`Unexpected directory format: ${value}`);
        }
        createNodeField({
          name,
          node,
          value: `/p/${value.substring(value.indexOf('_') + 1)}`,
        });
        createNodeField({
          name: 'date',
          node,
          value: value.substring(0, value.indexOf('_')),
        });
        break;

      default:
        if (!/charts\/.*md$/.test(node.fileAbsolutePath)) {
          throw new Error(`Unknown type: ${node.frontmatter.type}`);
        }
    }
  }
};

const queryMarkdowns = async (graphql, type) => {
  const result = await graphql(`{
      allMarkdownRemark(
          filter: {
            frontmatter: {
              type: {eq: "${type}"}
            }
          }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
      ) {
          edges {
              node {
                  fields {
                      slug
                  }
              }
          }
      }
      }`);

  if (result.errors) {
    throw result.errors;
  }

  return result.data.allMarkdownRemark.edges;
};

const queryTags = async (graphql) => {
  const result = await graphql(`
    query AllTags {
      allMarkdownRemark(
        filter: { frontmatter: { type: { eq: "blog" } } }
        limit: 1000
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  return result.data.allMarkdownRemark.group.map((v) => v.fieldValue);
};

const createBlogPages = (createPage, posts) => {
  const page = path.resolve(`./src/templates/blog-post.js`);

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: `${post.node.fields.slug}`,
      component: page,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });
};

const createStaticPages = (createPage, posts) => {
  const page = path.resolve(`./src/templates/static.js`);

  posts.forEach((post) => {
    createPage({
      path: `${post.node.fields.slug}`,
      component: page,
      context: {
        slug: post.node.fields.slug,
      },
    });
  });
};

const createBlogByTagPages = (createPage, tags) => {
  const page = path.resolve(`./src/templates/blog-by-tag.js`);

  tags.forEach((tag) => {
    createPage({
      path: `/posts/${tag}`,
      component: page,
      context: {
        tag,
      },
    });
  });
};

const queryMonths = async (graphql) => {
  const result = await graphql(`
    query AllYearMonths {
      allMarkdownRemark(
        filter: { frontmatter: { type: { eq: "what-i-read" } } }
        sort: { fields: fields___yearMonth, order: DESC }
      ) {
        edges {
          node {
            id
            fields {
              yearMonth
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  return result.data.allMarkdownRemark.edges.map((edge, index) => {
    const yearMonth = edge.node.fields.yearMonth;
    return {
      id: edge.node.id,
      path: index === 0 ? '/what-i-read' : `/what-i-read/${yearMonth}`,
      yearMonth: yearMonth,
    };
  });
};

const createWhatIReadPages = (createPage, months) => {
  const page = path.resolve('./src/templates/what-i-read/index.js');

  months.forEach((month) => {
    createPage({
      path: month.path,
      component: page,
      context: {
        id: month.id,
        months,
      },
    });
  });
};

const queryEpisodes = async (graphql, fragments) => {
  const data = await runQuery(
    graphql(`
      ${fragments}

      query AllEpisodes {
        allMarkdownRemark(
          filter: { frontmatter: { type: { eq: "what-i-listen" } } }
          sort: { fields: fields___slug, order: DESC }
        ) {
          edges {
            node {
              html
            }
          }
          ...ListenedPoscastEpisodeFragment
        }
      }
    `)
  );

  return data.allMarkdownRemark.edges.map(({ node }) => node);
};

const createWhatIListenPages = (createPage, nodes) => {
  createPage({
    path: '/what-i-listen',
    component: path.resolve('./src/templates/what-i-listen/list.tsx'),
    context: { nodes: nodes.filter((node) => !node.frontmatter.draft) },
  });

  nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(
        './src/templates/what-i-listen/single-episode.tsx'
      ),
      context: { node },
    });
  });
};

function createAllOldRedirects(createRedirect) {
  function redirect(from, to) {
    if (from.length === 0 || to.length === 0) {
      throw new Error('wrong redirect');
    }
    createRedirect({ fromPath: from, toPath: to, isPermanent: true });
  }

  redirect('/blog/tag/hebrew', '/posts/hebrew');
  redirect('/blog/tag/specs2', '/posts/specs2');
  redirect('/blog/tag/wix', '/posts/wix');
  redirect('/single-post/2015/07/14/About-Ulpan', '/p/about-ulpan/');
  redirect('/2015/07/15/about-ulpan.html', '/p/about-ulpan/');
  redirect('/2015/09/10/small-design-issues.html', '/p/small-design-issues/');
  redirect('/single-post/2015/09/15/Testing-asynchronous-code', '/p/testing-asynchronous-code/');
  redirect('/2015/09/13/testing-asynchronous-code.html', '/p/testing-asynchronous-code/');
  redirect('/2016/12/03/scala-stringbuilder-vs-java-stringbuilder-performance.html', '/p/scala-stringbuilder-vs-java-stringbuilder-performance/');
  redirect('/2016/01/09/scala-how-to-return-a-result-code-in-a-concise-way.html', '/p/scala-how-to-return-a-result-code-in-a-concise-way/');
  redirect('/2015/11/05/micro-optimization-for-uuid-fromstring-in-7-steps.html', '/p/micro-optimization-for-uuid-fromstring-in-7-steps/');
  redirect('/2016/12/05/scala-string-interpolation-performance.html', '/p/scala-string-interpolation-performance/');
  redirect('/2015/10/12/first-time-on-wix-engineering-blog.html', '/p/first-time-on-wix-engineering-blog/');
  redirect('/2015/11/16/lets-continue-with-uuid-fromstring.html', '/p/lets-continue-with-uuid-fromstring/');
  redirect('/2016/06/26/scala-serialization-updated.html', '/p/scala-serialization-updated/');
  redirect('/2016/02/02/one-more-threat-of-mockito.html', '/p/one-more-threat-of-mockito/');
  redirect('/2016/06/12/scala-serialization.html', '/p/scala-serialization/');
  redirect('/links', '/what-i-read');
  redirect('/scala-serialization', '/charts/scala-serialization/');
  redirect('/mysql-streaming', '/charts/mysql-streaming/');
  redirect('/scala-string-format', '/charts/scala-string-format/');
}

const runQuery = async (q) => {
  const { data, errors } = await q;
  if (errors) {
    throw errors;
  }
  return data;
};
