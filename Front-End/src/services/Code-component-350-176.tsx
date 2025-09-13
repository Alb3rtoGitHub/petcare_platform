// Utilidades para manejo de archivos
// Funciones helper para validación, compresión y manipulación de archivos

// Función para comprimir imágenes antes de subir
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convertir a blob
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Función para validar dimensiones de imagen
export const validateImageDimensions = (file, minWidth = 100, minHeight = 100, maxWidth = 5000, maxHeight = 5000) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const { width, height } = img
      
      if (width < minWidth || height < minHeight) {
        reject(new Error(`La imagen debe tener al menos ${minWidth}x${minHeight} píxeles`))
      } else if (width > maxWidth || height > maxHeight) {
        reject(new Error(`La imagen no puede ser mayor a ${maxWidth}x${maxHeight} píxeles`))
      } else {
        resolve({ width, height })
      }
      
      URL.revokeObjectURL(img.src)
    }
    
    img.onerror = () => {
      reject(new Error('No se pudo cargar la imagen'))
      URL.revokeObjectURL(img.src)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Función para crear preview de imagen
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    
    reader.readAsDataURL(file)
  })
}

// Función para validar archivo PDF
export const validatePDF = (file) => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/pdf') {
      reject(new Error('El archivo debe ser un PDF'))
      return
    }
    
    // Validar que sea realmente un PDF leyendo los primeros bytes
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const buffer = e.target.result
      const uint8Array = new Uint8Array(buffer)
      
      // Los archivos PDF empiezan con "%PDF"
      const pdfSignature = [0x25, 0x50, 0x44, 0x46] // %PDF
      
      let isValidPDF = true
      for (let i = 0; i < pdfSignature.length; i++) {
        if (uint8Array[i] !== pdfSignature[i]) {
          isValidPDF = false
          break
        }
      }
      
      if (isValidPDF) {
        resolve(true)
      } else {
        reject(new Error('El archivo no es un PDF válido'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al validar el archivo PDF'))
    }
    
    // Leer solo los primeros 10 bytes para validar
    reader.readAsArrayBuffer(file.slice(0, 10))
  })
}

// Función para formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Función para obtener extensión de archivo
export const getFileExtension = (fileName) => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

// Función para generar nombre seguro de archivo
export const sanitizeFileName = (fileName) => {
  // Remover caracteres especiales y espacios
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
}

// Función para crear thumbnail de imagen
export const createThumbnail = (file, size = 150) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      
      // Calcular dimensiones para crop centrado
      const { width, height } = img
      const min = Math.min(width, height)
      const x = (width - min) / 2
      const y = (height - min) / 2
      
      // Dibujar imagen crop y redimensionada
      ctx.drawImage(img, x, y, min, min, 0, 0, size, size)
      
      // Convertir a blob
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Función para detectar si el archivo es una imagen
export const isImageFile = (file) => {
  return file.type.startsWith('image/')
}

// Función para detectar si el archivo es un documento
export const isDocumentFile = (file) => {
  const documentTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ]
  return documentTypes.includes(file.type)
}

// Función para crear objeto de archivo con metadatos
export const createFileObject = (file, additionalData = {}) => {
  return {
    file: file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    extension: getFileExtension(file.name),
    isImage: isImageFile(file),
    isDocument: isDocumentFile(file),
    formattedSize: formatFileSize(file.size),
    ...additionalData
  }
}

// Función para validar múltiples archivos
export const validateMultipleFiles = async (files, options = {}) => {
  const {
    maxFiles = 5,
    maxTotalSize = 50 * 1024 * 1024, // 50MB
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  } = options
  
  const results = {
    valid: [],
    invalid: [],
    errors: []
  }
  
  // Validar cantidad
  if (files.length > maxFiles) {
    results.errors.push(`Máximo ${maxFiles} archivos permitidos`)
    return results
  }
  
  // Validar tamaño total
  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  if (totalSize > maxTotalSize) {
    results.errors.push(`Tamaño total excede ${formatFileSize(maxTotalSize)}`)
    return results
  }
  
  // Validar cada archivo
  for (const file of files) {
    const fileObj = createFileObject(file)
    
    if (!allowedTypes.includes(file.type)) {
      fileObj.error = 'Tipo de archivo no permitido'
      results.invalid.push(fileObj)
    } else {
      results.valid.push(fileObj)
    }
  }
  
  return results
}

// Hook personalizado para manejo de drag and drop
export const useDragAndDrop = (onFilesDrop, options = {}) => {
  const { multiple = false, accept = ['image/*'] } = options
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }
  
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    
    if (!multiple && files.length > 1) {
      console.warn('Solo se permite un archivo')
      return
    }
    
    // Filtrar archivos por tipo
    const validFiles = files.filter(file => {
      return accept.some(acceptType => {
        if (acceptType.includes('*')) {
          const baseType = acceptType.split('/')[0]
          return file.type.startsWith(baseType)
        }
        return file.type === acceptType
      })
    })
    
    if (validFiles.length > 0) {
      onFilesDrop(multiple ? validFiles : validFiles[0])
    }
  }
  
  return {
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  }
}

// Exportar todas las utilidades
export default {
  compressImage,
  validateImageDimensions,
  createImagePreview,
  validatePDF,
  formatFileSize,
  getFileExtension,
  sanitizeFileName,
  createThumbnail,
  isImageFile,
  isDocumentFile,
  createFileObject,
  validateMultipleFiles,
  useDragAndDrop
}