"""Document reserved-name attribute renames.

Revision ID: rename_metadata_attrs_20251206
Revises: digital_identity_20251205
Create Date: 2025-12-06 14:20:00
"""

from __future__ import annotations

from alembic import op

# revision identifiers, used by Alembic.
revision = "rename_metadata_attrs_20251206"
down_revision = "digital_identity_20251205"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """No-op: Attribute rename only, database columns unchanged."""
    pass


def downgrade() -> None:
    """No-op: Attribute rename only, database columns unchanged."""
    pass


