import { Model } from "../model/model.js";
import { View } from "../view/view.js";
import { activePage } from "../variables/variables.js";

export class Controller {
   constructor() {
      this.model = new Model({
         onGoodsFromData: this.handleModelGoods,
         onOrdersFromData: this.handleModelOrders,
         onProductFromData: this.handleModelProduct,
         onCart: this.handleReadCart,
         onCartSum: this.handleCartPrice,
         onCheckoutSum: this.handleCartCheckoutSum,
         onBigCart: this.handleCart,
         onBigCartCheckout: this.handleCartCheckout,
         onChangeQuantity: this.handleChangeQuantity,
         changeMethodToPay: this.handleChangeMethodToPay,
         infoForDelivery: this.handleInfoForDelivery,
         onOrderNumber: this.handleOrderNumber,
         formsChecked: this.handleFormsChecked,
         checkError: this.handleError,
         createError: this.handleCreateError,
         onChangeBtnText: this.handleChangeBtnText
      });
      this.view = new View({
         onHome: this.handleToHome,
         onReadProductData: this.handlerSafeProductId,
         onAddProductToCart: this.handleAddToCart,
         onPlusQuantity: this.handlePlusQuantity,
         onMinusQuantity: this.handleMinusQuantity,
         onChangeMethodPay: this.handleChangeMethodPay,
         onChangeDelivery: this.handleDeliveryInfo,
         onCheckForms: this.handleCheckForms,
         onCheckDeliveryData: this.handleCheckDeliveryData,
         onOrderFromFB: this.handleOrderFromFB,
         onCheckCartData: this.handleCheckCartData,
         linkToCart: this.handleToCart,
      });
   }
   init() {
      // console.log('controller.init')
      console.warn('activePage -', activePage)

      if (activePage == '/mobileStore/' || activePage == '/mobileStore/index.html') this.model.readData()

      if (activePage == '/mobileStore/product%D0%A1ard.html') this.model.readProductData()

      // if (activePage == '/mobileStore/shopping%D0%A1art.html') this.model.checkCartData()

      if (activePage == '/mobileStore/checkout.html') this.model.readCheckoutData()

      if (activePage == '/mobileStore/order.html') this.model.readOrderData()
   }

   handleToHome = () => {
      this.model.readData()
   }

   handleModelGoods = (listOfGoods) => {
      console.log('controller.handleModelGoods')

      this.view.renderProducts(listOfGoods)
   }

   handleModelOrders = (orders) => {
      // console.log('controller.handleModelOrders')

      this.view.renderOrders(orders)
   }

   handleReadCart = (cartLS) => {
      console.log('controller.handleReadCart', cartLS)

      this.view.renderCart(cartLS)
   }

   handleCartPrice = (cartSum) => {
      // console.log('controller.handleCartPrice')

      this.view.renderCartSum(cartSum)
   }

   handleCart = (cartLS) => {
      // console.log('controller.handleCart')

      this.view.renderBigCart(cartLS)
   }

   handleCartCheckout = (cartLS) => {
      // console.log('controller.handleCartCheckout')

      this.view.renderBigCartCheckout(cartLS)
   }

   handleCartCheckoutSum = (sum) => {
      // console.log('controller.handleCartCheckoutSum')

      this.view.renderCartCheckoutSum(sum)
   }

   handleModelProduct = (product) => {
      // console.log('controller.handleModelProduct')
      
      this.view.renderProductCard(product)
      this.model.clearLS()
   }

   handleAddToCart = (id) => {
      // console.log('controller.handleAddToCart', id)

      this.model.addProductToCart(id)
   }

   handlerSafeProductId = (id) => {
      // console.log('controller.handlerSafeProductId')

      this.model.safeProductId(id)
   }

   handlePlusQuantity = (id) => {
      // console.log('controller.handlePlusQuantity')

      this.model.plusQuantityProduct(id)
   }

   handleMinusQuantity = (id) => {
      // console.log('controller.handleMinusQuantity')

      this.model.minusQuantityProduct(id)
   }

   handleChangeQuantity = (cartLS) => {
      // console.log('controller.handleChangeQuantity')

      // this.view.renderQuantity(cartLS)
      this.view.renderBigCart(cartLS)
   }

   handleChangeMethodPay = (methodPay) => {
      // console.log('controller.handleChangeMethodPay', methodPay)

      this.model.changeMethodPay(methodPay)
   }

   handleChangeMethodToPay = (methodPayLS) => {
      // console.log('controller.handleChangeMethodToPay')

      this.view.renderPayForm(methodPayLS)
   }

   handleDeliveryInfo = (name, address, city, phone) => {
      // console.log('controller.handleDeliveryInfo')

      this.model.createDeliveryProps(name, address, city, phone)
   }

   handleInfoForDelivery = (deliveryProps) => {
      // console.log('controller.handleInfoForDelivery')

      this.view.renderDelivery(deliveryProps)
   }

   handleOrderNumber = (number) => {
      console.log('controller.handleOrderNumber')

      this.view.renderOrderNumber(number)
   }

   handleCheckDeliveryData = () => {
      // console.log('controller.handleCheckData')

      this.model.checkDeliveryData()
   }

   handleCheckForms = (name, address, city, phone) => {
      // console.log('controller.handleCheckForms')

      this.model.checkForms(name, address, city, phone)
   }

   handleFormsChecked = (link) => {
      // console.log('controller.handleFormsChecked')

      this.view.linkingToOrder(link)
   }

   handleError = (text) => {
      // console.log('controller.handleError')

      this.view.viewError(text)
   }

   handleCreateError = (object, text) => {
      // console.log('controller.handleCreateError')

      this.view.createError(object, text)
   }

   handleChangeBtnText = (text) => {
      // console.log('controller.handleChangeBtnText')

      this.view.renderChangeBtnText(text)
   }

   handleOrderFromFB = (id) => {
      // console.log('controller.handleOrderFromFB')

      this.model.checkOrder(id)
   }

   handleCheckCartData = () => {

      this.model.checkCartData()
   }

   handleToCart = () => {
      this.model.linkToCart()
   }
}