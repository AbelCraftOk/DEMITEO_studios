function unlock(id) {
    const clave = prompt("Introduce la clave especial:");
    if (clave === "221516") {
        document.getElementById('locked-' + id).style.display = 'none';
        document.getElementById(id).style.display = 'block';
        alert("Contenido desbloqueado ✅");
    } else {
        alert("Clave incorrecta ❌");
    }
}