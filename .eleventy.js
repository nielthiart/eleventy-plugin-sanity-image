const imageUrl = require('@sanity/image-url')

const DEFAULT_QUALITY = 85

module.exports = function (eleventyConfig, options = {}) {
  function urlFor (source) {
    return imageUrl(options.client).image(source)
  }
  eleventyConfig.addShortcode(
    'imageUrlFor',
    (image, width = '400', quality) => {
      return urlFor(image)
        .width(width)
        .quality(quality || options.quality || DEFAULT_QUALITY)
        .auto('format')
    }
  )
  eleventyConfig.addShortcode(
    'croppedUrlFor',
    (image, width, height, quality) => {
      return urlFor(image)
        .width(width)
        .height(height)
        .quality(quality || options.quality || DEFAULT_QUALITY)
        .auto('format')
    }
  )

  eleventyConfig.addShortcode(
    'responsiveImage',
    (
      image,
      srcs = '320,640,900',
      sizes = '100vw',
      classList = '',
      alt,
      quality,
      height_factor
    ) => {
      const sizeArray = srcs.split(',')
      const firstSize = sizeArray[0]
      const lastSize = sizeArray[sizeArray.length - 1]
      const srcSetContent = sizeArray
        .map(size => {
          let url = urlFor(image)
            .width(size)
            .quality(quality || options.quality || DEFAULT_QUALITY)
            .auto('format')

          if (height_factor) {
            url = url.height(Math.round(size * height_factor))
          }

          return `${url.url()} ${size}w`
        })
        .join(',')

      return `<img 
                src="${urlFor(image).width(firstSize)}"
                ${classList ? "class='" + classList + "'" : ''}
                srcset="${srcSetContent}"
                sizes="${sizes}"
                width="${lastSize.trim()}"
                alt="${alt || image.alt || ''}"
                ${height_factor ? "height='" + Math.round(lastSize.trim() * height_factor) + "'" : ''}
            >`
    }
  )
}
