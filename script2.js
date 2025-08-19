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
                     `Horario de inicio de sesión: ${Data.timestamp.toLocaleString()}\n` +
                     `<@&1407423501966639254>`,
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
window.mostrarSancionesActivas = async function () {
    const hoy = new Date();
    const sancionesRef = collection(db, "sanciones");
    const snapshot = await getDocs(sancionesRef);
    const tbody = document.querySelector("#tabla-sanciones-activas tbody");
    tbody.innerHTML = "";
    snapshot.forEach(docu => {
        const data = docu.data();
        const hastaEl = new Date(data["hasta el"]);
        if (isNaN(hastaEl.getTime()) || hoy > hastaEl) return;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${data.usuario || ""}</td>
            <td>${data.razon || ""}</td>
            <td>${data["hasta el"] || ""}</td>
            <td>${data.admin || ""}</td>
        `;
        tbody.appendChild(fila);
    });

    mostrarPestaña('sanciones-activas');
};
window.addSancion = async function () {
    const inputs = document.querySelectorAll('#menu-addSancion input');
    const usuario = inputs[0].value.trim();
    const tiempo = parseInt(inputs[1].value.trim(), 10); // días
    const razon = inputs[2].value.trim();
    const admin = inputs[3].value.trim();
    if (!usuario || isNaN(tiempo) || !razon || !admin) {
        alert("Completa todos los campos correctamente.");
        return;
    }
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const hastaEl = new Date(hoy);
    hastaEl.setDate(hoy.getDate() + tiempo);
    const hastaElStr = hastaEl.toISOString().split('T')[0];
    const sancion = {
        usuario: usuario,
        razon: razon,
        admin: admin,
        "hasta el": hastaElStr
    };
    try {
        await addDoc(collection(db, "sanciones"), sancion);
        alert("Sanción agregada correctamente.");
        document.getElementById('menu-addSancion').style.display = 'none';
        inputs.forEach(input => input.value = "");
    } catch (e) {
        alert("Error al agregar la sanción.");
        console.error(e);
    }
};