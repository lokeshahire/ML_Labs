document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const openModal = document.getElementById("open-modal");
  const closeModal = document.getElementById("close-modal");
  const modal = document.getElementById("dataModal");
  const refreshDataBtn = document.getElementById("refresh-data");
  const dataDisplay = document.getElementById("data-display");
  const form = document.getElementById("data-form");
  const weatherDisplay = document.getElementById("weather-display");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    menuToggle.innerHTML = sidebar.classList.contains("collapsed")
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fas fa-bars"></i>';
  });
  function toggleTheme() {
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;

    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      themeIcon.classList.remove("fas", "fa-moon");
      themeIcon.classList.add("fa-regular", "fa-sun");

      localStorage.setItem("theme", "light");
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");

      themeIcon.classList.remove("fa-regular", "fa-sun");
      themeIcon.classList.add("fas", "fa-moon");

      localStorage.setItem("theme", "dark");
    }
  }

  document
    .getElementById("theme-toggle")
    .addEventListener("click", toggleTheme);

  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;

    if (savedTheme === "dark") {
      body.classList.add("dark-theme");
      themeIcon.classList.add("fas", "fa-moon");
    } else {
      body.classList.add("light-theme");
      themeIcon.classList.add("fa-regular", "fa-sun");
    }
  }

  window.addEventListener("DOMContentLoaded", loadTheme);

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark" : "light"
    );
  });

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  }

  openModal.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  document.getElementById("open-modal").onclick = function () {
    document.getElementById("dataModal").style.display = "block";
  };

  document.getElementById("close-modal").onclick = function () {
    document.getElementById("dataModal").style.display = "none";
  };

  document.getElementById("data-form").onsubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const formData = {
      name: name,
      email: email,
    };

    localStorage.setItem("formData", JSON.stringify(formData));

    this.reset();

    document.getElementById("dataModal").style.display = "none";

    alert("Data saved successfully!");
  };

  async function fetchData() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      dataDisplay.innerHTML = "";

      data.slice(0, 9).forEach((entry) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
                    <h3>${entry.title}</h3>
                    <p><strong>Body:</strong> ${entry.body}</p>
                    <p><strong>Post ID:</strong> ${entry.id}</p>
                `;
        dataDisplay.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      displayErrorMessage("Failed to fetch data. Please try again later.");
    }
  }

  fetchData();

  refreshDataBtn.addEventListener("click", () => {
    fetchData();
  });
  const ctx = document.getElementById("dataChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Item 1", "Item 2", "Item 3"],
      datasets: [
        {
          label: "Data Example",
          data: [12, 19, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  function displayErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerText = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  async function fetchWeatherData() {
    const cities = ["Mumbai", "Pune", "Delhi", "Nashik"];
    const apiKey = "c1fbaeb6a7bf0f3ce4982911309ea904";
    const units = "metric";
    const temperatures = [];
    const cityNames = [];

    for (let city of cities) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
        );
        if (!response.ok) {
          throw new Error("Weather data fetch failed");
        }
        const weatherData = await response.json();
        temperatures.push(weatherData.main.temp);
        cityNames.push(weatherData.name);

        const weatherCard = document.createElement("div");
        weatherCard.classList.add("weather-card");
        weatherCard.innerHTML = `
            <h3>${weatherData.name}</h3>
            <p>Temperature: ${weatherData.main.temp}°C</p>
            <p>Weather: ${weatherData.weather[0].description}</p>
          `;
        weatherDisplay.appendChild(weatherCard);
      } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        displayErrorMessage(`Failed to fetch weather data for ${city}.`);
      }
    }

    updateWeatherChart(cityNames, temperatures);
  }

  function updateWeatherChart(cityNames, temperatures) {
    const ctxWeather = document.getElementById("weatherChart").getContext("2d");

    const weatherChart = new Chart(ctxWeather, {
      type: "line",
      data: {
        labels: cityNames,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatures,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Temperature (°C)",
            },
          },
          x: {
            title: {
              display: true,
              text: "City",
            },
          },
        },
      },
    });
  }

  fetchWeatherData();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value;
    const email = form.email.value;

    console.log("Form submitted:", { name, email });

    displayConfirmationMessage("Data submitted successfully!");

    modal.style.display = "none";
    form.reset();
  });

  function displayConfirmationMessage(message) {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.className = "confirmation-message";
    confirmationDiv.innerText = message;
    document.body.appendChild(confirmationDiv);
    setTimeout(() => {
      confirmationDiv.remove();
    }, 3000);
  }
});
