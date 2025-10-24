"""
Pagination utilities for list endpoints
"""

from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List
from math import ceil


T = TypeVar('T')


class PaginationParams(BaseModel):
    """Standard pagination parameters"""
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    
    @property
    def skip(self) -> int:
        """Calculate skip value for database query"""
        return (self.page - 1) * self.page_size
    
    @property
    def limit(self) -> int:
        """Get page size limit"""
        return self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper"""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    
    @staticmethod
    def create(items: List[T], total: int, page: int, page_size: int) -> 'PaginatedResponse[T]':
        """Factory method to create paginated response"""
        total_pages = ceil(total / page_size) if page_size > 0 else 0
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )


class SortParams(BaseModel):
    """Sorting parameters"""
    sort_by: str = "created_at"
    sort_order: str = Field(default="desc", regex="^(asc|desc)$")
