// Récupération de l'orderId de la page cart pour la page confirmtion

const commande = new URLSearchParams(window.location.search);

//la variable id récupère la valeur du paramètre _id
const id = commande.get("id");

// fonction pour afficher le numéro de commande 
function orderConfirmation() {
  const numberOfOrder = document.getElementById("orderId");

  let orderIdHTML = `<span id="orderId">${id}</span>
                      <p> Merci pour votre commande à bientôt !</p>`;

  numberOfOrder.insertAdjacentHTML(`afterbegin`, orderIdHTML);
}

// Appelle de la fonction pour afficher le numéro de commande
orderConfirmation();


// Documentations utilisées pour approfondir les connaissances : 
// https://w3schools.com et https://developer.mozilla.org/fr/