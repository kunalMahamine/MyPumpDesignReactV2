import React from 'react'

import Daybook from './pages/Daybook'
import Lubricants from './pages/Lubricants'
import Stockreport from './pages/Stockreport'
import Lubricanttransactions from './pages/Lubricanttransactions'
import Lubricantpurchase from './pages/Lubricantpurchase'
import Customers from './pages/Customers'
import Customerledger from './pages/Customerledger'
import Expenses from './pages/Expenses'
import Dsrms from './pages/Dsrms'
import Dsrhsd from './pages/Dsrhsd'
import Profit from './pages/Profit'
import Daily from './pages/Daily'
import Changepassword from './pages/Changepassword'
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin'
import Recoverpassword from './pages/auth/Recoverpassword'
import Confirmmail from './pages/auth/Confirmmail'

import Home from './pages/Home'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/daybook' element={<Daybook />}/>
      <Route path='/lubricants' element={<Lubricants />}/>
      <Route path='/stockreport' element={<Stockreport />}/>
      <Route path='/lubricanttransactions' element={<Lubricanttransactions />}/>
      <Route path='/lubricantpurchase' element={<Lubricantpurchase />}/>
      <Route path='/customers' element={<Customers />}/>
      <Route path='/customerledger' element={<Customerledger />}/>
      <Route path='/expenses' element={<Expenses />}/>
      <Route path='/dsrms' element={<Dsrms />}/>
      <Route path='/dsrhsd' element={<Dsrhsd />}/>
      <Route path='/profit' element={<Profit />}/>
      <Route path='/daily' element={<Daily />}/>
      <Route path='/changepassword' element={<Changepassword />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/signin' element={<Signin />}/>
      <Route path='/recoverpassword' element={<Recoverpassword />}/>
      <Route path='/confirmmail' element={<Confirmmail />}/>

    </Routes>
    </BrowserRouter>
  )
}

export default App