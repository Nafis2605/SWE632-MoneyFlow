/**
 * Chart Export Utilities
 * Functions to capture and convert charts to images for PDF embedding
 * Handles proper timing and rendering detection
 */

import html2canvas from 'html2canvas'

/**
 * Wait for charts to be fully rendered
 * Checks for canvas elements within the chart container
 * @param {HTMLElement} chartElement - The chart container element
 * @param {number} maxWaitTime - Maximum time to wait in milliseconds (default: 5000)
 * @param {number} pollInterval - Time between checks in milliseconds (default: 100)
 * @returns {Promise<boolean>} True if charts detected, false if timeout
 */
export const waitForChartRender = async (chartElement, maxWaitTime = 5000, pollInterval = 100) => {
  if (!chartElement) {
    return false
  }

  const startTime = Date.now()
  
  while (Date.now() - startTime < maxWaitTime) {
    // Check for Recharts canvas elements or SVG elements
    const svgElements = chartElement.querySelectorAll('svg')
    const canvasElements = chartElement.querySelectorAll('canvas')
    
    if (svgElements.length > 0 || canvasElements.length > 0) {
      // Found chart elements, wait a bit more for animation to complete
      await new Promise(resolve => setTimeout(resolve, 300))
      return true
    }
    
    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }
  
  return false
}

/**
 * Capture a chart element as a base64 image with proper rendering checks
 * @param {HTMLElement} chartElement - The chart container element
 * @param {boolean} waitForRender - Whether to wait for chart to render (default: true)
 * @param {Object} options - Additional options for capture
 *   @param {number} options.scale - Scale factor for quality (default: 2, max: 3)
 *   @param {number} options.minHeight - Minimum capture height (default: 400)
 *   @param {number} options.minWidth - Minimum capture width (default: 600)
 * @returns {Promise<string|null>} Base64 encoded image string or null if failed
 */
export const captureChartAsImage = async (chartElement, waitForRender = true, options = {}) => {
  if (!chartElement) {
    console.warn('Chart element is null or undefined')
    return null
  }

  const { scale = 2, minHeight = 400, minWidth = 600 } = options

  try {
    // Wait for chart to be rendered if requested
    if (waitForRender) {
      const renderComplete = await waitForChartRender(chartElement, 5000)
      if (!renderComplete) {
        console.warn('Chart did not render within timeout period')
      }
    }

    // Store original styles
    const originalDisplay = chartElement.style.display
    const originalVisibility = chartElement.style.visibility
    const originalOpacity = chartElement.style.opacity
    const originalPosition = chartElement.style.position
    const originalLeft = chartElement.style.left
    const originalTop = chartElement.style.top
    
    // Ensure element is visible and positioned properly for capture
    chartElement.style.display = 'block'
    chartElement.style.visibility = 'visible'
    chartElement.style.opacity = '1'
    chartElement.style.position = 'absolute'
    chartElement.style.left = '0'
    chartElement.style.top = '0'

    // Calculate optimal dimensions for PDF export
    let captureHeight = Math.max(chartElement.scrollHeight, minHeight)
    let captureWidth = Math.max(chartElement.scrollWidth, minWidth)

    // Add small padding for better composition
    captureHeight = Math.ceil(captureHeight * 1.05)
    captureWidth = Math.ceil(captureWidth * 1.05)

    console.log(`Capturing chart: ${captureWidth}x${captureHeight}px (scale: ${scale}x)`)

    // Capture with high resolution for better quality
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: scale,
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      windowHeight: captureHeight,
      windowWidth: captureWidth
    })

    // Restore original styles
    chartElement.style.display = originalDisplay
    chartElement.style.visibility = originalVisibility
    chartElement.style.opacity = originalOpacity
    chartElement.style.position = originalPosition
    chartElement.style.left = originalLeft
    chartElement.style.top = originalTop

    const imageData = canvas.toDataURL('image/png')
    
    // Verify image is not empty
    if (imageData && imageData.length > 100) {
      console.log(`Successfully captured chart (${Math.round(imageData.length / 1024)}KB)`)
      return imageData
    } else {
      console.warn('Captured chart image appears to be empty')
      return null
    }
  } catch (error) {
    console.error('Error capturing chart as image:', error)
    return null
  }
}

/**
 * Capture multiple charts with sequential processing to avoid conflicts
 * @param {Object} chartRefs - Object containing references to chart elements
 *   e.g., { pieChart: element, barChart: element, trendsChart: element }
 * @param {boolean} waitForRender - Whether to wait for each chart to render
 * @param {Object} options - Options passed to captureChartAsImage
 *   @param {number} options.scale - Scale factor for capture
 *   @param {number} options.minHeight - Minimum capture height
 *   @param {number} options.minWidth - Minimum capture width
 * @returns {Promise<Object>} Object with chart names as keys and base64 images as values
 */
export const captureChartsAsImages = async (chartRefs, waitForRender = true, options = {}) => {
  const images = {}
  
  // Process charts sequentially to ensure proper rendering
  for (const [name, element] of Object.entries(chartRefs)) {
    if (element) {
      try {
        const image = await captureChartAsImage(element, waitForRender, options)
        if (image) {
          images[name] = image
        } else {
          console.warn(`Failed to capture chart: ${name}`)
        }
      } catch (error) {
        console.error(`Error processing chart ${name}:`, error)
      }
      
      // Small delay between chart captures to avoid conflicts
      await new Promise(resolve => setTimeout(resolve, 200))
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
