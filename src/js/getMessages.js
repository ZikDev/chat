import app from "./initFirebase.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import dayjs from "dayjs";

// Fonction pour formater un message
const prepareMessage = function (message) {
  // On récupère l'auteur du message dans le formulaire, pour ajouter une classe CSS si c'est notre message
  const author = document.querySelector("[name=author]").value;

  // On formate le temps avec la librairie dayjs (voir https://day.js.org/docs/en/display/format pour les options de formatage)
  const formattedTime = dayjs(message.time.toDate()).format("HH:mm:ss");

  // On retourne le HTML du message
  return `
  <div class="message${message.author === author && " is-mine"}">
    <div class="message-time">${formattedTime}</div>
    <div class="message-user"><img src="../img/miniman.svg" alt="" />${
      message.author
    }</div>
    <div class="message-text">${message.text}</div>
  </div>`;
};

const getMessages = function () {
  // On sélectionne le conteneur des messages
  const messagesContainer = document.querySelector("[data-messages]");

  // On récupère la base de données Firestore
  const db = getFirestore(app);
  const messagesQuery = query(
    collection(db, "messages"),
    orderBy("time", "desc"),
    limit(20)
  );

  // On écoute les changements sur la collection 'messages'
  onSnapshot(messagesQuery, (querySnapshot) => {
    // Lorsqu'il y a un changement, on récupère les messages
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    messages.reverse();

    const messagesHTML = messages.map((message) => {
      // On formate le message
      return prepareMessage(message);
    });

    // On ajoute les messages dans le conteneur
    messagesContainer.innerHTML = messagesHTML.join("");
    // On scroll en bas du conteneur
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
};

export default getMessages;
