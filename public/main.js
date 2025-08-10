document.getElementById('downloadBtn').addEventListener('click', () => {
    const url = document.getElementById('url').value.trim();
    const type = document.getElementById('type').value;
    const quality = document.getElementById('quality').value;

    if (!url) {
        alert("Por favor ingresa un enlace de YouTube.");
        return;
    }

    window.location.href = `/download?url=${encodeURIComponent(url)}&type=${type}&quality=${quality}`;
});
