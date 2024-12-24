const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItensConteiner = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const adressWarn = document.getElementById('adress-warn');

//Array produtos
let cart = [];

/** Manipulando o modal do carrinho */
// Abrindo Modal para visualização do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechando modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

//Fechando modal quando clicar no botão fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})
/** FIM -> Manipulando o modal do carrinho */

/** Adicionando produto no carrinho */

menu.addEventListener("click", function (e) {
    //console.log(e.target)
    let parentButton = e.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //adicionando no carrinho
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // Se o item já existe ele apenas aumenta a quantidade ao invés de adicionar um novo
        existingItem.quantity++
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal()
}

// função atualizar carrinho
function updateCartModal() {
    cartItensConteiner.innerHTML = ""

    let total = 0;

    cart.forEach(item => {
        console.log(item)
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col"),

            cartItemElement.innerHTML = `
            <div class="flex items-center justify-between border border-b-[3px] border-gray-400 p-2">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        `;

        total += item.price * item.quantity;

        cartItensConteiner.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerText = cart.length
}

//Removendo itens do carrinho
cartItensConteiner.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-from-cart-btn")) {
        const name = e.target.getAttribute("data-name");
        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity--;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }
}
/** FIM -> Adicionando produto no carrinho */

/** Inserindo endereço de entrega */
addressInput.addEventListener("input", function (e) {
    let inputValue = e.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Restaurante fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            }
        }).showToast();
        return
    }

    if (cart.length === 0) {
        return;
    }

    if (addressInput.value === "") {
        adressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviando o peido para o Whts
    const cartItems = cart.map((item) => {
        return (
            `${item.name}, Quantidade: (${item.quantity}), Preco: R$${item.price}) |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "49999345088"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})

//Verifica e manipua o card do hrário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}