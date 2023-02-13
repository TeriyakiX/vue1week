Vue.component('product', {

    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },

    template: `
   <div class="product">
    <div class="product-image">
        <img :src="image" :alt="altText"/>
    </div>
    <div class="product-info">

        
        
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
                @click="removeCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
        >
            Remove from cart
        </button>
        
        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                  <li v-for="review in reviews">
                  <p>Name:{{ review.name }}</p>
                  <p>Rating: {{ review.rating }}</p>
                  <p>Review:{{ review.review }}</p>
                  <span>Picked: {{ review.picked }}</span>
                  </li>
                </ul>
        </div>  

        <product-review @review-submitted="addReview"></product-review>
    </div>
  </div>
 `,

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
            selectedVariant: 0,
            reviews: [],

        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },

        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        removeCart() {
            this.$emit('return-to-cart', this.variants[this.selectedVariant].variantId);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }


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

Vue.component('product-review', {
    template: `

  <form class="review-form" @submit.prevent="onSubmit">
          <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
         <ul>
           <li v-for="error in errors">{{ error }}</li>
         </ul>
        </p>
        
        <div class="picked">
        
        <p>Would you recommend this product?</p>
         <input type="radio" id="Yes" value="Yes" name="picked"  v-model="picked" />
          <label for="Yes">Yes</label>
          <br />
          <input type="radio" id="No" value="No" name="picked" v-model="picked" />
          <label for="No">No</label>
          <br />
        
        </div>
        
          
          
         <p>
           <label for="name">Name:</label>
           <input id="name" v-model="name" placeholder="name">
         </p>
        
         <p>
           <label for="review">Review:</label>
           <textarea id="review" v-model="review"></textarea>
         </p>
        
         <p>
           <label for="rating">Rating:</label>
           <select id="rating" v-model.number="rating">
             <option>5</option>
             <option>4</option>
             <option>3</option>
             <option>2</option>
             <option>1</option>
           </select>
         </p>
        
         <p>
           <input type="submit" value="Submit"> 
         </p>

    </form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            picked: '',

        }
    },

    methods:{
        onSubmit() {
            if (this.name && this.review && this.rating && this.picked) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    picked: this.picked
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.picked = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.picked) this.errors.push("Question required.")
            }
        },


    },

})




new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        returnCart() {
            this.cart.pop();
        }
    }

})

