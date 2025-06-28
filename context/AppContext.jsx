'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const {user}= useUser()
    const {getToken} =useAuth()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [buyNowItem, setBuyNowItem] = useState(null); 


    const fetchProductData = async () => {
        try {
            const {data} =await axios.get('/api/products/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            if(user.publicMetadata.role ==="seller"){
                setIsSeller(true)
            }

            setUserData(userDummyData)

            const token= await getToken()
            const response = await axios.get('/api/user/data', {
           headers: { Authorization: `Bearer ${token}` }
            });  
           const data = response.data;

            if (data.success && data.user) {
            setUserData(data.user);
            setCartItems(data.user.cartItems || {});
          } else {
           toast.error(data.message || "Something went wrong");
           }

        } catch (error) {
            console.error("Fetch user data failed:", error);
            toast.error("Failed to load user data");
        }
    }

    const addToCart = async (itemId) => {
        if (buyNowItem) return; 
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        if (user){
            try {
                const token = await getToken();
                await axios.post('/api/cart/update',{cartData}, {headers:{Authorization:`bearer ${token}`}})
                toast.success('Item added to cart')
                
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        if (user){
            try {
                const token = await getToken();
                await axios.post('/api/cart/update',{cartData}, {headers:{Authorization:`bearer ${token}`}})
                toast.success('Cart Updated')
                
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

const buyNow = (itemId) => {
  if (buyNowItem) return; // Skip if buyNowItem is already set
  setBuyNowItem({ product: itemId, quantity: 1 });
  router.push('/order-summary');
};



    const getOrderItemCount = () => {
    if (buyNowItem) {
        return buyNowItem.quantity;
    }
    let total = 0;
    for (const itemId in cartItems) {
        total += cartItems[itemId];
    }
    return total;
};

const getOrderAmount = () => {
    if (buyNowItem) {
        const product = products.find(p => p._id === buyNowItem.product);
        return product ? product.offerPrice * buyNowItem.quantity : 0;
    }

    let total = 0;
    for (const itemId in cartItems) {
        const product = products.find(p => p._id === itemId);
        if (product) {
            total += product.offerPrice * cartItems[itemId];
        }
    }
    return Math.floor(total * 100) / 100;
};


    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
    if (user && window.location.pathname !== "/order-summary") {
        fetchUserData();
    }
}, [user]);

    const value = {
        user,getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getOrderItemCount, getOrderAmount,
        buyNow,
        buyNowItem, setBuyNowItem 
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}