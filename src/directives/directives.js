export const priceMovement = {
  mounted(el, binding) {
    const value = binding.value.toString();
    const classList = el.classList;

    if (value.startsWith("-")) {
      classList.add("downward-price-movement");
    } else {
      classList.add("upward-price-movement");
    }
  },
  updated(el, binding) {
    const value = binding.value.toString();
    const classList = el.classList;

    classList.remove("upward-price-movement");
    classList.remove("downward-price-movement");

    if (value.startsWith("-")) {
      classList.add("downward-price-movement");
    } else {
      classList.add("upward-price-movement");
    }
  },
};

export const divideNumber = {
  mounted(el, binding) {
    const number = binding.value;

    el.textContent = number.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 20,
    });
  },
  updated(el, binding) {
    const number = binding.value;

    el.textContent = number.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 20,
    });
  },
};
