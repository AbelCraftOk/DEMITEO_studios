function mostrarPestaña(id) {
    document.querySelectorAll('.container').forEach(div => {
        div.style.display = 'none';
    });    
    document.getElementById(id).style.display = 'block';
}
function ObtenerWebhook() {
    const parteA1 = "http";
    const parteB2 = "s://discord.c";
    const parteC3 = "om/api/w";
    const parteD4 = "eb";
    const parteE5 = "ho";
    const parteF6 = "oks";
    const parteG7 = "/14072160617737";
    const parteH8 = "78964/4Y6XLWZgRG_WW";
    const parteI9 = "XY5SK3Ebz94siNnW5t";
    const parteJ10 = "-h0xv-e0tPo1WjG";
    const parteK11 = "oC-QCY2yY6SugYdKRg0WsF";
    const webhook = parteA1 + parteB2 + parteC3 + parteD4 + parteE5 + parteF6 + parteG7 + parteH8 + parteI9 + parteJ10 + parteK11;
    return webhook;
}
function mostrarMenu(id) {
    document.querySelectorAll('.menu-flotante').forEach(div => {
        div.style.display = 'none';
    });    
    document.getElementById(id).style.display = 'block';
}