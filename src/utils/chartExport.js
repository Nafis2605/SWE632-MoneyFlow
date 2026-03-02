/**
 * Chart Export Utilities
 * Functions to capture and convert charts to images for PDF embedding
 */

import html2canvas from 'html2canvas'

/**
 * Capture a chart element as a base64 image
 * @param {HTMLElement} chartElement - The chart container element
 * @returns {Promise<string>} Base64 encoded image string
 */
export const captureChartAsImage = async (chartElement) => {
  if (!chartElement) {
    return null
  }

  try {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    })
    
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error capturing chart as image:', error)
    return null
  }
}

/**
 * Capture multiple charts
 * @param {Object} chartRefs - Object containing references to chart elements
 * @returns {Promise<Object>} Object with chart names as keys and base64 images as values
 */
export const captureChartsAsImages = async (chartRefs) => {
  const images = {}
  
  for (const [name, element] of Object.entries(chartRefs)) {
    if (element) {
      images[name] = await captureChartAsImage(element)
    }
  }
  
  return images
}

/**
 * Get the dimensions for an image to fit in PDF
 * @param {number} imageWidth - Original image width
 * @param {number} imageHeight - Original image height
 * @param {number} maxWidth - Maximum width in PDF units
 * @param {number} maxHeight - Maximum height in PDF units
 * @returns {Object} Dimensions {width, height}
 */
export const calculateImageDimensions = (imageWidth, imageHeight, maxWidth, maxHeight) => {
  const widthRatio = maxWidth / imageWidth
  const heightRatio = maxHeight / imageHeight
  const ratio = Math.min(widthRatio, heightRatio)

  return {
    width: imageWidth * ratio,
    height: imageHeight * ratio
  }
}
