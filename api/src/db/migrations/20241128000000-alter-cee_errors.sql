ALTER TABLE CEE.CEE_APPLICATION_ERRORS
  DROP CONSTRAINT IF EXISTS cee_application_errors_application_id_fkey;

CREATE TABLE IF NOT EXISTS CEE.CEE_DELETED_APPLICATIONS (
  LIKE CEE.CEE_APPLICATIONS INCLUDING ALL,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cee_deleted_applications_uuid ON CEE.CEE_DELETED_APPLICATIONS(_id);
CREATE INDEX idx_cee_deleted_applications_deleted_at ON CEE.CEE_DELETED_APPLICATIONS(deleted_at);
