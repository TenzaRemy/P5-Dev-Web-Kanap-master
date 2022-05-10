

let orderParams = new URLSearchParams(window.location.search);

const displayOrderNumber = () => {
  orderId.textContent = orderParams.get("id");
  localStorage.clear();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 10000);
};
displayOrderNumber();