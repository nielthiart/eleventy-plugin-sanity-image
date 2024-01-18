const imageUrl = require('@sanity/image-url')

const DEFAULT_QUALITY = 85

module.exports = function (eleventyConfig, options = {}) {
    function urlFor(source) {
        return imageUrl(options.client).image(source)
    }
    eleventyConfig.addShortcode('imageUrlFor', (image, width = "400") => {
        return urlFor(image)
            .width(width)
            .quality(options.quality || DEFAULT_QUALITY)
            .auto('format')
    })
    eleventyConfig.addShortcode('croppedUrlFor', (image, width, height) => {
        return urlFor(image)
            .width(width)
            .height(height)
            .quality(options.quality || DEFAULT_QUALITY)
            .auto('format')
    })

    eleventyConfig.addShortcode('responsiveImage', (image, srcs="320,640,900", sizes="100vw", classList="") => {
        const sizeArray = srcs.split(',');
        const firstSize = sizeArray[0];
        const lastSize = sizeArray[sizeArray.length - 1];
        const srcSetContent = sizeArray.map((size) => {
            const url = urlFor(image)
                .width(size)
                .quality(options.quality || DEFAULT_QUALITY)
                .auto('format')
                .url()

            return `${url} ${size}w`
        }).join(',')

        return (
            `<img 
                src="${urlFor(image).width(firstSize)}"
                ${classList ? "class='" + classList + "'" : ""}
                srcset="${srcSetContent}"
                sizes="${sizes}"
                width="${lastSize.trim()}">`
        )
    })




}