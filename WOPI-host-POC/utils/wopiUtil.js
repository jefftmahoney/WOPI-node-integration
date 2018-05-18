//import * as Constants from "../config";
const Constants = require("../config/constants").Constants;
const populateActions = require("./wopiDiscovery").populateActions;
/**
 * Called at the beginning of every WOPI request to parse the request and determine the request type *
 */
module.exports.processWopiRequest = async function(req, res) {
  let requestType = getRequestType(req);
  let fileId = req.params.fileId;
  let file = {
    id: "01N7NB4CGFCVLYGC2E7NEKEBGDPZJ27QEI",
    OwnerId: "1234",
    UserId: "tricon",
    BaseFileName: "test.xlsx",
    Size: 7907,
    Version: "1"
  };
  try {
    // Get file data from DB  //
    // var file = DocumentDBRepository<DetailedFileModel>.GetItem("Files", i => i.id == itemId);

    //        // Check for null file
    //        if (file == null)
    //        response = returnStatus(HttpStatusCode.NotFound, "File Unknown/User Unauthorized");
    //    else
    //    {
    //        // Validate WOPI Proof (ie - ensure request came from Office Online)
    //        if (await WopiUtil.ValidateWopiProof(context))
    //        {
    //            // Get discovery information
    //            var fileExt = file.BaseFileName.Substring(file.BaseFileName.LastIndexOf('.') + 1).ToLower();
    //            var actions = await WopiUtil.GetDiscoveryInfo();

    //            // Augments the file with additional properties CloseUrl, HostViewUrl, HostEditUrl
    //            file.CloseUrl = String.Format("https://{0}", context.Request.Url.Authority);
    //            var view = actions.FirstOrDefault(i => i.ext == fileExt && i.name == "view");
    //            if (view != null)
    //                file.HostViewUrl = WopiUtil.GetActionUrl(view, file, context.Request.Url.Authority);
    //            var edit = actions.FirstOrDefault(i => i.ext == fileExt && i.name == "edit");
    //            if (edit != null)
    //                file.HostEditUrl = WopiUtil.GetActionUrl(edit, file, context.Request.Url.Authority);

    //            // Get the user from the token (token is already validated)
    //            file.UserId = WopiSecurity.GetUserFromToken(request.AccessToken);

    switch (requestType) {
      case "CheckFileInfo":
        response = await CheckFileInfo(req, res, file);
        break;
      case "GetFile":
        response = await GetFile(req, res, file);
        break;
      case "Lock":
        response = await Lock(req, res, file);
        break;
      case "GetLock":
        response = await GetLock(req, res, file);
        break;
      case "RefreshLock":
        response = await RefreshLock(req, res, file);
        break;
      case "Unlock":
        response = await Unlock(req, res, file);
        break;
      case "UnlockAndRelock":
        response = await UnlockAndRelock(req, res, file);
        break;
      case "PutFile":
        response = await PutFile(req, res, file);
        break;
      case "PutRelativeFile":
        response = await PutRelativeFile(req, res, file);
        break;
      case "RenameFile":
        response = await RenameFile(req, res, file);
        break;
      case "PutUserInfo":
        response = await PutUserInfo(req, res, file);
        break;
      default:
        response = "Unsupported";
        // response = returnStatus(HttpStatusCode.NotImplemented, "Unsupported");
        break;
    }
  } catch (err) {
    // An unknown exception occurred...return 500
    console.log("Server Error: " + err);
    response = "Server Error: " + err;
    //response = returnStatus(HttpStatusCode.InternalServerError, "Server Error");
  }

  res.send(response);
};

/**
 * Process CheckFileInfo request
 */

function CheckFileInfo(req, res, file) {
  file.actions = populateActions(file);
  return file;
}

/**
 * Process GetFile request
 */

function GetFile(req, res, file) {}

/**
 * Process Lock request
 */

async function Lock(req, res, file) {
  let requestLock = req.headers["x-wopi-lock"];
  if (file.lockValue || (file.lockExpires && file.lockExpires < Date.now())) {
    // Update the file with a lockValue and LockExpiration
    file.lockValue = requestLock;
    file.lockExpires = DateTime.Now.AddMinutes(30);
    await File.findByIdAndUpdate(file.id);

    // Return success 200
    return returnStatus(res, 200);
  } else if (file.lockValue === requestLock) {
    // File lock matches existing lock, so refresh lock by extending expiration
    file.lockExpires = DateTime.Now.AddMinutes(30);
    await File.findByIdAndUpdate(file.id);

    // Return success 200
    return returnStatus(res, 200);
  } else {
    // The file is locked by someone else...return mismatch
    return returnLockMismatch(
      res,
      file.lockValue,
      "File already locked by user"
    );
  }
}

/**
 * Process GetLock request
 */

async function GetLock(req, res, file) {
  // Check for valid lock on file
  if (!file.lockValue) {
    // File is not locked...return empty X-WOPI-Lock header
    res.set("x-wopi-lock", "");

    // Return success 200
    return returnStatus(res, 200);
  } else if (file.lockExpires && file.lockExpires < Date.now()) {
    // File lock expired, so clear it out
    file.lockValue = null;
    file.lockExpires = null;
    await File.findByIdAndUpdate(file.id);

    // File is not locked...return empty X-WOPI-Lock header
    res.set("x-wopi-lock", "");

    // Return success 200
    return returnStatus(res, 200);
  } else {
    // File has a valid lock, so we need to return it
    res.set("x-wopi-lock", file.lockValue);

    // Return success 200
    return returnStatus(res, 200);
  }
}

/**
 * Process RefreshLock request
 */

async function RefreshLock(req, res, file) {
  let requestLock = req.headers["x-wopi-lock"];
  // Ensure the file has a valid lock
  if (!file.lockValue) {
    // File isn't locked...pass empty Lock in mismatch response
    return returnLockMismatch(res, "", "File isn't locked");
  } else if (file.lockExpires && file.lockExpires < Date.now()) {
    // File lock expired, so clear it out
    file.lockValue = null;
    file.lockExpires = null;
    await File.findByIdAndUpdate(file.id);

    // File isn't locked...pass empty Lock in mismatch response
    return returnLockMismatch(res, "", "File isn't locked");
  } else if (requestLock != file.lockValue) {
    // File lock mismatch...pass Lock in mismatch response
    return returnLockMismatch(res, file.lockValue, "Lock mismatch");
  } else {
    // Extend the expiration
    file.lockExpires = DateTime.Now.AddMinutes(30);
    await File.findByIdAndUpdate(file.id);

    // Return success 200
    return returnStatus(res, 200);
  }
}

/**
 * Process Unlock request
 */

async function Unlock(req, res, file) {
  // Get the Lock value passed in on the request
  let requestLock = req.headers["x-wopi-lock"];
  // Ensure the file has a valid lock
  if (!file.lockValue) {
    // File isn't locked...pass empty Lock in mismatch response
    return returnLockMismatch(res, "", "File isn't locked");
  } else if (file.lockExpires != null && file.lockExpires < Date.now()) {
    // File lock expired, so clear it out
    file.lockValue = null;
    file.lockExpires = null;
    await File.findByIdAndUpdate(file.id);

    // File isn't locked...pass empty Lock in mismatch response
    return returnLockMismatch(res, "", "File isn't locked");
  } else if (requestLock != file.lockValue) {
    // File lock mismatch...pass Lock in mismatch response
    return returnLockMismatch(res, file.lockValue, "Lock mismatch");
  } else {
    // Unlock the file
    file.lockValue = null;
    file.lockExpires = null;
    await File.findByIdAndUpdate(file.id);

    // Return success 200
    return returnStatus(res, 200);
  }
}

/**
 * Process UnlockAndRelock request
 */

async function UnlockAndRelock(req, res, file) {
  // Get the Lock and OldLock values passed in on the request
  let requestLock = req.headers["x-wopi-lock"];
  let requestOldLock = req.headers["x-wopi-oldlock"];

  // Ensure the file has a valid lock
  if (!file.LockValue) {
    // File isn't locked...pass empty Lock in mismatch response
    return returnLockMismatch(res, "", "File isn't locked");
  } else if (file.lockExpires != null && file.lockExpires < Date.now()) {
    // File lock expired, so clear it out
    file.lockValue = null;
    file.lockExpires = null;
    await File.findByIdAndUpdate(file.id);

    // File isn't locked...pass empty Lock in mismatch response
    return returnLockMismatch(res, "", "File isn't locked");
  } else if (requestOldLock != file.lockValue) {
    // File lock mismatch...pass Lock in mismatch response
    return returnLockMismatch(res, file.lockValue, "Lock mismatch");
  } else {
    // Update the file with a LockValue and LockExpiration
    file.LockValue = requestLock;
    file.LockExpires = DateTime.Now.AddMinutes(30);
    await File.findByIdAndUpdate(file.id);

    // Return success 200
    return returnStatus(res, 200);
  }
}

/**
 * Process PutFile request
 */

async function PutFile(req, res, file) {
  // Get the Lock value passed in on the request
  let requestLock = req.headers["x-wopi-lock"];

  //Ensure file has valid lock
  if (!file.lockValue) {
    //
  }
}

/**
 * Process PutRelativeFile request
 */

async function PutRelativeFile(req, res, file) {
  return new Promise((resolve, reject) => {
    resolve("Inside PutRelativeFile");
  });
}

/**
 * Process RenameFile request
 */

async function RenameFile(req, res, file) {
  // Get the Lock value passed in on the request
  let requestLock = req.headers["x-wopi-lock"];

  // Make sure the X-WOPI-RequestedName header is included
  if (req.headers["x-wopi-requestedname"]) {
    // Get the new file name
    var newFileName = req.headers["x-wopi-requestedname"];

    // Ensure the file isn't locked
    if (
      !file.LockValue ||
      (!file.LockExpires && file.LockExpires < Date.now())
    ) {
      // Update the file with a LockValue and LockExpiration
      file.LockValue = requestLock;
      file.LockExpires = DateTime.Now.AddMinutes(30);
      file.BaseFileName = newFileName;
      await File.findByIdAndUpdate(file.id);

      // Return success 200
      return returnStatus(res, 200);
    } else if (file.LockValue === requestLock) {
      // File lock matches existing lock, so we can change the name
      file.LockExpires = DateTime.Now.AddMinutes(30);
      file.BaseFileName = newFileName;
      await File.findByIdAndUpdate(file.id);

      // Return success 200
      return returnStatus(res, 200);
    } else {
      // The file is locked by someone else...return mismatch
      return returnLockMismatch(res, file.LockValue, "File already locked");
    }
  } else {
    // X-WOPI-RequestedName header wasn't included
    return returnStatus(
      400,
      "X-WOPI-RequestedName header wasn't included in request"
    );
  }
}

/**
 * Process PutUserInfo request
 */

// async function PutUserInfo(req, res, file) {

// }

function getRequestType(req) {
  let requestType = "None";

  let requestPath = req.path.toLowerCase();
  if (requestPath.includes(Constants.WOPI_FILES_PATH)) {
    if (requestPath.includes(Constants.WOPI_CONTENTS_PATH)) {
      if (req.method === "GET") {
        requestType = "GetFile";
      }
      if (req.method === "POST") {
        requestType = "PutFile";
      }
    } else {
      if (req.method === "GET") {
        requestType = "CheckFileInfo";
      } else if (req.method === "POST") {
        let wopiOverride = req.headers["x-wopi-override"];

        switch (wopiOverride) {
          case "LOCK":
            // Check lock type based on presence of OldLock header
            if (req.headers["x-wopi-oldlock"] != null)
              requestType = "UnlockAndRelock";
            else requestType = "Lock";
            break;
          case "GET_LOCK":
            requestType = "GetLock";
            break;
          case "REFRESH_LOCK":
            requestType = "RefreshLock";
            break;
          case "UNLOCK":
            requestType = "Unlock";
            break;
          case "PUT_RELATIVE":
            requestType = "PutRelativeFile";
            break;
          case "RENAME_FILE":
            requestType = "RenameFile";
            break;
          case "PUT_USER_INFO":
            requestType = "PutUserInfo";
            break;
        }
      }
    }
  }
  console.log(requestType);
  return requestType;
}

/**
 * Handles lock mismatch responses on WOPI requests
 */

function returnLockMismatch(res, existingLock, reason) {
  var response = returnStatus(
    res,
    409,
    "Lock mismatch/Locked by another interface"
  );

  res.set("x-wopi-lock", existingLock);

  //response.Headers.Add(WopiResponseHeaders.LOCK, existingLock ?? String.Empty);
  if (reason) {
    res.set("x-wopi-lockfailurereason", reason);
  }
  return res;
}

/**
 * Forms the HttpResponseMessage for the WOPI request
 */

const returnStatus = function(res, code, description) {
  res.description = description;
  res.status(code);
  return res;
};

exports.returnStatus = returnStatus;
