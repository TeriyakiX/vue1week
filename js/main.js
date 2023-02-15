let eventBus = new Vue()

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
          <p v-else class="line">Out of Stock</p>

        <span v-show="onSale">{{ sale }}</span>

        <p>User is premium: {{ premium }}</p>

        <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
        >
        
        </div>




        <div 
        
            v-for="size in sizes"
        
        >
            <li>{{ size }}</li>
            
        </div>
        

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
        
          
        <product-tabs 
        
            :reviews="reviews"
            :premium="premium"
        >       
        
        </product-tabs>
       
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
                    variantQuantity: 10
                }
            ],

            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            selectedVariant: 0,
            reviews: [],

        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantColor);
        },

        updateProduct(index) {
            this.selectedVariant = index;

        },
        removeCart() {
            this.$emit('return-to-cart', this.variants[this.selectedVariant].variantColor);
        },

    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
            console.log(productReview)
        })
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
                eventBus.$emit('review-submitted', productReview)
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

Vue.component('product-tabs', {
    template: `
   <div>   
       <ul>
             <span class="tab"
                       :class="{ activeTab: selectedTab === tab }"
                       v-for="(tab, index) in tabs"
                       @click="selectedTab = tab"
             >  {{ tab }}</span>
         
       </ul>
       <div v-show="selectedTab === 'Reviews'">
       
            <h2>Reviews</h2>
            
            <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                      <li v-for="review in reviews">
                      <p>Name:{{ review.name }}</p>
                      <p>Rating: {{ review.rating }}</p>
                      <p>Review:{{ review.review }}</p>
                      <span>Question: {{ review.picked }}</span>
                      </li>
                    </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
              <product-review></product-review>
        </div>
        
        <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p>
        </div>
        
        <div v-show="selectedTab === 'Details'">
            <product-details/>
        </div>
        
     </div>
   
 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping' , 'Details'],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    },
    props: {

        reviews: {
            type: Array,
            required: false,
            },

        premium: {
            type: Boolean,
            required: true
        }
    },
    computed: {

        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }

})





new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(Color) {
            this.cart.push(Color);
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        returnCart() {
            this.cart.pop();
            localStorage.setItem('cart', JSON.stringify(this.cart))
        }
    },
    computed: {
        checkCart() {
            let CartColor = this.cart.map((i) => i)

            let str = "";
            for (let i = 0; i < CartColor.length; i++ ){
                let count = 0;
                let item = CartColor[i]
                while(CartColor.indexOf(item) !== -1){

                    CartColor.splice(CartColor.indexOf(item),1)
                    count++;
                }
                str += `${item}: ${count} `;
            }
            return str
        }
    },

    mounted() {
        this.cart = JSON.parse(localStorage.getItem('cart'));
    },



})

