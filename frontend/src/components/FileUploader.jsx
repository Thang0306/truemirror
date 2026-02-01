import React, { useState } from 'react'

const FileUploader = ({ files, onChange, maxFiles = 4, maxSizeMB = 1 }) => {
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState([])

  const allowedTypes = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'text/plain': 'Text',
    'image/jpeg': 'Image',
    'image/jpg': 'Image',
    'image/png': 'Image'
  }

  const validateFile = (file) => {
    const errors = []

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      errors.push(`${file.name}: File quá lớn (tối đa ${maxSizeMB}MB)`)
    }

    // Check file type
    if (!allowedTypes[file.type]) {
      errors.push(`${file.name}: Loại file không được hỗ trợ`)
    }

    return errors
  }

  const handleFiles = (newFiles) => {
    setErrors([])

    // Convert FileList to Array
    const filesArray = Array.from(newFiles)

    // Check max files
    if (files.length + filesArray.length > maxFiles) {
      setErrors([`Tối đa ${maxFiles} files được phép upload`])
      return
    }

    // Validate each file
    const validationErrors = []
    filesArray.forEach(file => {
      const fileErrors = validateFile(file)
      validationErrors.push(...fileErrors)
    })

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    // Add files
    onChange([...files, ...filesArray])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleRemove = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
    setErrors([])
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType === 'text/plain') return '📃'
    if (fileType.includes('image')) return '🖼️'
    return '📎'
  }

  return (
    <div className="w-full max-w-md">
      <label className="block text-lg font-semibold text-brand-navy mb-3 text-left">
        Tải lên tài liệu
      </label>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex justify-center w-full h-30 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer ${
          dragActive ? 'border-brand-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } focus:outline-none`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="flex items-center space-x-2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="font-medium text-gray-600">
            Kéo thả file hoặc{' '}
            <span className="text-blue-600 underline">chọn file</span>
          </span>
        </label>
      </div>

      <div className="h-3"></div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Files đã chọn ({files.length}/{maxFiles}):</p>
          <div className="rounded-lg border-2 border-gray-300 file-uploader-list">
            {files.map((file, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center justify-between h-8 file-uploader-item">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg px-2"
                    title="Xóa file"
                  >
                    ✕
                  </button>
                </div>
                {index < files.length - 1 && <div className="h-2"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader
