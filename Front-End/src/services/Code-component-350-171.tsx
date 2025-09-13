// Servicio de upload local simulado
// Este servicio simula el almacenamiento local para desarrollo
// y está preparado para ser reemplazado por la implementación real de Spring Boot

// Configuración del servicio
const UPLOAD_CONFIG = {
  // Tamaños máximos por tipo de archivo (en bytes)
  maxSizes: {
    image: 5 * 1024 * 1024, // 5MB para imágenes
    document: 10 * 1024 * 1024, // 10MB para documentos
  },
  
  // Tipos de archivo permitidos
  allowedTypes: {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    document: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
  
  // Estructura de carpetas
  folders: {
    profiles: 'profiles',
    documents: 'documents', 
    pets: 'pets',
    temp: 'temp'
  },
  
  // URL base para servir archivos (en desarrollo)
  baseUrl: '/uploads'
}

// Simulación de almacenamiento local
const LOCAL_STORAGE_KEY = 'pet_care_uploads'

// Obtener archivos guardados localmente
const getStoredFiles = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error al obtener archivos almacenados:', error)
    return {}
  }
}

// Guardar archivo localmente
const saveFileLocally = (fileName, fileData, metadata) => {
  try {
    const storedFiles = getStoredFiles()
    storedFiles[fileName] = {
      data: fileData,
      metadata: metadata,
      uploadedAt: new Date().toISOString()
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedFiles))
    return true
  } catch (error) {
    console.error('Error al guardar archivo localmente:', error)
    return false
  }
}

// Generar nombre único para archivo
const generateFileName = (originalName, userId, folder, documentType = null) => {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  
  let fileName = `${userId}_${timestamp}`
  
  if (documentType) {
    fileName += `_${documentType}`
  }
  
  return `${folder}/${fileName}.${extension}`
}

// Validar archivo
const validateFile = (file, type) => {
  const errors = []
  
  // Validar tamaño
  if (file.size > UPLOAD_CONFIG.maxSizes[type]) {
    const maxSizeMB = UPLOAD_CONFIG.maxSizes[type] / (1024 * 1024)
    errors.push(`El archivo es muy grande. Máximo ${maxSizeMB}MB permitido.`)
  }
  
  // Validar tipo
  if (!UPLOAD_CONFIG.allowedTypes[type].includes(file.type)) {
    errors.push(`Tipo de archivo no permitido. Tipos permitidos: ${UPLOAD_CONFIG.allowedTypes[type].join(', ')}`)
  }
  
  return errors
}

// Convertir archivo a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Función principal de upload
export const uploadFile = async (file, options = {}) => {
  const {
    userId = 'anonymous',
    folder = 'temp',
    documentType = null,
    type = 'image'
  } = options
  
  try {
    // Validar archivo
    const validationErrors = validateFile(file, type)
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '))
    }
    
    // Generar nombre único
    const fileName = generateFileName(file.name, userId, folder, documentType)
    
    // Convertir a base64 para almacenamiento local
    const fileData = await fileToBase64(file)
    
    // Metadatos del archivo
    const metadata = {
      originalName: file.name,
      size: file.size,
      type: file.type,
      userId: userId,
      folder: folder,
      documentType: documentType
    }
    
    // Guardar localmente (simulación)
    const saved = saveFileLocally(fileName, fileData, metadata)
    
    if (!saved) {
      throw new Error('Error al guardar el archivo')
    }
    
    // Simular respuesta del servidor
    const response = {
      success: true,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: `${UPLOAD_CONFIG.baseUrl}/${fileName}`,
      uploadedAt: new Date().toISOString()
    }
    
    console.log('✅ Archivo subido localmente:', response)
    return response
    
  } catch (error) {
    console.error('❌ Error al subir archivo:', error)
    throw error
  }
}

// Función para upload de foto de perfil
export const uploadProfileImage = async (file, userId) => {
  return uploadFile(file, {
    userId,
    folder: UPLOAD_CONFIG.folders.profiles,
    type: 'image'
  })
}

// Función para upload de documento de identificación
export const uploadIdentityDocument = async (file, userId, documentType) => {
  return uploadFile(file, {
    userId,
    folder: UPLOAD_CONFIG.folders.documents,
    documentType,
    type: 'document'
  })
}

// Función para upload de foto de mascota
export const uploadPetImage = async (file, userId, petId = null) => {
  return uploadFile(file, {
    userId: petId ? `${userId}_pet_${petId}` : userId,
    folder: UPLOAD_CONFIG.folders.pets,
    type: 'image'
  })
}

// Función para obtener archivo almacenado
export const getStoredFile = (fileName) => {
  const storedFiles = getStoredFiles()
  return storedFiles[fileName] || null
}

// Función para obtener URL de archivo
export const getFileUrl = (fileName) => {
  const storedFile = getStoredFile(fileName)
  if (storedFile) {
    return storedFile.data // En desarrollo retornamos el base64
  }
  return null
}

// Función para eliminar archivo
export const deleteFile = (fileName) => {
  try {
    const storedFiles = getStoredFiles()
    if (storedFiles[fileName]) {
      delete storedFiles[fileName]
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedFiles))
      console.log('✅ Archivo eliminado:', fileName)
      return true
    }
    return false
  } catch (error) {
    console.error('❌ Error al eliminar archivo:', error)
    return false
  }
}

// Función para listar archivos de un usuario
export const getUserFiles = (userId, folder = null) => {
  const storedFiles = getStoredFiles()
  const userFiles = []
  
  for (const [fileName, fileData] of Object.entries(storedFiles)) {
    if (fileData.metadata.userId === userId) {
      if (!folder || fileData.metadata.folder === folder) {
        userFiles.push({
          fileName,
          ...fileData.metadata,
          url: `${UPLOAD_CONFIG.baseUrl}/${fileName}`,
          uploadedAt: fileData.uploadedAt
        })
      }
    }
  }
  
  return userFiles
}

// Función para limpiar archivos temporales (útil para desarrollo)
export const cleanTempFiles = () => {
  try {
    const storedFiles = getStoredFiles()
    let deleted = 0
    
    for (const [fileName, fileData] of Object.entries(storedFiles)) {
      if (fileData.metadata.folder === UPLOAD_CONFIG.folders.temp) {
        delete storedFiles[fileName]
        deleted++
      }
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedFiles))
    console.log(`🧹 Limpiados ${deleted} archivos temporales`)
    return deleted
  } catch (error) {
    console.error('Error al limpiar archivos temporales:', error)
    return 0
  }
}

// Exportar configuración para uso en otros componentes
export { UPLOAD_CONFIG }

// Función para cuando se integre con Spring Boot
export const uploadToSpringBoot = async (file, options = {}) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', options.userId || 'anonymous')
  formData.append('folder', options.folder || 'temp')
  
  if (options.documentType) {
    formData.append('documentType', options.documentType)
  }
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // No incluir Content-Type, el navegador lo hará automáticamente
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error al subir archivo a Spring Boot:', error)
    throw error
  }
}

// Detectar si estamos en desarrollo o producción
export const isLocalMode = () => {
  return process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_BASE_URL
}

// Función principal que decide entre local o Spring Boot
export const smartUpload = async (file, options = {}) => {
  if (isLocalMode()) {
    return uploadFile(file, options)
  } else {
    return uploadToSpringBoot(file, options)
  }
}