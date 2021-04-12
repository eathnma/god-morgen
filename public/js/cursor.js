const cursor = document.querySelector(".cursor");

function moveMouse(e) {
    cursor.style.top = (e.pageY - 30) + "px";
    cursor.style.left = (e.pageX - 30)+ "px";
}

window.addEventListener("mousemove", moveMouse);
