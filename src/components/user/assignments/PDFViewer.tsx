import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker URL
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="flex items-center justify-between p-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
            disabled={pageNumber >= (numPages || 1)}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100"
          >
            -
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center p-4"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
}