import React from 'react';
import Loader from '../../Loader';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div>
    <div className="boxed-inner">
        <Loader />

    <div className="wrapper">
      <section className="login-content">
         <div className="row m-0 align-items-center bg-white vh-100">            
               <div className="col-md-6 d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden">
               <img src="../../assets/images/auth/05.png" className="img-fluid gradient-main animated-scaleX" alt="images" />
            </div>
            <div className="col-md-6">               
               <div className="row justify-content-center">
                  <div className="col-md-10">
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
                           <h4 className="mb-2 text-center">Sign Up</h4>
                           <p className="text-center">Create your account.</p>
                           <form>
                              <div className="row">
                                 <div className="col-lg-6">
                                    <div className="form-group">
                                       <label htmlFor="full-name" className="form-label">Full Name</label>
                                       <input type="text" className="form-control" id="full-name" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="form-group">
                                       <label htmlFor="last-name" className="form-label">Last Name</label>
                                       <input type="text" className="form-control" id="last-name" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="form-group">
                                       <label htmlFor="email" className="form-label">Email</label>
                                       <input type="email" className="form-control" id="email" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="form-group">
                                       <label htmlFor="phone" className="form-label">Phone No.</label>
                                       <input type="text" className="form-control" id="phone" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="form-group">
                                       <label htmlFor="password" className="form-label">Password</label>
                                       <input type="password" className="form-control" id="password" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="form-group">
                                       <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                                       <input type="text" className="form-control" id="confirm-password" placeholder=" " />
                                    </div>
                                 </div>
                                 <div className="col-lg-12 d-flex justify-content-center">
                                    <div className="form-check mb-3">
                                       <input type="checkbox" className="form-check-input" id="customCheck1" />
                                       <label className="form-check-label" htmlFor="customCheck1">I agree with the terms of use</label>
                                    </div>
                                 </div>
                              </div>
                              <div className="d-flex justify-content-center">
                                 <button type="submit" className="btn btn-primary">Sign Up</button>
                              </div>
                              <p className="mt-3 text-center">
                                 Already have an Account <Link className="text-underline" to="/signin">Sign In</Link>
                              </p>
                           </form>
                        </div>
                     </div>    
                  </div>
               </div>           
               <div className="sign-bg sign-bg-right">
                  <svg width="280" height="230" viewBox="0 0 421 359" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g opacity="0.05">
                        <rect x="-15.0845" y="154.773" width="543" height="77.5714" rx="38.7857" transform="rotate(-45 -15.0845 154.773)" fill="#3A57E8"/>
                        <rect x="149.47" y="319.328" width="543" height="77.5714" rx="38.7857" transform="rotate(-45 149.47 319.328)" fill="#3A57E8"/>
                        <rect x="203.936" y="99.543" width="310.286" height="77.5714" rx="38.7857" transform="rotate(45 203.936 99.543)" fill="#3A57E8"/>
                        <rect x="204.316" y="-229.172" width="543" height="77.5714" rx="38.7857" transform="rotate(45 204.316 -229.172)" fill="#3A57E8"/>
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

export default Signup