---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 780
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 780 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: postgresql.sql]---
Location: mlflow-master/tests/db/schemas/postgresql.sql

```sql

CREATE TABLE alembic_version (
	version_num VARCHAR(32) NOT NULL,
	CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
)


CREATE TABLE endpoints (
	endpoint_id VARCHAR(36) NOT NULL,
	name VARCHAR(255),
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT endpoints_pk PRIMARY KEY (endpoint_id)
)


CREATE TABLE entity_associations (
	association_id VARCHAR(36) NOT NULL,
	source_type VARCHAR(36) NOT NULL,
	source_id VARCHAR(36) NOT NULL,
	destination_type VARCHAR(36) NOT NULL,
	destination_id VARCHAR(36) NOT NULL,
	created_time BIGINT,
	CONSTRAINT entity_associations_pk PRIMARY KEY (source_type, source_id, destination_type, destination_id)
)


CREATE TABLE evaluation_datasets (
	dataset_id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	schema TEXT,
	profile TEXT,
	digest VARCHAR(64),
	created_time BIGINT,
	last_update_time BIGINT,
	created_by VARCHAR(255),
	last_updated_by VARCHAR(255),
	CONSTRAINT evaluation_datasets_pk PRIMARY KEY (dataset_id)
)


CREATE TABLE experiments (
	experiment_id INTEGER DEFAULT nextval('experiments_experiment_id_seq'::regclass) NOT NULL,
	name VARCHAR(256) NOT NULL,
	artifact_location VARCHAR(256),
	lifecycle_stage VARCHAR(32),
	creation_time BIGINT,
	last_update_time BIGINT,
	CONSTRAINT experiment_pk PRIMARY KEY (experiment_id),
	CONSTRAINT experiments_name_key UNIQUE (name),
	CONSTRAINT experiments_lifecycle_stage CHECK (lifecycle_stage::text = ANY (ARRAY['active'::character varying, 'deleted'::character varying]::text[]))
)


CREATE TABLE input_tags (
	input_uuid VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	value VARCHAR(500) NOT NULL,
	CONSTRAINT input_tags_pk PRIMARY KEY (input_uuid, name)
)


CREATE TABLE inputs (
	input_uuid VARCHAR(36) NOT NULL,
	source_type VARCHAR(36) NOT NULL,
	source_id VARCHAR(36) NOT NULL,
	destination_type VARCHAR(36) NOT NULL,
	destination_id VARCHAR(36) NOT NULL,
	step BIGINT DEFAULT '0'::bigint NOT NULL,
	CONSTRAINT inputs_pk PRIMARY KEY (source_type, source_id, destination_type, destination_id)
)


CREATE TABLE jobs (
	id VARCHAR(36) NOT NULL,
	creation_time BIGINT NOT NULL,
	job_name VARCHAR(500) NOT NULL,
	params TEXT NOT NULL,
	timeout DOUBLE PRECISION,
	status INTEGER NOT NULL,
	result TEXT,
	retry_count INTEGER NOT NULL,
	last_update_time BIGINT NOT NULL,
	CONSTRAINT jobs_pk PRIMARY KEY (id)
)


CREATE TABLE registered_models (
	name VARCHAR(256) NOT NULL,
	creation_time BIGINT,
	last_updated_time BIGINT,
	description VARCHAR(5000),
	CONSTRAINT registered_model_pk PRIMARY KEY (name)
)


CREATE TABLE secrets (
	secret_id VARCHAR(36) NOT NULL,
	secret_name VARCHAR(255) NOT NULL,
	encrypted_value BYTEA NOT NULL,
	wrapped_dek BYTEA NOT NULL,
	kek_version INTEGER NOT NULL,
	masked_value VARCHAR(100) NOT NULL,
	provider VARCHAR(64),
	auth_config TEXT,
	description TEXT,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT secrets_pk PRIMARY KEY (secret_id)
)


CREATE TABLE webhooks (
	webhook_id VARCHAR(256) NOT NULL,
	name VARCHAR(256) NOT NULL,
	description VARCHAR(1000),
	url VARCHAR(500) NOT NULL,
	status VARCHAR(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
	secret VARCHAR(1000),
	creation_timestamp BIGINT,
	last_updated_timestamp BIGINT,
	deleted_timestamp BIGINT,
	CONSTRAINT webhook_pk PRIMARY KEY (webhook_id)
)


CREATE TABLE datasets (
	dataset_uuid VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	name VARCHAR(500) NOT NULL,
	digest VARCHAR(36) NOT NULL,
	dataset_source_type VARCHAR(36) NOT NULL,
	dataset_source TEXT NOT NULL,
	dataset_schema TEXT,
	dataset_profile TEXT,
	CONSTRAINT dataset_pk PRIMARY KEY (experiment_id, name, digest),
	CONSTRAINT fk_datasets_experiment_id_experiments FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_bindings (
	endpoint_id VARCHAR(36) NOT NULL,
	resource_type VARCHAR(50) NOT NULL,
	resource_id VARCHAR(255) NOT NULL,
	created_at BIGINT NOT NULL,
	created_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	CONSTRAINT endpoint_bindings_pk PRIMARY KEY (endpoint_id, resource_type, resource_id),
	CONSTRAINT fk_endpoint_bindings_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	endpoint_id VARCHAR(36) NOT NULL,
	CONSTRAINT endpoint_tag_pk PRIMARY KEY (key, endpoint_id),
	CONSTRAINT fk_endpoint_tags_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE
)


CREATE TABLE evaluation_dataset_records (
	dataset_record_id VARCHAR(36) NOT NULL,
	dataset_id VARCHAR(36) NOT NULL,
	inputs JSON NOT NULL,
	expectations JSON,
	tags JSON,
	source JSON,
	source_id VARCHAR(36),
	source_type VARCHAR(255),
	created_time BIGINT,
	last_update_time BIGINT,
	created_by VARCHAR(255),
	last_updated_by VARCHAR(255),
	input_hash VARCHAR(64) NOT NULL,
	outputs JSON,
	CONSTRAINT evaluation_dataset_records_pk PRIMARY KEY (dataset_record_id),
	CONSTRAINT fk_evaluation_dataset_records_dataset_id FOREIGN KEY(dataset_id) REFERENCES evaluation_datasets (dataset_id) ON DELETE CASCADE,
	CONSTRAINT unique_dataset_input UNIQUE (dataset_id, input_hash)
)


CREATE TABLE evaluation_dataset_tags (
	dataset_id VARCHAR(36) NOT NULL,
	key VARCHAR(255) NOT NULL,
	value VARCHAR(5000),
	CONSTRAINT evaluation_dataset_tags_pk PRIMARY KEY (dataset_id, key),
	CONSTRAINT fk_evaluation_dataset_tags_dataset_id FOREIGN KEY(dataset_id) REFERENCES evaluation_datasets (dataset_id) ON DELETE CASCADE
)


CREATE TABLE experiment_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	experiment_id INTEGER NOT NULL,
	CONSTRAINT experiment_tag_pk PRIMARY KEY (key, experiment_id),
	CONSTRAINT experiment_tags_experiment_id_fkey FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE logged_models (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	name VARCHAR(500) NOT NULL,
	artifact_location VARCHAR(1000) NOT NULL,
	creation_timestamp_ms BIGINT NOT NULL,
	last_updated_timestamp_ms BIGINT NOT NULL,
	status INTEGER NOT NULL,
	lifecycle_stage VARCHAR(32),
	model_type VARCHAR(500),
	source_run_id VARCHAR(32),
	status_message VARCHAR(1000),
	CONSTRAINT logged_models_pk PRIMARY KEY (model_id),
	CONSTRAINT fk_logged_models_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE,
	CONSTRAINT logged_models_lifecycle_stage_check CHECK (lifecycle_stage::text = ANY (ARRAY['active'::character varying, 'deleted'::character varying]::text[]))
)


CREATE TABLE model_definitions (
	model_definition_id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	secret_id VARCHAR(36),
	provider VARCHAR(64) NOT NULL,
	model_name VARCHAR(256) NOT NULL,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT model_definitions_pk PRIMARY KEY (model_definition_id),
	CONSTRAINT fk_model_definitions_secret_id FOREIGN KEY(secret_id) REFERENCES secrets (secret_id) ON DELETE SET NULL
)


CREATE TABLE model_versions (
	name VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	creation_time BIGINT,
	last_updated_time BIGINT,
	description VARCHAR(5000),
	user_id VARCHAR(256),
	current_stage VARCHAR(20),
	source VARCHAR(500),
	run_id VARCHAR(32),
	status VARCHAR(20),
	status_message VARCHAR(500),
	run_link VARCHAR(500),
	storage_location VARCHAR(500),
	CONSTRAINT model_version_pk PRIMARY KEY (name, version),
	CONSTRAINT model_versions_name_fkey FOREIGN KEY(name) REFERENCES registered_models (name) ON UPDATE CASCADE
)


CREATE TABLE registered_model_aliases (
	alias VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	name VARCHAR(256) NOT NULL,
	CONSTRAINT registered_model_alias_pk PRIMARY KEY (name, alias),
	CONSTRAINT registered_model_alias_name_fkey FOREIGN KEY(name) REFERENCES registered_models (name) ON DELETE CASCADE ON UPDATE CASCADE
)


CREATE TABLE registered_model_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	name VARCHAR(256) NOT NULL,
	CONSTRAINT registered_model_tag_pk PRIMARY KEY (key, name),
	CONSTRAINT registered_model_tags_name_fkey FOREIGN KEY(name) REFERENCES registered_models (name) ON UPDATE CASCADE
)


CREATE TABLE runs (
	run_uuid VARCHAR(32) NOT NULL,
	name VARCHAR(250),
	source_type VARCHAR(20),
	source_name VARCHAR(500),
	entry_point_name VARCHAR(50),
	user_id VARCHAR(256),
	status VARCHAR(9),
	start_time BIGINT,
	end_time BIGINT,
	source_version VARCHAR(50),
	lifecycle_stage VARCHAR(20),
	artifact_uri VARCHAR(200),
	experiment_id INTEGER,
	deleted_time BIGINT,
	CONSTRAINT run_pk PRIMARY KEY (run_uuid),
	CONSTRAINT runs_experiment_id_fkey FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT runs_lifecycle_stage CHECK (lifecycle_stage::text = ANY (ARRAY['active'::character varying, 'deleted'::character varying]::text[])),
	CONSTRAINT runs_status_check CHECK (status::text = ANY (ARRAY['SCHEDULED'::character varying, 'FAILED'::character varying, 'FINISHED'::character varying, 'RUNNING'::character varying, 'KILLED'::character varying]::text[])),
	CONSTRAINT source_type CHECK (source_type::text = ANY (ARRAY['NOTEBOOK'::character varying, 'JOB'::character varying, 'LOCAL'::character varying, 'UNKNOWN'::character varying, 'PROJECT'::character varying]::text[]))
)


CREATE TABLE scorers (
	experiment_id INTEGER NOT NULL,
	scorer_name VARCHAR(256) NOT NULL,
	scorer_id VARCHAR(36) NOT NULL,
	CONSTRAINT scorer_pk PRIMARY KEY (scorer_id),
	CONSTRAINT fk_scorers_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE
)


CREATE TABLE trace_info (
	request_id VARCHAR(50) NOT NULL,
	experiment_id INTEGER NOT NULL,
	timestamp_ms BIGINT NOT NULL,
	execution_time_ms BIGINT,
	status VARCHAR(50) NOT NULL,
	client_request_id VARCHAR(50),
	request_preview VARCHAR(1000),
	response_preview VARCHAR(1000),
	CONSTRAINT trace_info_pk PRIMARY KEY (request_id),
	CONSTRAINT fk_trace_info_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE webhook_events (
	webhook_id VARCHAR(256) NOT NULL,
	entity VARCHAR(50) NOT NULL,
	action VARCHAR(50) NOT NULL,
	CONSTRAINT webhook_event_pk PRIMARY KEY (webhook_id, entity, action),
	CONSTRAINT webhook_events_webhook_id_fkey FOREIGN KEY(webhook_id) REFERENCES webhooks (webhook_id) ON DELETE CASCADE
)


CREATE TABLE assessments (
	assessment_id VARCHAR(50) NOT NULL,
	trace_id VARCHAR(50) NOT NULL,
	name VARCHAR(250) NOT NULL,
	assessment_type VARCHAR(20) NOT NULL,
	value TEXT NOT NULL,
	error TEXT,
	created_timestamp BIGINT NOT NULL,
	last_updated_timestamp BIGINT NOT NULL,
	source_type VARCHAR(50) NOT NULL,
	source_id VARCHAR(250),
	run_id VARCHAR(32),
	span_id VARCHAR(50),
	rationale TEXT,
	overrides VARCHAR(50),
	valid BOOLEAN NOT NULL,
	assessment_metadata TEXT,
	CONSTRAINT assessments_pk PRIMARY KEY (assessment_id),
	CONSTRAINT fk_assessments_trace_id FOREIGN KEY(trace_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_model_mappings (
	mapping_id VARCHAR(36) NOT NULL,
	endpoint_id VARCHAR(36) NOT NULL,
	model_definition_id VARCHAR(36) NOT NULL,
	weight DOUBLE PRECISION NOT NULL,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	CONSTRAINT endpoint_model_mappings_pk PRIMARY KEY (mapping_id),
	CONSTRAINT fk_endpoint_model_mappings_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE,
	CONSTRAINT fk_endpoint_model_mappings_model_definition_id FOREIGN KEY(model_definition_id) REFERENCES model_definitions (model_definition_id)
)


CREATE TABLE latest_metrics (
	key VARCHAR(250) NOT NULL,
	value DOUBLE PRECISION NOT NULL,
	timestamp BIGINT,
	step BIGINT NOT NULL,
	is_nan BOOLEAN NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT latest_metric_pk PRIMARY KEY (key, run_uuid),
	CONSTRAINT latest_metrics_run_uuid_fkey FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE logged_model_metrics (
	model_id VARCHAR(36) NOT NULL,
	metric_name VARCHAR(500) NOT NULL,
	metric_timestamp_ms BIGINT NOT NULL,
	metric_step BIGINT NOT NULL,
	metric_value DOUBLE PRECISION,
	experiment_id INTEGER NOT NULL,
	run_id VARCHAR(32) NOT NULL,
	dataset_uuid VARCHAR(36),
	dataset_name VARCHAR(500),
	dataset_digest VARCHAR(36),
	CONSTRAINT logged_model_metrics_pk PRIMARY KEY (model_id, metric_name, metric_timestamp_ms, metric_step, run_id),
	CONSTRAINT fk_logged_model_metrics_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_metrics_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE,
	CONSTRAINT fk_logged_model_metrics_run_id FOREIGN KEY(run_id) REFERENCES runs (run_uuid) ON DELETE CASCADE
)


CREATE TABLE logged_model_params (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	param_key VARCHAR(255) NOT NULL,
	param_value TEXT NOT NULL,
	CONSTRAINT logged_model_params_pk PRIMARY KEY (model_id, param_key),
	CONSTRAINT fk_logged_model_params_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_params_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE
)


CREATE TABLE logged_model_tags (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	tag_key VARCHAR(255) NOT NULL,
	tag_value TEXT NOT NULL,
	CONSTRAINT logged_model_tags_pk PRIMARY KEY (model_id, tag_key),
	CONSTRAINT fk_logged_model_tags_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_tags_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE
)


CREATE TABLE metrics (
	key VARCHAR(250) NOT NULL,
	value DOUBLE PRECISION NOT NULL,
	timestamp BIGINT NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	step BIGINT DEFAULT '0'::bigint NOT NULL,
	is_nan BOOLEAN DEFAULT false NOT NULL,
	CONSTRAINT metric_pk PRIMARY KEY (key, timestamp, step, run_uuid, value, is_nan),
	CONSTRAINT metrics_run_uuid_fkey FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE model_version_tags (
	key VARCHAR(250) NOT NULL,
	value TEXT,
	name VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	CONSTRAINT model_version_tag_pk PRIMARY KEY (key, name, version),
	CONSTRAINT model_version_tags_name_version_fkey FOREIGN KEY(name, version) REFERENCES model_versions (name, version) ON UPDATE CASCADE
)


CREATE TABLE params (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000) NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT param_pk PRIMARY KEY (key, run_uuid),
	CONSTRAINT params_run_uuid_fkey FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE scorer_versions (
	scorer_id VARCHAR(36) NOT NULL,
	scorer_version INTEGER NOT NULL,
	serialized_scorer TEXT NOT NULL,
	creation_time BIGINT,
	CONSTRAINT scorer_version_pk PRIMARY KEY (scorer_id, scorer_version),
	CONSTRAINT fk_scorer_versions_scorer_id FOREIGN KEY(scorer_id) REFERENCES scorers (scorer_id) ON DELETE CASCADE
)


CREATE TABLE spans (
	trace_id VARCHAR(50) NOT NULL,
	experiment_id INTEGER NOT NULL,
	span_id VARCHAR(50) NOT NULL,
	parent_span_id VARCHAR(50),
	name TEXT,
	type VARCHAR(500),
	status VARCHAR(50) NOT NULL,
	start_time_unix_nano BIGINT NOT NULL,
	end_time_unix_nano BIGINT,
	duration_ns BIGINT GENERATED ALWAYS AS ((end_time_unix_nano - start_time_unix_nano)) STORED,
	content TEXT NOT NULL,
	CONSTRAINT spans_pk PRIMARY KEY (trace_id, span_id),
	CONSTRAINT fk_spans_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_spans_trace_id FOREIGN KEY(trace_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT tag_pk PRIMARY KEY (key, run_uuid),
	CONSTRAINT tags_run_uuid_fkey FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE trace_metrics (
	request_id VARCHAR(50) NOT NULL,
	key VARCHAR(250) NOT NULL,
	value DOUBLE PRECISION,
	CONSTRAINT trace_metrics_pk PRIMARY KEY (request_id, key),
	CONSTRAINT fk_trace_metrics_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE trace_request_metadata (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	request_id VARCHAR(50) NOT NULL,
	CONSTRAINT trace_request_metadata_pk PRIMARY KEY (key, request_id),
	CONSTRAINT fk_trace_request_metadata_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE trace_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	request_id VARCHAR(50) NOT NULL,
	CONSTRAINT trace_tag_pk PRIMARY KEY (key, request_id),
	CONSTRAINT fk_trace_tags_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)
```

--------------------------------------------------------------------------------

---[FILE: sqlite.sql]---
Location: mlflow-master/tests/db/schemas/sqlite.sql

```sql

CREATE TABLE alembic_version (
	version_num VARCHAR(32) NOT NULL,
	CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
)


CREATE TABLE endpoints (
	endpoint_id VARCHAR(36) NOT NULL,
	name VARCHAR(255),
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT endpoints_pk PRIMARY KEY (endpoint_id)
)


CREATE TABLE entity_associations (
	association_id VARCHAR(36) NOT NULL,
	source_type VARCHAR(36) NOT NULL,
	source_id VARCHAR(36) NOT NULL,
	destination_type VARCHAR(36) NOT NULL,
	destination_id VARCHAR(36) NOT NULL,
	created_time BIGINT,
	CONSTRAINT entity_associations_pk PRIMARY KEY (source_type, source_id, destination_type, destination_id)
)


CREATE TABLE evaluation_datasets (
	dataset_id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	schema TEXT,
	profile TEXT,
	digest VARCHAR(64),
	created_time BIGINT,
	last_update_time BIGINT,
	created_by VARCHAR(255),
	last_updated_by VARCHAR(255),
	CONSTRAINT evaluation_datasets_pk PRIMARY KEY (dataset_id)
)


CREATE TABLE experiments (
	experiment_id INTEGER NOT NULL,
	name VARCHAR(256) NOT NULL,
	artifact_location VARCHAR(256),
	lifecycle_stage VARCHAR(32),
	creation_time BIGINT,
	last_update_time BIGINT,
	CONSTRAINT experiment_pk PRIMARY KEY (experiment_id),
	UNIQUE (name),
	CONSTRAINT experiments_lifecycle_stage CHECK (lifecycle_stage IN ('active', 'deleted'))
)


CREATE TABLE input_tags (
	input_uuid VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	value VARCHAR(500) NOT NULL,
	CONSTRAINT input_tags_pk PRIMARY KEY (input_uuid, name)
)


CREATE TABLE inputs (
	input_uuid VARCHAR(36) NOT NULL,
	source_type VARCHAR(36) NOT NULL,
	source_id VARCHAR(36) NOT NULL,
	destination_type VARCHAR(36) NOT NULL,
	destination_id VARCHAR(36) NOT NULL,
	step BIGINT DEFAULT '0' NOT NULL,
	CONSTRAINT inputs_pk PRIMARY KEY (source_type, source_id, destination_type, destination_id)
)


CREATE TABLE jobs (
	id VARCHAR(36) NOT NULL,
	creation_time BIGINT NOT NULL,
	job_name VARCHAR(500) NOT NULL,
	params TEXT NOT NULL,
	timeout FLOAT,
	status INTEGER NOT NULL,
	result TEXT,
	retry_count INTEGER NOT NULL,
	last_update_time BIGINT NOT NULL,
	CONSTRAINT jobs_pk PRIMARY KEY (id)
)


CREATE TABLE registered_models (
	name VARCHAR(256) NOT NULL,
	creation_time BIGINT,
	last_updated_time BIGINT,
	description VARCHAR(5000),
	CONSTRAINT registered_model_pk PRIMARY KEY (name),
	UNIQUE (name)
)


CREATE TABLE secrets (
	secret_id VARCHAR(36) NOT NULL,
	secret_name VARCHAR(255) NOT NULL,
	encrypted_value BLOB NOT NULL,
	wrapped_dek BLOB NOT NULL,
	kek_version INTEGER NOT NULL,
	masked_value VARCHAR(100) NOT NULL,
	provider VARCHAR(64),
	auth_config TEXT,
	description TEXT,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT secrets_pk PRIMARY KEY (secret_id)
)


CREATE TABLE webhooks (
	webhook_id VARCHAR(256) NOT NULL,
	name VARCHAR(256) NOT NULL,
	description VARCHAR(1000),
	url VARCHAR(500) NOT NULL,
	status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
	secret VARCHAR(1000),
	creation_timestamp BIGINT,
	last_updated_timestamp BIGINT,
	deleted_timestamp BIGINT,
	CONSTRAINT webhook_pk PRIMARY KEY (webhook_id)
)


CREATE TABLE datasets (
	dataset_uuid VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	name VARCHAR(500) NOT NULL,
	digest VARCHAR(36) NOT NULL,
	dataset_source_type VARCHAR(36) NOT NULL,
	dataset_source TEXT NOT NULL,
	dataset_schema TEXT,
	dataset_profile TEXT,
	CONSTRAINT dataset_pk PRIMARY KEY (experiment_id, name, digest),
	CONSTRAINT fk_datasets_experiment_id_experiments FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_bindings (
	endpoint_id VARCHAR(36) NOT NULL,
	resource_type VARCHAR(50) NOT NULL,
	resource_id VARCHAR(255) NOT NULL,
	created_at BIGINT NOT NULL,
	created_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	CONSTRAINT endpoint_bindings_pk PRIMARY KEY (endpoint_id, resource_type, resource_id),
	CONSTRAINT fk_endpoint_bindings_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	endpoint_id VARCHAR(36) NOT NULL,
	CONSTRAINT endpoint_tag_pk PRIMARY KEY (key, endpoint_id),
	CONSTRAINT fk_endpoint_tags_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE
)


CREATE TABLE evaluation_dataset_records (
	dataset_record_id VARCHAR(36) NOT NULL,
	dataset_id VARCHAR(36) NOT NULL,
	inputs JSON NOT NULL,
	expectations JSON,
	tags JSON,
	source JSON,
	source_id VARCHAR(36),
	source_type VARCHAR(255),
	created_time BIGINT,
	last_update_time BIGINT,
	created_by VARCHAR(255),
	last_updated_by VARCHAR(255),
	input_hash VARCHAR(64) NOT NULL,
	outputs JSON,
	CONSTRAINT evaluation_dataset_records_pk PRIMARY KEY (dataset_record_id),
	CONSTRAINT fk_evaluation_dataset_records_dataset_id FOREIGN KEY(dataset_id) REFERENCES evaluation_datasets (dataset_id) ON DELETE CASCADE,
	CONSTRAINT unique_dataset_input UNIQUE (dataset_id, input_hash)
)


CREATE TABLE evaluation_dataset_tags (
	dataset_id VARCHAR(36) NOT NULL,
	key VARCHAR(255) NOT NULL,
	value VARCHAR(5000),
	CONSTRAINT evaluation_dataset_tags_pk PRIMARY KEY (dataset_id, key),
	CONSTRAINT fk_evaluation_dataset_tags_dataset_id FOREIGN KEY(dataset_id) REFERENCES evaluation_datasets (dataset_id) ON DELETE CASCADE
)


CREATE TABLE experiment_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	experiment_id INTEGER NOT NULL,
	CONSTRAINT experiment_tag_pk PRIMARY KEY (key, experiment_id),
	FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE logged_models (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	name VARCHAR(500) NOT NULL,
	artifact_location VARCHAR(1000) NOT NULL,
	creation_timestamp_ms BIGINT NOT NULL,
	last_updated_timestamp_ms BIGINT NOT NULL,
	status INTEGER NOT NULL,
	lifecycle_stage VARCHAR(32),
	model_type VARCHAR(500),
	source_run_id VARCHAR(32),
	status_message VARCHAR(1000),
	CONSTRAINT logged_models_pk PRIMARY KEY (model_id),
	CONSTRAINT fk_logged_models_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE,
	CONSTRAINT logged_models_lifecycle_stage_check CHECK (lifecycle_stage IN ('active', 'deleted'))
)


CREATE TABLE model_definitions (
	model_definition_id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	secret_id VARCHAR(36),
	provider VARCHAR(64) NOT NULL,
	model_name VARCHAR(256) NOT NULL,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT model_definitions_pk PRIMARY KEY (model_definition_id),
	CONSTRAINT fk_model_definitions_secret_id FOREIGN KEY(secret_id) REFERENCES secrets (secret_id) ON DELETE SET NULL
)


CREATE TABLE model_versions (
	name VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	creation_time BIGINT,
	last_updated_time BIGINT,
	description VARCHAR(5000),
	user_id VARCHAR(256),
	current_stage VARCHAR(20),
	source VARCHAR(500),
	run_id VARCHAR(32),
	status VARCHAR(20),
	status_message VARCHAR(500),
	run_link VARCHAR(500),
	storage_location VARCHAR(500),
	CONSTRAINT model_version_pk PRIMARY KEY (name, version),
	FOREIGN KEY(name) REFERENCES registered_models (name) ON UPDATE CASCADE
)


CREATE TABLE registered_model_aliases (
	alias VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	name VARCHAR(256) NOT NULL,
	CONSTRAINT registered_model_alias_pk PRIMARY KEY (name, alias),
	CONSTRAINT registered_model_alias_name_fkey FOREIGN KEY(name) REFERENCES registered_models (name) ON DELETE CASCADE ON UPDATE CASCADE
)


CREATE TABLE registered_model_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	name VARCHAR(256) NOT NULL,
	CONSTRAINT registered_model_tag_pk PRIMARY KEY (key, name),
	FOREIGN KEY(name) REFERENCES registered_models (name) ON UPDATE CASCADE
)


CREATE TABLE runs (
	run_uuid VARCHAR(32) NOT NULL,
	name VARCHAR(250),
	source_type VARCHAR(20),
	source_name VARCHAR(500),
	entry_point_name VARCHAR(50),
	user_id VARCHAR(256),
	status VARCHAR(9),
	start_time BIGINT,
	end_time BIGINT,
	source_version VARCHAR(50),
	lifecycle_stage VARCHAR(20),
	artifact_uri VARCHAR(200),
	experiment_id INTEGER,
	deleted_time BIGINT,
	CONSTRAINT run_pk PRIMARY KEY (run_uuid),
	FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT runs_lifecycle_stage CHECK (lifecycle_stage IN ('active', 'deleted')),
	CONSTRAINT source_type CHECK (source_type IN ('NOTEBOOK', 'JOB', 'LOCAL', 'UNKNOWN', 'PROJECT')),
	CHECK (status IN ('SCHEDULED', 'FAILED', 'FINISHED', 'RUNNING', 'KILLED'))
)


CREATE TABLE scorers (
	experiment_id INTEGER NOT NULL,
	scorer_name VARCHAR(256) NOT NULL,
	scorer_id VARCHAR(36) NOT NULL,
	CONSTRAINT scorer_pk PRIMARY KEY (scorer_id),
	CONSTRAINT fk_scorers_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE
)


CREATE TABLE trace_info (
	request_id VARCHAR(50) NOT NULL,
	experiment_id INTEGER NOT NULL,
	timestamp_ms BIGINT NOT NULL,
	execution_time_ms BIGINT,
	status VARCHAR(50) NOT NULL,
	client_request_id VARCHAR(50),
	request_preview VARCHAR(1000),
	response_preview VARCHAR(1000),
	CONSTRAINT trace_info_pk PRIMARY KEY (request_id),
	CONSTRAINT fk_trace_info_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE webhook_events (
	webhook_id VARCHAR(256) NOT NULL,
	entity VARCHAR(50) NOT NULL,
	action VARCHAR(50) NOT NULL,
	CONSTRAINT webhook_event_pk PRIMARY KEY (webhook_id, entity, action),
	FOREIGN KEY(webhook_id) REFERENCES webhooks (webhook_id) ON DELETE CASCADE
)


CREATE TABLE assessments (
	assessment_id VARCHAR(50) NOT NULL,
	trace_id VARCHAR(50) NOT NULL,
	name VARCHAR(250) NOT NULL,
	assessment_type VARCHAR(20) NOT NULL,
	value TEXT NOT NULL,
	error TEXT,
	created_timestamp BIGINT NOT NULL,
	last_updated_timestamp BIGINT NOT NULL,
	source_type VARCHAR(50) NOT NULL,
	source_id VARCHAR(250),
	run_id VARCHAR(32),
	span_id VARCHAR(50),
	rationale TEXT,
	overrides VARCHAR(50),
	valid BOOLEAN NOT NULL,
	assessment_metadata TEXT,
	CONSTRAINT assessments_pk PRIMARY KEY (assessment_id),
	CONSTRAINT fk_assessments_trace_id FOREIGN KEY(trace_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_model_mappings (
	mapping_id VARCHAR(36) NOT NULL,
	endpoint_id VARCHAR(36) NOT NULL,
	model_definition_id VARCHAR(36) NOT NULL,
	weight FLOAT NOT NULL,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	CONSTRAINT endpoint_model_mappings_pk PRIMARY KEY (mapping_id),
	CONSTRAINT fk_endpoint_model_mappings_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE,
	CONSTRAINT fk_endpoint_model_mappings_model_definition_id FOREIGN KEY(model_definition_id) REFERENCES model_definitions (model_definition_id)
)


CREATE TABLE latest_metrics (
	key VARCHAR(250) NOT NULL,
	value FLOAT NOT NULL,
	timestamp BIGINT,
	step BIGINT NOT NULL,
	is_nan BOOLEAN NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT latest_metric_pk PRIMARY KEY (key, run_uuid),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid),
	CHECK (is_nan IN (0, 1))
)


CREATE TABLE logged_model_metrics (
	model_id VARCHAR(36) NOT NULL,
	metric_name VARCHAR(500) NOT NULL,
	metric_timestamp_ms BIGINT NOT NULL,
	metric_step BIGINT NOT NULL,
	metric_value FLOAT,
	experiment_id INTEGER NOT NULL,
	run_id VARCHAR(32) NOT NULL,
	dataset_uuid VARCHAR(36),
	dataset_name VARCHAR(500),
	dataset_digest VARCHAR(36),
	CONSTRAINT logged_model_metrics_pk PRIMARY KEY (model_id, metric_name, metric_timestamp_ms, metric_step, run_id),
	CONSTRAINT fk_logged_model_metrics_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_metrics_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE,
	CONSTRAINT fk_logged_model_metrics_run_id FOREIGN KEY(run_id) REFERENCES runs (run_uuid) ON DELETE CASCADE
)


CREATE TABLE logged_model_params (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	param_key VARCHAR(255) NOT NULL,
	param_value TEXT NOT NULL,
	CONSTRAINT logged_model_params_pk PRIMARY KEY (model_id, param_key),
	CONSTRAINT fk_logged_model_params_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_params_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE
)


CREATE TABLE logged_model_tags (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	tag_key VARCHAR(255) NOT NULL,
	tag_value TEXT NOT NULL,
	CONSTRAINT logged_model_tags_pk PRIMARY KEY (model_id, tag_key),
	CONSTRAINT fk_logged_model_tags_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_tags_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE
)


CREATE TABLE metrics (
	key VARCHAR(250) NOT NULL,
	value FLOAT NOT NULL,
	timestamp BIGINT NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	step BIGINT DEFAULT '0' NOT NULL,
	is_nan BOOLEAN DEFAULT '0' NOT NULL,
	CONSTRAINT metric_pk PRIMARY KEY (key, timestamp, step, run_uuid, value, is_nan),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid),
	CHECK (is_nan IN (0, 1))
)


CREATE TABLE model_version_tags (
	key VARCHAR(250) NOT NULL,
	value TEXT,
	name VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	CONSTRAINT model_version_tag_pk PRIMARY KEY (key, name, version),
	FOREIGN KEY(name, version) REFERENCES model_versions (name, version) ON UPDATE CASCADE
)


CREATE TABLE params (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000) NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT param_pk PRIMARY KEY (key, run_uuid),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE scorer_versions (
	scorer_id VARCHAR(36) NOT NULL,
	scorer_version INTEGER NOT NULL,
	serialized_scorer TEXT NOT NULL,
	creation_time BIGINT,
	CONSTRAINT scorer_version_pk PRIMARY KEY (scorer_id, scorer_version),
	CONSTRAINT fk_scorer_versions_scorer_id FOREIGN KEY(scorer_id) REFERENCES scorers (scorer_id) ON DELETE CASCADE
)


CREATE TABLE spans (
	trace_id VARCHAR(50) NOT NULL,
	experiment_id INTEGER NOT NULL,
	span_id VARCHAR(50) NOT NULL,
	parent_span_id VARCHAR(50),
	name TEXT,
	type VARCHAR(500),
	status VARCHAR(50) NOT NULL,
	start_time_unix_nano BIGINT NOT NULL,
	end_time_unix_nano BIGINT,
	duration_ns BIGINT GENERATED ALWAYS AS (end_time_unix_nano - start_time_unix_nano) STORED,
	content TEXT NOT NULL,
	CONSTRAINT spans_pk PRIMARY KEY (trace_id, span_id),
	CONSTRAINT fk_spans_trace_id FOREIGN KEY(trace_id) REFERENCES trace_info (request_id) ON DELETE CASCADE,
	CONSTRAINT fk_spans_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT tag_pk PRIMARY KEY (key, run_uuid),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE trace_metrics (
	request_id VARCHAR(50) NOT NULL,
	key VARCHAR(250) NOT NULL,
	value FLOAT,
	CONSTRAINT trace_metrics_pk PRIMARY KEY (request_id, key),
	CONSTRAINT fk_trace_metrics_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE trace_request_metadata (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	request_id VARCHAR(50) NOT NULL,
	CONSTRAINT trace_request_metadata_pk PRIMARY KEY (key, request_id),
	CONSTRAINT fk_trace_request_metadata_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE trace_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	request_id VARCHAR(50) NOT NULL,
	CONSTRAINT trace_tag_pk PRIMARY KEY (key, request_id),
	CONSTRAINT fk_trace_tags_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)
```

--------------------------------------------------------------------------------

---[FILE: test_cli.py]---
Location: mlflow-master/tests/deployments/test_cli.py

```python
import json
import os
from unittest import mock

import pytest
from click.testing import CliRunner

from mlflow.deployments import cli
from mlflow.exceptions import MlflowException

f_model_uri = "fake_model_uri"
f_name = "fake_deployment_name"
f_flavor = "fake_flavor"
f_target = "faketarget"
runner = CliRunner()


def test_create():
    res = runner.invoke(
        cli.create_deployment,
        ["--flavor", f_flavor, "--model-uri", f_model_uri, "--target", f_target, "--name", f_name],
    )
    assert f"{f_flavor} deployment {f_name} is created" in res.stdout
    res = runner.invoke(
        cli.create_deployment, ["-f", f_flavor, "-m", f_model_uri, "-t", f_target, "--name", f_name]
    )
    assert f"{f_flavor} deployment {f_name} is created" in res.stdout


def test_update():
    res = runner.invoke(
        cli.update_deployment,
        ["--flavor", f_flavor, "--model-uri", f_model_uri, "--target", f_target, "--name", f_name],
    )
    assert f"Deployment {f_name} is updated (with flavor {f_flavor})" in res.stdout


def test_delete():
    res = runner.invoke(cli.delete_deployment, ["--name", f_name, "--target", f_target])
    assert f"Deployment {f_name} is deleted" in res.stdout


def test_update_no_flavor():
    res = runner.invoke(
        cli.update_deployment, ["--name", f_name, "--target", f_target, "-m", f_model_uri]
    )
    assert f"Deployment {f_name} is updated (with flavor None)" in res.stdout


def test_list():
    res = runner.invoke(cli.list_deployment, ["--target", f_target])
    assert f"[{{'name': '{f_name}'}}]" in res.stdout


def test_create_deployment_with_custom_args():
    res = runner.invoke(
        cli.create_deployment,
        [
            "--model-uri",
            f_model_uri,
            "--target",
            f_target,
            "--name",
            f_name,
            "-C",
            "raiseError=True",
        ],
    )
    assert isinstance(res.exception, RuntimeError)


def test_delete_deployment_with_custom_args():
    res = runner.invoke(
        cli.delete_deployment,
        ["--target", f_target, "--name", f_name, "-C", "raiseError=True"],
    )
    assert isinstance(res.exception, RuntimeError)


def test_get():
    res = runner.invoke(cli.get_deployment, ["--name", f_name, "--target", f_target])
    assert "key1: val1" in res.stdout
    assert "key2: val2" in res.stdout


@pytest.mark.skipif(
    "MLFLOW_SKINNY" in os.environ,
    reason="Skinny Client does not support predict due to the pandas dependency",
)
def test_predict(tmp_path):
    temp_input_file_path = tmp_path.joinpath("input.json")
    temp_input_file_path.write_text('{"data": [5000]}')

    temp_output_file_path = tmp_path.joinpath("output.json")
    res = runner.invoke(
        cli.predict, ["--target", f_target, "--name", f_name, "--input-path", temp_input_file_path]
    )
    assert '{"predictions": [1, 2, 3]}' in res.stdout

    res = runner.invoke(
        cli.predict,
        [
            "--target",
            f_target,
            "--name",
            f_name,
            "--input-path",
            temp_input_file_path,
            "--output-path",
            temp_output_file_path,
        ],
    )
    with open(temp_output_file_path) as f:
        assert json.load(f) == {"predictions": [1, 2, 3]}


def test_target_help():
    res = runner.invoke(cli.target_help, ["--target", f_target])
    assert "Target help is called" in res.stdout


def test_run_local():
    res = runner.invoke(
        cli.run_local, ["-f", f_flavor, "-m", f_model_uri, "-t", f_target, "--name", f_name]
    )
    assert f"Deployed locally at the key {f_name}" in res.stdout
    assert f"using the model from {f_model_uri}." in res.stdout
    assert f"It's flavor is {f_flavor} and config is {{}}" in res.stdout


@pytest.mark.skipif(
    "MLFLOW_SKINNY" in os.environ,
    reason="Skinny Client does not support explain due to the pandas dependency",
)
def test_explain(tmp_path):
    temp_input_file_path = tmp_path.joinpath("input.json")
    temp_input_file_path.write_text('{"data": [5000]}')
    res = runner.invoke(
        cli.explain, ["--target", f_target, "--name", f_name, "--input-path", temp_input_file_path]
    )
    assert "1" in res.stdout


def test_explain_with_no_target_implementation(tmp_path):
    file_path = tmp_path.joinpath("input.json")
    file_path.write_text('{"data": [5000]}')
    mock_error = MlflowException("MOCK ERROR")
    with mock.patch.object(CliRunner, "invoke", return_value=mock_error) as mock_explain:
        res = runner.invoke(
            cli.explain, ["--target", f_target, "--name", f_name, "--input-path", file_path]
        )
        assert type(res) == MlflowException
        mock_explain.assert_called_once()
```

--------------------------------------------------------------------------------

````
