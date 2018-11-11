
var ItemCard = Vue.component('item-card', {
    props: ['id','name', 'description', 'img', 'stock', 'price', 'category', 'owner'],
    template:   `<div class="col-lg-3 col-md-6 mb-3">
                    <div class="card h-100">
                        <a href="#"><img class="card-img-top" v-bind:src="img" alt=""></a>
                        <div class="card-body">
                        <h4 class="card-title">
                            <a href="#">{{name}} </a>
                        </h4>
                        <h5>Rp {{price}} </h5>
                        <h5>Stock : {{stock}} </h5>
                        <p class="card-text"> {{description}} </p>
                        </div>
                        <div class="card-footer">
                        
                        <slot></slot>
                        </div>
                    </div>
                </div> `
})

var app = new Vue({
    el : '#app',
    data: {
        title: 'Daily Fresh',
        page: 'home',
        items:[],
        carts: [],
        cartInfo: {
            totalItems: 0,
            total: 0
        },
        filteredItems: [],
        categories: '',
        search: '',
        username: '',
        user: {
            email: '',
            password: ''
        },
        errorLogin: '',
        token: '',
        showForm: false
    },
    mounted : function(){
        this.getAllItems()
        this.getAllCategories()
        this.items = this.filteredItems
    },

    methods: {
        addToCart: function(item){
            if(this.isLogin()=== true){
                let checkCarts = this.carts.findIndex(cart => cart._id == item._id)
                if(checkCarts == -1){
                    item.qty= 1
                    item.subtotal = item.price
                    this.carts.push(item)
                } else {
                    this.carts[checkCarts].qty++
                    this.carts[checkCarts].subtotal+= item.price
                }
                this.cartInfo.totalItems++ 
            } else {

            }
        },

        getTotalCarts : function(){
            let total = 0
            for (let i = 0; i < this.carts.length; i++) {
                total += this.carts[i].subtotal
            }
            return total
        },

        getAllItems:  function(){
            axios
                .get('http://localhost:3000/items')
                .then(response =>{
                    // console.log(response.data.items)
                    this.filteredItems = response.data.items
                    this.items = this.filteredItems 
                })
                .catch(error=>{
                    console.log(error)
                })
        },

        getAllCategories:function(){
            axios
                .get('http://localhost:3000/categories')
                .then(response=>{
                    this.categories = response.data.categories
                })
                .catch(error=>{
                    console.log(error)
                })
        },

        filterCategory: function(id){
            if(id ===  'all'){
                this.items = this.filteredItems
            } else {
                console.log(id)
                axios
                    .get(`http://localhost:3000/categories/${id}`)
                    .then(response=>{
                        // console.log(response.data.category)
                        this.items = response.data.category.items
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            }
        },

        isLogin: function(){
            let token = localStorage.getItem('token')
            if(token){
                return true
            } else {
                return false
            }
        },

        setPage: function(page){
            this.page = page
        }, 

        login: function(user){
            axios
                .post('http://localhost:3000/users/login', this.user)
                .then(function(response){
                    // console.log(response.data.name)
                    localStorage.setItem('name', response.data.name)
                    this.username = localStorage.getItem('name')
                    localStorage.setItem('token', response.data.token)
                    this.token = localStorage.getItem('token')
                    location.reload()
                })
                .catch(error=>{
                    // console.log(error)
                    // console.log(error.response.data.message)
                    this.errorLogin = error.response

                })
        },

        logout: function(){
            localStorage.clear()
            this.token = ''
            location.reload()
        },

        isEmail: function(input){
            
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(this.user.email !== ''){
                return re.test(String(input).toLowerCase());
            }
        },
        
        getUserItems: function(){
            axios
                .get('http://localhost:3000/items', {headers: this.token})
                .then(response=>{
                    this.items = response.data.items

                })
                .catch(err=>{
                    console.log(err.response)
                })
        },

        createItem: function(){
            this.showForm = true
        }, 
        toUser: function(){
            this.setPage('single-page-user')
            this.getUserItems()
        }
    }
})