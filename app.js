// Base API
const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

// DOM elements
const amountInput = document.querySelector("#amount");
const fromCurrency = document.querySelector("#from");
const toCurrency = document.querySelector("#to");
const resultText = document.querySelector("#currency");
const convertBtn = document.querySelector("#btn");
const fromFlag = document.querySelector("#from-flag");
const toFlag = document.querySelector("#to-flag");
const swapIcon = document.querySelector(".fa-exchange-alt");
const animationBox = document.querySelector(".animation-box");


// 👇 Add this at the top with your other sounds
function playTouchSound() {
    const touchSound = document.getElementById("touch-sound");
    if (touchSound) {
        touchSound.currentTime = 0;
        touchSound.play();
    }
}
// 🔁 Play sound when dropdown changes
fromCurrency.addEventListener("change", () => {
    updateFlags();
    playTouchSound();
});

toCurrency.addEventListener("change", () => {
    updateFlags();
    playTouchSound();
});

// 🧮 Play sound when typing
amountInput.addEventListener("input", () => {
    playTouchSound();
});


// Trigger animation in left box
const triggerAnimation = () => {
    animationBox.innerHTML = "";

    const coin = document.createElement("span");
    coin.className = "emoji-coin";
    coin.textContent = "🪙";

    const currency = document.createElement("div");
    currency.className = "currency";

  // Get symbol from selected "from" currency
    const symbol = currencySymbols[fromCurrency.value] || fromCurrency.value;
    currency.textContent = symbol;

    animationBox.appendChild(coin);
    animationBox.appendChild(currency);

  // Fade out after animation
    setTimeout(() => {
    animationBox.innerHTML = "";
    }, 3000);
};

// Show loading spinner
const showSpinner = () => {
        resultText.innerHTML = `<div class="spinner"></div>`;
};

// Fetch and convert
const convertCurrency = async () => {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
    }

    showSpinner();
    triggerAnimation();

    try {
    const response = await fetch(`${BASE_URL}${from}`);
    const data = await response.json();
    const rate = data.rates[to];

    if (rate) {
      const converted = (amount * rate).toFixed(2);
        resultText.textContent = `${amount} ${from} = ${converted} ${to}`;
    } else {
        resultText.textContent = "Currency not available.";
    }
    } catch (error) {
    resultText.textContent = "Failed to fetch exchange rate.";
    console.error("Error:", error);
    }
};

// Load flags
const updateFlags = () => {
    const fromCode = countryList[fromCurrency.value];
    const toCode = countryList[toCurrency.value];
    fromFlag.src = `https://flagsapi.com/${fromCode}/flat/24.png`;
    toFlag.src = `https://flagsapi.com/${toCode}/flat/24.png`;
};

// Dropdown change listeners
fromCurrency.addEventListener("change", updateFlags);
toCurrency.addEventListener("change", updateFlags);

// Populate currency list
const populateCurrencyList = () => {
    for (let currencyCode in countryList) {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = option2.value = currencyCode;
    option1.textContent = option2.textContent = currencyCode;

    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
    }

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
    updateFlags();
};

populateCurrencyList();

// Swap values and flags
swapIcon.addEventListener("click", () => {
    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateFlags();
});

// On button click
convertBtn.addEventListener("click", () => {
    playTouchSound();
    convertCurrency();
});
