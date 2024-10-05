import React from 'react';
import Loader from '../../Loader';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';


const Recoverpassword = () => {
  return (
    <div>
    <div className="boxed-inner">
        <Loader />

    <div class="wrapper">
      <section class="login-content">
         <div class="row m-0 align-items-center bg-white vh-100">
            <div class="col-md-6 d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden">
               <img src="../../assets/images/auth/02.png" class="img-fluid gradient-main animated-scaleX" alt="images" />
            </div>
            <div class="col-md-6 p-0">               
               <div class="card card-transparent auth-card shadow-none d-flex justify-content-center mb-0">
                  <div class="card-body">
                    <Link className="navbar-brand d-flex align-items-center mb-3" to="/">
                              {/* <!--Logo start--> */}
                              <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 30 30" width="30" fill="none">
                                 <path width="28" fill="currentColor" d="M16,9H0V3A3,3,0,0,1,3,0H13a3,3,0,0,1,3,3Zm7.414-5L19.707.293,18.293,1.707,20,3.414V6a2,2,0,0,0,2,2V18a1,1,0,0,1-2,0V17a3,3,0,0,0-3-3H16V11H0V24H16V16h1a1,1,0,0,1,1,1v1a3,3,0,0,0,6,0V5.414A2.011,2.011,0,0,0,23.414,4Z"/>
                              </svg>
                              {/* <!--logo End-->         */}
                              <h3 class="logo-title">MyPump</h3>
                      </Link>
                     <h4 class="mb-2">Reset Password</h4>
                     <p>Enter your email address and we'll send you an email with instructions to reset your password.</p>
                     <form>
                        <div class="row">
                           <div class="col-lg-12">
                              <div class="floating-label form-group">
                                 <label for="email" class="form-label">Email</label>
                                 <input type="email" class="form-control" id="email" aria-describedby="email" placeholder=" " />
                              </div>
                           </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Reset</button>
                     </form>
                  </div>
               </div>               
               <div class="sign-bg sign-bg-right">
                  <svg width="280" height="230" viewBox="0 0 431 398" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g opacity="0.05">
                     <rect x="-157.085" y="193.773" width="543" height="77.5714" rx="38.7857" transform="rotate(-45 -157.085 193.773)" fill="#3B8AFF"/>
                     <rect x="7.46875" y="358.327" width="543" height="77.5714" rx="38.7857" transform="rotate(-45 7.46875 358.327)" fill="#3B8AFF"/>
                     <rect x="61.9355" y="138.545" width="310.286" height="77.5714" rx="38.7857" transform="rotate(45 61.9355 138.545)" fill="#3B8AFF"/>
                     <rect x="62.3154" y="-190.173" width="543" height="77.5714" rx="38.7857" transform="rotate(45 62.3154 -190.173)" fill="#3B8AFF"/>
                     </g>
                  </svg>
               </div>
            </div>
         </div>
      </section>
      </div>
    </div>
    <Footer />
    </div>
  )
}

export default Recoverpassword