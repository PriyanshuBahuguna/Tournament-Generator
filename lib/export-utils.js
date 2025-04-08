/**
 * Utility functions for exporting tournament fixtures
 */

/**
 * Export the tournament fixture as an image
 * @param {HTMLElement} element - The element to capture
 * @param {string} fileName - The name of the file to download
 */
export function exportAsImage(element, fileName = "tournament-fixture.png") {
  // Create a canvas element
  const html2canvas = window.html2canvas
  if (!html2canvas) {
    console.error("html2canvas library not loaded")
    alert("Could not export as image. Please try again later.")
    return
  }

  // Show a loading indicator
  const loadingIndicator = document.createElement("div")
  loadingIndicator.style.position = "fixed"
  loadingIndicator.style.top = "0"
  loadingIndicator.style.left = "0"
  loadingIndicator.style.width = "100%"
  loadingIndicator.style.height = "100%"
  loadingIndicator.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
  loadingIndicator.style.display = "flex"
  loadingIndicator.style.alignItems = "center"
  loadingIndicator.style.justifyContent = "center"
  loadingIndicator.style.zIndex = "9999"

  const spinner = document.createElement("div")
  spinner.style.width = "3rem"
  spinner.style.height = "3rem"
  spinner.style.borderRadius = "50%"
  spinner.style.border = "4px solid white"
  spinner.style.borderTopColor = "transparent"
  spinner.style.animation = "spin 1s linear infinite"

  loadingIndicator.appendChild(spinner)
  document.body.appendChild(loadingIndicator)

  // Use html2canvas to capture the element
  html2canvas(element, {
    allowTaint: true,
    useCORS: true,
    backgroundColor: "#080808",
    scale: 2, // Higher scale for better quality
  })
    .then((canvas) => {
      // Remove the loading indicator
      document.body.removeChild(loadingIndicator)

      // Convert canvas to image and download
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = fileName
      link.click()
    })
    .catch((error) => {
      console.error("Error exporting as image:", error)
      document.body.removeChild(loadingIndicator)
      alert("Failed to export as image. Please try again.")
    })
}

/**
 * Export the tournament fixture as a PDF
 * @param {HTMLElement} element - The element to capture
 * @param {string} fileName - The name of the file to download
 */
export function exportAsPDF(element, fileName = "tournament-fixture.pdf") {
  // Create a canvas element
  const html2canvas = window.html2canvas
  const jsPDF = window.jspdf?.jsPDF

  if (!html2canvas || !jsPDF) {
    console.error("Required libraries not loaded")
    alert("Could not export as PDF. Please try again later.")
    return
  }

  // Show a loading indicator
  const loadingIndicator = document.createElement("div")
  loadingIndicator.style.position = "fixed"
  loadingIndicator.style.top = "0"
  loadingIndicator.style.left = "0"
  loadingIndicator.style.width = "100%"
  loadingIndicator.style.height = "100%"
  loadingIndicator.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
  loadingIndicator.style.display = "flex"
  loadingIndicator.style.alignItems = "center"
  loadingIndicator.style.justifyContent = "center"
  loadingIndicator.style.zIndex = "9999"

  const spinner = document.createElement("div")
  spinner.style.width = "3rem"
  spinner.style.height = "3rem"
  spinner.style.borderRadius = "50%"
  spinner.style.border = "4px solid white"
  spinner.style.borderTopColor = "transparent"
  spinner.style.animation = "spin 1s linear infinite"

  loadingIndicator.appendChild(spinner)
  document.body.appendChild(loadingIndicator)

  // Use html2canvas to capture the element
  html2canvas(element, {
    allowTaint: true,
    useCORS: true,
    backgroundColor: "#080808",
    scale: 2, // Higher scale for better quality
  })
    .then((canvas) => {
      // Remove the loading indicator
      document.body.removeChild(loadingIndicator)

      // Convert canvas to image
      const imgData = canvas.toDataURL("image/png")

      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      // Create PDF
      const pdf = new jsPDF("p", "mm")
      let position = 0

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new pages if needed for long content
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save PDF
      pdf.save(fileName)
    })
    .catch((error) => {
      console.error("Error exporting as PDF:", error)
      document.body.removeChild(loadingIndicator)
      alert("Failed to export as PDF. Please try again.")
    })
}

