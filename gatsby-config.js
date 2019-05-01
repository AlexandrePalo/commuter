module.exports = {
    siteMetadata: {
        title: 'Commuter',
    },
    plugins: [
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      }
    }
    ],
    }