import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
// This is required for react-pdf to work with Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SecurePDFViewerProps {
  fileUrl: string;
  watermarkText: string;
}

export const SecurePDFViewer = ({ fileUrl, watermarkText }: SecurePDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // Generate watermark pattern
  const WatermarkOverlay = () => (
    <div
      className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none flex flex-wrap content-center justify-center gap-12 opacity-20"
      style={{ transform: 'rotate(-45deg) scale(1.5)' }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="text-slate-900 font-bold text-xl whitespace-nowrap p-8">
          {watermarkText}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full h-full bg-slate-100/50 p-4 overflow-auto">
      {/* Controls */}
      <div className="sticky top-0 z-20 flex items-center justify-between w-full max-w-3xl mb-4 bg-white p-2 rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousPage} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={pageNumber >= numPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={() => setScale((s) => Math.min(2.0, s + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Viewer */}
      <div
        className="relative w-full max-w-3xl bg-white shadow-lg min-h-[calc(100vh-150px)] flex justify-center overflow-hidden"
        onContextMenu={(e) => e.preventDefault()} // Disable right click
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-[calc(100vh-150px)]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[calc(100vh-150px)] text-red-500">
              Failed to load document.
            </div>
          }
          className="flex justify-center"
        >
          <div className="relative">
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              renderMode="canvas"
              className="shadow-md"
            />
          </div>
        </Document>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center max-w-md">
        Protected Document. ID: {watermarkText}. Unauthorized distribution is prohibited.
      </p>
    </div>
  );
};
