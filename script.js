// #region //! Consts for elements

//#region //* Main page
const supportOverlay = document.querySelector(".supportOverlay");

const mainSettingsOverlay = document.querySelector(".mainSettingsOverlay");
const speffzBtn = document.querySelector(".speffzBtn");
const customLettersBtn = document.querySelector(".customLettersBtn");
const schemeInput = document.querySelector(".schemeInput");

const questions = document.querySelectorAll(".questionBox");
//#endregion //* Main page

//#region //* Piecetype Page

//#region Top section / popups
const presetsOverlay = document.querySelector(".presetsOverlay");
const presetsPopup = document.querySelector(".presetsPopup");
const preset = document.querySelectorAll(".preset");

const specialSlowsOptions = document.querySelector(".specialSlowsOptions");
const specialSlowsBtns = document.querySelectorAll(".specialSlowsOption");

const settingsOverlay = document.querySelector(".settingsOverlay");
const container = document.querySelector(".bufferOrderContainer");
//#endregion Top section / popups

//#region Grid
const setDropdowns = document.querySelectorAll(".setContainer, .setContainerTwists");
const allCases = document.querySelectorAll(".case");
//#endregion Grid

//#region Training
const trainOverlay = document.querySelector(".trainOverlay"); // the full page
const repeatSlowBtn = document.querySelector(".repeatSlowBtn");
//#endregion //* Training

//#endregion //* Piecetype Page

//#endregion //? Consts for elements

//#region //! Dynamic vars

//#region Lettering Scheme Variables
var speffzArray = "ABCDEFGHIJKLMNOPQRSTUVWX";
var [UBL, UBR, UFR, UFL, LUB, LUF, LDF, LDB, FUL, FUR, FDR, FDL, RUF, RUB, RDB, RDF, BUR, BUL, BDL, BDR, DFL, DFR, DBR, DBL] = speffzArray.split("");
var [UB, UR, UF, UL, LU, LF, LD, LB, FU, FR, FD, FL, RU, RB, RD, RF, BU, BL, BD, BR, DF, DR, DB, DL] = speffzArray.split("");
//#endregion

//#region buffer variables
var selectedBuffer = "";
var bufferSibling = "";
var eliminatedBuffers = [];
//#endregion buffer variables

//#region training, used before
var inverseCase = "";
var targetTime = 3;
var casesBeforeBreak = 0;
var showNextLP = false;
var includeInv = false;
var maxAmount = 20;
var maxTime = 20;
var currentBuffer = "";
//#endregion training, used before

//#region training, used during
var randomArray = [];
var orderedArray = [];
var trainedObject = {};
var prevLP;
var currentLP;
var nextLPvar;
var overlayLP = document.querySelector(".overlayLetterpair");
var nextLP = document.querySelector(".nextLetterpair");
var casesLeft = document.querySelector(".casesLeft");
var progressBar = document.querySelector(".progressBar");
var progressPercent;
var startTime = 0;
var lpTimes = 0;
var lpTime = 0;
var breakActive = false;
var avg = 0;
var foundSlow = false;
var done = false;
//#endregion training, used during

// theme customization
var accentColor = "00b1cc";

// store token
var inputCode = "";

//#endregion //? Dynamic vars

//#region //! Functions

//#region //* Vars in html
function htmlVar(name, value) {
  var val = value;
  Object.defineProperty(window, name, {
    set(newVal) {
      val = newVal;
      updateVars()
    },
    get() {
      return val;
    }
  });
  updateVars(true);
}
function updateVars(firstTime) {
  document.querySelectorAll("*").forEach(el => {
    if (el.innerHTML.includes("<") || el.innerHTML.includes(">")) {
      return;
    }
    if (el.innerText.includes("{{") && el.innerText.includes("}}")) {
      var matches = el.innerText.match(/{{[a-zA-Z0-9 ]+}}/g);
      var minIndex = 0;
      matches.forEach(match => {
        var index = el.innerHTML.indexOf(match, minIndex);
        minIndex += index + match.length + 1;
        var varName = match.replace(/{/g, "").replace(/}/g, "").replace(/ /g, "");
        el.innerHTML = el.innerHTML.slice(0, index) + `<htmlvar data-var="${varName}">${window[varName]}</htmlvar>` + el.innerHTML.slice(index + match.length);
      })
    }
  });
  document.querySelectorAll("htmlvar").forEach(el => {
    el.innerText = window[el.getAttribute("data-var")];
  })
}
//#endregion //* vars in html

//#region //* Delete / Reset 
function resetSlowCases() {
  Swal.fire({
    title: 'Are you sure?',
    text: "This will reset all slow cases.",
    icon: 'warning',
    toast: true,
    position: 'top',
    showCancelButton: true,
    confirmButtonText: 'Continue',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Are you really sure?',
        text: "This action is irreversible. Do you want to proceed?",
        icon: 'warning',
        toast: true,
        position: 'top',
        showCancelButton: true,
        confirmButtonText: 'Reset Slow Cases',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('slowCases')) {
              localStorage.removeItem(key);
              i--;
            }
          }
          // TODO: after db added, delete from there as well

          window.location.reload();
        }
      });
    }
  });
}
function hardReset() {
  Swal.fire({
    title: 'Are you sure?',
    text: "This will delete ALL data!",
    icon: 'warning',
    toast: true,
    position: 'top',
    showCancelButton: true,
    confirmButtonText: 'Continue',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Are you really sure?',
        text: "This action is irreversible. Do you want to proceed?",
        icon: 'warning',
        toast: true,
        position: 'top',
        showCancelButton: true,
        confirmButtonText: 'Hard Reset',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          window.location.reload();
        }
      });
    }
  });
}
//#endregion //* Delete / Reset 

//#region //* Open and Close Windows
function openMainSettings() {
  // make settings visible, prevent scrolling
  mainSettingsOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  // add event listener to close settings
  mainSettingsOverlay.addEventListener("click", () => {
    mainSettingsOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  })

  // load colorpicker
  if (localStorage.getItem("ac")) {
    document.querySelector(".colorPickerInput").value = localStorage.getItem("ac");
  } else {
    document.querySelector(".colorPickerInput").value = "#00b1cc";
  }

  // load lettering scheme
  if (localStorage.getItem("letterScheme")) {
    const letters = localStorage.getItem("letterScheme");
    let hasDiff = false;
    for (let i = 0; i < letters.length; i++) {
      if (letters[i] !== speffzArray[i]) {
        hasDiff = true;
        break;
      }
    }
    if (hasDiff) {
      schemeInput.classList.add("open");
    }
  }

  // switch between speffz and custom
  speffzBtn.addEventListener("click", () => {
    schemeInput.classList.remove("open");
  });
  customLettersBtn.addEventListener("click", () => {
    if (!schemeInput.classList.contains("open"))
      schemeInput.classList.add("open");
  });
}

let sortableCreated = false;

function openPtSettings() {
  // make settings visible, prevent scrolling
  settingsOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  // add event listener to close settings
  settingsOverlay.addEventListener("click", () => {
    settingsOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  })

  // load max amount/time 
  if (localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`)) {
    document.querySelector(".slowPresetAmountInput").value = localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`);
  }
  if (localStorage.getItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`)) {
    document.querySelector(".slowPresetMaxInput").value = localStorage.getItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`);
  }


  clearSelection();

  // save buffers for comparison
  tempBufferArr = [];
  document.querySelector(".buffer").classList.add("selected");

  function clearSelection() {
    const selected = container.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }
  }

  // handle drag and drop floating
  function handleDoubleClick(event) {
    clearSelection();
    event.target.classList.add("selected");
  }

  container.addEventListener("dblclick", (event) => {
    if (event.target !== container) {
      handleDoubleClick(event);
    }
  });
  if(!sortableCreated){
    Sortable.create(container, {
      animation: 150,
    });
    sortableCreated = true;
  }
  loadOrder();
}
function openPresets() {
  // make settings visible 
  presetsOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  // add event listener to close presets
  presetsOverlay.addEventListener("click", () => {
    presetsOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  })
}
function openSpecialSlows() {
  // make popup visible
  specialSlowsOptions.style.opacity = "1";
  specialSlowsOptions.style.pointerEvents = "all";

  // add event listener to close popup
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".specialSlowsContainer")) {
      specialSlowsOptions.style.opacity = "0";
      specialSlowsOptions.style.pointerEvents = "none";
    }
  })
}
function openSupport() {
  // make support visible
  supportOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  // add event listener to close support
  supportOverlay.addEventListener("click", () => {
    supportOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  })
}
function setupFaq() {
  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.querySelector(".answer");
      const isOpen = answer.classList.contains("open");

      document.querySelectorAll(".questionBox.open").forEach(openQ => {
        openQ.classList.remove("open");
      });

      if (!isOpen) {
        question.classList.add("open");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".questionBox")) {
      document.querySelectorAll(".questionBox.open").forEach(openQ => {
        openQ.classList.remove("open");
      });
    }
  })
}
function openTokenPopup() {
  // make token popup visible
  document.querySelector('.tokenPopupOverlay').classList.add('visible');

  // add event listener to close token popup
  document.querySelector('.tokenPopupOverlay').addEventListener('click', () => {
    document.querySelector('.tokenPopupOverlay').classList.remove('visible');
  })
}
//#endregion //* Open and Close Windows

//#region //* Save Settings
function saveMainSettings() {
  // Handle lettering scheme (speffz / custom), then close window
  if (!schemeInput.classList.contains("open")) {
    if (localStorage.getItem("letterScheme") == speffzArray || localStorage.getItem("letterScheme") == null) {
    }
    assignSpeffzScheme();
    mainSettingsOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  }
  else if (schemeInput.classList.contains("open")) {
    if (validateAssignCustomScheme()) {
      mainSettingsOverlay.classList.remove("visible");
      document.body.style.overflow = "auto";
    } else {
      return;
    }
  }

  // store accent color
  accentColor = document.querySelector(".colorPickerInput").value;
  localStorage.setItem("ac", accentColor);

  Swal.fire({
    title: 'Settings Saved!',
    width: 'max-content',
    timer: 1000,
    icon: 'success',
    showConfirmButton: false,
    position: 'top',
    toast: true,
    showClass: {
      popup: '',
    },
    hideClass: {
      popup: '',
    },
  });
  setTimeout(() => {
    window.location.reload();
  }, 1100)
}
function savePtSettings() {
  // save settings in vars
  casesBeforeBreak = Number(document.querySelector(".casesBeforeBreakInput").value);
  targetTime = Number(document.querySelector(".targetTimeInput").value);
  showNextLP = document.querySelector(".showNextLetterpairInput").checked;
  includeInv = document.querySelector(".includeInversesInput").checked;

  // save settings to localstorage
  maxAmount = Number(document.querySelector(".slowPresetAmountInput").value);
  localStorage.setItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`, maxAmount);
  maxTime = Number(document.querySelector(".slowPresetMaxInput").value);
  localStorage.setItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`, maxTime);

  // store eliminated buffers
  selectedBuffer = document.querySelector(".buffer.selected");
  eliminatedBuffers = [];
  eliminatedBuffers.push(selectedBuffer.textContent);
  bufferSibling = selectedBuffer.previousElementSibling;
  while (bufferSibling) {
    eliminatedBuffers.push(bufferSibling.innerText);
    bufferSibling = bufferSibling.previousElementSibling;
  }

  // save buffer order
  if (window.location.pathname.endsWith("/corners.html")) {
    saveOrderCorners();
  }
  if (window.location.pathname.endsWith("/edges.html")) {
    saveOrderEdges();
  }
  if (window.location.pathname.endsWith("/xcenters.html")) {
    saveOrderXcenters();
  }
  if (window.location.pathname.endsWith("/pluscenters.html")) {
    saveOrderPluscenters();
  }

  // only show valid sets and cases
  allCases.forEach((e) => {
    e.style.display = "flex";
  });
  setDropdowns.forEach((e) => {
    e.style.display = "block";
  });
  eliminatedBuffers.forEach((buffer) => {
    hideInvalidCases(buffer);
  })

  // close settings
  settingsOverlay.classList.remove("visible");
  document.body.style.overflow = "auto";

  setTimeout(() => {
    Swal.fire({
      title: 'Settings Saved!',
      width: 'max-content',
      timer: 1000,
      icon: 'success',
      showConfirmButton: false,
      position: 'top',
      toast: true,
      showClass: {
        popup: '',
      },
      hideClass: {
        popup: '',
      },
    });
  }, 100)
}
//#endregion //* Save Settings

//#region //* Token Generation
function getAllLocalStorageData() {
  let allData = {};
  // Loop through all keys in LocalStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);  // Get the key at index i
    const value = localStorage.getItem(key);  // Get the value for that key

    // If the value is a stringified array or object, parse it
    try {
      allData[key] = JSON.parse(value); // Try parsing it as JSON
    } catch (e) {
      allData[key] = value; // If parsing fails, just store the raw value
    }
  }

  return allData;
}
function generateAndCopyToken() {
  const allPreferences = getAllLocalStorageData();

  // Convert preferences object to a string and compress it
  const preferencesString = JSON.stringify(allPreferences);
  const compressedString = LZString.compressToBase64(preferencesString); // Compress and encode in Base64

  // Copy the token to the clipboard
  navigator.clipboard
    .writeText(compressedString)
    .then(() => {
      console.log("Compressed token copied to clipboard:", compressedString);
      Swal.fire({
        title: 'Token Copied!',
        width: 'max-content',
        timer: 1000,
        icon: 'success',
        showConfirmButton: false,
        position: 'top',
        toast: true,
        showClass: {
          popup: '',
        },
        hideClass: {
          popup: '',
        },
      });
    })
    .catch((err) => {
      console.error("Error copying token to clipboard:", err);
      alert("Failed to copy the token to clipboard. Please try again.");
    });

  // Return the compressed token for any further use
  return compressedString;
}
function applySettingsFromToken() {
  try {
    // Retrieve the token from the input field
    const inputCode = document.getElementById("tokenInput").value;

    // Decompress and parse the token
    const decompressedString = LZString.decompressFromBase64(inputCode); // Decompress the Base64 string
    const userPreferences = JSON.parse(decompressedString); // Parse the settings into an object

    // Loop through the object and set all items back into LocalStorage
    localStorage.clear();
    for (const key in userPreferences) {
      if (userPreferences.hasOwnProperty(key)) {
        // If the value is an array or object, stringify it again before saving to LS
        const valueToStore = typeof userPreferences[key] === "object" ? JSON.stringify(userPreferences[key]) : userPreferences[key];
        localStorage.setItem(key, valueToStore);
      }
    }

    Swal.fire({
      title: 'Token Applied!',
      width: 'max-content',
      timer: 1000,
      icon: 'success',
      showConfirmButton: false,
      position: 'top',
      toast: true,
      showClass: {
        popup: '',
      },
      hideClass: {
        popup: '',
      },
    });
    setTimeout(() => {
      window.location.reload();
    }, 1100);
  } catch (error) {
    alert("Invalid code! Could not apply settings.");
  }
}

//#endregion //* Token Generation


//#region //* Lettering Scheme
function validateAssignCustomScheme() {
  if (schemeInput.value.length != 24) {
    Swal.fire({
      title: 'Invalid Input. Please Enter 24 Letters',
      width: 'max-content',
      icon: 'error',
      showConfirmButton: true,
      confirmButtonColor: 'grey',
      position: 'top',
      toast: true,
      showClass: {
        popup: '',
      },
      hideClass: {
        popup: '',
      },
    });
    return false;
  }

  else {
    [UBL, UBR, UFR, UFL, LUB, LUF, LDF, LDB, FUL, FUR, FDR, FDL, RUF, RUB, RDB, RDF, BUR, BUL, BDL, BDR, DFL, DFR, DBR, DBL] = schemeInput.value.toUpperCase().split("");
    [UB, UR, UF, UL, LU, LF, LD, LB, FU, FR, FD, FL, RU, RB, RD, RF, BU, BL, BD, BR, DF, DR, DB, DL] = schemeInput.value.toUpperCase().split("");
    localStorage.setItem("letterScheme", (schemeInput.value.toUpperCase()));
    updateVars();
    return true;
  }
}
function assignSpeffzScheme() {
  [UBL, UBR, UFR, UFL, LUB, LUF, LDF, LDB, FUL, FUR, FDR, FDL, RUF, RUB, RDB, RDF, BUR, BUL, BDL, BDR, DFL, DFR, DBR, DBL] = speffzArray.split("");
  [UB, UR, UF, UL, LU, LF, LD, LB, FU, FR, FD, FL, RU, RB, RD, RF, BU, BL, BD, BR, DF, DR, DB, DL] = speffzArray.split("");
  localStorage.setItem("letterScheme", speffzArray);
  updateVars();
}
//#endregion //* Lettering Scheme

//#region //* Floating 
function hideInvalidCases(buffer) {
  // Uncheck all cases
  allCases.forEach((e) => {
    e.classList.remove("checked");
  })
  document.querySelectorAll(".setOpener").forEach((e) => {
    e.classList.remove("overOneChecked");
  })

  // Corner Buffers
  if (window.location.pathname.endsWith("/corners.html")) {
    if (eliminatedBuffers.includes("UBL")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UBL) || e.textContent.includes(LUB) || e.textContent.includes(BUL)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UBL) || e.querySelector(".setOpener").textContent.includes(LUB) || e.querySelector(".setOpener").textContent.includes(BUL)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("UBR")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UBR) || e.textContent.includes(BUR) || e.textContent.includes(RUB)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UBR) || e.querySelector(".setOpener").textContent.includes(BUR) || e.querySelector(".setOpener").textContent.includes(RUB)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("UFR")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UFR) || e.textContent.includes(FUR) || e.textContent.includes(RUF)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UFR) || e.querySelector(".setOpener").textContent.includes(FUR) || e.querySelector(".setOpener").textContent.includes(RUF)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("UFL")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UFL) || e.textContent.includes(LUF) || e.textContent.includes(FUL)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UFL) || e.querySelector(".setOpener").textContent.includes(LUF) || e.querySelector(".setOpener").textContent.includes(FUL)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("DFR")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(DFR) || e.textContent.includes(RDF) || e.textContent.includes(FDR)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(DFR) || e.querySelector(".setOpener").textContent.includes(FDR) || e.querySelector(".setOpener").textContent.includes(RDF)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("DFL")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(DFL) || e.textContent.includes(FDL) || e.textContent.includes(LDF)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(DFL) || e.querySelector(".setOpener").textContent.includes(FDL) || e.querySelector(".setOpener").textContent.includes(LDF)) {
          e.style.display = "none";
        }
      })
    }
  }

  // Edge Buffers
  if (window.location.pathname.endsWith("/edges.html")) {
    if (eliminatedBuffers.includes("UF")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UF) || e.textContent.includes(FU)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UF) || e.querySelector(".setOpener").textContent.includes(FU)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("UB")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UB) || e.textContent.includes(BU)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UB) || e.querySelector(".setOpener").textContent.includes(BU)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("UR")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UR) || e.textContent.includes(RU)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UR) || e.querySelector(".setOpener").textContent.includes(RU)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("UL")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UL) || e.textContent.includes(LU)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UL) || e.querySelector(".setOpener").textContent.includes(LU)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("FR")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(FR) || e.textContent.includes(RF)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(FR) || e.querySelector(".setOpener").textContent.includes(RF)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("FL")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(FL) || e.textContent.includes(LF)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(FL) || e.querySelector(".setOpener").textContent.includes(LF)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("BR")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(BR) || e.textContent.includes(RB)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(BR) || e.querySelector(".setOpener").textContent.includes(RB)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("BL")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(BL) || e.textContent.includes(LB)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(BL) || e.querySelector(".setOpener").textContent.includes(LB)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("DF")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(DF) || e.textContent.includes(FD)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(DF) || e.querySelector(".setOpener").textContent.includes(FD)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("DB")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(DB) || e.textContent.includes(BD)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(DB) || e.querySelector(".setOpener").textContent.includes(BD)) {
          e.style.display = "none";
        }
      })
    }
  }

  // Xcenter buffers
  if (window.location.pathname.endsWith("/xcenters.html")) {
    if (eliminatedBuffers.includes("Ubl")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UBL)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UBL)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("Ubr")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UBR)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UBR)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("Ufr")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UFR)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UFR)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("Ufl")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UFL)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UFL)) {
          e.style.display = "none";
        }
      })
    }
  }

  // Pluscenter buffer
  if (window.location.pathname.endsWith("/pluscenters.html")) {
    if (eliminatedBuffers.includes("Uf")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UF)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UF)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("Ub")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UB)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UB)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("Ur")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UR)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UR)) {
          e.style.display = "none";
        }
      })
    }
    if (eliminatedBuffers.includes("Ul")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UL)) {
          e.style.display = "none";
        }
      })
      setDropdowns.forEach((e) => {
        if (e.querySelector(".setOpener").textContent.includes(UL)) {
          e.style.display = "none";
        }
      })
    }
  }

  // parity buffer
  if (window.location.pathname.endsWith("/parity.html")) {
    setDropdowns.forEach((drop) => {
      var opener = drop.querySelector(".setOpener");
      if (opener.textContent !== "UFr") {
        if (localStorage.bufferOrderCorners) {
          var orderList = JSON.parse(localStorage.getItem("bufferOrderCorners"));
        } else {
          var orderList = ["UFR", "UFL", "UBR", "UBL", "DFL", "DFR"];
        }
        var individualList = [];
        var i = 0;
        while (i < orderList.length && orderList[i] !== opener.textContent) {
          individualList.push(orderList[i]);
          i++;
        }
        individualList.push(opener.textContent);

        drop.querySelectorAll(".case").forEach((e) => {
          innerArray = e.textContent.split("/");
          innerText = String(innerArray[1]);
          if (individualList.includes("UBL")) {
            if (innerText == UBL || innerText == LUB || innerText == BUL) {
              e.style.display = "none";
            }
          }
          if (individualList.includes("UBR")) {
            if (innerText == UBR || innerText == RUB || innerText == BUR) {
              e.style.display = "none";
            }
          }
          if (individualList.includes("UFR")) {
            if (innerText == UFR || innerText == FUR || innerText == RUF) {
              e.style.display = "none";
            }
          }
          if (individualList.includes("UFL")) {
            if (innerText == UFL || innerText == LUF || innerText == FUL) {
              e.style.display = "none";
            }
          }

          if (individualList.includes("DFR")) {
            if (innerText == DFR || innerText == RDF || innerText == FDR) {
              e.style.display = "none";
            }
          }

          if (individualList.includes("DFL")) {
            if (innerText == DFL || innerText == FDL || innerText == LDF) {
              e.style.display = "none";
            }
          }
        });
      }
    });
  }
}
function saveOrderCorners() {
  var orderArray = [];
  document.querySelectorAll(".buffer").forEach((e) => {
    orderArray.push(e.textContent);
  })
  localStorage.setItem("bufferOrderCorners", JSON.stringify(orderArray));
}
function saveOrderEdges() {
  var orderArray = [];
  document.querySelectorAll(".buffer").forEach((e) => {
    orderArray.push(e.textContent);
  })
  localStorage.setItem("bufferOrderEdges", JSON.stringify(orderArray));
}
function saveOrderXcenters() {
  var orderArray = [];
  document.querySelectorAll(".buffer").forEach((e) => {
    orderArray.push(e.textContent);
  })
  localStorage.setItem("bufferOrderXcenters", JSON.stringify(orderArray));
}
function saveOrderPluscenters() {
  var orderArray = [];
  document.querySelectorAll(".buffer").forEach((e) => {
    orderArray.push(e.textContent);
  })
  localStorage.setItem("bufferOrderPluscenters", JSON.stringify(orderArray));
}
function loadOrder() {
  if (window.location.pathname.endsWith("/corners.html")) {
    const orderArray = JSON.parse(localStorage.getItem("bufferOrderCorners"));
    if (orderArray) {
      const buffers = document.querySelectorAll(".buffer");
      buffers.forEach((buffer, index) => {
        if (orderArray[index]) {
          buffer.textContent = orderArray[index];
        }
      });
    }
  }
  if (window.location.pathname.endsWith("/edges.html")) {
    const orderArray = JSON.parse(localStorage.getItem("bufferOrderEdges"));
    if (orderArray) {
      const buffers = document.querySelectorAll(".buffer");
      buffers.forEach((buffer, index) => {
        if (orderArray[index]) {
          buffer.textContent = orderArray[index];
        }
      });
    }
  }
  if (window.location.pathname.endsWith("/xcenters.html")) {
    const orderArray = JSON.parse(localStorage.getItem("bufferOrderXcenters"));
    if (orderArray) {
      const buffers = document.querySelectorAll(".buffer");
      buffers.forEach((buffer, index) => {
        if (orderArray[index]) {
          buffer.textContent = orderArray[index];
        }
      });
    }
  }
  if (window.location.pathname.endsWith("/pluscenters.html")) {
    const orderArray = JSON.parse(localStorage.getItem("bufferOrderPluscenters"));
    if (orderArray) {
      const buffers = document.querySelectorAll(".buffer");
      buffers.forEach((buffer, index) => {
        if (orderArray[index]) {
          buffer.textContent = orderArray[index];
        }
      });
    }
  }
}
//#endregion //* Floating

//#region //* Case Selection
function selectPt() {
  document.querySelectorAll(".case").forEach((item) => {
    if (item.style.display !== "none") {
      item.classList.add("checked");
    }
  });
  document.querySelectorAll(".setOpener").forEach((item) => {
    if (item.style.display !== "none") {
      item.classList.add("overOneChecked");
    }
  });
}
function deselectPt() {
  document.querySelectorAll(".case").forEach((item) => {
    item.classList.remove("checked");
  });
  document.querySelectorAll(".setOpener").forEach((item) => {
    item.classList.remove("overOneChecked");
  });
}
function setDropdownFunctions() {
  setDropdowns.forEach((container) => {
    // vars for each setDropdown
    const setOpener = container.querySelector(".setOpener");
    const items = container.querySelectorAll(".case");
    const selectAll = container.querySelector(".selectAllCases");
    const selectNone = container.querySelector(".selectNoCases");

    // open/close set
    setOpener.addEventListener("click", () => {
      setOpener.classList.toggle("open");
    });

    // toggle individual cases
    items.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("checked");
        var foundChecked = false;
        items.forEach((item) => {
          if (item.classList.contains("checked")) {
            foundChecked = true;
          }
        });
        if (foundChecked) {
          setOpener.classList.add("overOneChecked");
        } else {
          setOpener.classList.remove("overOneChecked");
        }
      });
    });

    // select/deselect set
    selectAll.addEventListener("click", () => {
      items.forEach((item) => {
        if (item.style.display !== "none") {
          item.classList.add("checked");
          setOpener.classList.add("overOneChecked");
        }
      });
    });
    selectNone.addEventListener("click", () => {
      items.forEach((item) => {
        item.classList.remove("checked");
        setOpener.classList.remove("overOneChecked");
      });
    });
  });

  // Clicking outside of Container closes Container
  document.addEventListener("click", function (event) {
    setDropdowns.forEach((container) => {
      const setOpener = container.querySelector(".setOpener");
      if (!container.contains(event.target)) {
        setOpener.classList.remove("open");
      }
    });
  });
}
//#endregion //* Case Selection

//#region //* Start Training
function startTraining() {
  if (document.querySelectorAll(".case.checked").length > 0) {
    // get all selected cases
    allCases.forEach((e) => {
      if (e.classList.contains("checked")) {
        orderedArray.push(e.innerText.replace(/\n/g, ''));
      }
    });

    // add inverse cases if checked
    if (includeInv) {
      orderedArray.forEach((item) => {
        inverseCase = item.split("").reverse().join("");
        if (!orderedArray.includes(inverseCase.replace(/\n/g, ''))) {
          orderedArray.push(inverseCase.replace(/\n/g, ''));
        }
      });
    }

    randomArray = [];
    trainedObject = {};

    // get current buffer for correctly storing slow preset
    if (document.querySelector(".buffer.selected")) {
      currentBuffer = document.querySelector(".buffer.selected").innerText;
    }
    else if (window.location.pathname.endsWith("/corners.html") && localStorage.getItem("bufferOrderCorners")) {
      currentBuffer = JSON.parse(localStorage.getItem("bufferOrderCorners"))[0];
    }
    else if (window.location.pathname.endsWith("/edges.html") && localStorage.getItem("bufferOrderEdges")) {
      currentBuffer = JSON.parse(localStorage.getItem("bufferOrderEdges"))[0];
    }
    else if (window.location.pathname.endsWith("/pluscenters.html") && localStorage.getItem("bufferOrderPluscenters")) {
      currentBuffer = JSON.parse(localStorage.getItem("bufferOrderPluscenters"))[0];
    }
    else if (window.location.pathname.endsWith("/xcenters.html") && localStorage.getItem("bufferOrderXcenters")) {
      currentBuffer = JSON.parse(localStorage.getItem("bufferOrderXcenters"))[0];
    }
    else {
      currentBuffer = document.querySelector(".buffer").innerText;
    }

    // get max amount and time for slow preset from local storage
    if (localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`)) {
      maxAmount = localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`);
    }
    if (localStorage.getItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`)) {
      maxTime = localStorage.getItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`);
    }

    // create random array
    let tempArray = [...orderedArray];
    while (tempArray.length > 0) {
      let randomIndex = Math.floor(Math.random() * tempArray.length);
      randomArray.push(tempArray.splice(randomIndex, 1)[0]);
    }

    // open training elements
    trainOverlay.classList.add("open");
    document.querySelector(".whileTrainingContainer").style.display = "flex";
    document.querySelector(".afterTrainingContainer").style.display = "none";
    casesLeft.innerText = "Cases Left: " + (randomArray.length);

    // Countdown for starting + first letterpair
    overlayLP.innerText = "3";
    setTimeout(() => {
      overlayLP.innerText = "2";
      setTimeout(() => {
        overlayLP.innerText = "1";
        setTimeout(() => {
          progressPercent = 0;
          progressBar.style.width = progressPercent + "%";

          startTime = Date.now();
          currentLP = randomArray[0];
          nextLPvar = randomArray[1];

          overlayLP.innerText = currentLP;
          if (showNextLP && randomArray.length > 1) {
            nextLP.innerText = "Next: " + nextLPvar;
          }

          setTimeout(() => {
            if (/Mobi|Android/i.test(navigator.userAgent)) {
              // Mobile device
              document.addEventListener("click", trainingIfElseStuff);
            } else {
              // Desktop
              document.addEventListener("keydown", trainingIfElseStuff);
            }
          }, 250);

        }, 1000)
      }, 1000)
    }, 1000)
  }
  else {
    Swal.fire({
      title: 'Select at least one case!',
      width: 'max-content',
      timer: 1500,
      icon: 'info',
      showConfirmButton: false,
      position: 'top',
      toast: true,
      showClass: {
        popup: '',
      },
      hideClass: {
        popup: '',
      },

    })
  }
}
function repeatAll() {
  lpTimes = avg = startTime = 0;
  randomArray = [];
  trainedObject = {};
  let tempArray = [...orderedArray];
  while (tempArray.length > 0) {
    let randomIndex = Math.floor(Math.random() * tempArray.length);
    randomArray.push(tempArray.splice(randomIndex, 1)[0]);
  }

  progressBar.style.width = "0%";
  nextLP.innerText = "";

  document.querySelector(".afterTrainingContainer").style.opacity = "0%";
  setTimeout(() => {
    document.querySelector(".afterTrainingContainer").style.display = "none";
    document.querySelector(".whileTrainingContainer").style.opacity = "0%";
    setTimeout(() => {
      document.querySelector(".whileTrainingContainer").style.display = "block";
      document.querySelector(".whileTrainingContainer").style.opacity = "100%";

      casesLeft.innerText = "Cases Left: " + (randomArray.length);

      overlayLP.innerText = "3";
      setTimeout(() => {
        overlayLP.innerText = "2";
        setTimeout(() => {
          overlayLP.innerText = "1";
          setTimeout(() => {
            progressPercent = 0;
            progressBar.style.width = progressPercent + "%";

            startTime = Date.now();
            currentLP = randomArray[0];
            nextLPvar = randomArray[1];

            overlayLP.innerText = currentLP;
            if (showNextLP && randomArray.length > 1) {
              nextLP.innerText = "Next: " + nextLPvar;
            }

            setTimeout(() => {
              done = false;
            }, 250)
          }, 1000)
        }, 1000)
      }, 1000)
    }, 200)
  }, 200)
}
function repeatSlow() {

  orderedArray = [];
  for (let key in trainedObject) {
    const value = trainedObject[key];
    if (value > targetTime) {
      orderedArray.push(key);
      delete trainedObject[key]; // Remove the value from the trainedObject
    }
  }

  lpTimes = avg = startTime = 0;
  randomArray = [];
  trainedObject = {};
  var tempArray = [...orderedArray];
  while (tempArray.length > 0) {
    let randomIndex = Math.floor(Math.random() * tempArray.length);
    randomArray.push(tempArray.splice(randomIndex, 1)[0]);
  }

  progressBar.style.width = "0%";
  if (showNextLP && randomArray.length > 1) {
    nextLP.innerText = "";
  }

  document.querySelector(".afterTrainingContainer").style.opacity = "0%";
  setTimeout(() => {
    document.querySelector(".afterTrainingContainer").style.display = "none";
    document.querySelector(".whileTrainingContainer").style.opacity = "0%";
    setTimeout(() => {
      document.querySelector(".whileTrainingContainer").style.display = "block";
      document.querySelector(".whileTrainingContainer").style.opacity = "100%";

      casesLeft.innerText = "Cases Left: " + (randomArray.length);

      overlayLP.innerText = "3";
      setTimeout(() => {
        overlayLP.innerText = "2";
        setTimeout(() => {
          overlayLP.innerText = "1";
          setTimeout(() => {
            progressPercent = 0;
            progressBar.style.width = progressPercent + "%";

            startTime = Date.now();
            currentLP = randomArray[0];
            nextLPvar = randomArray[1];

            overlayLP.innerText = currentLP;
            if (showNextLP && randomArray.length > 1) {
              nextLP.innerText = "Next: " + nextLPvar;
            }

            setTimeout(() => {
              done = false;
            }, 250)
          }, 1000)
        }, 1000)
      }, 1000)
    }, 200)
  }, 200)
}
function trainSlowCases() {
  var storageName = `slowCases_${window.location.pathname.split("/").pop().split(".").shift()}`;
  if (localStorage.getItem(storageName)) {
    for (let key in JSON.parse(localStorage.getItem(storageName))) {
      orderedArray.push(key);
    }

    randomArray = [];
    trainedObject = {};
    let tempArray = [...orderedArray];
    while (tempArray.length > 0) {
      let randomIndex = Math.floor(Math.random() * tempArray.length);
      randomArray.push(tempArray.splice(randomIndex, 1)[0]);
    }

    trainOverlay.classList.add("open");
    document.querySelector(".whileTrainingContainer").style.display = "flex";
    document.querySelector(".afterTrainingContainer").style.display = "none";
    casesLeft.innerText = "Cases Left: " + (randomArray.length);

    overlayLP.innerText = "3";
    setTimeout(() => {
      overlayLP.innerText = "2";
      setTimeout(() => {
        overlayLP.innerText = "1";
        setTimeout(() => {
          progressPercent = 0;
          progressBar.style.width = progressPercent + "%";

          startTime = Date.now();
          currentLP = randomArray[0];
          nextLPvar = randomArray[1];

          overlayLP.innerText = currentLP;
          if (showNextLP && randomArray.length > 1) {
            nextLP.innerText = "Next: " + nextLPvar;
          }

          setTimeout(() => {
            if (/Mobi|Android/i.test(navigator.userAgent)) {
              // Mobile device
              document.addEventListener("click", trainingIfElseStuff);
            } else {
              // Desktop
              document.addEventListener("keydown", trainingIfElseStuff);
            }
          }, 250);

        }, 1000)
      }, 1000)
    }, 1000)
  } else {
    Swal.fire({
      title: 'No slow cases found!',
      width: 'max-content',
      timer: 1500,
      icon: 'error',
      showConfirmButton: false,
      position: 'top',
      toast: true,
      showClass: {
        popup: '',
      },
      hideClass: {
        popup: '',
      },

    })
  }
}
function setupSpecialSlows() {
  if (specialSlowsBtns) {
    specialSlowsBtns.forEach((btn) => btn.addEventListener("click", function (e) {
      var storageName = `slowCases_${window.location.pathname.split("/").pop().split(".").shift()}_${e.target.innerText}`;
      if (localStorage.getItem(storageName)) {
        for (let key in JSON.parse(localStorage.getItem(storageName))) {
          orderedArray.push(key);
        }

        randomArray = [];
        trainedObject = {};
        currentBuffer = e.target.innerText;
        let tempArray = [...orderedArray];
        while (tempArray.length > 0) {
          let randomIndex = Math.floor(Math.random() * tempArray.length);
          randomArray.push(tempArray.splice(randomIndex, 1)[0]);
        }

        trainOverlay.classList.add("open");
        document.querySelector(".whileTrainingContainer").style.display = "flex";
        document.querySelector(".afterTrainingContainer").style.display = "none";
        casesLeft.innerText = "Cases Left: " + (randomArray.length);

        overlayLP.innerText = "3";
        setTimeout(() => {
          overlayLP.innerText = "2";
          setTimeout(() => {
            overlayLP.innerText = "1";
            setTimeout(() => {
              progressPercent = 0;
              progressBar.style.width = progressPercent + "%";

              startTime = Date.now();
              currentLP = randomArray[0];
              nextLPvar = randomArray[1];

              overlayLP.innerText = currentLP;
              if (showNextLP && randomArray.length > 1) {
                nextLP.innerText = "Next: " + nextLPvar;
              }

              setTimeout(() => {
                if (/Mobi|Android/i.test(navigator.userAgent)) {
                  // Mobile device
                  document.addEventListener("click", trainingIfElseStuff);
                } else {
                  // Desktop
                  document.addEventListener("keydown", trainingIfElseStuff);
                }
              }, 250);

            }, 1000)
          }, 1000)
        }, 1000)
      } else {
        Swal.fire({
          title: 'No slow cases found!',
          width: 'max-content',
          timer: 1500,
          icon: 'error',
          showConfirmButton: false,
          position: 'top',
          toast: true,
          showClass: {
            popup: '',
          },
          hideClass: {
            popup: '',
          },

        })
      }
    }));
  }
}
//#endregion //* Start Training

//#region //* While Training 
function sortTable(index) {
  const table = document.querySelector("#trainEndTable");
  const rows = Array.from(table.rows).slice(1);
  const tableBody = document.querySelector("#trainEndTable tbody");
  const isAscending = table.rows[0].cells[index].classList.toggle("asc");

  rows.sort((a, b) => {
    const cellA = a.cells[index].textContent;
    const cellB = b.cells[index].textContent;

    if (index === 1) {
      return isAscending ? cellA - cellB : cellB - cellA;
    } else {
      return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    }
  });

  tableBody.innerHTML = "";
  rows.forEach((row) => tableBody.appendChild(row));
}

var chart; // Global variable to hold the chart
function trainingIfElseStuff() {
  if (!done) {
    var caseCount = orderedArray.length - randomArray.length + 1;

    //#region Break
    if (
      caseCount % casesBeforeBreak == 0 &&
      !breakActive &&
      caseCount > 0 &&
      casesBeforeBreak > 0 &&
      randomArray.length > 5
    ) {
      lpTime = ((Date.now() - startTime) / 1000).toFixed(2);
      lpTimes += parseFloat(lpTime);
      trainedObject[randomArray[0]] = lpTime;
      randomArray.splice(0, 1);
      startTime = 0;
      breakActive = true;
      overlayLP.innerText = "break";
      casesLeft.innerText = "Cases Left: " + randomArray.length;
      progressPercent = Math.round(((orderedArray.length - randomArray.length + 1) / orderedArray.length) * 100);
      progressBar.style.width = progressPercent + "%";

      if (showNextLP && randomArray.length > 1) {
        nextLP.innerText = "Next: " + randomArray[0];
      }
    }
    //#endregion Break

    //#region First Letterpair after Break
    else if (startTime == 0) {
      startTime = Date.now();
      breakActive = false;
      currentLP = randomArray[0];
      nextLPvar = randomArray[1];

      overlayLP.innerText = currentLP;
      casesLeft.innerText = "Cases Left: " + randomArray.length;
      if (showNextLP && randomArray.length > 1) {
        nextLP.innerText = "Next: " + nextLPvar;
      }
    }
    //#endregion First Letterpair after Break

    //#region normal Letterpairs
    else if (randomArray.length > 1 && Date.now() - startTime > 250) {
      lpTime = ((Date.now() - startTime) / 1000).toFixed(2);
      lpTimes += parseFloat(lpTime);
      trainedObject[randomArray[0]] = lpTime;
      progressPercent = Math.round(((orderedArray.length - randomArray.length + 1) / orderedArray.length) * 100);
      progressBar.style.width = progressPercent + "%";
      randomArray.splice(0, 1);

      startTime = Date.now();
      currentLP = randomArray[0];
      nextLPvar = randomArray[1];

      overlayLP.innerText = currentLP;
      casesLeft.innerText = "Cases Left: " + randomArray.length;
      if (showNextLP && randomArray.length > 1) {
        if ((caseCount + 1) % casesBeforeBreak == 0 && caseCount > 0 && casesBeforeBreak > 0 && randomArray.length > 6) {
          nextLP.innerText = "Next: break";
        } else {
          nextLP.innerText = "Next: " + nextLPvar;
        }
      } else if (showNextLP && randomArray.length == 1) {
        nextLP.innerText = "Next: done";
      }
    }
    //#endregion normal Letterpairs

    //#region //* Last letterpair
    else if (Date.now() - startTime > 250) {
      //#region finish last letterpair
      lpTime = ((Date.now() - startTime) / 1000).toFixed(2);
      lpTimes += parseFloat(lpTime);
      trainedObject[randomArray[0]] = lpTime;
      progressPercent = Math.round(((orderedArray.length - randomArray.length + 1) / orderedArray.length) * 100);
      progressBar.style.width = progressPercent + "%";
      randomArray.splice(0, 1);
      done = true;
      //#endregion finish last letterpair

      //#region transition to after-training page
      document.querySelector(".whileTrainingContainer").style.opacity = "0%";
      setTimeout(() => {
        document.querySelector(".whileTrainingContainer").style.display = "none";
        document.querySelector(".afterTrainingContainer").style.opacity = "0%";
        setTimeout(() => {
          document.querySelector(".afterTrainingContainer").style.display = "grid";
          document.querySelector(".afterTrainingContainer").style.opacity = "100%";
        }, 300)
      }, 300)
      //#endregion transition to after-training page

      //#region avg, count, time
      avg = lpTimes / orderedArray.length;
      document.querySelector(".averageTime").innerText = "Average Time: " + avg.toFixed(2) + "s";
      document.querySelector(".caseCount").innerText = "Total Cases: " + orderedArray.length;
      function formatTime(seconds) {
        if (seconds < 60) {
          return seconds.toFixed(2) + "s";
        } else {
          let minutes = Math.floor(seconds / 60);
          let remainingSeconds = (seconds % 60).toFixed(0);
          return minutes + "m " + remainingSeconds + "s";
        }
      }
      document.querySelector(".totalTime").innerText = "Total Time: " + formatTime(lpTimes);
      //#endregion avg, count, time

      //#region consistency
      var timesArray = [];
      var diffSum = "";
      for (let key in trainedObject) {
        let value = trainedObject[key];
        timesArray.push(value);
      }

      diffSum = 0;
      timesArray.forEach((e) => {
        diffSum += Math.abs(e - avg);
      })
      var avgDiff = diffSum / timesArray.length;
      document.querySelector(".consistency").innerText = "σ: " + avgDiff.toFixed(2);
      //#endregion consistency

      //#region cases below target time
      var casesBelowTargetTime = 0;
      timesArray.forEach((e) => {
        if (e < targetTime) {
          casesBelowTargetTime++;
        }
      })
      if (casesBelowTargetTime == timesArray.length) {
        document.querySelector(".casesBelowTarget").innerText = "Sub Target Time: All";
      } else {
        document.querySelector(".casesBelowTarget").innerText = "Sub Target Time: " + casesBelowTargetTime;
      }
      //#endregion cases below target time

      //#region repeat slow btn style
      foundSlow = false;
      for (let key in trainedObject) {
        const value = trainedObject[key];
        if (value > targetTime) {
          foundSlow = true;
        }
      }
      if (!foundSlow || !targetTime > 0) {
        repeatSlowBtn.style.pointerEvents = "none";
        repeatSlowBtn.style.opacity = "0.5";
        repeatSlowBtn.textContent = "No slow cases";
      }
      else if (foundSlow && targetTime > 0) {
        repeatSlowBtn.style.pointerEvents = "auto";
        repeatSlowBtn.style.opacity = "1";
        repeatSlowBtn.textContent = "Repeat >" + targetTime + "s";
      }
      //#endregion repeat slow btn style

      //#region share
      document.querySelector(".shareSessionBtn").addEventListener("click", () => {
        // get piecetype and buffer
        var pieceTypeCapital = "";
        if (window.location.pathname.includes("ltct")) {
          pieceTypeCapital = "LTCT";
        } else if (currentBuffer) {
          pieceTypeCapital = window.location.pathname.split("/").pop().split(".").shift().charAt(0).toUpperCase() +
            window.location.pathname.split("/").pop().split(".").shift().slice(1) + ` (${currentBuffer})`;
        } else {
          pieceTypeCapital = window.location.pathname.split("/").pop().split(".").shift().charAt(0).toUpperCase() +
            window.location.pathname.split("/").pop().split(".").shift().slice(1);
        }

        // define link, date
        const link = "https://blindtrainer.com/";
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date();

        // create summary
        let summary = `${pieceTypeCapital} practice session on ${link}, ${date.toLocaleDateString("en-US", options)}\n\n`;
        summary += "Average Time: " + avg.toFixed(2) + "s\n";
        summary += "Amount of Cases: " + orderedArray.length + "\n";
        summary += "Total Time: " + formatTime(lpTimes) + "\n";
        summary += "σ: " + avgDiff.toFixed(2) + "\n";

        // copy summary
        const textArea = document.createElement("textarea");
        textArea.value = summary;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        Swal.fire({
          title: 'Summary Copied!',
          width: 'max-content',
          timer: 1000,
          icon: 'success',
          showConfirmButton: false,
          position: 'top',
          toast: true,
          showClass: {
            popup: '',
          },
          hideClass: {
            popup: '',
          },
          toast: true,
        })
      });
      //#endregion share

      //#region Populate stats table
      const tableBody = document.querySelector("#trainEndTable tbody");
      tableBody.innerHTML = "";

      for (let key in trainedObject) {
        const row = document.createElement("tr");
        const lpCell = document.createElement("td");
        const timeCell = document.createElement("td");

        lpCell.textContent = key;
        timeCell.textContent = trainedObject[key];

        row.appendChild(lpCell);
        row.appendChild(timeCell);
        tableBody.appendChild(row);
      }
      //#endregion Populate stats table

      //#region chart
      const context = document.querySelector("#trainEndChart").getContext("2d");
      const labels = timesArray.map((value, index) => index + 1);
      const root = document.documentElement;
      const lightClr = getComputedStyle(root).getPropertyValue("--light");
      const vibClr = getComputedStyle(root).getPropertyValue("--vib");

      // crate lp array in trained order
      var lpArray = [];
      for (let key in trainedObject) {
        lpArray.push(key);
      }

      // or else bug :(
      if (chart) {
        chart.destroy();
      }

      // create the chart
      chart = new Chart(context, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "",
            data: timesArray,
            borderColor: lightClr,
            pointBackgroundColor: vibClr,
            pointBorderColor: vibClr,
            borderWidth: 1,
            fill: false
          }]
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false,
              },
              border: {
                color: lightClr,
                width: 3,
              },
              ticks: {
                font: {
                  size: 16
                },
                color: lightClr
              }
            },
            y: {
              grid: {
                display: false,
              },
              border: {
                color: lightClr,
                width: 3,
              },
              ticks: {
                font: {
                  size: 16
                },
                color: lightClr
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const time = context.raw; // Get the time value
                  const letterPair = lpArray[index]; // Get the corresponding letter pair
                  return `${letterPair} ${time}s`;
                },
                title: function () {
                  return "";
                }
              },
              displayColors: false,
            }
          }
        }
      });
      //#endregion chart

      //#region slow case preset update

      // remove cases above max time
      var tempObj = { ...trainedObject };
      let keys = Object.keys(tempObj);
      for (let key of keys) {
        if (tempObj[key] > maxTime) {
          delete tempObj[key];
        }
      }
      var pieceType = window.location.pathname.split("/").pop().split(".").shift();

      // handle non-special slow presets
      if (pieceType === "flips" || pieceType === "twists" || pieceType === "ltct" || pieceType === "words" || pieceType === "wings" || pieceType === "midges") {
        // create object with updated cases and times
        var slowCasesLS = JSON.parse(localStorage.getItem(`slowCases_${pieceType}`)) || {};
        if (!Object.keys(slowCasesLS).length) {
          Object.assign(slowCasesLS, tempObj);
        } else {
          for (let key in tempObj) {
            if (slowCasesLS.hasOwnProperty(key)) {
              delete slowCasesLS[key];
            }
          }
          Object.assign(slowCasesLS, tempObj);
        }

        // keep slowest X, save to local storage
        function keepSlowestCases(slowCasesLS, maxAmount) {
          let entries = Object.entries(slowCasesLS);
          entries.sort((a, b) => b[1] - a[1]);
          let topEntries = entries.slice(0, maxAmount);
          let newSlowCases = Object.fromEntries(topEntries);
          return newSlowCases;
        }
        var filteredSlowCases = keepSlowestCases(slowCasesLS, maxAmount);
        localStorage.setItem(`slowCases_${pieceType}`, JSON.stringify(filteredSlowCases));
      }

      // handle special slow presets
      else {
        // create object with updated cases and times
        slowCasesLS = JSON.parse(localStorage.getItem(`slowCases_${pieceType}_${currentBuffer}`)) || {};
        if (!Object.keys(slowCasesLS).length) {
          Object.assign(slowCasesLS, tempObj);
        } else {
          for (let key in tempObj) {
            if (slowCasesLS.hasOwnProperty(key)) {
              delete slowCasesLS[key];
            }
          }
          Object.assign(slowCasesLS, tempObj);
        }

        // keep slowest X, save to local storage
        function keepSlowestCases(slowCasesLS, maxAmount) {
          let entries = Object.entries(slowCasesLS);
          entries.sort((a, b) => b[1] - a[1]);
          let topEntries = entries.slice(0, maxAmount);
          let newSlowCases = Object.fromEntries(topEntries);
          return newSlowCases;
        }
        var filteredSlowCases = keepSlowestCases(slowCasesLS, maxAmount);
        localStorage.setItem(`slowCases_${pieceType}_${currentBuffer}`, JSON.stringify(filteredSlowCases));
      }
      //#endregion slow case preset update

    }
    //#endregion //* Last letterpair
  }
}
//#endregion //* While Training

//#endregion //? Functions

//#region //! Page load eventListener to initialize page
document.addEventListener("DOMContentLoaded", () => {
  // set accent color
  document.documentElement.style.setProperty("--vib", localStorage.getItem("ac"));

  // if localstorage empty, save speffz
  if (!localStorage.getItem("letterScheme")) {
    localStorage.setItem("letterScheme", speffzArray);
  }

  // configure preset functionality
  preset.forEach((item, index) => {
    const presetBtn = item.querySelector(".presetBtn"),
      set = item.querySelector(".presetSet"),
      reset = item.querySelector(".presetReset"),
      pieceType = window.location.pathname.split("/").pop().split(".").shift(),
      presetPairsKey = `${pieceType}_presetPairs_${index}`,
      presetNameKey = `${pieceType}_presetName_${index}`,
      savedPresetArray = (localStorage.getItem(presetPairsKey) || "").split(","),
      savedPresetName = localStorage.getItem(presetNameKey) || `Preset ${index + 1}`;

    var presetArray = [];
    presetArray = savedPresetArray;
    presetBtn.textContent = savedPresetName;

    function updateLocalStoragePairs() {
      let presetString = presetArray.join(",").replace(/\s+/g, "");
      localStorage.setItem(presetPairsKey, presetString);
    }
    function resetLocalStorageName() {
      localStorage.setItem(presetNameKey, `Preset ${index + 1}`);
      presetBtn.textContent = localStorage.getItem(presetNameKey);
    }

    set.addEventListener("click", () => {
      Swal.fire({
        title: `Are you sure you want to save ${presetBtn.textContent}?`,
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'grey',
        confirmButtonText: 'Yes, save it!'
      }).then((result) => {
        if (result.isConfirmed) {
          presetArray = [];
          allCases.forEach((item) => {
            if (item.classList.contains("checked")) {
              presetArray.push(item.innerText);
            }
          });
          updateLocalStoragePairs();
        }
      });
    });

    reset.addEventListener("click", () => {
      Swal.fire({
        title: `Are you sure you want to reset ${presetBtn.textContent}?`,
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'grey',
        confirmButtonText: 'Yes, reset it!'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem(presetPairsKey);
          resetLocalStorageName();
        }
      });
    });
    presetBtn.addEventListener("click", () => {
      setDropdowns.forEach((container) => {
        const setOpener = container.querySelector(".setOpener");
        var foundChecked = false;

        container.querySelectorAll(".case").forEach((item) => {
          if (presetArray.includes(item.innerText.replace(/\s+/g, ""))) {
            item.classList.add("checked");
            foundChecked = true;
          } else {
            item.classList.remove("checked");
          }
        });

        if (foundChecked) {
          setOpener.classList.add("overOneChecked");
        } else {
          setOpener.classList.remove("overOneChecked");
        }
      });
    });

    presetBtn.addEventListener("dblclick", () => {
      var newName = "";
      Swal.fire({
        title: 'Enter Preset Name',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
          if (!name) {
            Swal.showValidationMessage('You need to write something!')
          }
          return name;
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          newName = result.value;
          presetBtn.textContent = newName;
          localStorage.setItem(presetNameKey, presetBtn.textContent);
        }
      });
    });
  });

  updateVars();
  setDropdownFunctions();
  setupSpecialSlows();
  setupFaq();
})
//#endregion //* Page load eventListener to initialize page