"""
File Processing Service for TrueMirror
Converts files to base64 for Azure GPT-4 Vision API processing
No local OCR needed - all processing done via Azure API
"""

import base64
import os
from typing import Dict, List
from werkzeug.datastructures import FileStorage

# Only need python-docx for DOCX text extraction
try:
    from docx import Document
except ImportError:
    Document = None

# For PDF to image conversion (using PyMuPDF - no poppler dependency!)
try:
    import fitz  # PyMuPDF
    from PIL import Image
    import io
except ImportError:
    fitz = None
    Image = None


class FileProcessor:
    """Service for processing files and converting to base64 for Azure Vision API."""

    # Allowed MIME types
    ALLOWED_TYPES = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'text/plain': 'txt',
        'image/jpeg': 'image',
        'image/jpg': 'image',
        'image/png': 'image'
    }

    # Max file size in bytes (1MB = 1024 * 1024)
    MAX_FILE_SIZE = 1 * 1024 * 1024  # 1MB

    def __init__(self):
        """Initialize FileProcessor."""
        pass

    def validate_file(self, file: FileStorage, max_size_mb: int = 1) -> tuple:
        """
        Validate file size and type.

        Args:
            file: FileStorage object from Flask request
            max_size_mb: Maximum file size in MB

        Returns:
            (is_valid, error_message)
        """
        # Check if file exists
        if not file or not file.filename:
            return False, "File không tồn tại"

        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)  # Reset to beginning

        max_size_bytes = max_size_mb * 1024 * 1024
        if file_size > max_size_bytes:
            return False, f"File quá lớn (tối đa {max_size_mb}MB)"

        # Check MIME type
        content_type = file.content_type
        if content_type not in self.ALLOWED_TYPES:
            return False, f"Loại file không được hỗ trợ: {content_type}"

        return True, ""

    def extract_text_from_docx(self, file_content: bytes) -> str:
        """
        Extract text from DOCX file.

        Args:
            file_content: DOCX file content as bytes

        Returns:
            Extracted text string
        """
        if not Document:
            raise Exception("Không thể đọc file DOCX. Vui lòng cài đặt python-docx.")

        try:
            import io
            doc = Document(io.BytesIO(file_content))
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise Exception(f"Lỗi khi đọc file DOCX: {str(e)}")

    def extract_text_from_txt(self, file_content: bytes) -> str:
        """
        Extract text from TXT file.

        Args:
            file_content: TXT file content as bytes

        Returns:
            Extracted text string
        """
        try:
            # Try UTF-8 first
            text = file_content.decode('utf-8')
            return text.strip()
        except UnicodeDecodeError:
            try:
                # Fallback to Latin-1
                text = file_content.decode('latin-1')
                return text.strip()
            except Exception as e:
                raise Exception(f"Lỗi khi đọc file TXT: {str(e)}")

    def convert_pdf_to_images(self, file_content: bytes) -> list:
        """
        Convert PDF pages to images for Vision API processing.
        Uses PyMuPDF (fitz) - NO poppler dependency needed!

        Args:
            file_content: PDF file content as bytes

        Returns:
            List of base64 image dicts (one per page)
        """
        if not fitz or not Image:
            raise Exception("Cần cài PyMuPDF và Pillow để đọc PDF")

        try:
            # Open PDF from bytes using PyMuPDF
            pdf_document = fitz.open(stream=file_content, filetype="pdf")

            base64_images = []

            # Iterate through each page
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]

                # Render page to image (matrix for 200 DPI: 200/72 = 2.78)
                mat = fitz.Matrix(2.78, 2.78)
                pix = page.get_pixmap(matrix=mat)

                # Convert pixmap to PIL Image
                img_data = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_data))

                # Convert to JPEG and encode to base64
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='JPEG', quality=95)
                img_bytes = img_byte_arr.getvalue()

                # Encode to base64
                base64_data = base64.b64encode(img_bytes).decode('utf-8')

                base64_images.append({
                    'type': 'image_url',
                    'image_url': {
                        'url': f'data:image/jpeg;base64,{base64_data}'
                    }
                })

            pdf_document.close()

            print(f"[INFO] Converted PDF to {len(base64_images)} images using PyMuPDF")
            return base64_images

        except Exception as e:
            raise Exception(f"Lỗi khi convert PDF sang images: {str(e)}")

    def convert_to_base64_image(self, file_content: bytes, content_type: str) -> Dict:
        """
        Convert image to base64 format for Azure Vision API.

        Args:
            file_content: File content as bytes
            content_type: MIME type

        Returns:
            Dict with base64 data and metadata for Azure API
            For PDFs, returns list of image dicts (one per page)
        """
        try:
            # PDFs need to be converted to images first
            if 'pdf' in content_type:
                return self.convert_pdf_to_images(file_content)

            base64_data = base64.b64encode(file_content).decode('utf-8')

            # Determine image format for Azure (only images supported)
            if 'jpeg' in content_type or 'jpg' in content_type:
                image_format = 'jpeg'
            elif 'png' in content_type:
                image_format = 'png'
            else:
                image_format = 'jpeg'  # default

            # Return as single-item list for consistency
            return [{
                'type': 'image_url',
                'image_url': {
                    'url': f'data:image/{image_format};base64,{base64_data}'
                }
            }]
        except Exception as e:
            raise Exception(f"Lỗi khi convert file sang base64: {str(e)}")

    def process_file(self, file: FileStorage) -> Dict:
        """
        Process a single file: validate and prepare for Azure Vision API.

        For images/PDFs: Convert to base64 for Vision API
        For TXT/DOCX: Extract text directly

        Args:
            file: FileStorage object from Flask request

        Returns:
            Dictionary with file info:
            {
                'filename': str,
                'type': str,  # pdf, docx, txt, image
                'size': int,  # in bytes
                'text': str (if txt/docx) or None,
                'base64_content': dict (if image/pdf) or None
            }

        Raises:
            Exception if file processing fails
        """
        # Validate file
        is_valid, error_msg = self.validate_file(file)
        if not is_valid:
            raise Exception(error_msg)

        # Get file info
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)

        filename = file.filename
        content_type = file.content_type
        file_type = self.ALLOWED_TYPES.get(content_type, 'unknown')

        # Read file content
        file_content = file.read()
        file.seek(0)  # Reset for potential re-reading

        result = {
            'filename': filename,
            'type': file_type,
            'size': file_size,
            'content_type': content_type,
            'text': None,
            'base64_content': None
        }

        try:
            # Handle text files directly
            if file_type == 'txt':
                result['text'] = self.extract_text_from_txt(file_content)

            elif file_type == 'docx':
                result['text'] = self.extract_text_from_docx(file_content)

            # Handle images and PDFs via Azure Vision API (convert to base64)
            elif file_type in ['pdf', 'image']:
                result['base64_content'] = self.convert_to_base64_image(file_content, content_type)

            else:
                raise Exception(f"Loại file không được hỗ trợ: {file_type}")

            return result

        except Exception as e:
            raise Exception(f"Lỗi khi xử lý file {filename}: {str(e)}")

    def process_multiple_files(self, files: List[FileStorage]) -> List[Dict]:
        """
        Process multiple files.

        Args:
            files: List of FileStorage objects

        Returns:
            List of dictionaries with file info

        Raises:
            Exception if any file processing fails
        """
        if len(files) > 4:
            raise Exception("Tối đa 4 files được phép upload")

        results = []
        for i, file in enumerate(files):
            try:
                print(f"[INFO] Processing file {i+1}/{len(files)}: {file.filename}")
                result = self.process_file(file)
                results.append(result)

                if result['text']:
                    print(f"[SUCCESS] Extracted {len(result['text'])} characters from {file.filename}")
                else:
                    print(f"[SUCCESS] Converted {file.filename} to base64 for Azure Vision API")

            except Exception as e:
                print(f"[ERROR] Failed to process {file.filename}: {str(e)}")
                raise

        return results


# Singleton instance
file_processor = FileProcessor()
