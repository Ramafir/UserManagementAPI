import { FILES } from "@config";

import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";

export const CUSTOM_MESSAGES = {
  GENERAL: {
    UNIQUE: "%s must be unique!",
    MIN_CHARACTERS: "Should include at least %s characters.",
    MAX_CHARACTERS: "Should include up to %s characters.",
    MIN_MAX_CHARACTERS: "Should include from %s to %s characters.",
    SHOULD_BE: "Should be %s",
    SHOULD_START_WITH: "Should start with %s",
    SHOULD_NOT_END_WITH: "Should not end with %s",
    SHOULD_BE_GREATER_THAN: "Should be greater than %s",
    NOT_EDITABLE: "This %s is not editable.",
    NOT_AVAILABLE: "This %s is not available.",
    NOT_ASSIGNABLE: "This %s is not assignable.",
    REQUIRE_ONE_OF: "Either %s or %s should be provided.",
    HEXADECIMAL_FORMAT: "%s needs to be in hexadecimal pattern (e.g. #4231E2)",
    WRONG_VERSION: "Wrong resource version (available: ${values})",
  },

  DATE: {
    MAX_DIFFERENCE: "Max allowed difference is %s (provided %s)",
    NOT_UNIX_TIMESTAMP_IN_SECONDS:
      "Unix format in seconds is required (e.g. 1708168503)",
  },

  BLUEPRINT: {
    SOME_NOT_AVAILABLE: "One or more blueprints are not available.",
  },

  BUCKET: {
    INVALID_CONFIGURATION: "Buckets configuration is invalid!",
  },

  FILE: {
    DUPLICATE: "Dir (%s) already includes file with such name.",
    VARIANTS_CONFLICT:
      "File %s was selected with %s different variants. Please update your configuration to use only one variant or remove one of the blueprints.",
    ONLY_ONE_ROOT_INDICATOR: `Relative path should only contain one root indicator '${FILES.ROOT}'`,
    SHOULD_START_WITH_ROOT_INDICATOR: `Relative path should start with root indicator '${FILES.ROOT}'`,
  },

  NOTE: {},

  CHAT_MESSAGE: {
    MAX_DEPTH_REACHED: `Can't add reply to that comment. Max depth reached (${WORKSPACE_CHAT_MAX_DEPTH})!`,
  },

  PERMISSION: {
    MISSING_PERMISSION: "Permission '%s' (%s) must be provided in request.",
  },

  AUTH: {
    DELETE_OWN_SESSION: "Cannot delete own session. Use sign out request 👌.",
    PASSWORD: {
      ONE_LOWERCASE_LETTER: "Include at least one lowercase letter.",
      ONE_UPPERCASE_LETTER: "Include at least one uppercase letter.",
      ONE_DIGIT: "Include at least one digit.",
      ONE_SPECIAL_CHARACTER: "Include at least one special character.",
    },
  },

  USER: {
    NO_PERSONAL_ACCOUNT_CHANGES: "Can't change personal account.",
    INVALID_WORKSPACES: "One or more workspaces do not exist!",
  },

  VARIANT: {
    MUST_REFERENCE_FILE: "Must reference file.",
  },
};
