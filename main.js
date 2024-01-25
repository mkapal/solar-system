window.onload = () => {
  const earthPixelsInput = document.getElementById("earth-pixels");
  const distancesCheckbox = document.getElementById("distances");

  updateScaleMarkers();

  earthPixelsInput.oninput = () => {
    updateScaleMarkers();
  };

  const spheres = document.getElementsByClassName("sphere-with-label");

  distancesCheckbox.onchange = (event) => {
    const { checked } = event.target;

    document.documentElement.style.setProperty(
      "--distance-multiplier",
      checked ? "1" : "0",
    );
    for (let sphere of spheres) {
      sphere.style.position = checked ? "absolute" : "static";
    }

    updateScaleMarkers();
  };
};

function updateScaleMarkers() {
  const documentStyles = window.getComputedStyle(document.documentElement);
  const scale = document.getElementById("scale");
  const pxKm = document.getElementById("px-km");
  const earthDiameterKm = documentStyles.getPropertyValue("--earth-diameter");
  const distanceMultiplier = documentStyles.getPropertyValue(
    "--distance-multiplier",
  );
  const earthPixelsInput = document.getElementById("earth-pixels");

  const scaleFactor = earthPixelsInput.value / earthDiameterKm;

  document.documentElement.style.setProperty(
    "--scale-factor",
    scaleFactor.toString(10),
  );

  scale.innerHTML = "";

  const markerDistanceInKm = 1_000_000;
  const neptuneDistanceInMillionsKm = 4516;
  const max = distanceMultiplier === "1" ? neptuneDistanceInMillionsKm : 2;

  for (let i = 0; i <= max; i++) {
    const div = document.createElement("div");
    div.className = "scale-marker";
    div.style.position = "absolute";
    div.style.right = "0";
    div.style.top = "" + i * markerDistanceInKm * scaleFactor + "px";
    div.innerHTML = formatNumber(i * markerDistanceInKm, "km");
    scale.appendChild(div);
  }

  pxKm.innerHTML = `1 px = ${formatNumber((1 / scaleFactor).toFixed(0), "km")}`;
}

function formatNumber(number, unit) {
  return `${new Intl.NumberFormat([]).format(number)}${unit ? ` ${unit}` : ""}`;
}
