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
  // if(firstTime){
  document.querySelectorAll("*").forEach(el => {
    if (el.innerHTML.includes("<") || el.innerHTML.includes(">")) {
      return;
    }
    if (el.innerText.includes("{{") && el.innerText.includes("}}")) {
      var matches = el.innerText.match(/{{[a-zA-Z0-9 ]+}}/g);
      var minIndex = 0;
      matches.forEach(match => {
        var index = el.innerHTML.indexOf(match, minIndex);
        // console.log(index);
        minIndex += index + match.length + 1;
        var varName = match.replace(/{/g, "").replace(/}/g, "").replace(/ /g, "");
        el.innerHTML = el.innerHTML.slice(0, index) + `<htmlvar data-var="${varName}">${window[varName]}</htmlvar>` + el.innerHTML.slice(index + match.length);
        // console.log(el.innerHTML);
      })
    }
  });
  //     return;
  // }
  document.querySelectorAll("htmlvar").forEach(el => {
    el.innerText = window[el.getAttribute("data-var")];
  })
}

//#region Variales

//#region Presets
const presetsOpener = document.querySelector(".presetsOpener"),
  presetsPopup = document.querySelector(".presetsPopup"),
  preset = document.querySelectorAll(".preset");
//#endregion

//#region Settings
const settingsOpener = document.querySelector(".settingsOpener"),
  mainSettingsOpener = document.querySelector(".settingsBtn"),
  settingsOverlay = document.querySelector(".settingsOverlay"),
  mainSettingsOverlay = document.querySelector(".mainSettingsOverlay"),
  settingsPopup = document.querySelector(".settingsPopup"),
  mainSettingsPopup = document.querySelector(".mainSettingsPopup"),
  speffzBtn = document.querySelector(".speffzBtn"),
  customLettersBtn = document.querySelector(".customLettersBtn"),
  schemeInput = document.querySelector(".schemeInput"),
  saveSettings = document.querySelector(".saveSettingsBtn"),
  saveMainSettings = document.querySelector(".saveMainSettings");

var showInverse = document.querySelector(".showInverse");
var themeModeToggle = document.querySelector("#themeModeCheckbox");
var accentColor = "00b1cc";
//#endregion

//#region Login
const loginOverlay = document.querySelector(".loginOverlay"),
  loginPopup = document.querySelector(".loginPopup"),
  loginHeader = document.querySelector(".loginHeader"),
  loginSubmitBtn = document.querySelector(".loginSubmitBtn"),
  toggleLogin = document.querySelector(".toggleLogin"),
  accountBtn = document.querySelectorAll(".accountBtnT, .accountBtnI"),
  passwordEye = document.querySelector(".togglePassword");
var password = document.querySelector(".password");
//#endregion

//#region Select Cases
const piecetypeAll = document.querySelector(".piecetypeAll"),
  piecetypeNone = document.querySelector(".piecetypeNone");
//#endregion

//#region Training
const startBtn = document.querySelector(".startBtn");
const trainSlowBtn = document.querySelector(".slowCasesOpener");
const trainSpecialSlowBtn = document.querySelectorAll(".specialSlowsOption");
const setDropdowns = document.querySelectorAll(
  ".setContainer, .setContainerTwists"
);
const trainOverlay = document.querySelector(".trainOverlay"); // the full page
const repeatBtn = document.querySelector(".repeatBtn");
const repeatSlowBtn = document.querySelector(".repeatSlowBtn");
const leaveBtn = document.querySelector(".leaveBtn");
const allCases = document.querySelectorAll(".case"); // used for presets and training
const setOpeners = document.querySelectorAll(".setOpener");

var targetTime = 3,
  casesBeforeBreak = 0,
  showNextLP = false,
  maxAmount = 20,
  maxTime = 20,
  selectedBuffer = "",
  currentBuffer = "",
  bufferSibling = "",
  eliminatedBuffers = [],
  randomArray = [],
  orderedArray = [],
  prevLP,
  currentLP,
  nextLPvar,
  inverseCase = "",
  overlayLP = document.querySelector(".overlayLetterpair"),
  nextLP = document.querySelector(".nextLetterpair"),
  casesLeft = document.querySelector(".casesLeft"),
  progressBar = document.querySelector(".progressBar"),
  progressPercent,
  trainedObject = {},
  startTime = 0,
  lpTimes = 0,
  lpTime = 0,
  breakActive = false,
  avg = 0,
  foundSlow = false,
  done = false;

//#region Lettering Scheme Variables
var speffzArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"];

// corners, parity, ltct, twists, words, xcenters
var [UBL, UBR, UFR, UFL, LUB, LUF, LDF, LDB, FUL, FUR, FDR, FDL, RUF, RUB, RDB, RDF, BUR, BUL, BDL, BDR, DFL, DFR, DBR, DBL] = speffzArray;
if (!localStorage.getItem("cornersArray")) {
  localStorage.setItem("cornersArray", JSON.stringify(speffzArray));
}
// edges, +centers, midges, wings
var [UB, UR, UF, UL, LU, LF, LD, LB, FU, FR, FD, FL, RU, RB, RD, RF, BU, BL, BD, BR, DF, DR, DB, DL] = speffzArray;
if (!localStorage.getItem("edgesArray")) {
  localStorage.setItem("edgesArray", JSON.stringify(speffzArray));
}

//#endregion
//#endregion

//#endregion Variables

//#region Presets
preset.forEach((item, index) => {
  const presetBtn = item.querySelector(".presetBtn"),
    set = item.querySelector(".presetSet"),
    reset = item.querySelector(".presetReset"),
    pieceType = window.location.pathname.split("/").pop().split(".").shift(),
    presetPairsKey = `${pieceType}_presetPairs_${index}`,
    presetNameKey = `${pieceType}_presetName_${index}`,
    savedPresetArray = JSON.parse(localStorage.getItem(presetPairsKey)) || [],
    savedPresetName = localStorage.getItem(presetNameKey) || `Preset ${index + 1}`;

  var presetArray = [];
  presetArray = savedPresetArray;
  presetBtn.textContent = savedPresetName;

  function updateLocalStoragePairs() {
    localStorage.setItem(presetPairsKey, JSON.stringify(presetArray));
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
        presetArray = [];
        updateLocalStoragePairs();
        resetLocalStorageName();
      }
    });
  });
  presetBtn.addEventListener("click", () => {
    setDropdowns.forEach((container) => {
      const setOpener = container.querySelector(".setOpener");
      var foundChecked = false;

      container.querySelectorAll(".case").forEach((item) => {
        if (presetArray.includes(item.innerText)) {
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
//#endregion

//#region Main Settings

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
    localStorage.setItem("cornersArray", JSON.stringify(schemeInput.value.toUpperCase().split("")));

    [UB, UR, UF, UL, LU, LF, LD, LB, FU, FR, FD, FL, RU, RB, RD, RF, BU, BL, BD, BR, DF, DR, DB, DL] = schemeInput.value.toUpperCase().split("");
    localStorage.setItem("edgesArray", JSON.stringify(schemeInput.value.toUpperCase().split("")));

    updateVars();
    return true;
  }
}
function assignSpeffzScheme() {
  [UBL, UBR, UFR, UFL, LUB, LUF, LDF, LDB, FUL, FUR, FDR, FDL, RUF, RUB, RDB, RDF, BUR, BUL, BDL, BDR, DFL, DFR, DBR, DBL] = speffzArray;
  localStorage.setItem("cornersArray", JSON.stringify(speffzArray));

  [UB, UR, UF, UL, LU, LF, LD, LB, FU, FR, FD, FL, RU, RB, RD, RF, BU, BL, BD, BR, DF, DR, DB, DL] = speffzArray;
  localStorage.setItem("edgesArray", JSON.stringify(speffzArray));

  [UBl, URb, UFr, ULf, LUb, LFu, LDf, LBd, FUl, FRu, FDr, FLd, RUf, RBu, RDb, RFd, BUr, BLu, BDl, BRd, DFl, DRf, DBr, DLb] = speffzArray;
  localStorage.setItem("wingsArray", JSON.stringify(speffzArray));

  updateVars();
  console.log("assigned speffz");
}
function openMainSettings() {
  mainSettingsOverlay.classList.add("visible");
  mainSettingsOverlay.addEventListener("click", () => {
    mainSettingsOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  })
  document.body.style.overflow = "hidden";
  if (localStorage.getItem("accentColor")) {
    document.querySelector(".colorPickerInput").value = localStorage.getItem("accentColor");
  } else {
    document.querySelector(".colorPickerInput").value = "#00b1cc";
    console.log("test");
  }
}

if (mainSettingsOverlay) {
  speffzBtn.addEventListener("click", () => {
    schemeInput.classList.remove("open");
  });
  customLettersBtn.addEventListener("click", () => {
    if (!schemeInput.classList.contains("open"))
      schemeInput.classList.add("open");
  });
}

if (saveMainSettings) {
  saveMainSettings.addEventListener("click", () => {
    if (!schemeInput.classList.contains("open")) {
      if (JSON.parse(localStorage.getItem("cornersArray")) == speffzArray || JSON.parse(localStorage.getItem("cornersArray")) == null) {
        console.log("fine");
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

    // Function to set the accent color
    accentColor = document.querySelector(".colorPickerInput").value;
    localStorage.setItem("accentColor", accentColor);


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
  });
}
document.documentElement.style.setProperty("--vib", localStorage.getItem("accentColor"));

//#endregion

//#region Piecetype Settings

updateVars();

// function for hiding all cases and sets that are impossible with the current buffer configuration
function hideInvalidCases(buffer) {
  // Uncheck all cases
  allCases.forEach((e) => {
    e.classList.remove("checked");
  })
  document.querySelectorAll(".setOpener").forEach((e) => {
    e.classList.remove("overOneChecked");
  })

  // Corner Buffers
  if (window.location.pathname === "/corners.html") {
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
  if (window.location.pathname === "/edges.html") {
    if (eliminatedBuffers.includes("UF")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UF) || e.textContent.includes(FU)) {
          console.log("idk");
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
  if (window.location.pathname === "/xcenters.html") {
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
  if (window.location.pathname === "/pluscenters.html") {
    if (eliminatedBuffers.includes("Uf")) {
      allCases.forEach((e) => {
        if (e.textContent.includes(UF)) {
          console.log("idk");
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
  if (window.location.pathname === "/parity.html") {
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
  console.log(localStorage.bufferOrderCorners);
}
function saveOrderEdges() {
  var orderArray = [];
  document.querySelectorAll(".buffer").forEach((e) => {
    orderArray.push(e.textContent);
  })
  localStorage.setItem("bufferOrderEdges", JSON.stringify(orderArray));
  console.log(localStorage.bufferOrderEdges);
}

function saveOrderXcenters() {
  var orderArray = [];
  document.querySelectorAll(".buffer").forEach((e) => {
    orderArray.push(e.textContent);
  })
  localStorage.setItem("bufferOrderXcenters", JSON.stringify(orderArray));
  console.log(localStorage.bufferOrderXcenters);
}

function saveOrderPluscenters() {
  var orderArray = [];
  document.querySelectorAll(".buffer").forEach((e) => {
    orderArray.push(e.textContent);
  })
  localStorage.setItem("bufferOrderPluscenters", JSON.stringify(orderArray));
  console.log(localStorage.bufferOrderPluscenters);
}

function loadOrder() {
  if (window.location.pathname === "/corners.html") {
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
  if (window.location.pathname === "/edges.html") {
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
  if (window.location.pathname === "/xcenters.html") {
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
  if (window.location.pathname === "/pluscenters.html") {
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

function openSettings() {
  settingsOverlay.classList.add("visible");
  settingsOverlay.addEventListener("click", () => {
    settingsOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  })
  document.body.style.overflow = "hidden";
  if (localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`)) {
    document.querySelector(".slowPresetAmountInput").value = localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`);
  }
  if (localStorage.getItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`)) {
    document.querySelector(".slowPresetMaxInput").value = localStorage.getItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`);
  }
  loadOrder();
}

// Buffer order Drag and Drop
const container = document.querySelector(".bufferOrderContainer");

if (container) {
  function clearSelection() {
    const selected = container.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }
  }

  function handleDoubleClick(event) {
    clearSelection();
    event.target.classList.add("selected");
  }

  container.addEventListener("dblclick", (event) => {
    if (event.target !== container) {
      handleDoubleClick(event);
    }
  });

  Sortable.create(container, {
    animation: 150,
  });
}

if (settingsOverlay) {
  settingsOpener.addEventListener("click", () => {
    openSettings()
  });

  showInverse.innerText = "Inverses Off";
  document.querySelector(".buffer").classList.add("selected");
  selectedBuffer = document.querySelector(".buffer.selected").textContent;

  showInverse.addEventListener("click", function () {
    showInverse.classList.toggle("checked");
    if (showInverse.classList.contains("checked")) {
      showInverse.innerText = "Inverses On";
    } else {
      showInverse.innerText = "Inverses Off";
    }
  });

  if (saveSettings) {
    saveSettings.addEventListener("click", () => {
      casesBeforeBreak = Number(document.querySelector(".casesBeforeBreakInput").value);
      targetTime = Number(document.querySelector(".targetTimeInput").value);
      showNextLP = document.querySelector(".showNextLetterpairInput").checked;
      console.log(showNextLP);
      maxAmount = Number(document.querySelector(".slowPresetAmountInput").value);
      localStorage.setItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`, maxAmount);
      maxTime = Number(document.querySelector(".slowPresetMaxInput").value);
      localStorage.setItem(`maxTime_${window.location.pathname.split("/").pop().split(".").shift()}`, maxTime);
      selectedBuffer = document.querySelector(".buffer.selected");
      eliminatedBuffers = [];
      eliminatedBuffers.push(selectedBuffer.textContent);
      bufferSibling = selectedBuffer.previousElementSibling;

      while (bufferSibling) {
        eliminatedBuffers.push(bufferSibling.innerText);
        bufferSibling = bufferSibling.previousElementSibling;
      }

      if (window.location.pathname == "/corners.html") {
        saveOrderCorners();
      }
      if (window.location.pathname == "/edges.html") {
        saveOrderEdges();
      }
      if (window.location.pathname == "/xcenters.html") {
        saveOrderXcenters();
      }
      if (window.location.pathname == "/pluscenters.html") {
        saveOrderPluscenters();
      }

      allCases.forEach((e) => {
        e.style.display = "flex";
      });
      setDropdowns.forEach((e) => {
        e.style.display = "block";
      });
      eliminatedBuffers.forEach((buffer) => {
        hideInvalidCases(buffer);
      })
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
    });
  }
}

//#endregion

//#region Login
if (loginOverlay) {
  function openLogin() {
    loginPopup.style.display = "block";
    loginOverlay.classList.add("visible");
    loginOverlay.addEventListener("click", () => {
      loginPopup.style.display = "none";
      loginOverlay.classList.remove("visible");
    })
  }
  function showPassword() {
    var x = password;
    if (x.type === "password") {
      x.type = "text";
      passwordEye.style.textDecoration = "none";
    } else {
      x.type = "password";
      passwordEye.style.textDecoration = "line-through";
    }
  }

  accountBtn.forEach((e) => {
    e.addEventListener("click", () => {
      openLogin();
    })
  })

  toggleLogin.addEventListener("click", () => {
    if (loginHeader.textContent === "Login") {
      loginHeader.textContent = "Register";
      loginSubmitBtn.textContent = "Register";
      toggleLogin.textContent = "Already have an account? Log In!";
    } else {
      loginHeader.textContent = "Login";
      loginSubmitBtn.textContent = "Login";
      toggleButton.textContent = "Don't have an account? Register!";
    }
  });
}
//#endregion

//#region Case Selection

if (piecetypeAll) {
  piecetypeAll.addEventListener("click", () => {
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
  });
}

if (piecetypeNone) {
  piecetypeNone.addEventListener("click", () => {
    document.querySelectorAll(".case").forEach((item) => {
      item.classList.remove("checked");
    });
    document.querySelectorAll(".setOpener").forEach((item) => {
      item.classList.remove("overOneChecked");
    });
  });
}

// Selections within dropdowns
if (setDropdowns) {
  setDropdowns.forEach((container) => {
    const setOpener = container.querySelector(".setOpener"),
      items = container.querySelectorAll(".case"),
      selectAll = container.querySelector(".selectAllCases"),
      selectNone = container.querySelector(".selectNoCases");

    // if nothing checked, cant start
    function checkForChecked() {
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
    }

    // open/close set
    setOpener.addEventListener("click", () => {
      setOpener.classList.toggle("open");
    });

    // select individual cases
    items.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("checked");
        checkForChecked();
      });
    });

    // select set
    selectAll.addEventListener("click", () => {
      items.forEach((item) => {
        if (item.style.display !== "none") {
          item.classList.add("checked");
          setOpener.classList.add("overOneChecked");
        }
      });
    });
    // deselect set
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

//#endregion

//#region Train

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

function copySummary() { };

var chart;
function trainingIfElseStuff() {
  if (!done) {
    var caseCount = orderedArray.length - randomArray.length + 1;

    // break
    if (
      0 == caseCount % casesBeforeBreak &&
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
    }

    // First Letterpair after Break
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

    // normal Letterpairs
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
        nextLP.innerText = "Next: " + nextLPvar;
      }
    }

    // last letterpair
    else if (Date.now() - startTime > 250) {

      lpTime = ((Date.now() - startTime) / 1000).toFixed(2);
      lpTimes += parseFloat(lpTime);
      trainedObject[randomArray[0]] = lpTime;
      progressPercent = Math.round(((orderedArray.length - randomArray.length + 1) / orderedArray.length) * 100);
      progressBar.style.width = progressPercent + "%";
      randomArray.splice(0, 1);
      done = true;


      // after trainig page
      document.querySelector(".whileTrainingContainer").style.opacity = "0%";
      setTimeout(() => {
        document.querySelector(".whileTrainingContainer").style.display = "none";
        document.querySelector(".afterTrainingContainer").style.opacity = "0%";
        setTimeout(() => {
          document.querySelector(".afterTrainingContainer").style.display = "grid";
          document.querySelector(".afterTrainingContainer").style.opacity = "100%";
        }, 300)
      }, 300)


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

      //#region consistency
      var timesArray = [];
      var diffSum = "";
      for (let key in trainedObject) {
        let value = trainedObject[key];
        timesArray.push(value);
        console.log(timesArray);
      }

      diffSum = 0;
      timesArray.forEach((e) => {
        diffSum += Math.abs(e - avg);
      })

      var avgDiff = diffSum / timesArray.length;

      document.querySelector(".consistency").innerText = "σ: " + avgDiff.toFixed(2);

      //#endregion

      var casesBelowTargetTime = 0;
      timesArray.forEach((e) => {
        if (e < targetTime) {
          casesBelowTargetTime++;
        }
      })

      if (casesBelowTargetTime == timesArray.length) {
        document.querySelector(".casesBelowTarget").innerText = "Cases Below Target Time: All";
      } else {
        document.querySelector(".casesBelowTarget").innerText = "Cases Below Target Time: " + casesBelowTargetTime;
      }


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

      //#region share
      function createSummary() {
        const pieceType = window.location.pathname.split("/").pop().split(".").shift();
        const link = "https://example.com/";
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date();

        let summary = `${pieceType.charAt(0).toUpperCase() + pieceType.slice(1)} practice session on ${link}, ${date.toLocaleDateString("en-US", options)}\n\n`;
        summary += "Average Time: " + avg.toFixed(2) + "s\n";
        summary += "Amount of Cases: " + timesArray.length + "\n";
        summary += "Total Time: " + formatTime(lpTimes) + "\n";
        summary += "σ: " + avgDiff.toFixed(2) + "\n";

        return summary;
      }

      function copySummary() {
        const summary = createSummary();
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
      }

      document.querySelector(".shareSessionBtn").addEventListener("click", copySummary);
      //#endregion

      //#region stats table
      function populateTable() {
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
      }
      populateTable();

      //#endregion

      //#region chart
      const context = document.querySelector("#trainEndChart").getContext("2d");
      const labels = timesArray.map((value, index) => index + 1);

      const root = document.documentElement;
      const lightClr = getComputedStyle(root).getPropertyValue("--light");
      const vibClr = getComputedStyle(root).getPropertyValue("--vib");

      var lpArray = [];
      for (let key in trainedObject) {
        lpArray.push(key);
      }

      if (chart) {
        chart.destroy();
      }

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

      //#endregion

      //#region slow cases 


      var tempObj = trainedObject;
      let keys = Object.keys(tempObj);
      for (let key of keys) {
        if (tempObj[key] > maxTime) {
          delete tempObj[key];
        }
      }

      var pieceType = window.location.pathname.split("/").pop().split(".").shift();

      if (pieceType === "flips" || pieceType === "twists" || pieceType === "ltct" || pieceType === "words" || pieceType === "wings" || pieceType === "midges") {
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

        function keepSlowestCases(slowCasesLS, maxAmount) {
          let entries = Object.entries(slowCasesLS);
          entries.sort((a, b) => b[1] - a[1]);
          let topEntries = entries.slice(0, maxAmount);
          let newSlowCases = Object.fromEntries(topEntries);
          return newSlowCases;
        }

        var filteredSlowCases = keepSlowestCases(slowCasesLS, maxAmount);
        localStorage.setItem(`slowCases_${pieceType}`, JSON.stringify(filteredSlowCases));

      } else {
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

        function keepSlowestCases(slowCasesLS, maxAmount) {
          let entries = Object.entries(slowCasesLS);
          entries.sort((a, b) => b[1] - a[1]);
          let topEntries = entries.slice(0, maxAmount);
          let newSlowCases = Object.fromEntries(topEntries);
          return newSlowCases;
        }

        var filteredSlowCases = keepSlowestCases(slowCasesLS, maxAmount);
        localStorage.setItem(`slowCases_${pieceType}_${currentBuffer}`, JSON.stringify(filteredSlowCases));
        console.log(filteredSlowCases);
      }

      //#endregion
    }
  }
}

if (startBtn) {
  startBtn.addEventListener("click", () => {
    if (document.querySelectorAll(".case.checked").length > 0) {
      allCases.forEach((e) => {
        if (e.classList.contains("checked")) {
          orderedArray.push(e.innerText.replace(/\n/g, ''));
        }
      });

      if (showInverse.classList.contains("checked")) {
        orderedArray.forEach((item) => {
          inverseCase = item.split("").reverse().join("");
          if (!orderedArray.includes(inverseCase.replace(/\n/g, ''))) {
            orderedArray.push(inverseCase.replace(/\n/g, ''));
          }
        });
      }

      randomArray = [];
      trainedObject = {};
      currentBuffer = document.querySelector(".buffer.selected").innerText;
      if (localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`)) {
        maxAmount = localStorage.getItem(`maxAmount_${window.location.pathname.split("/").pop().split(".").shift()}`);
      }
      console.log(currentBuffer);
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
  })
}

if (trainSlowBtn) {
  trainSlowBtn.addEventListener("click", function () {
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
  });
}

if (trainSpecialSlowBtn) {
  trainSpecialSlowBtn.forEach((btn) => btn.addEventListener("click", function (e) {
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

if (repeatBtn) {
  repeatBtn.addEventListener("click", function () {
    lpTimes = avg = startTime = 0;
    randomArray = [];
    trainedObject = {};
    let tempArray = [...orderedArray];
    while (tempArray.length > 0) {
      let randomIndex = Math.floor(Math.random() * tempArray.length);
      randomArray.push(tempArray.splice(randomIndex, 1)[0]);
    }

    progressBar.style.width = "0%";

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
  });
}

if (repeatSlowBtn) {
  repeatSlowBtn.addEventListener("click", function () {
    orderedArray = [];
    for (let key in trainedObject) {
      const value = trainedObject[key];
      if (value > targetTime) {
        orderedArray.push(key);
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
  });
}

//#endregion

//#region Supabase

// const supabase = createClient("https://utdmpxbxucvvrrbnvrwj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZG1weGJ4dWN2dnJyYm52cndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMzcwODgsImV4cCI6MjAzODcxMzA4OH0.JSwQqAPlc9Q7Uixz1xceyBBBfrRO8mo4N3qb4SeVF0k");

//#endregion
