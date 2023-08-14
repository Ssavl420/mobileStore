import { createStorage } from "../storage/storage.js";
import { PRODUCTS_STORAGE_KEY, ORDERS_STORAGE_KEY } from"../variables/variables.js";
import { activePage, deliveryCost, linkToOrder } from "../variables/variables.js";

export class Model {
   constructor({ onGoodsFromData, onOrdersFromData, onProductFromData, onCart, onCartSum, onBigCart, onChangeQuantity, onBigCartCheckout, onChangeBtnText, onCheckoutSum, changeMethodToPay, infoForDelivery, onOrderNumber, formsChecked, checkError, createError }) {
      this.listOfGoods = []
      this.orders = []
      this.cart = []
      this.product = {}
      this.onGoodsFromData = onGoodsFromData
      this.onOrdersFromData = onOrdersFromData
      this.onProductFromData = onProductFromData
      this.onCart = onCart
      this.onCartSum = onCartSum
      this.onCheckoutSum = onCheckoutSum
      this.onBigCart = onBigCart
      this.onBigCartCheckout = onBigCartCheckout
      this.onChangeQuantity = onChangeQuantity
      this.onChangeBtnText = onChangeBtnText
      this.changeMethodToPay = changeMethodToPay
      this.infoForDelivery = infoForDelivery
      this.onOrderNumber = onOrderNumber
      this.formsChecked = formsChecked
      this.checkError = checkError
      this.createError = createError
      this.storage = createStorage(PRODUCTS_STORAGE_KEY)
      this.storageOrder = createStorage(ORDERS_STORAGE_KEY)
   }

   readData() {
      console.log('model.readData')

      const cartLS = JSON.parse(localStorage.getItem('cart'))
      const cartHistoryLS = JSON.parse(localStorage.getItem('cartHistory'))
      const ordersFromLS = JSON.parse(localStorage.getItem('orders'))
      const link = localStorage.getItem('link')

      if (link !== null) {
         localStorage.removeItem('link')
         this.checkCartData()
         return
      }

      this.storage.pull().then((listOfGoods) => {
         this.onGoodsFromData(listOfGoods)
         this.listOfGoods = listOfGoods;
         this.onOrdersFromData(ordersFromLS)
         this.orders = ordersFromLS;

         if (cartHistoryLS !== null) {
            localStorage.setItem('cart', JSON.stringify(cartHistoryLS))
            this.cart = cartHistoryLS
            this.onCart(cartHistoryLS)
            localStorage.removeItem('cartHistory')
         }
         if (cartLS !== null) {
            
            this.cart = cartLS
            this.onCart(cartLS)
         }
      })
   }

   linkToCart() {
      localStorage.setItem('link', 'cart')
   }

   readProductData() {
      // console.log('model.readProductData')

      const cartLS = JSON.parse(localStorage.getItem('cart'))
      if (cartLS !== null) {
         this.cart = cartLS
         this.onCart(cartLS)
      }
      
      this.storage.readProductData(this.readProductId()).then((product) => {
         // console.warn('Ответ из storage получен:', product)
         this.onProductFromData(product)
         this.product = product
      })
   }

   checkCartData() {
      // console.log('model.checkCartData')

      const cartLS = JSON.parse(localStorage.getItem('cart'))
      
      this.onBigCart(cartLS)
      if (cartLS !== null) {
         this.cart = cartLS
         this.onCart(cartLS)
         this.onCartSum(this.calcCartSum())
      }
   }

   readCheckoutData() {
      // console.log('model.readCheckoutData')

      const cartLS = JSON.parse(localStorage.getItem('cart'))
      
      this.readMethodPay()
      this.readDeliveryProps()
      this.onCartSum(this.calcCartSum())
      this.onCheckoutSum(this.calcCartSumCheckout())
      this.onBigCartCheckout(cartLS)
      this.checkDeliveryDataLS()
   }

   checkOrder(id) {
      // console.log('model.checkOrder')

      const orders = JSON.parse(localStorage.getItem('orders'))
      const cartLS = JSON.parse(localStorage.getItem('cart'))

      for (let index = 0; index < orders.length; index++) {
         const element = orders[index];
         
         if (element.number == id) {
            this.storageOrder.pullOrder().then((orders) => {
               for (let index = 0; index < orders.length; index++) {
                  const element = orders[index];
                  if (element.number == id) {


                     if (cartLS !== null) localStorage.setItem('cartHistory', JSON.stringify(cartLS))

                     localStorage.setItem('ordersData', JSON.stringify(element))
                     localStorage.setItem('numberOfOrder', element.number)
                     localStorage.setItem('delivery', JSON.stringify(element.delivery))
                     localStorage.setItem('cart', JSON.stringify(element.goods[0][0]))
                     localStorage.setItem('methodPay', element.methodPay)

                     window.location.href = linkToOrder;
                  }
               }
            })
         }
         
      }
   }

   checkDeliveryDataLS() {
      // console.log('model.checkDeliveryDataLS')

      if (!localStorage.getItem('delivery')) this.onChangeBtnText('Добавить')
      if (localStorage.getItem('delivery')) this.onChangeBtnText('Изменить')

   }

   readOrderData() {
      // console.log('model.readOrderData')

      const cartLS = JSON.parse(localStorage.getItem('cart'))

      
      this.onBigCartCheckout(cartLS)
      if (!cartLS) return
      this.onOrderNumber(this.createOrderNumber())
      this.readMethodPay()
      this.readDeliveryProps()
      this.onCartSum(this.calcCartSum())
      this.onCheckoutSum(this.calcCartSumCheckout())
      this.safeOrder()
      localStorage.removeItem('cart')
      localStorage.removeItem('numberOfOrder')
      localStorage.removeItem('ordersData')
   }

   safeOrder() {
      // console.log('model.safeOrder')
      const cartLS = JSON.parse(localStorage.getItem('cart'))
      if (localStorage.getItem('ordersData') !== null) return
      if (!cartLS) return
      const order = {
         number: localStorage.getItem('numberOfOrder'),
         goods: cartLS,
         cost: {
            priceOfGoods: this.calcCartSum(),
            delivery: deliveryCost,
            total: this.calcCartSumCheckout(),
            currency: '$'
         },
         methodPay: localStorage.getItem('methodPay'),
         delivery: JSON.parse(localStorage.getItem('delivery'))
      }

      const goods = [cartLS]
      // console.warn(order)
      // console.log(goods)
      this.storageOrder.pushOrders(order, goods)
      
      if (!JSON.parse(localStorage.getItem('orders'))) {
         const orders = []
         localStorage.setItem('orders', JSON.stringify(orders))
      }

      const orders = JSON.parse(localStorage.getItem('orders'))

      JSON.parse(localStorage.getItem('orders'))

      orders.push(order)

      localStorage.setItem('orders', JSON.stringify(orders))
      localStorage.removeItem('numberOfOrder')
   }

   createOrderNumber() {
      // console.log('model.createOrderNumber')

      if (localStorage.getItem('numberOfOrder') !== null) return localStorage.getItem('numberOfOrder')

      let number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      localStorage.setItem('numberOfOrder', number)
      return number
   }

   createDeliveryProps(name, address, city, phone) {
      // console.log('model.createDeliveryProps')

      if (localStorage.getItem('numberOfOrder') !== null) return

      let deliveryProps = {
         name,
         address,
         city,
         phone
      }
      localStorage.setItem('delivery', JSON.stringify(deliveryProps))
      
      // this.readDeliveryProps()
   }

   readDeliveryProps() {
      // console.log('model.readDeliveryProps')

      const deliveryProps = JSON.parse(localStorage.getItem('delivery'))

      this.infoForDelivery(deliveryProps)
   }

   calcCartSum() {
      // console.log('model.calcCartSum')

      const cartLS = JSON.parse(localStorage.getItem('cart'))
      if (!cartLS) return
      let sum = 0;
      cartLS.forEach(element => {
      let cost = element.price.cost * element.quantity
      sum += cost;
      });
      return sum.toFixed(2)
   }

   calcCartSumCheckout() {
      const sum =  Number(deliveryCost) + Number(this.calcCartSum())
      return sum.toFixed(2)
   }

   plusQuantityProduct(id) {
      // console.log('model.plusQuantityProduct')

      this.cart.forEach(element => {
         if (element.id == id) {
            ++element.quantity
         }
      })
      localStorage.setItem('cart', JSON.stringify(this.cart))
      
      const cartLS = JSON.parse(localStorage.getItem('cart'))
      this.onChangeQuantity(cartLS)
      this.onCartSum(this.calcCartSum())
   }

   minusQuantityProduct(id) {
      // console.log('model.minusQuantityProduct')

      this.cart.forEach(element => {
         if (element.id == id) {
            --element.quantity
            if (element.quantity == 0) {
               const del = this.cart.indexOf(element)
               this.cart.splice(del, 1)
            }
         }
      })
      
      localStorage.setItem('cart', JSON.stringify(this.cart))
      if (this.cart.length < 1) localStorage.removeItem('cart')
      this.checkCartData()
      const cartLS = JSON.parse(localStorage.getItem('cart'))
      this.onChangeQuantity(cartLS)
      this.onCartSum(this.calcCartSum())
   }

   changeMethodPay(methodPay) {
      // console.log('model.changeMethodPay')

      localStorage.setItem('methodPay', methodPay)
      
      this.readMethodPay()
   }

   readMethodPay() {
      // console.log('model.readMethodPay')

      const methodPayLS = localStorage.getItem('methodPay')

      if (!methodPayLS) {
         localStorage.setItem('methodPay', 'Card')
      }
      
      this.changeMethodToPay(methodPayLS)
   }

   safeProductId(id) {
      // console.log('model.safeProductId')

      localStorage.setItem('productID', id)
   }

   addProductToCart(id) {
      // console.log('model.addProductToCart', id)
      
      if ((activePage == '/mobileStore/product%D0%A1ard.html')) {
         this.storage.pull().then((listOfGoods) => {
            this.listOfGoods = listOfGoods;
            this.listOfGoods.forEach(product => {
               if (product.id == id) {
      
                  if (!this.cart.length) {
                     this.cart.push(product)
                     return
                  }
      
                  const found = this.cart.some(element => element.id == id)
                  if (found == false) {
                     this.cart.push(product)
                     return
                  }
      
                  this.cart.forEach(element => {
                     if (element.id == id) {
                        // console.log('++quantity')
                        ++element.quantity
                        localStorage.setItem('cart', JSON.stringify(this.cart))
                     }
                  })
               }
            })
            localStorage.setItem('cart', JSON.stringify(this.cart))
            const cartLS = JSON.parse(localStorage.getItem('cart'))
   
            this.onCart(cartLS)
         })
      } 

      this.listOfGoods.forEach(product => {
         if (product.id == id) {

            if (!this.cart.length) {
               this.cart.push(product)
               return
            }

            const found = this.cart.some(element => element.id == id)
            if (found == false) {
               this.cart.push(product)
               return
            }

            this.cart.forEach(element => {
               if (element.id == id) {
                  // console.log('++quantity')
                  ++element.quantity
                  localStorage.setItem('cart', JSON.stringify(this.cart))
               }
            })
         }
      })
      localStorage.setItem('cart', JSON.stringify(this.cart))
      const cartLS = JSON.parse(localStorage.getItem('cart'))

      this.onCart(cartLS)
   }

   readProductId() {
      // console.log('model.readProductId')

      let id = localStorage.getItem('productID')

      return id
   }

   clearLS() {
      // console.log('model.clearLS')

      localStorage.removeItem('productID')
   }

   createProduct() {
      // console.log('model.createProduct')

      // event.preventDefault();
      // if (this.validation(title) == false) {
      //    return
      // }
      
      const product = {
         title: product.title,
         description: {
            cardDescription: product.description.cardDescription,
            cardShortDescription: product.description.cardShortDescription,
            miniDescription: product.description.miniDescription
         },
         price: {
            currency: product.price.currency,
            cost: product.price.cost
         },
         imageURL: product.imageURL,
         stockBalance: product.stockBalance,
      }
      this.listOfGoods.unshift(product)
      this.onNewMovies(this.listOfGoods)
      this.storage.push(product)
      this.onNewMovies(this.listOfGoods)
   }

   checkDeliveryData() {
      // console.log('model.checkData')

      const deliveryData = JSON.parse(localStorage.getItem('delivery'))
      if (!deliveryData) {
         this.checkError('Заполните пожалуйста, данные по доставке!')
         return
      }

      this.formsChecked(linkToOrder)
   }

   checkForms(name, address, city, phone) {
      // console.log('model.checkForms')

      if (this.validation(name, address, city, phone) == false) {
         return
      }
      this.createDeliveryProps(name, address, city, phone)
      this.readDeliveryProps()
      // this.checkData()
   }

   validation(name, address, city, phone) {
      // console.log('model.validation')

      let result = true;

      // // console.warn(name)

      // const props = [
      //    name,
      //    address,
      //    city,
      //    phone
      // ]

      // props.forEach(element => {
      //    if (element == "" || element.trim() == "") {
      //       // console.warn(element)
      //       this.createError(String(element), 'Поле не заполнено')
      //       result = false
      //       return result
      //    }
      // })

      if (name == "" || name.trim() == "") {
         this.createError('name', 'Поле не заполнено')
         result = false
         return result
      }

      if (address == "" || address.trim() == "") {
         this.createError('address', 'Поле не заполнено')
         result = false
         return result
      }

      if (city == "" || city.trim() == "") {
         this.createError('city', 'Поле не заполнено')
         result = false
         return result
      }

      if (phone == ""  || phone.trim() == "") {
         this.createError('phone', 'Поле не заполнено')
         result = false
         return result
      }

      return result
   }
}