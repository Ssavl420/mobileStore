import { deliveryCost, activePage } from "../variables/variables.js"

export class View {
   constructor({ onReadProductData, onAddProductToCart, onPlusQuantity, onMinusQuantity, onChangeMethodPay, onChangeDelivery, onCheckForms, onCheckData, onOrderFromFB }) {
      this.onReadProductData = onReadProductData
      this.onAddProductToCart = onAddProductToCart
      this.onPlusQuantity = onPlusQuantity
      this.onMinusQuantity = onMinusQuantity
      this.onChangeMethodPay = onChangeMethodPay
      this.onChangeDelivery = onChangeDelivery
      this.onCheckForms = onCheckForms
      this.onCheckData = onCheckData
      this.onOrderFromFB = onOrderFromFB

      this.popupWrap = document.querySelector('#popup__wrap')
      this.productCardWrap = document.querySelector('#productCardWrap')
      this.cartItems = document.querySelector('#cartItems')
      this.ordersItems = document.querySelector('#ordersItems')
      this.popupDelivery = document.querySelector('#popup__delivery')
      this.popupPayment = document.querySelector('#popup__payment')
      this.popupError = document.querySelector('#popup__error')
      this.btnAddress = document.querySelector('#btnAddress')
      this.btnPayment = document.querySelector('#btnPayment')
      this.closePopupBtn = document.querySelectorAll('#closePopup')
      this.basketItems = document.querySelector('#basketItems')
      this.cartSum = document.querySelector('#sum')
      this.costSum = document.querySelector('#costSum')

      this.userName = document.querySelector('#userName')
      this.userAddress = document.querySelector('#userAddress')
      this.userCity = document.querySelector('#userCity')
      this.userPhone = document.querySelector('#userPhone')

      this.userNameInput = document.querySelector('#userNameInput')
      this.userAddressInput = document.querySelector('#userAddressInput')
      this.userCityInput = document.querySelector('#userCityInput')
      this.userPhoneInput = document.querySelector('#userPhoneInput')
      // this.deliveryFormBtn = document.querySelector('#deliveryForm')
      this.placeOrderBtn = document.querySelector('#placeOrder')
      this.errorBtn = document.querySelector('#errorBtn')
      this.deliveryForm = document.querySelector('#deliveryForm')
      if (this.deliveryForm) this.deliveryForm.addEventListener('click', this.checkFormsToOrder)
      if (this.errorBtn) this.errorBtn.addEventListener('click', this._openDeliveryForm)
      // if (this.deliveryFormBtn) this.deliveryFormBtn.addEventListener('click', this.deliveryForm)
      if (this.placeOrderBtn) this.placeOrderBtn.addEventListener('click', this.checkDataToOrder)


      this.payCard = document.querySelector('#payCard')
      this.payCash = document.querySelector('#payCash')
      this.payFormBtn = document.querySelector('#payForm')
      if (this.payFormBtn) this.payFormBtn.addEventListener('click', this.payForm)

      this.goodsList = document.querySelector('#cardsItems')

      if (this.btnAddress) this.btnAddress.addEventListener('click', this._openPopup)
      if (this.btnPayment) this.btnPayment.addEventListener('click', this._openPopup)
      if (this.popupWrap) this.popupWrap.addEventListener('click', this._closePopup)
      if (this.closePopupBtn.length > 0) {
         for (let index = 0; index < this.closePopupBtn.length; index++) {
            const el = this.closePopupBtn[index];
            el.addEventListener("click", this._closePopup);
         }
      }
   }

   // deliveryForm = () => {
   //    // console.log('view.deliveryForm')

   //    const name = this.userNameInput.value
   //    const address = this.userAddressInput.value
   //    const city = this.userCityInput.value
   //    const phone = this.userPhoneInput.value

   //    this.onChangeDelivery(name, address, city, phone)
   // }

   renderDelivery = (deliveryProps) => {
      // console.log('view.renderDelivery')

      if (!deliveryProps) return

      this.userName.innerHTML = deliveryProps.name
      this.userAddress.innerHTML = deliveryProps.address
      this.userCity.innerHTML = deliveryProps.city
      this.userPhone.innerHTML = deliveryProps.phone
   }

   payForm = () => {
      // console.log('view.payForm')

      let methodPay = null

      if (this.payCard.checked) methodPay = 'Card'
      if (this.payCash.checked) methodPay = 'Cash'

      this.onChangeMethodPay(methodPay)
   }

   renderPayForm = (methodPayLS) => {
      // console.log('view.renderPayForm')

      const methodImage = document.querySelector('#methodImage')
      const methodText = document.querySelector('#methodText')

      if (methodPayLS == 'Card') {         
         methodText.innerHTML = 'Оплата картой при получении'
         methodImage.setAttribute('src', '/pay_card.e9ec8a00.svg')
      }
      if (methodPayLS == 'Cash') {
         methodText.innerHTML = 'Оплата наличными при получении'
         methodImage.setAttribute('src', '/pay_cash.58bc8e80.png')
      }
   }

   _openProductCard = () => {
      // console.log('view._openProductCard')

      let id = null;

      if (event.target.id.length > 5) {id = event.target.id}
      if (event.target.parentNode.id.length > 5) {id = event.target.parentNode.id}
      
      this.onReadProductData(id)
   }

   _addProductToCart = () => {
      // console.log('view._addProductToCart')

      let id = event.target.id
      // console.warn(event.target.id)
      this.onAddProductToCart(id)
   }

   renderProductCard = (product) => {
      // console.warn('view.renderProductCard')

      if (!product) {
         console.error('Нет данных для рендера')

         document.querySelector('.content').style.borderRight = 'none'
         document.querySelector('.order__section').style.display = 'none'
         
         this.productCardWrap.innerHTML = ''

         let error = document.createElement('p')
         error.className = 'error'
         error.innerHTML = 'Упс, ошибка. Такого товара нет.'
         this.productCardWrap.appendChild(error)
      return}

      this.productCardWrap.innerHTML = ''

      let productCart = document.createElement('div')
      productCart.className = 'product__card'
      this.productCardWrap.appendChild(productCart)

      let productImageWrap = document.createElement('div')
      productImageWrap.className = 'product__image'
      productCart.appendChild(productImageWrap)

      let productImage = document.createElement('img')
      productImage.setAttribute('src', `${product.imageURL}`)
      productImage.setAttribute('alt', `${product.title}`)
      productImageWrap.appendChild(productImage)

      let productTextContent = document.createElement('div')
      productTextContent.className = 'product__textcontent'
      productCart.appendChild(productTextContent)

      let productTitle = document.createElement('p')
      productTitle.className = 'product__title'
      productTitle.innerHTML = `${product.title}`
      productTextContent.appendChild(productTitle)

      let productModel = document.createElement('p')
      productModel.className = 'product__model'
      productModel.innerHTML = `${product.description.miniDescription}`
      productTextContent.appendChild(productModel)

      let productRatingWrap = document.createElement('div')
      productRatingWrap.className = 'product__rating'
      productTextContent.appendChild(productRatingWrap)

      let productRatingStars = document.createElement('div')
      productRatingStars.className = 'rating__stars'
      productRatingWrap.appendChild(productRatingStars)

      let ratingStar1 = document.createElement('img')
      ratingStar1.setAttribute('src', '/star.70726630.svg')
      productRatingStars.appendChild(ratingStar1)

      let ratingStar2 = document.createElement('img')
      ratingStar2.setAttribute('src', '/star.70726630.svg')
      productRatingStars.appendChild(ratingStar2)

      let ratingStar3 = document.createElement('img')
      ratingStar3.setAttribute('src', '/star.70726630.svg')
      productRatingStars.appendChild(ratingStar3)

      let ratingStar4 = document.createElement('img')
      ratingStar4.setAttribute('src', '/star.70726630.svg')
      productRatingStars.appendChild(ratingStar4)

      let ratingStar5 = document.createElement('img')
      ratingStar5.setAttribute('src', '/star50.310d6162.svg')
      productRatingStars.appendChild(ratingStar5)

      let ratingText = document.createElement('p')
      ratingText.className = 'rating__text'
      ratingText.innerHTML = '4.5 / 5'
      productRatingWrap.appendChild(ratingText)

      let productPrice = document.createElement('p')
      productPrice.className = 'product__price'
      productPrice.innerHTML = `${product.price.currency} ${product.price.cost}`
      productTextContent.appendChild(productPrice)

      let productShortDescription = document.createElement('p')
      productShortDescription.className = 'product__shortdescription'
      productShortDescription.innerHTML = `${product.description.cardShortDescription}`
      productTextContent.appendChild(productShortDescription)

      let productBtnWrap = document.createElement('div')
      productBtnWrap.className = 'product__btn btn'
      productBtnWrap.setAttribute('id', `${product.id}`)
      productBtnWrap.addEventListener('click', this._addProductToCart)
      productTextContent.appendChild(productBtnWrap)

      let btnPicture = document.createElement('div')
      btnPicture.className = 'product__btn_picture'
      btnPicture.setAttribute('id', `${product.id}`)
      productBtnWrap.appendChild(btnPicture)

      let btnText = document.createElement('p')
      btnText.className = 'cart__btn_text'
      btnText.setAttribute('id', `${product.id}`)
      btnText.innerHTML = 'В корзину'
      productBtnWrap.appendChild(btnText)

      let productDescription = document.createElement('div')
      productDescription.className = 'product__description'
      this.productCardWrap.appendChild(productDescription)

      let descriptionTitle = document.createElement('p')
      descriptionTitle.className = 'description__title'
      descriptionTitle.innerHTML = 'Описание'
      productDescription.appendChild(descriptionTitle)

      let descriptionText = document.createElement('p')
      descriptionText.className = 'description__text'
      descriptionText.innerHTML = `${product.description.cardDescription}`
      productDescription.appendChild(descriptionText)
   }

   renderProducts = (listOfGoods) => {
      // console.log('view.renderProducts')

      if (!this.goodsList) return

      this.goodsList.innerHTML = ''
      for (let i =0; i < listOfGoods.length; i++) {
         let product = document.createElement('li')
         product.className = 'card__item'
         product.setAttribute('id', i)
         this.goodsList.appendChild(product)

         let productImageWrap = document.createElement('a')
         productImageWrap.className = 'item__picture-wrap'
         productImageWrap.setAttribute('id', `${listOfGoods[i].id}`)
         productImageWrap.addEventListener('click', this._openProductCard)
         productImageWrap.setAttribute('href', './productСard.html')
         product.appendChild(productImageWrap)

         let productImage = document.createElement('img')
         productImage.className = 'item__picture'
         productImage.setAttribute('src', `${listOfGoods[i].imageURL}`)
         productImage.setAttribute('alt', `${listOfGoods[i].title}`)
         productImageWrap.appendChild(productImage)

         let productDescription = document.createElement('div')
         productDescription.className = 'item__description'
         product.appendChild(productDescription)

         let productTitle = document.createElement('p')
         productTitle.className = 'item__title'
         productTitle.innerText = `${listOfGoods[i].title}`
         productDescription.appendChild(productTitle)

         let productFeature = document.createElement('p')
         productFeature.className = 'item__feature'
         productFeature.innerText = `${listOfGoods[i].description.miniDescription}`
         productDescription.appendChild(productFeature)

         let productPriceWrap = document.createElement('div')
         productPriceWrap.className = 'item__price'
         productDescription.appendChild(productPriceWrap)

         let productPrice = document.createElement('span')
         productPrice.className = 'price'
         productPrice.innerText = `${listOfGoods[i].price.currency} ${listOfGoods[i].price.cost}`
         productPriceWrap.appendChild(productPrice)

         let btnAddProductToCart = document.createElement('div')
         btnAddProductToCart.className = 'price__btn'
         btnAddProductToCart.setAttribute('id', `${listOfGoods[i].id}`)
         btnAddProductToCart.addEventListener('click', this._addProductToCart)
         productPriceWrap.appendChild(btnAddProductToCart)
      }
   }

   renderOrders = (orders) => {
      // console.log('view.renderOrders')

      if (!orders || orders.length < 1) {
         document.querySelector('.orders').style.display = 'none'
         return
      }

      this.ordersItems.innerHTML = ''

      orders.forEach(element => {
         let orderNumber = document.createElement('li')
         orderNumber.className = 'order__item'
         orderNumber.setAttribute('id', element.number)
         // orderNumber.innerHTML = `# ${element.number}`
         this.ordersItems.appendChild(orderNumber)
         orderNumber.addEventListener('click', () => {this.onOrderFromFB(element.number)})
         let link = document.createElement('a')
         link.className = 'order__item'
         link.innerHTML = `# ${element.number}`
         orderNumber.appendChild(link)
      })
      

      // console.warn(orders)
   }

   // onOrderFromFB = (id) => {
   //    // console.log('view.onOrderFromFB')

   //    this.(id)
   // }

   renderCart = (cartLS) => {
      // console.log('view.renderCart', cartLS)

      this.cartItems.innerHTML = ''

      cartLS.forEach(product => {

         let cartItem = document.createElement('li')
         cartItem.className = 'cart__item'
         cartItem.setAttribute('id', `${product.id}`)
         cartItem.setAttribute('title', `${product.title}`)
         cartItem.style.backgroundImage = `url(${product.imageURL})`
         this.cartItems.appendChild(cartItem)

      });
   }

   renderCartSum = (cartSum) => {
      // console.log('view.renderCartSum')

      this.cartSum.innerHTML = `${cartSum}`
   }

   renderCartCheckoutSum = (sum) => {
      // console.log('view.renderCartCheckoutSum')

      document.querySelector('#deliveryCost').innerHTML = `${deliveryCost}`

      this.costSum.innerHTML = `${sum}`
   }

   renderBigCart = (cartLS) => {
      // console.log('view.renderBigCart')

      if (!cartLS) {
         console.error('Нет данных для рендера')
   
         document.querySelector('.content').style.borderRight = 'none'
         document.querySelector('.order__section').style.display = 'none'
         // document.querySelector('.cart__wrap').style.display = 'none'
         
         document.querySelector('.cart__wrap').innerHTML = ''
   
         let error = document.createElement('p')
         error.className = 'error'
         error.innerHTML = 'Корзина пуста'
         document.querySelector('.cart__wrap').appendChild(error)

         return
      }

      this.basketItems.innerHTML = ''

      cartLS.forEach(element => {
         let item = document.createElement('li')
         item.className = 'basket__item cart'
         this.basketItems.appendChild(item)

         let itemImageWrap = document.createElement('div')
         itemImageWrap.className = 'item__image'
         item.appendChild(itemImageWrap)

         let itemImage = document.createElement('img')
         itemImage.setAttribute('src', `${element.imageURL}`)
         itemImage.setAttribute('alt', `${element.title}`)
         itemImageWrap.appendChild(itemImage)

         let itemBody = document.createElement('div')
         itemBody.className = 'item__body'
         item.appendChild(itemBody)

         let title = document.createElement('p')
         title.className = 'item__title-cart'
         title.innerHTML = `${element.title}`
         itemBody.appendChild(title)

         let subtitle = document.createElement('p')
         subtitle.className = 'item__color'
         subtitle.innerHTML = `${element.description.miniDescription}`
         itemBody.appendChild(subtitle)

         let description = document.createElement('p')
         description.className = 'item__description'
         description.innerHTML = `${element.description.cardShortDescription}`
         itemBody.appendChild(description)

         let productRating = document.createElement('div')
         productRating.className = 'product__rating'
         itemBody.appendChild(productRating)

         let starsWrap = document.createElement('div')
         starsWrap.className = 'rating__stars'
         productRating.appendChild(starsWrap)

         let ratingStar1 = document.createElement('img')
         ratingStar1.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar1)
   
         let ratingStar2 = document.createElement('img')
         ratingStar2.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar2)
   
         let ratingStar3 = document.createElement('img')
         ratingStar3.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar3)
   
         let ratingStar4 = document.createElement('img')
         ratingStar4.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar4)
   
         let ratingStar5 = document.createElement('img')
         ratingStar5.setAttribute('src', '/star50.310d6162.svg')
         starsWrap.appendChild(ratingStar5)
   
         let ratingText = document.createElement('p')
         ratingText.className = 'rating__text'
         ratingText.innerHTML = '4.5 / 5'
         productRating.appendChild(ratingText)

         let basketItem = document.createElement('div')
         basketItem.className = 'basket__item-wrap'
         itemBody.appendChild(basketItem)

         let priceWrap = document.createElement('div')
         priceWrap.className = 'basket__item_price'
         basketItem.appendChild(priceWrap)

         let price = document.createElement('span')
         price.className = 'item__price'
         price.innerHTML = `${element.price.currency} ${element.price.cost}`
         priceWrap.appendChild(price)

         let x = document.createElement('span')
         x.innerHTML = 'x'
         priceWrap.appendChild(x)

         let itemQuantity = document.createElement('span')
         itemQuantity.className = 'item__quantity'
         itemQuantity.setAttribute('id', 'itemQuantity')
         itemQuantity.innerHTML = `${element.quantity}`
         priceWrap.appendChild(itemQuantity)

         let quantity = document.createElement('div')
         quantity.className = 'quantity'
         basketItem.appendChild(quantity)

         let quantityPlus = document.createElement('span')
         quantityPlus.className = 'quantity__plus'
         quantityPlus.innerHTML = '+'
         quantityPlus.setAttribute('id', `${element.id}`)
         quantityPlus.addEventListener('click', this.quantityCounterPlus)
         quantity.appendChild(quantityPlus)

         let quantityNumber = document.createElement('span')
         quantityNumber.className = 'quantity__number'
         quantityNumber.setAttribute('id', 'quantityNumber')
         quantityNumber.innerHTML = `${element.quantity}`
         quantity.appendChild(quantityNumber)

         let quantityMinus = document.createElement('span')
         quantityMinus.className = 'quantity__minus'
         quantityMinus.innerHTML = '-'
         quantityMinus.setAttribute('id', `${element.id}`)
         quantityMinus.addEventListener('click', this.quantityCounterMinus)
         quantity.appendChild(quantityMinus)
      })
   }

   renderBigCartCheckout = (cartLS) => {
      // console.log('view.renderBigCartCheckout')

      if (!cartLS) {
         console.error('Нет данных для рендера')
   
         document.querySelector('.order__section-checkout').style.display = 'none'
         if (activePage == '/order.html') document.querySelector('.order__title__wrap').style.display = 'none'
         let wrap = document.querySelectorAll('.cart__wrap-checkout')

         if (wrap.length > 1) {
            for (let index = 0; index < wrap.length; index++) {
               const el = wrap[index];
               el.style.display = 'none';
            }
         }
   
         let error = document.createElement('p')
         error.className = 'error'
         if (activePage == '/order.html') error.innerHTML = 'Страница не найдена'
         if (activePage !== '/order.html') error.innerHTML = 'В заказе нет товаров'
         document.querySelector('.checkout__body').appendChild(error)

         return
      }

      this.basketItems.innerHTML = ''

      cartLS.forEach(element => {
         let item = document.createElement('li')
         if (activePage !== '/order.html') item.className = 'basket__item'
         if (activePage == '/order.html') item.className = 'basket__item order'
         this.basketItems.appendChild(item)

         let itemImageWrap = document.createElement('div')
         itemImageWrap.className = 'item__image'
         item.appendChild(itemImageWrap)

         let itemImage = document.createElement('img')
         itemImage.setAttribute('src', `${element.imageURL}`)
         itemImage.setAttribute('alt', `${element.title}`)
         itemImageWrap.appendChild(itemImage)

         let itemBody = document.createElement('div')
         itemBody.className = 'item__body'
         item.appendChild(itemBody)

         let title = document.createElement('p')
         title.className = 'item__title-cart'
         title.innerHTML = `${element.title}`
         itemBody.appendChild(title)

         let subtitle = document.createElement('p')
         subtitle.className = 'item__color'
         subtitle.innerHTML = `${element.description.miniDescription}`
         itemBody.appendChild(subtitle)

         let description = document.createElement('p')
         description.className = 'item__description'
         description.innerHTML = `${element.description.cardShortDescription}`
         itemBody.appendChild(description)

         let productRating = document.createElement('div')
         productRating.className = 'product__rating'
         itemBody.appendChild(productRating)

         let starsWrap = document.createElement('div')
         starsWrap.className = 'rating__stars'
         productRating.appendChild(starsWrap)

         let ratingStar1 = document.createElement('img')
         ratingStar1.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar1)
   
         let ratingStar2 = document.createElement('img')
         ratingStar2.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar2)
   
         let ratingStar3 = document.createElement('img')
         ratingStar3.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar3)
   
         let ratingStar4 = document.createElement('img')
         ratingStar4.setAttribute('src', '/star.70726630.svg')
         starsWrap.appendChild(ratingStar4)
   
         let ratingStar5 = document.createElement('img')
         ratingStar5.setAttribute('src', '/star50.310d6162.svg')
         starsWrap.appendChild(ratingStar5)
   
         let ratingText = document.createElement('p')
         ratingText.className = 'rating__text'
         ratingText.innerHTML = '4.5 / 5'
         productRating.appendChild(ratingText)

         let basketItem = document.createElement('div')
         basketItem.className = 'basket__item-wrap'
         itemBody.appendChild(basketItem)

         let priceWrap = document.createElement('div')
         priceWrap.className = 'basket__item_price'
         basketItem.appendChild(priceWrap)

         let price = document.createElement('span')
         price.className = 'item__price'
         price.innerHTML = `${element.price.currency} ${element.price.cost}`
         priceWrap.appendChild(price)

         let x = document.createElement('span')
         x.innerHTML = 'x'
         priceWrap.appendChild(x)

         let itemQuantity = document.createElement('span')
         itemQuantity.className = 'item__quantity'
         itemQuantity.setAttribute('id', 'itemQuantity')
         itemQuantity.innerHTML = `${element.quantity}`
         priceWrap.appendChild(itemQuantity)
      })
   }

   renderOrderNumber(number) {
      // console.log('view.renderOrderNumber')

      const orderNumber = document.querySelector('#orderNumber')
      orderNumber.innerText = `${number}`
   }

   checkFormsToOrder = () => {
      // console.log('view.checkFormsToOrder')

      const name = this.userNameInput.value
      const address = this.userAddressInput.value
      const city = this.userCityInput.value
      const phone = this.userPhoneInput.value

      this.onCheckForms(name, address, city, phone)
   }

   checkDataToOrder = () => {
      // console.log('view.checkDataToOrder')

      this.onCheckData()
   }

   linkingToOrder = (link) => {
      // console.log('view.linkingToOrder')
      if (this.popupDelivery.classList.contains('active')) this.popupDelivery.classList.remove('active')
      this.popupWrap.classList.remove('active')
      this.popupWrap.removeAttribute('style')

      this._bodyUnLock()

      this.placeOrderBtn.setAttribute('href', link)
   }

   createError = (object, text) => {
      // console.log('view.createError', object, text)

      if (object == 'name') object = this.userNameInput
      if (object == 'address') object = this.userAddressInput
      if (object == 'city') object = this.userCityInput
      if (object == 'phone') object = this.userPhoneInput

      this.animateElement(object)

   }

   animateElement = (object) => {
      object.classList.add('animation')
      
      setTimeout(() => {
         object.classList.remove('animation')
      }, 400);
   }

   viewError = (text) => {
      // console.log('view.viewError')

      this.removeError()

      this._openPopup(text)
      // this.animateElement(this.movieTitleNode)
      // const parent = this.movieTitleNode.parentNode;
      // const errorLabel = document.createElement('label');

      // errorLabel.classList.add('error__label');
      // errorLabel.innerText = text;
      // parent.appendChild(errorLabel);
      // parent.classList.add('error');
      // this.clearValue()
      // this.movieTitleNode.focus()
   }

   removeError = () => {
      // const parent = this.movieTitleNode.parentNode;
      // if (parent.classList.contains('error')) {
      //    parent.querySelector('.error__label').remove()
      //    parent.classList.remove('error')
      // }
   }

   quantityCounterPlus = () => {
      // console.log('view.quantityCounterPlus')

      let id = event.target.id
      this.onPlusQuantity(id)
   }

   quantityCounterMinus = () => {
      // console.log('view.quantityCounterMinus')

      let id = event.target.id
      this.onMinusQuantity(id)
   }

   _openPopup = (text) => {
      // console.log('view._openPopup')

      const errorText = document.querySelector('#errorText')
      
      if (event.target.id == 'btnAddress' || event.target.parentNode.id == 'btnAddress') {
         this._bodyLock()

         this.popupWrap.style.marginTop = `${window.scrollY}px`
         this.popupWrap.classList.add('active')
         this.popupDelivery.classList.add('active')
      }
      if (event.target.id == 'btnPayment' || event.target.parentNode.id == 'btnPayment') {
         this._bodyLock()

         this.popupWrap.style.marginTop = `${window.scrollY}px`
         this.popupWrap.classList.add('active')
         this.popupPayment.classList.add('active')
      }
      if (event.target.id == 'placeOrder' || event.target.parentNode.id == 'placeOrder') {
         this._bodyLock()

         this.popupWrap.style.marginTop = `${window.scrollY}px`
         this.popupWrap.classList.add('active')
         this.popupError.classList.add('active')
         errorText.innerHTML = text
      }
   }

   _closePopup = () => {
      // console.log('view.closePopup')

      if (event.target.id !== 'popup__wrap' && event.target.parentNode.id !== 'closePopup') return
      if (this.popupDelivery.classList.contains('active')) this.popupDelivery.classList.remove('active')
      if (this.popupPayment.classList.contains('active')) this.popupPayment.classList.remove('active')
      if (this.popupError.classList.contains('active')) this.popupError.classList.remove('active')
   
      this.popupWrap.classList.remove('active')
      this.popupWrap.removeAttribute('style')

      this._bodyUnLock()
   }

   _openDeliveryForm = () => {
      // console.warn('_openDeliveryForm')

      this.popupError.classList.remove('active')
      this.popupWrap.classList.add('active')
      this.popupDelivery.classList.add('active')
   }

   renderChangeBtnText = (text) => {
      // console.log('view.renderChangeBtnText')

      document.querySelector('#deliveryTextBtn').innerHTML = `${text}`
   }

   _bodyLock = () => {
      const lockPaddingValue = window.innerWidth - document.querySelector("body").offsetWidth + "px"; 

      document.body.style.paddingRight = lockPaddingValue;
      document.body.classList.add("body-lock");
   }

   _bodyUnLock = () => {
      document.body.removeAttribute('class')
      document.body.removeAttribute('style')
   }
}