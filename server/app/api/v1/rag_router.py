from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends

from app.config.logger_config import setup_logger
from app.services.rag_service import RAGService, get_rag_service
from app.model.request.rag_request import TextIngestRequest, SearchRequest
from app.model.response.rag_response import IngestResponse, SearchResult

rag_router = APIRouter()
log = setup_logger("rag_router")


@rag_router.post("/ingest/file", response_model=IngestResponse)
async def ingest_file(
    file: UploadFile = File(...),
    vehicle_model: Optional[str] = Form(None),
    section: Optional[str] = Form(None),
    rag_service: RAGService = Depends(get_rag_service),
):
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        pdf_bytes = await file.read()
        result = rag_service.ingest_pdf(
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
        result = rag_service.ingest_text(
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
            results = rag_service.retrieve_with_context(
                query=request.query,
                vehicle_model=request.vehicle_model,
                section=request.section,
                top_k=request.top_k,
                context_window=request.context_window,
            )
        else:
            results = rag_service.retrieve(
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