// Récupération de l'orderId de la page cart pour la page confirmtion

const commande = new URLSearchParams(window.location.search);

//la variable id récupère la valeur du paramètre _id
const id = commande.get("id");

orderConfirmation();

// fonction pour afficher le numéro de commande 
function orderConfirmation() {
  const numberOfOrder = document.getElementById("orderId");

  let orderIdHTML = `<span id="orderId">${id}</span>`;

  numberOfOrder.insertAdjacentHTML(`afterbegin`, orderIdHTML);
}