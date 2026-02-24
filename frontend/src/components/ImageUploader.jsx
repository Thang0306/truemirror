import React, { useState } from 'react'

const ImageUploader = ({ file, onChange, maxSizeMB = 5 }) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const validateFile = (file) => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File quá lớn (tối đa ${maxSizeMB}MB)`
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Chỉ hỗ trợ upload file hình ảnh'
    }

    return ''
  }

  const handleFile = (newFile) => {
    setError('')
    const fileError = validateFile(newFile)
    
    if (fileError) {
      setError(fileError)
      return
    }

    onChange(newFile)
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
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError('')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="w-full flex flex-col items-center">
      <label className="block text-lg font-semibold text-brand-navy mb-3 text-center">
        Chọn ảnh chủ đề
      </label>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-xl appearance-none cursor-pointer ${
          dragActive ? 'border-brand-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } focus:outline-none`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-file-input"
        />
        <label htmlFor="image-file-input" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-gray-600 text-center text-sm">
            Kéo thả ảnh hoặc <span className="text-brand-blue underline">chọn từ máy tính</span>
          </span>
        </label>
      </div>

      <div className="h-3"></div>

      {/* Error messages */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* File list / Image preview */}
      {file && (
        <div className="w-full mt-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                 {/* Image preview thumbnail */}
                 <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
               </div>
               <div className="min-w-0 flex-1">
                 <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                 <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
               </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors shrink-0"
              title="Xóa ảnh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
