/* =========================================
   CURRENCY CONVERTER
========================================= */


const amount = document.getElementById("amount");

const fromCurrency =
    document.getElementById("fromCurrency");

const toCurrency =
    document.getElementById("toCurrency");

const convertButton =
    document.getElementById("convert");

const swapButton =
    document.getElementById("swap");

const result =
    document.getElementById("result");

const convertedValue =
    document.getElementById("convertedValue");

const conversionText =
    document.getElementById("conversionText");

const exchangeRate =
    document.getElementById("exchangeRate");

const updatedTime =
    document.getElementById("updatedTime");

const favoriteButton =
    document.getElementById("favoriteButton");

const historyList =
    document.getElementById("historyList");

const favoritesList =
    document.getElementById("favoritesList");

const clearHistory =
    document.getElementById("clearHistory");

const themeToggle =
    document.getElementById("themeToggle");

const loadChart =
    document.getElementById("loadChart");

const glitterContainer =
    document.getElementById("glitterContainer");


let currentRate = null;

let rateChart = null;


/* =========================================
   CURRENCY SYMBOLS
========================================= */

const currencySymbols = {

    USD: "$",

    INR: "₹",

    EUR: "€",

    GBP: "£",

    JPY: "¥",

    AUD: "A$",

    CAD: "C$",

    CHF: "CHF",

    CNY: "¥",

    SGD: "S$",

    AED: "د.إ",

    NZD: "NZ$"

};


/* =========================================
   CREATE GLITTER
========================================= */

function createGlitter() {

    for (let i = 0; i < 80; i++) {

        const glitter =
            document.createElement("span");

        glitter.classList.add("glitter");

        glitter.style.left =
            Math.random() * 100 + "%";

        glitter.style.top =
            Math.random() * 100 + "%";

        glitter.style.animationDelay =
            Math.random() * 5 + "s";

        glitter.style.animationDuration =
            (2 + Math.random() * 4) + "s";

        glitterContainer.appendChild(glitter);
    }
}


createGlitter();


/* =========================================
   CONVERT CURRENCY
========================================= */

async function convertCurrency() {

    const value =
        Number(amount.value);

    const from =
        fromCurrency.value;

    const to =
        toCurrency.value;


    if (!value || value <= 0) {

        convertedValue.innerText = "Invalid";

        conversionText.innerText =
            "Please enter a valid amount.";

        exchangeRate.innerText = "";

        updatedTime.innerText = "";

        return;
    }


    /* Same currency */

    if (from === to) {

        currentRate = 1;

        const symbol =
            currencySymbols[to] || to;

        convertedValue.innerText =
            `${symbol}${value.toFixed(2)}`;

        conversionText.innerText =
            `${value} ${from} → ${value} ${to}`;

        exchangeRate.innerText =
            `1 ${from} = 1 ${to}`;

        updatedTime.innerText =
            "Same currency conversion";

        saveHistory(
            value,
            from,
            to,
            value
        );

        updateFavoriteButton();

        return;
    }


    convertedValue.innerText =
        "Loading...";

    conversionText.innerText =
        "Fetching latest exchange rate...";

    exchangeRate.innerText = "";

    updatedTime.innerText = "";


    try {

        const url =
            `https://api.frankfurter.dev/v2/rate/${from}/${to}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch exchange rate"
            );
        }


        const data =
            await response.json();


        currentRate =
            Number(data.rate);


        const convertedAmount =
            value * currentRate;


        const symbol =
            currencySymbols[to] || to;


        /* Result */

        convertedValue.innerText =
            `${symbol}${convertedAmount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;


        conversionText.innerText =
            `${value.toLocaleString()} ${from} → ${convertedAmount.toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 2
                }
            )} ${to}`;


        exchangeRate.innerText =
            `1 ${from} = ${currentRate.toFixed(4)} ${to}`;


        updatedTime.innerText =
            `Updated: ${new Date().toLocaleString()}`;


        /* Save history */

        saveHistory(
            value,
            from,
            to,
            convertedAmount
        );


        /* Update favorite */

        updateFavoriteButton();

    }


    catch (error) {

        console.error(error);


        convertedValue.innerText =
            "Error";


        conversionText.innerText =
            "Unable to get exchange rate.";


        exchangeRate.innerText =
            "Please check your internet connection and try again.";


        updatedTime.innerText = "";

    }

}


/* =========================================
   CONVERT BUTTON
========================================= */

convertButton.addEventListener(
    "click",
    convertCurrency
);


/* =========================================
   SWAP CURRENCIES
========================================= */

swapButton.addEventListener(
    "click",
    function () {

        const temporary =
            fromCurrency.value;

        fromCurrency.value =
            toCurrency.value;

        toCurrency.value =
            temporary;


        convertCurrency();

    }
);


/* =========================================
   QUICK AMOUNTS
========================================= */

document.querySelectorAll(
    ".quick-btn"
).forEach(button => {

    button.addEventListener(
        "click",
        function () {

            amount.value =
                this.dataset.amount;

            convertCurrency();

        }
    );

});


/* =========================================
   HISTORY
========================================= */

function saveHistory(
    amountValue,
    from,
    to,
    converted
) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "currencyHistory"
            )
        ) || [];


    const item = {

        amount: amountValue,

        from: from,

        to: to,

        converted: converted,

        date: new Date().toLocaleString()

    };


    history.unshift(item);


    /* Keep only 10 */

    history =
        history.slice(0, 10);


    localStorage.setItem(
        "currencyHistory",
        JSON.stringify(history)
    );


    displayHistory();
}


function displayHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "currencyHistory"
            )
        ) || [];


    if (history.length === 0) {

        historyList.innerHTML =
            `<p class="empty-message">
                No conversions yet
            </p>`;

        return;
    }


    historyList.innerHTML = "";


    history.forEach(item => {

        const div =
            document.createElement("div");


        div.className =
            "history-item";


        div.innerHTML = `

            <div>

                <strong>
                    ${item.amount} ${item.from}
                </strong>

                →

                <strong>
                    ${item.to}
                </strong>

                <br>

                <small>
                    ${item.date}
                </small>

            </div>


            <div>

                ${Number(item.converted).toLocaleString(
                    undefined,
                    {
                        maximumFractionDigits: 2
                    }
                )}

            </div>

        `;


        historyList.appendChild(div);

    });

}


clearHistory.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "currencyHistory"
        );

        displayHistory();

    }
);


displayHistory();


/* =========================================
   FAVORITES
========================================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "currencyFavorites"
        )
    ) || [];

}


function saveFavorite() {

    const from =
        fromCurrency.value;

    const to =
        toCurrency.value;


    const pair =
        `${from}-${to}`;


    let favorites =
        getFavorites();


    if (
        !favorites.includes(pair)
    ) {

        favorites.push(pair);

    }


    localStorage.setItem(
        "currencyFavorites",
        JSON.stringify(favorites)
    );


    displayFavorites();

    updateFavoriteButton();

}


function removeFavorite(pair) {

    let favorites =
        getFavorites();


    favorites =
        favorites.filter(
            item => item !== pair
        );


    localStorage.setItem(
        "currencyFavorites",
        JSON.stringify(favorites)
    );


    displayFavorites();

    updateFavoriteButton();

}


function updateFavoriteButton() {

    const pair =
        `${fromCurrency.value}-${toCurrency.value}`;


    const favorites =
        getFavorites();


    if (favorites.includes(pair)) {

        favoriteButton.innerText =
            "⭐ Remove from Favorites";

    }

    else {

        favoriteButton.innerText =
            "☆ Add to Favorites";

    }

}


favoriteButton.addEventListener(
    "click",
    function () {

        const pair =
            `${fromCurrency.value}-${toCurrency.value}`;


        const favorites =
            getFavorites();


        if (favorites.includes(pair)) {

            removeFavorite(pair);

        }

        else {

            saveFavorite();

        }

    }
);


function displayFavorites() {

    const favorites =
        getFavorites();


    if (favorites.length === 0) {

        favoritesList.innerHTML =
            `<p class="empty-message">
                No favorite pairs yet
            </p>`;

        return;

    }


    favoritesList.innerHTML = "";


    favorites.forEach(pair => {

        const [from, to] =
            pair.split("-");


        const div =
            document.createElement("div");


        div.className =
            "favorite-item";


        div.innerHTML = `

            <strong>
                ${from} → ${to}
            </strong>

            <button
                class="remove-favorite"
                data-pair="${pair}"
            >
                ×
            </button>

        `;


        div.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.classList.contains(
                        "remove-favorite"
                    )
                ) {

                    removeFavorite(pair);

                    return;
                }


                fromCurrency.value =
                    from;

                toCurrency.value =
                    to;


                convertCurrency();

            }
        );


        favoritesList.appendChild(div);

    });

}


displayFavorites();

updateFavoriteButton();


/* =========================================
   DARK MODE
========================================= */

const savedTheme =
    localStorage.getItem(
        "currencyTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeToggle.innerText =
        "☀️";

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        if (isDark) {

            themeToggle.innerText =
                "☀️";

            localStorage.setItem(
                "currencyTheme",
                "dark"
            );

        }

        else {

            themeToggle.innerText =
                "🌙";

            localStorage.setItem(
                "currencyTheme",
                "light"
            );

        }

    }
);


/* =========================================
   HISTORICAL CHART
========================================= */

async function createChart() {

    const from =
        fromCurrency.value;

    const to =
        toCurrency.value;


    if (from === to) {

        alert(
            "Please select two different currencies."
        );

        return;

    }


    loadChart.innerText =
        "Loading...";


    try {

        /*
         * Get dates for approximately
         * the previous 30 days.
         */

        const today =
            new Date();


        const oldDate =
            new Date();


        oldDate.setDate(
            today.getDate() - 30
        );


        const formatDate =
            date => {

                return date
                    .toISOString()
                    .split("T")[0];

            };


        const startDate =
            formatDate(oldDate);


        const endDate =
            formatDate(today);


        const url =
            `https://api.frankfurter.dev/v2/rates?base=${from}&quotes=${to}&from=${startDate}&to=${endDate}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Chart API failed"
            );

        }


        const data =
            await response.json();


        const labels =
            data.map(item => item.date);


        const rates =
            data.map(item => item.rate);


        if (rateChart) {

            rateChart.destroy();

        }


        const ctx =
            document
                .getElementById(
                    "rateChart"
                )
                .getContext("2d");


        rateChart =
            new Chart(
                ctx,
                {

                    type: "line",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    `${from} → ${to}`,

                                data: rates,

                                borderWidth: 3,

                                tension: 0.35,

                                fill: true,

                                pointRadius: 3

                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                display: true

                            }

                        },


                        scales: {

                            y: {

                                beginAtZero: false

                            }

                        }

                    }

                }
            );


        loadChart.innerText =
            "Refresh Chart";

    }


    catch (error) {

        console.error(error);


        loadChart.innerText =
            "Load Chart";


        alert(
            "Unable to load historical data. Please try again."
        );

    }

}


loadChart.addEventListener(
    "click",
    createChart
);


/* =========================================
   AUTO CONVERT WHEN CURRENCY CHANGES
========================================= */

fromCurrency.addEventListener(
    "change",
    function () {

        updateFavoriteButton();

        convertCurrency();

    }
);


toCurrency.addEventListener(
    "change",
    function () {

        updateFavoriteButton();

        convertCurrency();

    }
);


/* =========================================
   INITIAL CONVERSION
========================================= */

convertCurrency();