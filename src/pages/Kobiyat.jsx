import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Kobiyat() {
    const[products,setproducts]=useState([])
    const[kobiyat,set9obiyat]=useState([])
    useEffect(()=>{
        axios.get('http://localhost:8000/api/products').then(
            res=>setproducts(res.data.products)
        )
        set9obiyat(products.filter((product)=>{
            return product.category==='kobiyat'
        }))
    })
  return (
    <div>
         
    </div>
  )
}
