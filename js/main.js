Vue.component('product', {
    template: `
   <div class="product">
    <div class="product-image">
        <img :src="image" :alt="altText"/>
    </div>
    <div class="product-info">

        <div class="cart">
            <p>Cart({{ cart }})</p>
        </div>
        
        <h1>{{ title }}</h1>
        <p>{{description}}</p>
        <a :href="link"> More products like this.</a>

          <p v-if="inStock">In stock</p>

          <p
                  v-else
                  class="line"
          >
              Out of Stock
          </p>

        <span v-show="onSale">{{ sale }}</span>

        <p>User is premium: {{ premium }}</p>

        <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
        ></div>




        <div v-for="size in sizes">
            <li>{{ size }}</li>
        </div>
        
        <p>Shipping: {{ shipping }}</p>

        <button
                @click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
        >
            Add to cart
        </button>

        <button
                @click="RemoveCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
        >
            Remove to cart
        </button>



    </div>
  </div>
 `,
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },

    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            altText: "A pair of socks",
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],

            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            selectedVariant: 0,
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        RemoveCart() {
            this.cart -= 1
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            return "Проходит распродажа";
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
})

Vue.component('product-details', {
    template: `
   <div class="product">
     <ul>
          <li v-for="detail in details">{{ detail }}</li>
       </ul>
  </div>
 `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        };
    }

})

new Vue({
    el: '#app',
    data: {
        premium: true
    }
})

