import React from 'react';
import Loader from '../../Loader';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';

const Signin = () => {
  return (
    <div>
        <div className="boxed-inner">
        <Loader />

        <div className="wrapper">
      <section className="login-content">
         <div className="row m-0 align-items-center bg-white vh-100">            
            <div className="col-md-6">
               <div className="row justify-content-center">
                  <div className="col-md-10">
                     <div className="card card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <div className="card-body">
                           <Link className="navbar-brand d-flex align-items-center mb-3" to="/">
                              {/* <!--Logo start--> */}
                              <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 30 30" width="30" fill="none">
                                 <path width="28" fill="currentColor" d="M16,9H0V3A3,3,0,0,1,3,0H13a3,3,0,0,1,3,3Zm7.414-5L19.707.293,18.293,1.707,20,3.414V6a2,2,0,0,0,2,2V18a1,1,0,0,1-2,0V17a3,3,0,0,0-3-3H16V11H0V24H16V16h1a1,1,0,0,1,1,1v1a3,3,0,0,0,6,0V5.414A2.011,2.011,0,0,0,23.414,4Z"/>
                              </svg>
                              {/* <!--logo End-->         */}
                              <h3 class="logo-title">MyPump</h3>
                           </Link>
                           <h4 className="mb-2 text-center">Sign In</h4>
                           <p className="text-center">Login to access MyPump Application.</p>
                           <form>
                              <div className="row">
                                 <div className="col-lg-12">
                                    <div className="form-group">
                                       <label htmlFor="email" className="form-label">Email</label>
                                       <input type="email" className="form-control" id="email" aria-describedby="email" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-12">
                                    <div className="form-group">
                                       <label htmlFor="password" className="form-label">Password</label>
                                       <input type="password" className="form-control" id="password" aria-describedby="password" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-12 d-flex justify-content-end">
                                    {/* <div className="form-check mb-3">
                                       <input type="checkbox" className="form-check-input" id="customCheck1" />
                                       <label className="form-check-label" htmlFor="customCheck1">Remember Me</label>
                                    </div> */}
                                    <Link className="text-underline" to="/recoverpassword">Forgot Password?</Link>
                                 </div>
                              </div>
                              <div className="d-flex justify-content-center mt-3">
                                 <button type="submit" className="btn btn-primary">Sign In</button>
                              </div>
                              <div className="mt-3 text-center">
                                 Don’t have an account? <Link className="text-underline" to="/signup">Click here to sign up.</Link>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="sign-bg">
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
            <div className="col-md-6 d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden">
               <img src="../../assets/images/auth/01.png" className="img-fluid gradient-main animated-scaleX" alt="images" />
            </div>
         </div>
      </section>
      </div>
    </div>
    <Footer />

    </div>
  )
}

export default Signin