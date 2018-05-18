module.exports.Constants = {
  // WOPI Protocol Constants
  WOPI_BASE_PATH: "/wopi/",
  WOPI_CHILDREN_PATH: "/children",
  WOPI_CONTENTS_PATH: "/contents",
  WOPI_FILES_PATH: "files/",
  WOPI_FOLDERS_PATH: "folders/",
  // WOI URL Placeholders
  WOPI_URL_PH_BUSINESS_USER: "<IsLicensedUser=BUSINESS_USER&>",
  WOPI_URL_PH_DC_LLCC: "<rs=DC_LLCC&>",
  WOPI_URL_PH_DISABLE_ASYNC: "<na=DISABLE_ASYNC&>",
  WOPI_URL_PH_DISABLE_CHAT: "<dchat=DISABLE_CHAT&>",
  WOPI_URL_PH_DISABLE_BROADCAST: "<vp=DISABLE_BROADCAST&>",
  WOPI_URL_PH_EMBDDED: "<e=EMBEDDED&>",
  WOPI_URL_PH_FULLSCREEN: "<fs=FULLSCREEN&>",
  WOPI_URL_PH_PERFSTATS: "<showpagestats=PERFSTATS&>",
  WOPI_URL_PH_RECORDING: "<rec=RECORDING&>",
  WOPI_URL_PH_THEME_ID: "<thm=THEME_ID&>",
  WOPI_URL_PH_UI_LLCC: "<ui=UI_LLCC&>",
  WOPI_URL_PH_VALIDATOR_TEST_CATEGORY: "<testcategory=VALIDATOR_TEST_CATEGORY>",
  WOPI_URL_PH_LIST: [
    'WOPI_URL_PH_BUSINESS_USER',
    'WOPI_URL_PH_DC_LLCC',
    'WOPI_URL_PH_DISABLE_ASYNC',
    'WOPI_URL_PH_DISABLE_CHAT',
    'WOPI_URL_PH_DISABLE_BROADCAST',
    'WOPI_URL_PH_EMBDDED',
    'WOPI_URL_PH_FULLSCREEN',
    'WOPI_URL_PH_PERFSTATS',
    'WOPI_URL_PH_RECORDING',
    'WOPI_URL_PH_THEME_ID',
    'WOPI_URL_PH_UI_LLCC',
    'WOPI_URL_PH_VALIDATOR_TEST_CATEGORY'
  ],
  // Cache Keys and values
  WOPI_DISCOVERY_CACHE_KEY: "wopidisco",
  WOPI_DISCOVERY_CACHE_TTL: 21600000, // 6 hr
  // WOPI Discovery endpoint
  WOPI_DISCOVERY_ENDPOINT:
    "https://onenote.officeapps-df.live.com/hosting/discovery",
  WopiResponseHeaders: {
    //WOPI Header Consts
    HOST_ENDPOINT: "X-WOPI-HostEndpoint",
    INVALID_FILE_NAME_ERROR: "X-WOPI-InvalidFileNameError",
    LOCK: "X-WOPI-Lock",
    LOCK_FAILURE_REASON: "X-WOPI-LockFailureReason",
    LOCKED_BY_OTHER_INTERFACE: "X-WOPI-LockedByOtherInterface",
    MACHINE_NAME: "X-WOPI-MachineName",
    PREF_TRACE: "X-WOPI-PerfTrace",
    SERVER_ERROR: "X-WOPI-ServerError",
    SERVER_VERSION: "X-WOPI-ServerVersion",
    VALID_RELATIVE_TARGET: "X-WOPI-ValidRelativeTarget"
  },
  /// Contains valid WOPI request headers
  WopiRequestHeaders: {
    //WOPI Header Consts
    APP_ENDPOINT: "X-WOPI-AppEndpoint",
    CLIENT_VERSION: "X-WOPI-ClientVersion",
    CORRELATION_ID: "X-WOPI-CorrelationId",
    LOCK: "X-WOPI-Lock",
    MACHINE_NAME: "X-WOPI-MachineName",
    MAX_EXPECTED_SIZE: "X-WOPI-MaxExpectedSize",
    OLD_LOCK: "X-WOPI-OldLock",
    OVERRIDE: "X-WOPI-Override",
    OVERWRITE_RELATIVE_TARGET: "X-WOPI-OverwriteRelativeTarget",
    PREF_TRACE_REQUESTED: "X-WOPI-PerfTraceRequested",
    PROOF: "X-WOPI-Proof",
    PROOF_OLD: "X-WOPI-ProofOld",
    RELATIVE_TARGET: "X-WOPI-RelativeTarget",
    REQUESTED_NAME: "X-WOPI-RequestedName",
    SESSION_CONTEXT: "X-WOPI-SessionContext",
    SIZE: "X-WOPI-Size",
    SUGGESTED_TARGET: "X-WOPI-SuggestedTarget",
    TIME_STAMP: "X-WOPI-TimeStamp"
  }
};

//export default Constants;
//# sourceMappingURL=configjs.map
