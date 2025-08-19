import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    setDoc,
    serverTimestamp,
    doc as firestoreDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyC9Jip-5e9FxdlKwDRlKHnt1uQXUib8emg",
  authDomain: "demiteo-studios.firebaseapp.com",
  projectId: "demiteo-studios",
  storageBucket: "demiteo-studios.firebasestorage.app",
  messagingSenderId: "127959547821",
  appId: "1:127959547821:web:39327b2789aad43ae66b24"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.login = async function () {
    const usuarioInput = document.getElementById('login-user').value.trim();
    const claveInput = document.getElementById('login-password').value.trim();
    const q = query(collection(db, "cuenta"), where("usuario", "==", usuarioInput));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        alert("El usuario no coincide con las cuentas creadas.");
        return;
    }
    const nuevaLogin = {
        chofer: usuarioInput,
        timestamp: new Date(),
    };
    let acceso = false;
    snapshot.forEach((docu) => {
        const data = docu.data();
        console.log("Documento encontrado:", data);
        if (String(data.contraseña) === String(claveInput)) {
            acceso = true;
            alert('Logueo exitoso');
            mostrarPestaña('panel');
            enviarEmbled(nuevaLogin); // Pasamos el objeto con los datos
        } else {
            alert("La contraseña es incorrecta.");
        }
    });
    if (!acceso) return;
};
function enviarEmbled(Data) {
    const webhook = ObtenerWebhook(); // Debe retornar la URL del webhook descifrada
    if (!webhook) {
        console.error("❌ Webhook no disponible");
        return;
    }
    const embed = {
        title: "Nuevo Inicio de Sesión en la Web",
        description: `Se detectó un usuario iniciando sesión en la web.\n` +
                     `Usuario: ${Data.chofer}\n` +
                     `Horario de inicio de sesión: ${Data.timestamp.toLocaleString()}`,
        color: 3066993,
    };
    const payload = { embeds: [embed] };
    fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            console.error("❌ Error al enviar mensaje:", response.statusText);
        } else {
            console.log("✅ Mensaje embed enviado a Discord");
        }
    })
    .catch(error => {
        console.error("❌ Error en la solicitud al enviar embed:", error);
    });
}
window.enviarEmbled = enviarEmbled;