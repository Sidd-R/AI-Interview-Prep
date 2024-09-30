from PyPDF2 import PdfReader

def pdf_read():
    text = ""
    pdf_reader = PdfReader('resume.pdf')
    for page in pdf_reader.pages:
        text += page.extract_text()
        
    return text