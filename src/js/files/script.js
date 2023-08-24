// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile, bodyLockToggleCart, bodyUnlockCart, bodyUnlockCartBody, bodyLockCartBody, bodyLock, bodyUnlock } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

//========================================================================================================================================================
window.onload = function () {
   document.addEventListener("click", documentActions);
   function documentActions(e) {
      const targetElement = e.target;

      //SUB-MENU========================================================================================================================================================
      if (window.innerWidth > 768 && isMobile.any()) {
         const arrowMenu = document.querySelectorAll('.menu__item');
         if (!targetElement.closest('.menu__item')) {
            arrowMenu.forEach(function (item) {
               item.classList.remove('_hover');
            });
         } else {
            arrowMenu.forEach(function (item) {
               if (item !== targetElement.closest('.menu__item')) {
                  item.classList.remove('_hover');
               } else {
                  item.classList.toggle('_hover');
               }
            });
         }
      }

      //SEARCH-FROM========================================================================================================================================================
      if (targetElement.classList.contains('search-form__icon')) {
         document.querySelector('.search-form').classList.toggle('_active')
      } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
         document.querySelector('.search-form').classList.remove('_active')
      }

      //SHOM-MORE-TARGET========================================================================================================================================================
      if (targetElement.classList.contains('products__more')) {
         getProducts(targetElement)
         e.preventDefault()
      }

      //ADD CART-HEADER _ACTIVE========================================================================================================================================================
      if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
         if (document.querySelector('.cart-list').children.length > 0) {
            document.querySelector('.cart-header').classList.toggle('_active');
            if (window.innerWidth < 768) {
               bodyLockToggleCart();
            }
         }
         e.preventDefault();
      } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-item-products__button') && !targetElement.classList.contains('products__more') && !targetElement.classList.contains('cart-popup__close')) {
         document.querySelector('.cart-header').classList.remove('_active');
         if (window.innerWidth < 768) {
            bodyUnlockCart();
         }
      }

      //LOCK/UNLOCK FOR CART-HEADER__BODY========================================================================================================================================================
      if (document.querySelector('.cart-header__body')) {
         const cartBody = document.querySelector('.cart-header__body');
         function handleMouseEnter() {
            bodyLock();
         }
         function handleMouseLeave() {
            if (!document.documentElement.classList.contains('popup-show')) {
               bodyUnlock();
            }
         }
         if (!isMobile.any()) {
            cartBody.addEventListener('mouseenter', handleMouseEnter);
            cartBody.addEventListener('mouseleave', handleMouseLeave);
         }
         if (document.querySelector('.cart-list__make-order-btn')) {
            const buttonOrder = document.querySelector('.cart-list__make-order-btn');
            buttonOrder.addEventListener('click', () => {
               bodyUnlock();
               setTimeout(() => {
                  flsModules.popup.open('#cart-popup');
               }, 0)
            });
         }
      }

      //ITEM-PRODUCTS TO CART========================================================================================================================================================
      if (e.target.classList.contains('actions-item-products__button')) {
         let productId = e.target.closest('.item-products').dataset.pid;
         let productBtn = e.target;
         addToCart(productBtn, productId);
         e.preventDefault();
      }

      //BUTTON "+" IN CART
      if (e.target.classList.contains('cart-list__btn_plus')) {
         let productId = e.target.closest('.cart-list__item').dataset.cartId;
         let productBtn = e.target;
         updateCart(productBtn, productId);
         // e.preventDefault();
      }
      //BUTTON "-" IN CART
      if (e.target.classList.contains('cart-list__btn_minus')) {
         let productId = e.target.closest('.cart-list__item').dataset.cartId;
         let productBtn = e.target;
         updateCart(productBtn, productId, false);
         // e.preventDefault();
      }

      // CHANGE INPUT
      if (e.target.classList.contains('cart-list__quantity-number')) {
         let productId = e.target.closest('.cart-list__item').dataset.cartId;
         let productBtn = e.target;
         let cartProduct = document.querySelector(`[data-cart-id="${productId}"]`);
         e.target.addEventListener('input', () => {
            getPrice(cartProduct, productId, productBtn, false, false, true)
         });
      }

      //BUTTON "DELETE" IN CART
      if (e.target.classList.contains('cart-list__delete')) {
         let productBtn = e.target;
         e.preventDefault();
         removeCart(productBtn);
      }
      //BUTTON "ORDER" IN CART
      if (e.target.classList.contains('cart-list__make-order-btn')) {
         let productBtn = e.target;
         makeOrder(productBtn);
      }
   }

   //TRACKING WIDTH FOR OUTPUT ITEMS========================================================================================================================================================
   let items = 5;
   const checkWindowsInnerWidth = () => {
      switch (true) {
         case window.innerWidth > 1266:
            items = 5;
            break;
         case window.innerWidth < 1266 && window.innerWidth > 932:
            items = 4;
            break;
         case window.innerWidth < 932 && window.innerWidth > 619:
            items = 3;
            break;
         case window.innerWidth < 619 && window.innerWidth > 319:
            items = 2;
            break;
         default:
            items = 5
            break;
      }
   }
   checkWindowsInnerWidth();
   function debounce(func, delay) {
      let timeoutId;
      return function (...args) {
         checkWindowsInnerWidth();
         clearTimeout(timeoutId);
         timeoutId = setTimeout(() => {
            func.apply(this, args);
         }, delay);
      };
   }
   function windiwResize() {
      checkWindowsInnerWidth();
   }
   const debouncedResize = debounce(windiwResize, 100);
   window.addEventListener('resize', debouncedResize);

   //SHOW-MORE========================================================================================================================================================
   const loadMoreBtn = document.querySelector('.products__more');
   const productsItems = document.querySelector('.products__items');

   //REQUEST TO "SERVER" FOR GET JSON FILE========================================================================================================================================================
   async function getProducts(loadMoreBtn) {
      if (!loadMoreBtn.classList.contains('_hold')) {
         loadMoreBtn.classList.add('_hold');
         const file = "files/json/products.json";
         let response = await fetch(file, {
            method: "GET"
         });
         if (response.ok) {
            let result = await response.json();
            loadProducts(result);
            const visItems = [...productsItems.children]
            setTimeout(() => {
               visItems.forEach(el => el.classList.remove('is-visible'))
            }, 50);
            loadMoreBtn.classList.remove('_hold');[]
         } else {
            alert(`Error with json file adress: ${file}`);
         }
      }
   }

   //LOAD-PRODUCTS========================================================================================================================================================
   function loadProducts(data) {
      let currentLastProductBlockId = productsItems.lastElementChild.dataset.pid;
      data.products.forEach((item) => {
         if (item.id > +currentLastProductBlockId && item.id < +currentLastProductBlockId + items) {
            const productId = item.id;
            const productUrl = item.url;
            const productImage = item.image;
            const productTitle = item.title;
            const productText = item.text;
            const productPrice = item.price;
            const productOldPrice = item.priceOld;
            const productShareUrl = item.shareUrl;
            const productLikeUrl = item.likeUrl;
            const productLabels = item.labels;

            let productTemplateStart = `<article data-pid="${productId}" class="products__item item-products is-visible">`;
            let productTemplateEnd = `</article>`;

            let productTemplateLabels = '';
            if (productLabels) {
               let productTemplateLabelsStart = `<div class="item-products__labels">`;
               let productTemplateLabelsEnd = `</div>`;
               let productTemplateLabelsContent = '';

               productLabels.forEach(labelItem => {
                  productTemplateLabelsContent += `<div class="item-products__label item-products__label_${labelItem.type}">${labelItem.value}</div>`;
               });

               productTemplateLabels += productTemplateLabelsStart;
               productTemplateLabels += productTemplateLabelsContent;
               productTemplateLabels += productTemplateLabelsEnd;
            }

            let productTemplateImage = `
   <a href="${productUrl}" class="item-products__image-ibg">
      <img src="img/products/${productImage}" alt="${productTitle}">
   </a>
`;

            let productTemplateBodyStart = `<div class="item-products__body">`;
            let productTemplateBodyEnd = `</div>`;

            let productTemplateContent = `
   <div class="item-products__content">
      <h3 class="item-products__title">${productTitle}</h3>
      <div class="item-product__text">${productText}</div>
   </div>
`;

            let productTemplatePrices = '';
            let productTemplatePricesStart = `<div class="item-products__prices">`;
            let productTemplatePricesCurrent = `<div class="item-products__price">${productPrice}</div>`;
            let productTemplatePricesOld = `<div class="item-products__price item-products__price_old">${productOldPrice}</div>`;
            let productTemplatePricesEnd = `</div>`;

            productTemplatePrices = productTemplatePricesStart;
            productTemplatePrices += productTemplatePricesCurrent;
            if (productOldPrice) {
               productTemplatePrices += productTemplatePricesOld;
            }
            productTemplatePrices += productTemplatePricesEnd;

            let productTemplateActions = `
   <div class="item-products__actions actions-item-products">
      <div class="actions-item-products__body">
         <button class="actions-item-products__button button button_originally button_white">Add to cart</button>
         <button class="actions-item-products__link _icon-share">Share</button>
         <button class="actions-item-products__link _icon-favorite">Like</button>
      </div>
   </div>
`;

            let productTemplateBody = '';
            productTemplateBody += productTemplateBodyStart;
            productTemplateBody += productTemplateContent;
            productTemplateBody += productTemplatePrices;
            productTemplateBody += productTemplateActions;
            productTemplateBody += productTemplateBodyEnd;

            let productTemplate = '';
            productTemplate += productTemplateStart;
            productTemplate += productTemplateLabels;
            productTemplate += productTemplateImage;
            productTemplate += productTemplateBody;
            productTemplate += productTemplateEnd;


            // GET ID FROM LAST ELEMENT
            const lastElement = data.products[data.products.length - 1];
            productsItems.insertAdjacentHTML('beforeend', productTemplate);
            if (lastElement.id == productId) {
               loadMoreBtn.remove();
            }
         }
      });

   }

   //CART========================================================================================================================================================

   function addToCart(productBtn, productId) {
      if (!productBtn.classList.contains('_hold')) {
         productBtn.classList.add('_hold');
         productBtn.classList.add('_fly');

         const cart = document.querySelector('.cart-header__icon');
         const product = document.querySelector(`[data-pid="${productId}"]`);
         const productImage = product.querySelector('.item-products__image-ibg');

         const productImageFly = productImage.cloneNode(true);

         const productImageFlyWidth = productImage.offsetWidth;
         const productImageFlyHeight = productImage.offsetHeight;
         const productImageFlyTop = productImage.getBoundingClientRect().top;
         const productImageFlyLeft = productImage.getBoundingClientRect().left;

         productImageFly.setAttribute('class', '_flyImage-ibg');
         productImageFly.style.cssText =
            `
			left: ${productImageFlyLeft}px;
			top: ${productImageFlyTop}px;
			width: ${productImageFlyWidth}px;
			height: ${productImageFlyHeight}px;
		`;

         document.body.append(productImageFly);

         const cartFlyLeft = cart.getBoundingClientRect().left;
         const cartFlyTop = cart.getBoundingClientRect().top;

         productImageFly.style.cssText =
            `
			left: ${cartFlyLeft}px;
			top: ${cartFlyTop}px;
			width: 0px;
			height: 0px;
			opacity:0;
		`;

         productImageFly.addEventListener('transitionend', function () {
            if (productBtn.classList.contains('_fly')) {
               productImageFly.remove();
               updateCart(productBtn, productId);
               productBtn.classList.remove('_fly');
            }
         });
      }
   }
   
   function updateCart(productBtn, productId, productAdd = true) {
      const cartIcon = document.querySelector('.cart-header__icon');
      const cartQuantity = cartIcon.querySelector('span');
      const cartProduct = document.querySelector(`[data-cart-id="${productId}"]`);
      if (productAdd) {
         if (cartQuantity) {
            cartQuantity.innerHTML = ++cartQuantity.innerHTML;
         } else {
            cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
         }
         getPrice(cartProduct, productId, productBtn);
      } else {
         if (!(cartQuantity.innerHTML == 1 || 0)) {
            cartQuantity.innerHTML = --cartQuantity.innerHTML;
         } else {
            cartQuantity.remove();
         }
         getPrice(cartProduct, productId, productBtn, false);
      }
   }

   function caclQuantityCart() {
      const cartIcon = document.querySelector('.cart-header__icon');
      const cartQuantity = cartIcon.querySelector('span');
      const number = document.querySelectorAll('.cart-list__quantity-number');

      let totalSum = 0;
      number.forEach(input => {
         const value = parseFloat(input.value);
         if (!isNaN(value)) {
            totalSum += value;
         }
      });

      if (cartQuantity) {
         cartQuantity.innerHTML = totalSum;
      }
   }

   async function getPrice(cartProduct, productId, productBtn, productAdd = true, makeOrder = false, input = false) {
      const cartList = document.querySelector('.cart-list');
      const file = "files/json/products.json";
      let responce = await fetch(file, {
         method: 'GET',
      });
      if (responce.ok) {
         let result = await responce.json();
         //Отправка данных о цене при подтверждении заказа
         if (makeOrder) {
            let prices = [];
            productId.forEach((item) => {
               let price = result.products.find((product) => product.id == item).price;
               prices.push(price.slice(2).trim());
            })
            return prices;
         }

         //Отправка данных о цене при добавлении / удалении товара в корзину
         let cartProductPrice = result.products.find(item => item.id == productId).price;
         cartProductPrice = cartProductPrice.slice(2).replace(/\./g, '').trim();
         if (productAdd) {
            addPriceToCart(+cartProductPrice, cartProduct, productId, productBtn, cartList, true);
         } else if (!productAdd && input) {
            addPriceToCart(+cartProductPrice, cartProduct, productId, productBtn, cartList, false);
         }
         else if (!productAdd) {
            removePriceFromCart(+cartProductPrice, cartProduct, productBtn, cartList, true);
         }
         let productsInCart = cartList.querySelectorAll('.cart-list__item');
         let currentPrices = [];
         productsInCart.forEach((item) => {
            let price = result.products.find(product => product.id == item.dataset.cartId).price;
            price = price.slice(2).replace(/\./g, '').trim();
            currentPrices.push(price);
         });
         makeTotalPrice(cartList, currentPrices, productBtn);
      } else {
         alert('Ошибка загрузки цены товара');
      }
   }
   
   function addPriceToCart(cartProductPrice, cartProduct, productId, productBtn, cartList, changeNum = false) {
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const cartProductImg = product.querySelector('.item-products__image-ibg').innerHTML;
      const cartPproductName = product.querySelector('.item-products__title').innerHTML;
      if (!cartProduct) {
         const cartProductContent = `

<div class="cart-list__img-wrapper"><a href="" class="cart-list__img-ibg">${cartProductImg}</a><div class="cart-list__price-item">${cartProductPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0, })}</div></div>


<div class="cart-list__body">
   <a href="" class="cart-list__name">${cartPproductName}</a>
   <div class="cart-list__quantity"><div class="cart-list__price">${cartProductPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0, })}</div><button class="cart-list__btn cart-list__btn_plus">+</button><input type='number' value="1" class='cart-list__quantity-number'><button class="cart-list__btn cart-list__btn_minus">-</button></div>
   <a href="" class="cart-list__delete">Delete</a>
</div>`;
         cartList.insertAdjacentHTML('beforeend', `<li data-cart-id="${productId}" class="cart-list__item">${cartProductContent}</li>`);
      } else {
         if (changeNum) {
            cartProduct.querySelector('.cart-list__quantity input').value++;
         }
         let sum = cartProductPrice * cartProduct.querySelector('.cart-list__quantity input').value;
         cartProduct.querySelector('.cart-list__price').innerHTML = sum.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
      }

      caclQuantityCart()
      productBtn.classList.remove('_hold');
   }
   
   function removePriceFromCart(cartProductPrice, cartProduct, productBtn, cartList, changeNum = false) {
      if (changeNum) {
         cartProduct.querySelector('.cart-list__quantity input').value--;
      }
      let sum = cartProductPrice * cartProduct.querySelector('.cart-list__quantity input').value;
      cartProduct.querySelector('.cart-list__price').innerHTML = sum.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
      if (cartProduct.querySelector('.cart-list__quantity input').value == 0) {
         cartList.removeChild(cartProduct);
      }
      productBtn.classList.remove('_hold');
   }

   function makeTotalPrice(cartList, currentPrices, productBtn) {
      let totalPrice = 0;
      const cartWrapper = document.querySelector('.cart-header__list-wrapper');
      for (let i = 0; i < currentPrices.length; i++) {
         let totalPriceItem = currentPrices[i] * cartList.querySelectorAll('.cart-list__quantity input')[i].value;
         totalPrice += totalPriceItem;
      }
      if (!totalPrice) {
         if (document.querySelector('.cart-list__total-price')) {
            document.querySelector('.cart-list__total-price').remove();
            document.querySelector('.cart-list__make-order').remove();
         }
         cartWrapper.insertAdjacentHTML('beforeend', `<div class="cart-list__total-price">Total: <span>${totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', symbol: "Rp", maximumFractionDigits: 0, })}</span></div><div class="cart-list__make-order"><button class="cart-list__make-order-btn button button_originally">Make order</button></div>`);
         if (cartList.querySelectorAll('.cart-list__item').length == 0) {
            removeCart(productBtn);
         }
      } else {
         if (document.querySelector('.cart-list__total-price')) {
            document.querySelector('.cart-list__total-price').remove();
            document.querySelector('.cart-list__make-order').remove();
         }
         cartWrapper.insertAdjacentHTML('beforeend', `<div class="cart-list__total-price">Total: <span>${totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', symbol: "Rp", maximumFractionDigits: 0, })}</span></div><div class="cart-list__make-order"><button class="cart-list__make-order-btn button button_originally">Make order</button></div>`);
      }
   }

   function removeCart(productBtn, order = false) {
      const cartList = document.querySelector('.cart-list')
      const item = productBtn.closest('.cart-list__item');
      if (item) {
         item.remove();
      }
      if (cartList.childElementCount == 0) {
         if (document.querySelector('.cart-header__icon span')) {
            document.querySelector('.cart-header__icon span').remove();
         }
         document.querySelector('.cart-header').classList.remove('_active')
      }
      if (order) {
         const items = document.querySelectorAll('.cart-list__item')
         while (items.firstChild) {
            items.removeChild(items.firstChild);
         }
         if (document.querySelector('.cart-header__icon span')) {
            document.querySelector('.cart-header__icon span').remove();
         }
         document.querySelector('.cart-header').classList.remove('_active')
      }

      caclQuantityCart();
   }
   
   function makeOrder(productBtn) {
      if (document.querySelectorAll('.ordered-table-popup__item').length > 0) {
         document.querySelectorAll('.ordered-table-popup__item').forEach((item) => {
            item.remove();
         });
         document.querySelector('.ordered-table-popup__total').remove();;
      }
      const cartList = document.querySelector('.cart-list');
      const cartProducts = cartList.querySelectorAll('.cart-list__item');
      const cartPopup = document.getElementById('cart-popup');
      const popupTable = cartPopup.querySelector('.ordered-table-popup');
      let productsId = [];
      cartProducts.forEach((item) => {
         productsId.push(item.dataset.cartId);
      })
      let totalPrice = 0;
      let prices = getPrice(cartProducts, productsId, productBtn, true, true);
      prices.then((data) => {
         for (let i = 0; i < data.length; i++) {
            let price = +data[i].replace(/\./g, '');
            const cartProductImg = cartProducts[i].querySelector('.cart-list__img-ibg').innerHTML;
            let productName = cartProducts[i].querySelector('.cart-list__name').innerHTML;
            let productQuantity = cartProducts[i].querySelector('.cart-list__quantity input').value;
            let totalProductPrice = price * productQuantity;
            totalPrice += +totalProductPrice;
            popupTable.insertAdjacentHTML('beforeend', `<div class="ordered-table-popup__item">
            <div class="ordered-table-popup__img-wrapper">
            <div class="ordered-table-popup__name" >${productName}</div>
            <div class="ordered-table-popup__img-ibg" >${cartProductImg}</div>
            </div>
            <div class="ordered-table-popup__price">${price.toLocaleString('id-ID', { style: 'currency', symbol: "Rp", currency: 'IDR', maximumFractionDigits: 0, })}</div>
            <div class="ordered-table-popup__quantity">${productQuantity}</div>
            <div class="ordered-table-popup__total-product-price">${totalProductPrice.toLocaleString('id-ID', { maximumFractionDigits: 0, })}</div>
         </div>`);
            if (i == data.length - 1) {
               popupTable.insertAdjacentHTML('beforeend', `<div class="ordered-table-popup__total">Total: ${totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', symbol: "Rp", maximumFractionDigits: 0, })}</div>`);
            }
         }
      });
      const acceptOrder = document.querySelector('.cart-popup__button')
      acceptOrder.addEventListener('click', function (e) {
         for (let i = 0; i < cartProducts.length; i++) {
            cartProducts[i].remove();
         }
         removeCart(productBtn, true);
         e.preventDefault();
      });
   }

   //Gallery========================================================================================================================================================
   const furniture = document.querySelector('.furniture__body');
   if (furniture && !isMobile.any()) {
      const furnitureItems = document.querySelector('.furniture__items');
      const furnitureColumn = document.querySelectorAll('.furniture__column');

      // Скорость анимации
      const speed = furniture.dataset.speed;

      // Объявление переменных
      let positionX = 0;
      let coordXprocent = 0;

      function setMouseGalleryStyle() {
         let furnitureItemsWidth = 0;
         furnitureColumn.forEach(element => {
            furnitureItemsWidth += element.offsetWidth;
         });

         const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
         const distX = Math.floor(coordXprocent - positionX);

         positionX = positionX + (distX * speed);
         let position = furnitureDifferent / 200 * positionX;

         furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

         if (Math.abs(distX) > 0) {
            requestAnimationFrame(setMouseGalleryStyle);
         } else {
            furniture.classList.remove('_init');
         }
      }
      furniture.addEventListener("mousemove", function (e) {
         // Получение ширины
         const furnitureWidth = furniture.offsetWidth;

         // Ноль по середине
         const coordX = e.pageX - furnitureWidth / 2;

         // Получаем проценты
         coordXprocent = coordX / furnitureWidth * 200;

         if (!furniture.classList.contains('_init')) {
            requestAnimationFrame(setMouseGalleryStyle);
            furniture.classList.add('_init');
         }
      });
   }
}