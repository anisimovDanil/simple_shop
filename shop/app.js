const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');

let cartItemID = 1;

eventListeners();


// all event listeners - прорслушиватель всех событий
function eventListeners() {
	window.addEventListener('DOMContentLoaded', () => { // когда загрузился весь HTML полностью , то
		loadJSON();	// подгружаем JSON	
		loadCart();							
	});
	document.querySelector('.navbar-toggler').addEventListener('click', () => {
		document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
	});

	document.getElementById('cart-btn').addEventListener('click', () => {
		cartContainer.classList.toggle('show-cart-container');
	});

	productList.addEventListener('click', purchaseProduct);

	cartList.addEventListener('click', deleteProdict);

    /*for (let i = 0; i < document.querySelector('.banner').childNodes.length; i++) {
      console.log(document.querySelector('.banner').childNodes[i]);
    }*/
	//console.log(document.querySelector('.banner').classList);

}

function updateCartInfo() {
	let cartInfo = findCartInfo();
	cartCountInfo.innerHTML = cartInfo.productCount;
	cartTotalValue.innerHTML = cartInfo.total;
}

// load product items content from JSON file - загрузка продуктовых "пунктов", содержащихся в JSON файле
function loadJSON() {
	fetch('db.json')
	.then(res => res.json())
	.then(data => {
		let html = "";
		data.forEach(product => {
			html += 
				`<div class="product-item">
					<div class="product-img">
						<img src="${product.imgSrc}" alt="product image">
						<button type="button" class="add-to-cart-btn">
							<i class="fa fa-shopping-cart"></i>Add To Cart
						</button>
					</div>	

					<div class="product-content">
						<h3 class="product-name">${product.name}</h3>
						<span class="product-category">${product.category}</span>
						<p class="product-price">$${product.price}</p>
					</div>				
				</div>`;
		});
		productList.innerHTML = html;
	})
	.catch( error => {
		alert('User live server or local server');
	});
}

function purchaseProduct(e) {
	if(e.target.classList.contains('add-to-cart-btn')){   // если нажали в кнопку "add to cart" с классом "add-to-cart-btn", то true и
		let product = e.target.parentElement.parentElement; // в product добавляем нажатый товар, который гоним в функцию
		getProductInfo(product); 							
	}
}

function getProductInfo(product) {  // функция добавления продукта
	let productInfo = {				// инфа о продукте, взятая из классов
		id: cartItemID,
		imgSrc: product.querySelector('.product-img img').src,
		name: product.querySelector('.product-name').textContent,
		category: product.querySelector('.product-category').textContent,
		price: product.querySelector('.product-price').textContent
	}
	cartItemID++;
	//console.log(productInfo);
	addToCartList(productInfo);
	saveProductStorage(productInfo);
}

function addToCartList(product) {
	const cartItem = document.createElement('div'); // создается div для обортки содержимого товара
	cartItem.classList.add('cart-item'); // название класса div
	cartItem.setAttribute('data-id', `${product.id}`); // атрибут "data-id" и его для различия(?)
	cartItem.innerHTML = 
		`
		<img src="${product.imgSrc}" alt="product image">
		<div class="cart-item-info">
			<h3 class="cart-item-name"${product.name}</h3>
			<span class="cart-item-category">${product.category}</span>
			<span class="cart-item-price">${product.price}</span>
		</div> 

		<button type="button" class="cart-item-del-btn">
			<i class="fa fa-times"></i>
		</button>
		`;										// содержимое div
	cartList.appendChild(cartItem);				// 
}

function saveProductStorage(item) {
	let products = getProductfromStorage();
	products.push(item);
	localStorage.setItem('products', JSON.stringify(products));
	updateCartInfo();
}

function getProductfromStorage() {
	return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
}

function loadCart() {
	let products = getProductfromStorage();
	if(products.length < 1){
		cartItemID = 1;
	}
	else{
		cartItemID = products[products.length - 1].id;
		cartItemID++;
	}
	products.forEach(product => addToCartList(product)); // выводим список выбранных товаров из Хранилища
	updateCartInfo();

}

function findCartInfo() {
	let products = getProductfromStorage();
	let total = products.reduce((accumulator, product) => {
		let price = parseFloat(product.price.substring(1));
		return accumulator += price;
	}, 0); // ноль - начальное значение accumulator, т.е. accumulator = 0;

	return {
		total: total.toFixed(2),
		productCount: products.length
	}
}

function deleteProdict(e) {
	let cartItem;
	if(e.target.tagName === 'BUTTON') {
		cartItem = e.target.parentElement; // parentElement - пишется один раз, так как удаляется только list-item, если продублировать, то будет удален cart-list
		cartItem.remove();
	}
	else if(e.target.tagName === 'I'){
		cartItem = e.target.parentElement.parentElement;
		cartItem.remove();
	}
	
	let products = getProductfromStorage();
	let updateProducts = products.filter( product => {
		return product.id !== parseInt(cartItem.dataset.id);
	});
	localStorage.setItem('products', JSON.stringify(updateProducts));
	updateCartInfo();

}
