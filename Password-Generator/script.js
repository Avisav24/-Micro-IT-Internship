const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

// Initialize
handleSlider();
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = `${
    ((passwordLength - min) * 100) / (max - min)
  }% 100%`;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 10);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  return symbols[getRndInteger(0, symbols.length)];
}

function calculateStrength() {
  const hasUpper = upperCaseCheck.checked;
  const hasLower = lowerCaseCheck.checked;
  const hasNumber = numberCheck.checked;
  const hasSymbol = symbolCheck.checked;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "COPIED";
  } catch (e) {
    copyMsg.innerText = "FAILED";
  }

  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// Event listeners
inputSlider.addEventListener("input", (e) => {
  passwordLength = parseInt(e.target.value);
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";
  const funcArr = [];

  if (upperCaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowerCaseCheck.checked) funcArr.push(generateLowerCase);
  if (numberCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolCheck.checked) funcArr.push(generateSymbol);

  // Compulsory characters
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Remaining characters
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    const randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // Shuffle and display
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;

  calculateStrength();
});
