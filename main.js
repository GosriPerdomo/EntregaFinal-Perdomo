// main.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('productos.json');
        const data = await response.json();

        const productos = data;

        renderizarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
});

const shopContent = document.getElementById("shopContent");
const verCarro = document.getElementById("verCarro");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//renderizar los productos
async function renderizarProductos(productos) {
    if (!productos || productos.length === 0) {
        console.error('Error: No hay productos para renderizar.');
        return;
    }

    productos.forEach((product) => {
        let content = document.createElement("div");
        content.innerHTML = `
            <h3>${product.nombre}</h3>
            <p>${product.precio}$</p>
            <img src="${product.img}" alt="${product.nombre}" style="width: 200px; height: 150px; object-fit: cover;">
        `;

        //boton comprar en cada producto del array
        let comprar = document.createElement("button");
        comprar.innerText = "comprar";

        content.append(comprar);

        //evento para el botón
        comprar.addEventListener("click", () => {
            //a;ade el producto al carrito y se actualiza en el localStorage
            carrito.push({
                id: product.id,
                img: product.img,
                nombre: product.nombre,
                precio: product.precio,
            });

            //utilizo SweetAlert 
            Swal.fire({
                position: "mid",
                icon: "success",
                title: "Producto Agregado Con Exito",
                showConfirmButton: false,
                timer: 1000
              });

            localStorage.setItem("carrito", JSON.stringify(carrito));
        });

        shopContent.append(content);
    });
}

verCarro.addEventListener("click", async () => {
    await renderizarCarrito();
});
