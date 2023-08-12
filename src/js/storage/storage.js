import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, writeBatch, doc, query, updateDoc, arrayUnion } from "firebase/firestore";
import { firebaseConfig } from "../variables/variables.js";


export function createStorage(key) {
  // console.warn(key)
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  return {
    key,
    db,
    pull: async function() {
      // console.warn('storage.createStorage.pull')

      const goodsFB = await getDocs(collection(this.db, this.key))
      const listOfGoods = []

      goodsFB.forEach((doc) => {
          listOfGoods.unshift({
            id: doc.id,
            title: doc.data().title,
            description: {
              cardDescription: doc.data().description.cardDescription,
              cardShortDescription: doc.data().description.cardShortDescription,
              miniDescription: doc.data().description.miniDescription
            },
            price: {
              currency: doc.data().price.currency,
              cost: doc.data().price.cost
            },
            imageURL: doc.data().imageURL,
            stockBalance: doc.data().stockBalance,
            quantity: doc.data().quantity
          }) 
      });
      return  listOfGoods;
    },
    pullOrder: async function() {
      // console.warn('storage.createStorage.pullOrder')

      const ordersFB = await getDocs(collection(this.db, this.key))
      const orders = []

      ordersFB.forEach((doc) => {
          orders.unshift({
            id: doc.id,
            number: doc.data().number,
            methodPay: doc.data().methodPay,
            cost: {
              currency: doc.data().cost.currency,
              delivery: doc.data().cost.delivery,
              priceOfGoods: doc.data().cost.priceOfGoods,
              total: doc.data().cost.total
            },
            delivery: {
              address: doc.data().delivery.address,
              city: doc.data().delivery.city,
              name: doc.data().delivery.name,
              phone: doc.data().delivery.phone
            },
            goods: [JSON.parse(doc.data().goods)]
          }) 
      });
      return  orders;
    },
    readProductData: async function(id) {
      // console.log('storage.readProductData')
      // const ref = collection(this.db, this.key)
      // const q = query(ref, orderBy('createdAt'))
      // const goodsFB = await getDocs(q)
      // const listOfGoods = []
      if (id == null) {
        // console.log('Stop')
        return} 

      const q = query(collection(this.db, this.key));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.id == id) {
          product = {
            id: doc.id,
            title: doc.data().title,
            description: {
              cardDescription: doc.data().description.cardDescription,
              cardShortDescription: doc.data().description.cardShortDescription,
              miniDescription: doc.data().description.miniDescription
            },
            price: {
              currency: doc.data().price.currency,
              cost: doc.data().price.cost
            },
            imageURL: doc.data().imageURL,
            stockBalance: doc.data().stockBalance,
          }
        }
      });
      return product
    },
    push: async function(product) {
      // console.log('storage.createStorage.push')

      try {
        const docRef = await addDoc(collection(this.db, this.key), {
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
            createdAt: serverTimestamp()
          });
          product.id = docRef.id
      } catch (e) {
          console.error("Error adding document: ", e);
      }
    },
    pushOrders: async function(order, goods) {
      // console.log('storage.createStorage.pushOrders')

      // // console.warn(order)
      // // console.warn(order.goods.length - 1)

      // let i = order.goods.length - 1

      function index() {

        for (let i = 0; i < order.goods.length; i++) {
          // console.log(i)
        }
      }

      // // console.log(i())

      try {
        const docRef = await addDoc(collection(this.db, this.key), {
            cost: {
              currency: order.cost.currency,
              delivery: order.cost.delivery,
              priceOfGoods: order.cost.priceOfGoods,
              total: order.cost.total
            },
            delivery: {
              address: order.delivery.address,
              city: order.delivery.city,
              name: order.delivery.name,
              phone: order.delivery.phone
            },
            methodPay: order.methodPay,
            number: order.number,
            goods: JSON.stringify(goods)
            // goods: [{
            //   description: {
            //     cardDescription: order.goods[index()].description.cardDescription,
            //     cardShortDescription: order.goods[index()].description.cardShortDescription,
            //     miniDescription: order.goods[index()].description.miniDescription
            //   },
            //   id: order.goods[index()].id,
            //   imageURL: order.goods[index()].imageURL,
            //   price: {
            //     cost: order.goods[index()].price.cost,
            //     currency: order.goods[index()].price.currency
            //   },
            //   quantity: order.goods[index()].quantity,
            //   stockBalance: order.goods[index()].stockBalance,
            //   title: order.goods[index()].title
            // }]
          });
          order.id = docRef.id
          // await updateDoc(collection(this.db, this.key), {
          //   goods: arrayUnion(goods)
            
          // })
      } catch (e) {
          console.error("Error adding document: ", e);
      }
    },
    delete: async function (id) {
      // console.log('storage.createStorage.delete')
      
      const batch = writeBatch(this.db)
      const ref = doc(this.db, this.key, id)
      batch.delete(ref)
      await batch.commit();
    },
    update: async function (product) {
      // // console.log('storage.createStorage.update')
      const ref = doc(this.db, this.key, product.id);
      await updateDoc(ref, {
        stockBalance: product.stockBalance
      });
    }
  }
}