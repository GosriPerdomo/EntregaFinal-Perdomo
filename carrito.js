// carrito.js

const modalContainer = document.getElementById("modal-container");

async function renderizarCarrito() {
    modalContainer.innerHTML = "";

    //creo elementos HTML para mostrar el contenido del carrito
    const modalWrapper = document.createElement("div");
    modalWrapper.className = "modal-wrapper";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h1>Carrito.</h1>
        <button class="modal-button" id="cerrarModal">X</button>
    `;

    modalContent.appendChild(modalHeader);

    //agrupa los productos dentro del carrito para que no se repitan
    const groupedProducts = carrito.reduce((acc, product) => {
        const existingProduct = acc.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.cantidad++;
        } else {
            acc.push({ ...product, cantidad: 1 });
        }
        return acc;
    }, []);

    groupedProducts.forEach((product) => {
        let carritoContent = document.createElement("div");
        carritoContent.className = "carrito-item";
        carritoContent.innerHTML = `
            <img src="${product.img}" alt="${product.nombre}" class="carrito-img">
            <div class="carrito-info">
                <h3>${product.nombre}</h3>
                <p>${product.precio}$ - Cantidad: ${product.cantidad}</p>
            </div>
        `;

        const eliminarBoton = document.createElement("button");
        eliminarBoton.innerText = "Eliminar";
        eliminarBoton.className = "eliminar-producto";
        eliminarBoton.setAttribute("data-producto-id", product.id);
        carritoContent.appendChild(eliminarBoton);

        eliminarBoton.addEventListener("click", () => {
            eliminarProducto(product.id);
        });

        modalContent.appendChild(carritoContent);
    });

    //calcula el total
    const total = carrito.reduce((acc, el) => acc + el.precio, 0);

    //elemento total a pagar
    const totalCompra = document.createElement("div");
    totalCompra.className = "total-content";
    totalCompra.innerHTML = `Total a pagar: ${total} $`;
    modalContent.appendChild(totalCompra);

    //boton de checkout 
    const checkoutButton = document.createElement("button");
    checkoutButton.innerText = "Checkout";
    checkoutButton.className = "checkout-button";
    checkoutButton.disabled = carrito.length === 0; 
    modalContent.appendChild(checkoutButton);

    //boton para vaciar el carrito y su evento
    const vaciarCarritoButton = document.createElement("button");
    vaciarCarritoButton.innerText = "Vaciar Carrito";
    vaciarCarritoButton.className = "vaciar-carrito-button";
    vaciarCarritoButton.disabled = carrito.length === 0; 
    modalContent.appendChild(vaciarCarritoButton);

    vaciarCarritoButton.addEventListener("click", () => {
        vaciarCarrito();
    });

    modalWrapper.appendChild(modalContent);
    modalContainer.appendChild(modalWrapper);
    modalContainer.style.display = "flex";

    //cierre de modal
    const cerrarModal = document.getElementById("cerrarModal");
    cerrarModal.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    checkoutButton.addEventListener("click", () => {
        const mensajeCompra = document.createElement("p");
        mensajeCompra.innerText = "¡Gracias por tu compra!";

        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));

        modalContent.innerHTML = "";
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(mensajeCompra);
        modalContainer.style.display = "flex";
    });
}

//funcion para eliminar productos desde el carrito / sweetalert 
function eliminarProducto(id) {
    Swal.fire({
        title: "Estas seguro que quieres quitar este producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = carrito.filter(producto => producto.id !== id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderizarCarrito();

            Swal.fire({
                title: "Hecho!",
                text: "el producto fue retirado del carrito.",
                icon: "success"
            });
        }
    });
}

//funcion para vaciar todo el carrito de golpe / sweetalert
function vaciarCarrito() {
    Swal.fire({
        title: "¿estas seguro que deseas vaciar el carrito?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            localStorage.removeItem("carrito");
            renderizarCarrito();

            Swal.fire({
                title: "Carrito vaciado",
                text: "el carrito ha sido vaciado exitosamente.",
                icon: "success"
            });
        }
    });
}
