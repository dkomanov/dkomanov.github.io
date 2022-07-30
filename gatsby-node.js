const { createRemoteFileNode } = require('gatsby-source-filesystem'); // https://github.com/gatsbyjs/gatsby/discussions/34929#discussioncomment-2775100
const requireEsm = require('esm')(module);
module.exports = requireEsm('./gatsby-node.esm.js');