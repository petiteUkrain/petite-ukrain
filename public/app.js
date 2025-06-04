fetch("/api/ads")
  .then(res => res.json())
  .then(ads => {
    const container = document.getElementById("ads");
    const searchInput = document.getElementById("search");
    const locationSelect = document.getElementById("locationFilter");

    function render(filteredAds) {
      container.innerHTML = "";
      filteredAds.forEach(ad => {
        const el = document.createElement("div");
        el.id = "ad";
        el.innerHTML = `
          <img src="${ad.image_url}" alt="${ad.title}">
          <div>
            <h3>${ad.title}</h3>
            <p>${ad.description}</p>
            <p><strong>${ad.price}</strong></p>
            <p><em>${ad.city}</em></p>
            <p>${new Date(ad.created_at).toLocaleDateString()}</p>
          </div>
        `;
        container.appendChild(el);
      });
    }

    function applyFilters() {
      const keyword = searchInput.value.toLowerCase();
      const selectedLocation = locationSelect.value;
      const filtered = ads.filter(ad => {
        const matchText = ad.title.toLowerCase().includes(keyword) || ad.description.toLowerCase().includes(keyword);
        const matchLocation = !selectedLocation || ad.city.includes(selectedLocation);
        return matchText && matchLocation;
      });
      render(filtered);
    }

    searchInput.addEventListener("input", applyFilters);
    locationSelect.addEventListener("change", applyFilters);

    render(ads);

    // ✔️ Обробка форми ДОДАННЯ оголошення (було правильно, але дужка була зайва)
    const adForm = document.getElementById("adForm");
    adForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(adForm);
      const ad = Object.fromEntries(formData.entries());

      const res = await fetch("/api/create-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ad)
      });

      const result = await res.json();
      if (res.ok) {
        alert("Оголошення додано!");
        adForm.reset();

        // Оновлюємо список (перезапитуємо оголошення)
        const updatedRes = await fetch("/api/ads");
        const updatedAds = await updatedRes.json();
        ads.length = 0; ads.push(...updatedAds);
        render(updatedAds);
      } else {
        alert("Помилка: " + result.error);
      }
    });
  });