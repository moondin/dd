---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 352
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 352 of 991)

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

---[FILE: assessments.proto]---
Location: mlflow-master/mlflow/protos/assessments.proto

```proto
// This file contains the proto definition for communicating with the Databricks tracing server.
// The message definition should be kept in (mostly) sync with the MLflow service definition.
syntax = "proto2";

package mlflow.assessments;

import "databricks.proto";
import "google/protobuf/struct.proto";
import "google/protobuf/timestamp.proto";

option java_package = "org.mlflow.api.proto";
option py_generic_services = true;

message AssessmentSource {
  // Type of the assessment source.
  enum SourceType {
    SOURCE_TYPE_UNSPECIFIED = 0;
    // Assessment from a human.
    HUMAN = 1;
    // Assessment from an LLM Judge.
    LLM_JUDGE = 2;
    // Code-based assessment, (e.g. Python UDF).
    CODE = 3;
  }
  // The type of the source.
  optional SourceType source_type = 1 [(validate_required) = true];

  // Identifier for the source.
  // Example: For human -> user name; for LLM judge -> judge source (databricks or custom); for code -> empty.
  optional string source_id = 2 [(validate_required) = true];
}

message AssessmentError {
  // Value of an assessment when an error has occurred.
  optional string error_code = 1;

  optional string error_message = 2;

  // Stack trace of the error. Truncated to 1000 characters to avoid making TraceInfo too large.
  optional string stack_trace = 3;
}

// An expectation for the values or guidelines for the outputs that a model or agent should produce
// from the inputs contained in the trace.
message Expectation {
  // The value of the expectation-based assessment. This uses ``google.protobuf.Value`` under the hood to support a
  // flexible schema of expectation values but is validated to constrain it to specific types. This means the value must
  // be JSON conforming to one of the following supported types:
  // * Numeric values like integers or floats
  // * Boolean values
  // * Text value (can contain JSON text the user wishes to store, but it will only be searchable as text)
  // * List values containing only strings (empty lists allowed).
  //
  // Other values like null, structs, non-string lists etc. will be rejected. However, they can instead be serialized as
  // a string and stored in the ``serialized_value`` field instead. Only one of either ``serialized_value`` or ``value``
  // may be defined. We do not support these other formats directly despite using google.protobuf.Value due to security
  // risks around their serialization and deserialization.
  optional google.protobuf.Value value = 2;

  message SerializedValue {
    // Marks the serialization format for the expectation value. This is a contract specific to the client. The service
    // will not attempt to deserialize the value or validate the format. An example format is "JSON_FORMAT".
    optional string serialization_format = 1;

    // The value of the expectation-based assessment serialized as a string in the format defined by ``serialization_format``.
    optional string value = 2;
  }

  // The value of the expecation-based assessment serialized as a string in a specified format. Only one of either
  // ``serialized_value`` or ``value`` may be defined.
  optional SerializedValue serialized_value = 3;
}

// Feedback provided on the model / agent output(s) contained in the trace
message Feedback {
  // Value of the feedback-based assessment.
  // We use google.protobuf.Value to support a flexible schema of feedback values.
  // Supported initial types:
  // - Numeric values like integers or floats
  // - Boolean values
  // - Text value (can contain json text the user wishes to store, but it will only be searchable as text)
  // - Non-empty list values containing only strings
  // - Other values like structs, non-string lists etc. will be rejected for now
  optional google.protobuf.Value value = 2;

  // An error encountered while generating the feedback. Required if value is set to null.
  optional AssessmentError error = 3;
}

// Data and metadata for an assessment of a trace.
message Assessment {
  // Unique ID of the assessment.
  // NB: This is not marked as required field via "validate_required", because the message is
  //  used in the context of creating a new assessment, where the ID is not known.
  optional string assessment_id = 1;

  // Name of the assessment. The name must not contain ".".
  optional string assessment_name = 2 [(validate_required) = true];
  // ID of the trace this assessment is associated with.
  optional string trace_id = 3;

  // ID of the span if the assessment is for a particular span (optional).
  optional string span_id = 4;

  // The source this assessment came from.
  optional AssessmentSource source = 5;

  // The creation time of this assessment.
  optional google.protobuf.Timestamp create_time = 6;

  // The last update time of this assessment.
  optional google.protobuf.Timestamp last_update_time = 7;

  // An Assessment can either be human/code/judge Feedback, human-generated Expectation, or an error.
  // The name of the Feedback or Expectation must be the same with the assessment_name.
  oneof value {
    // The feedback on the trace from this assessment.
    Feedback feedback = 9;
    // A representation of the guidelines and/or expected response from the agent.
    Expectation expectation = 10;
  }

  // Justification for the assessment.
  optional string rationale = 11;

  // [Deprecated, use the ``error`` field in ``feedback`` instead]
  // An error encountered while computing the assessment.
  optional AssessmentError error = 12 [deprecated = true];

  // Additional metadata describing the assessment and store additional information,
  // such as the chunk relevance chunk_index. This metadata is required to be JSON-serializable.
  map<string, string> metadata = 13;

  // The ID of the assessment which this assessment overrides.
  optional string overrides = 14;

  // Whether this assessment is valid (i.e. has not been superseded)
  // defaults to true, and is set to false if a new superseding assessment
  // is created.
  optional bool valid = 15 [default = true];
}
```

--------------------------------------------------------------------------------

---[FILE: assessments_pb2.py]---
Location: mlflow-master/mlflow/protos/assessments_pb2.py

```python

import google.protobuf
from packaging.version import Version
if Version(google.protobuf.__version__).major >= 5:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: assessments.proto
  # Protobuf Python Version: 5.26.0
  """Generated protocol buffer code."""
  from google.protobuf import descriptor as _descriptor
  from google.protobuf import descriptor_pool as _descriptor_pool
  from google.protobuf import symbol_database as _symbol_database
  from google.protobuf.internal import builder as _builder
  # @@protoc_insertion_point(imports)

  _sym_db = _symbol_database.Default()


  from . import databricks_pb2 as databricks__pb2
  from google.protobuf import struct_pb2 as google_dot_protobuf_dot_struct__pb2
  from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2


  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x11\x61ssessments.proto\x12\x12mlflow.assessments\x1a\x10\x64\x61tabricks.proto\x1a\x1cgoogle/protobuf/struct.proto\x1a\x1fgoogle/protobuf/timestamp.proto\"\xc6\x01\n\x10\x41ssessmentSource\x12J\n\x0bsource_type\x18\x01 \x01(\x0e\x32/.mlflow.assessments.AssessmentSource.SourceTypeB\x04\xf8\x86\x19\x01\x12\x17\n\tsource_id\x18\x02 \x01(\tB\x04\xf8\x86\x19\x01\"M\n\nSourceType\x12\x1b\n\x17SOURCE_TYPE_UNSPECIFIED\x10\x00\x12\t\n\x05HUMAN\x10\x01\x12\r\n\tLLM_JUDGE\x10\x02\x12\x08\n\x04\x43ODE\x10\x03\"Q\n\x0f\x41ssessmentError\x12\x12\n\nerror_code\x18\x01 \x01(\t\x12\x15\n\rerror_message\x18\x02 \x01(\t\x12\x13\n\x0bstack_trace\x18\x03 \x01(\t\"\xbf\x01\n\x0b\x45xpectation\x12%\n\x05value\x18\x02 \x01(\x0b\x32\x16.google.protobuf.Value\x12I\n\x10serialized_value\x18\x03 \x01(\x0b\x32/.mlflow.assessments.Expectation.SerializedValue\x1a>\n\x0fSerializedValue\x12\x1c\n\x14serialization_format\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t\"e\n\x08\x46\x65\x65\x64\x62\x61\x63k\x12%\n\x05value\x18\x02 \x01(\x0b\x32\x16.google.protobuf.Value\x12\x32\n\x05\x65rror\x18\x03 \x01(\x0b\x32#.mlflow.assessments.AssessmentError\"\xd9\x04\n\nAssessment\x12\x15\n\rassessment_id\x18\x01 \x01(\t\x12\x1d\n\x0f\x61ssessment_name\x18\x02 \x01(\tB\x04\xf8\x86\x19\x01\x12\x10\n\x08trace_id\x18\x03 \x01(\t\x12\x0f\n\x07span_id\x18\x04 \x01(\t\x12\x34\n\x06source\x18\x05 \x01(\x0b\x32$.mlflow.assessments.AssessmentSource\x12/\n\x0b\x63reate_time\x18\x06 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x34\n\x10last_update_time\x18\x07 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x30\n\x08\x66\x65\x65\x64\x62\x61\x63k\x18\t \x01(\x0b\x32\x1c.mlflow.assessments.FeedbackH\x00\x12\x36\n\x0b\x65xpectation\x18\n \x01(\x0b\x32\x1f.mlflow.assessments.ExpectationH\x00\x12\x11\n\trationale\x18\x0b \x01(\t\x12\x36\n\x05\x65rror\x18\x0c \x01(\x0b\x32#.mlflow.assessments.AssessmentErrorB\x02\x18\x01\x12>\n\x08metadata\x18\r \x03(\x0b\x32,.mlflow.assessments.Assessment.MetadataEntry\x12\x11\n\toverrides\x18\x0e \x01(\t\x12\x13\n\x05valid\x18\x0f \x01(\x08:\x04true\x1a/\n\rMetadataEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x42\x07\n\x05valueB\x19\n\x14org.mlflow.api.proto\x90\x01\x01')

  _globals = globals()
  _builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
  _builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'assessments_pb2', _globals)
  if not _descriptor._USE_C_DESCRIPTORS:
    _globals['DESCRIPTOR']._loaded_options = None
    _globals['DESCRIPTOR']._serialized_options = b'\n\024org.mlflow.api.proto\220\001\001'
    _globals['_ASSESSMENTSOURCE'].fields_by_name['source_type']._loaded_options = None
    _globals['_ASSESSMENTSOURCE'].fields_by_name['source_type']._serialized_options = b'\370\206\031\001'
    _globals['_ASSESSMENTSOURCE'].fields_by_name['source_id']._loaded_options = None
    _globals['_ASSESSMENTSOURCE'].fields_by_name['source_id']._serialized_options = b'\370\206\031\001'
    _globals['_ASSESSMENT_METADATAENTRY']._loaded_options = None
    _globals['_ASSESSMENT_METADATAENTRY']._serialized_options = b'8\001'
    _globals['_ASSESSMENT'].fields_by_name['assessment_name']._loaded_options = None
    _globals['_ASSESSMENT'].fields_by_name['assessment_name']._serialized_options = b'\370\206\031\001'
    _globals['_ASSESSMENT'].fields_by_name['error']._loaded_options = None
    _globals['_ASSESSMENT'].fields_by_name['error']._serialized_options = b'\030\001'
    _globals['_ASSESSMENTSOURCE']._serialized_start=123
    _globals['_ASSESSMENTSOURCE']._serialized_end=321
    _globals['_ASSESSMENTSOURCE_SOURCETYPE']._serialized_start=244
    _globals['_ASSESSMENTSOURCE_SOURCETYPE']._serialized_end=321
    _globals['_ASSESSMENTERROR']._serialized_start=323
    _globals['_ASSESSMENTERROR']._serialized_end=404
    _globals['_EXPECTATION']._serialized_start=407
    _globals['_EXPECTATION']._serialized_end=598
    _globals['_EXPECTATION_SERIALIZEDVALUE']._serialized_start=536
    _globals['_EXPECTATION_SERIALIZEDVALUE']._serialized_end=598
    _globals['_FEEDBACK']._serialized_start=600
    _globals['_FEEDBACK']._serialized_end=701
    _globals['_ASSESSMENT']._serialized_start=704
    _globals['_ASSESSMENT']._serialized_end=1305
    _globals['_ASSESSMENT_METADATAENTRY']._serialized_start=1249
    _globals['_ASSESSMENT_METADATAENTRY']._serialized_end=1296
  # @@protoc_insertion_point(module_scope)

else:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: assessments.proto
  """Generated protocol buffer code."""
  from google.protobuf import descriptor as _descriptor
  from google.protobuf import descriptor_pool as _descriptor_pool
  from google.protobuf import message as _message
  from google.protobuf import reflection as _reflection
  from google.protobuf import symbol_database as _symbol_database
  # @@protoc_insertion_point(imports)

  _sym_db = _symbol_database.Default()


  from . import databricks_pb2 as databricks__pb2
  from google.protobuf import struct_pb2 as google_dot_protobuf_dot_struct__pb2
  from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2


  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x11\x61ssessments.proto\x12\x12mlflow.assessments\x1a\x10\x64\x61tabricks.proto\x1a\x1cgoogle/protobuf/struct.proto\x1a\x1fgoogle/protobuf/timestamp.proto\"\xc6\x01\n\x10\x41ssessmentSource\x12J\n\x0bsource_type\x18\x01 \x01(\x0e\x32/.mlflow.assessments.AssessmentSource.SourceTypeB\x04\xf8\x86\x19\x01\x12\x17\n\tsource_id\x18\x02 \x01(\tB\x04\xf8\x86\x19\x01\"M\n\nSourceType\x12\x1b\n\x17SOURCE_TYPE_UNSPECIFIED\x10\x00\x12\t\n\x05HUMAN\x10\x01\x12\r\n\tLLM_JUDGE\x10\x02\x12\x08\n\x04\x43ODE\x10\x03\"Q\n\x0f\x41ssessmentError\x12\x12\n\nerror_code\x18\x01 \x01(\t\x12\x15\n\rerror_message\x18\x02 \x01(\t\x12\x13\n\x0bstack_trace\x18\x03 \x01(\t\"\xbf\x01\n\x0b\x45xpectation\x12%\n\x05value\x18\x02 \x01(\x0b\x32\x16.google.protobuf.Value\x12I\n\x10serialized_value\x18\x03 \x01(\x0b\x32/.mlflow.assessments.Expectation.SerializedValue\x1a>\n\x0fSerializedValue\x12\x1c\n\x14serialization_format\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t\"e\n\x08\x46\x65\x65\x64\x62\x61\x63k\x12%\n\x05value\x18\x02 \x01(\x0b\x32\x16.google.protobuf.Value\x12\x32\n\x05\x65rror\x18\x03 \x01(\x0b\x32#.mlflow.assessments.AssessmentError\"\xd9\x04\n\nAssessment\x12\x15\n\rassessment_id\x18\x01 \x01(\t\x12\x1d\n\x0f\x61ssessment_name\x18\x02 \x01(\tB\x04\xf8\x86\x19\x01\x12\x10\n\x08trace_id\x18\x03 \x01(\t\x12\x0f\n\x07span_id\x18\x04 \x01(\t\x12\x34\n\x06source\x18\x05 \x01(\x0b\x32$.mlflow.assessments.AssessmentSource\x12/\n\x0b\x63reate_time\x18\x06 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x34\n\x10last_update_time\x18\x07 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x30\n\x08\x66\x65\x65\x64\x62\x61\x63k\x18\t \x01(\x0b\x32\x1c.mlflow.assessments.FeedbackH\x00\x12\x36\n\x0b\x65xpectation\x18\n \x01(\x0b\x32\x1f.mlflow.assessments.ExpectationH\x00\x12\x11\n\trationale\x18\x0b \x01(\t\x12\x36\n\x05\x65rror\x18\x0c \x01(\x0b\x32#.mlflow.assessments.AssessmentErrorB\x02\x18\x01\x12>\n\x08metadata\x18\r \x03(\x0b\x32,.mlflow.assessments.Assessment.MetadataEntry\x12\x11\n\toverrides\x18\x0e \x01(\t\x12\x13\n\x05valid\x18\x0f \x01(\x08:\x04true\x1a/\n\rMetadataEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x42\x07\n\x05valueB\x19\n\x14org.mlflow.api.proto\x90\x01\x01')



  _ASSESSMENTSOURCE = DESCRIPTOR.message_types_by_name['AssessmentSource']
  _ASSESSMENTERROR = DESCRIPTOR.message_types_by_name['AssessmentError']
  _EXPECTATION = DESCRIPTOR.message_types_by_name['Expectation']
  _EXPECTATION_SERIALIZEDVALUE = _EXPECTATION.nested_types_by_name['SerializedValue']
  _FEEDBACK = DESCRIPTOR.message_types_by_name['Feedback']
  _ASSESSMENT = DESCRIPTOR.message_types_by_name['Assessment']
  _ASSESSMENT_METADATAENTRY = _ASSESSMENT.nested_types_by_name['MetadataEntry']
  _ASSESSMENTSOURCE_SOURCETYPE = _ASSESSMENTSOURCE.enum_types_by_name['SourceType']
  AssessmentSource = _reflection.GeneratedProtocolMessageType('AssessmentSource', (_message.Message,), {
    'DESCRIPTOR' : _ASSESSMENTSOURCE,
    '__module__' : 'assessments_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.assessments.AssessmentSource)
    })
  _sym_db.RegisterMessage(AssessmentSource)

  AssessmentError = _reflection.GeneratedProtocolMessageType('AssessmentError', (_message.Message,), {
    'DESCRIPTOR' : _ASSESSMENTERROR,
    '__module__' : 'assessments_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.assessments.AssessmentError)
    })
  _sym_db.RegisterMessage(AssessmentError)

  Expectation = _reflection.GeneratedProtocolMessageType('Expectation', (_message.Message,), {

    'SerializedValue' : _reflection.GeneratedProtocolMessageType('SerializedValue', (_message.Message,), {
      'DESCRIPTOR' : _EXPECTATION_SERIALIZEDVALUE,
      '__module__' : 'assessments_pb2'
      # @@protoc_insertion_point(class_scope:mlflow.assessments.Expectation.SerializedValue)
      })
    ,
    'DESCRIPTOR' : _EXPECTATION,
    '__module__' : 'assessments_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.assessments.Expectation)
    })
  _sym_db.RegisterMessage(Expectation)
  _sym_db.RegisterMessage(Expectation.SerializedValue)

  Feedback = _reflection.GeneratedProtocolMessageType('Feedback', (_message.Message,), {
    'DESCRIPTOR' : _FEEDBACK,
    '__module__' : 'assessments_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.assessments.Feedback)
    })
  _sym_db.RegisterMessage(Feedback)

  Assessment = _reflection.GeneratedProtocolMessageType('Assessment', (_message.Message,), {

    'MetadataEntry' : _reflection.GeneratedProtocolMessageType('MetadataEntry', (_message.Message,), {
      'DESCRIPTOR' : _ASSESSMENT_METADATAENTRY,
      '__module__' : 'assessments_pb2'
      # @@protoc_insertion_point(class_scope:mlflow.assessments.Assessment.MetadataEntry)
      })
    ,
    'DESCRIPTOR' : _ASSESSMENT,
    '__module__' : 'assessments_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.assessments.Assessment)
    })
  _sym_db.RegisterMessage(Assessment)
  _sym_db.RegisterMessage(Assessment.MetadataEntry)

  if _descriptor._USE_C_DESCRIPTORS == False:

    DESCRIPTOR._options = None
    DESCRIPTOR._serialized_options = b'\n\024org.mlflow.api.proto\220\001\001'
    _ASSESSMENTSOURCE.fields_by_name['source_type']._options = None
    _ASSESSMENTSOURCE.fields_by_name['source_type']._serialized_options = b'\370\206\031\001'
    _ASSESSMENTSOURCE.fields_by_name['source_id']._options = None
    _ASSESSMENTSOURCE.fields_by_name['source_id']._serialized_options = b'\370\206\031\001'
    _ASSESSMENT_METADATAENTRY._options = None
    _ASSESSMENT_METADATAENTRY._serialized_options = b'8\001'
    _ASSESSMENT.fields_by_name['assessment_name']._options = None
    _ASSESSMENT.fields_by_name['assessment_name']._serialized_options = b'\370\206\031\001'
    _ASSESSMENT.fields_by_name['error']._options = None
    _ASSESSMENT.fields_by_name['error']._serialized_options = b'\030\001'
    _ASSESSMENTSOURCE._serialized_start=123
    _ASSESSMENTSOURCE._serialized_end=321
    _ASSESSMENTSOURCE_SOURCETYPE._serialized_start=244
    _ASSESSMENTSOURCE_SOURCETYPE._serialized_end=321
    _ASSESSMENTERROR._serialized_start=323
    _ASSESSMENTERROR._serialized_end=404
    _EXPECTATION._serialized_start=407
    _EXPECTATION._serialized_end=598
    _EXPECTATION_SERIALIZEDVALUE._serialized_start=536
    _EXPECTATION_SERIALIZEDVALUE._serialized_end=598
    _FEEDBACK._serialized_start=600
    _FEEDBACK._serialized_end=701
    _ASSESSMENT._serialized_start=704
    _ASSESSMENT._serialized_end=1305
    _ASSESSMENT_METADATAENTRY._serialized_start=1249
    _ASSESSMENT_METADATAENTRY._serialized_end=1296
  # @@protoc_insertion_point(module_scope)
```

--------------------------------------------------------------------------------

---[FILE: assessments_pb2.pyi]---
Location: mlflow-master/mlflow/protos/assessments_pb2.pyi

```text
import databricks_pb2 as _databricks_pb2
from google.protobuf import struct_pb2 as _struct_pb2
from google.protobuf import timestamp_pb2 as _timestamp_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class AssessmentSource(_message.Message):
    __slots__ = ("source_type", "source_id")
    class SourceType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
        __slots__ = ()
        SOURCE_TYPE_UNSPECIFIED: _ClassVar[AssessmentSource.SourceType]
        HUMAN: _ClassVar[AssessmentSource.SourceType]
        LLM_JUDGE: _ClassVar[AssessmentSource.SourceType]
        CODE: _ClassVar[AssessmentSource.SourceType]
    SOURCE_TYPE_UNSPECIFIED: AssessmentSource.SourceType
    HUMAN: AssessmentSource.SourceType
    LLM_JUDGE: AssessmentSource.SourceType
    CODE: AssessmentSource.SourceType
    SOURCE_TYPE_FIELD_NUMBER: _ClassVar[int]
    SOURCE_ID_FIELD_NUMBER: _ClassVar[int]
    source_type: AssessmentSource.SourceType
    source_id: str
    def __init__(self, source_type: _Optional[_Union[AssessmentSource.SourceType, str]] = ..., source_id: _Optional[str] = ...) -> None: ...

class AssessmentError(_message.Message):
    __slots__ = ("error_code", "error_message", "stack_trace")
    ERROR_CODE_FIELD_NUMBER: _ClassVar[int]
    ERROR_MESSAGE_FIELD_NUMBER: _ClassVar[int]
    STACK_TRACE_FIELD_NUMBER: _ClassVar[int]
    error_code: str
    error_message: str
    stack_trace: str
    def __init__(self, error_code: _Optional[str] = ..., error_message: _Optional[str] = ..., stack_trace: _Optional[str] = ...) -> None: ...

class Expectation(_message.Message):
    __slots__ = ("value", "serialized_value")
    class SerializedValue(_message.Message):
        __slots__ = ("serialization_format", "value")
        SERIALIZATION_FORMAT_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        serialization_format: str
        value: str
        def __init__(self, serialization_format: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    VALUE_FIELD_NUMBER: _ClassVar[int]
    SERIALIZED_VALUE_FIELD_NUMBER: _ClassVar[int]
    value: _struct_pb2.Value
    serialized_value: Expectation.SerializedValue
    def __init__(self, value: _Optional[_Union[_struct_pb2.Value, _Mapping]] = ..., serialized_value: _Optional[_Union[Expectation.SerializedValue, _Mapping]] = ...) -> None: ...

class Feedback(_message.Message):
    __slots__ = ("value", "error")
    VALUE_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    value: _struct_pb2.Value
    error: AssessmentError
    def __init__(self, value: _Optional[_Union[_struct_pb2.Value, _Mapping]] = ..., error: _Optional[_Union[AssessmentError, _Mapping]] = ...) -> None: ...

class Assessment(_message.Message):
    __slots__ = ("assessment_id", "assessment_name", "trace_id", "span_id", "source", "create_time", "last_update_time", "feedback", "expectation", "rationale", "error", "metadata", "overrides", "valid")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    ASSESSMENT_ID_FIELD_NUMBER: _ClassVar[int]
    ASSESSMENT_NAME_FIELD_NUMBER: _ClassVar[int]
    TRACE_ID_FIELD_NUMBER: _ClassVar[int]
    SPAN_ID_FIELD_NUMBER: _ClassVar[int]
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    CREATE_TIME_FIELD_NUMBER: _ClassVar[int]
    LAST_UPDATE_TIME_FIELD_NUMBER: _ClassVar[int]
    FEEDBACK_FIELD_NUMBER: _ClassVar[int]
    EXPECTATION_FIELD_NUMBER: _ClassVar[int]
    RATIONALE_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    OVERRIDES_FIELD_NUMBER: _ClassVar[int]
    VALID_FIELD_NUMBER: _ClassVar[int]
    assessment_id: str
    assessment_name: str
    trace_id: str
    span_id: str
    source: AssessmentSource
    create_time: _timestamp_pb2.Timestamp
    last_update_time: _timestamp_pb2.Timestamp
    feedback: Feedback
    expectation: Expectation
    rationale: str
    error: AssessmentError
    metadata: _containers.ScalarMap[str, str]
    overrides: str
    valid: bool
    def __init__(self, assessment_id: _Optional[str] = ..., assessment_name: _Optional[str] = ..., trace_id: _Optional[str] = ..., span_id: _Optional[str] = ..., source: _Optional[_Union[AssessmentSource, _Mapping]] = ..., create_time: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., last_update_time: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., feedback: _Optional[_Union[Feedback, _Mapping]] = ..., expectation: _Optional[_Union[Expectation, _Mapping]] = ..., rationale: _Optional[str] = ..., error: _Optional[_Union[AssessmentError, _Mapping]] = ..., metadata: _Optional[_Mapping[str, str]] = ..., overrides: _Optional[str] = ..., valid: bool = ...) -> None: ...
```

--------------------------------------------------------------------------------

````
