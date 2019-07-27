const path = require(`path`);
const {createFilePath} = require(`gatsby-source-filesystem`);

exports.createPages = async ({graphql, actions}) => {
  const {createPage} = actions;

  createBlogByTagPages(createPage, await queryTags(graphql));
  createBlogPages(createPage, await queryMarkdowns(graphql, 'blog'));
  createStaticPages(createPage, await queryMarkdowns(graphql, 'static'));
  createWhatIReadPages(createPage, await queryMonths(graphql));
};

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const name = 'slug';
    const value = createFilePath({node, getNode});
    switch (node.frontmatter.type) {
      case 'static':
        createNodeField({name, node, value: value});
        break;

      case 'what-i-read':
        const date = new Date(value.split('/')[2] + '-01');

        createNodeField({name, node, value: `/what-i-read${value}`});
        createNodeField({name: 'month', node, value: date});
        break;

      case 'blog':
        if (!/\d{4}-\d{2}-\d{2}_/.test(value)) {
          throw new Error(`Unexpected directory format: ${value}`);
        }
        createNodeField({
          name,
          node,
          value: `/p/${value.substr(value.indexOf('_') + 1)}`,
        });
        createNodeField({
          name: 'date',
          node,
          value: value.substr(0, value.indexOf('_')),
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
        filter: {
          frontmatter: {
            type: { eq: "blog"}
          }
        }
        limit: 1000
      ) {
        group(field:frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  return result.data.allMarkdownRemark.group.map(v => v.fieldValue);
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

  posts.forEach(post => {
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

  tags.forEach(tag => {
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
    query AllMonths {
      allMarkdownRemark(
        filter: {
          frontmatter: {
            type: {eq: "what-i-read"}
          }
        },
        sort: { fields: [fields___month], order: DESC }
      ) {
        edges {
          node {
            id
            fields {
              month(formatString: "YYYY-DD")
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
    const month = edge.node.fields.month;
    return {
      id: edge.node.id,
      path: index === 0 ? '/what-i-read' : `/what-i-read/${month}`,
      month
    };
  });
};

const createWhatIReadPages = (createPage, months) => {
  const page = path.resolve('./src/templates/what-i-read/index.js');

  months.forEach(month => {
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
