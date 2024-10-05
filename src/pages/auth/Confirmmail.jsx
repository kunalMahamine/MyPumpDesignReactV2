import React from 'react';
import Loader from '../../Loader';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';

const Confirmmail = () => {
  return (
    <div>
    <div className="boxed-inner">
        <Loader />

        <div className="wrapper">
      <section className="login-content">
         <div className="row m-0 align-items-center bg-white vh-100">            
            <div className="col-md-6 p-0">    
               <div className="card card-transparent auth-card shadow-none d-flex justify-content-center mb-0">
                  <div className="card-body">
                        <Link className="navbar-brand d-flex align-items-center mb-3" to="/">
                              {/* <!--Logo start--> */}
                              <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 30 30" width="30" fill="none">
                                 <path width="28" fill="currentColor" d="M16,9H0V3A3,3,0,0,1,3,0H13a3,3,0,0,1,3,3Zm7.414-5L19.707.293,18.293,1.707,20,3.414V6a2,2,0,0,0,2,2V18a1,1,0,0,1-2,0V17a3,3,0,0,0-3-3H16V11H0V24H16V16h1a1,1,0,0,1,1,1v1a3,3,0,0,0,6,0V5.414A2.011,2.011,0,0,0,23.414,4Z"/>
                              </svg>
                              {/* <!--logo End-->         */}
                              <h3 class="logo-title">MyPump</h3>
                        </Link>
                        <img src="../../assets/images/auth/mail.png" className="img-fluid" width="80" alt="" />
                        <h2 className="mt-3 mb-0">Success !</h2>
                        <p className="cnf-mail mb-1">A email has been send to youremail@domain.com. Please check for an
                           email from Binary Bird and click
                           on the included link to reset your password.</p>
                        <div className="d-inline-block w-100">
                        <Link className="btn btn-primary mt-3" to="/">Back to Home</Link>
                        </div>
                  </div>
               </div>
            </div>
            <div className="col-md-6 d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden">
               <img src="../../assets/images/auth/03.png" className="img-fluid gradient-main animated-scaleX" alt="images" />
            </div>
         </div>
      </section>
      </div>
    </div>
    <Footer />
    </div>
  )
}

export default Confirmmail