import asyncio
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends

from app.config.logger_config import setup_logger
from app.services.rag_service import RAGService, get_rag_service
from app.model.request.rag_request import TextIngestRequest, SearchRequest
from app.model.response.rag_response import IngestResponse, SearchResult
from app.constants.rag import (
    MAX_FILE_SIZE_MB,
    MAX_FILE_SIZE_BYTES,
    PDF_MAGIC_BYTES,
)

rag_router = APIRouter()
log = setup_logger("rag_router")


@rag_router.post("/ingest/file", response_model=IngestResponse)
async def ingest_file(
    file: UploadFile = File(...),
    vehicle_model: Optional[str] = Form(None),
    section: Optional[str] = Form(None),
    rag_service: RAGService = Depends(get_rag_service),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        pdf_bytes = await file.read()
        
        if len(pdf_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE_MB}MB"
            )
        
        if not pdf_bytes.startswith(PDF_MAGIC_BYTES):
            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file. File content does not match PDF format"
            )
        
        result = await asyncio.to_thread(
            rag_service.ingest_pdf,
            pdf_bytes=pdf_bytes,
            source=file.filename,
            vehicle_model=vehicle_model,
            section=section,
        )
        return IngestResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        log.error(f"Failed to ingest file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to ingest file: {str(e)}")


@rag_router.post("/ingest/text", response_model=IngestResponse)
async def ingest_text(
    request: TextIngestRequest,
    rag_service: RAGService = Depends(get_rag_service),
):
    try:
        result = await asyncio.to_thread(
            rag_service.ingest_text,
            text_content=request.text,
            source=request.source,
            vehicle_model=request.vehicle_model,
            section=request.section,
        )
        return IngestResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        log.error(f"Failed to ingest text: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to ingest text: {str(e)}")


@rag_router.post("/search", response_model=list[SearchResult])
async def search(
    request: SearchRequest,
    rag_service: RAGService = Depends(get_rag_service),
):
    try:
        if request.include_context:
            results = await asyncio.to_thread(
                rag_service.retrieve_with_context,
                query=request.query,
                vehicle_model=request.vehicle_model,
                section=request.section,
                top_k=request.top_k,
                context_window=request.context_window,
                score_threshold=request.score_threshold,
            )
        else:
            results = await asyncio.to_thread(
                rag_service.retrieve,
                query=request.query,
                vehicle_model=request.vehicle_model,
                section=request.section,
                top_k=request.top_k,
                score_threshold=request.score_threshold,
            )
        
        return results
    except Exception as e:
        log.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@rag_router.get("/sources")
async def list_sources(
    vehicle_model: Optional[str] = None,
    section: Optional[str] = None,
    rag_service: RAGService = Depends(get_rag_service),
):
    """List all ingested sources with optional filtering."""
    try:
        sources = await asyncio.to_thread(
            rag_service.list_sources,
            vehicle_model=vehicle_model,
            section=section,
        )
        return sources
    except Exception as e:
        log.error(f"Failed to list sources: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list sources: {str(e)}")


@rag_router.delete("/sources/{source}")
async def delete_source(
    source: str,
    rag_service: RAGService = Depends(get_rag_service),
):
    """Delete all chunks for a given source."""
    try:
        count = await asyncio.to_thread(
            rag_service.delete_by_source,
            source=source,
        )
        if count == 0:
            raise HTTPException(status_code=404, detail=f"Source '{source}' not found")
        return {"status": "success", "source": source, "chunks_deleted": count}
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Failed to delete source: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete source: {str(e)}")