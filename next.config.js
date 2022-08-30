const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["bransferstorage.blob.core.windows.net"],
  },
  reactStrictMode: false
});