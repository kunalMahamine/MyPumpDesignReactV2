(function () {
    "use strict";
    /*---------------------------------------------------------------------
        Fieldset
    -----------------------------------------------------------------------*/
    
    let currentTab =0;


    
    const ActiveTab=(n)=>{
        if(n==0){
            document.getElementById("fuel").classList.add("active");
            document.getElementById("fuel").classList.remove("done");
            
            document.getElementById("other").classList.remove("done");
            document.getElementById("other").classList.remove("active");
            document.getElementById("records").classList.remove("done");
            document.getElementById("records").classList.remove("active");
            document.getElementById("stock").classList.remove("done");
            document.getElementById("stock").classList.remove("active");
            document.getElementById("review").classList.remove("done");
            document.getElementById("review").classList.remove("active");
            document.getElementById("confirm").classList.remove("done");
            document.getElementById("confirm").classList.remove("active");
        }
        if(n==1){
            document.getElementById("fuel").classList.add("done");
            
            document.getElementById("other").classList.add("active");
            document.getElementById("other").classList.remove("done");
            
            document.getElementById("records").classList.remove("done");
            document.getElementById("records").classList.remove("active");
            document.getElementById("stock").classList.remove("done");
            document.getElementById("stock").classList.remove("active");
            document.getElementById("review").classList.remove("done");
            document.getElementById("review").classList.remove("active");
            document.getElementById("confirm").classList.remove("done");
            document.getElementById("confirm").classList.remove("active");
        }
        if(n==2){
            document.getElementById("fuel").classList.add("done");
            document.getElementById("other").classList.add("done");
            
            document.getElementById("records").classList.add("active");
            document.getElementById("records").classList.remove("done");
            
            document.getElementById("stock").classList.remove("done");
            document.getElementById("stock").classList.remove("active");
            document.getElementById("review").classList.remove("done");
            document.getElementById("review").classList.remove("active");
            document.getElementById("confirm").classList.remove("done");
            document.getElementById("confirm").classList.remove("active");
        }
        if(n==3){
            document.getElementById("fuel").classList.add("done");
            document.getElementById("other").classList.add("done");
            document.getElementById("records").classList.add("done");
            
            document.getElementById("stock").classList.add("active");
            document.getElementById("stock").classList.remove("done");
            
            document.getElementById("review").classList.remove("done");
            document.getElementById("review").classList.remove("active");
            document.getElementById("confirm").classList.remove("done");
            document.getElementById("confirm").classList.remove("active");
        }
        if(n==4){
            document.getElementById("fuel").classList.add("done");
            document.getElementById("other").classList.add("done");
            document.getElementById("records").classList.add("done");
            document.getElementById("stock").classList.add("done");
                        
            document.getElementById("review").classList.add("active");
            document.getElementById("review").classList.remove("done");
                        
            document.getElementById("confirm").classList.remove("done");
            document.getElementById("confirm").classList.remove("active");
        }
        if(n==5){
            document.getElementById("fuel").classList.add("done");
            document.getElementById("other").classList.add("done");
            document.getElementById("records").classList.add("done");
            document.getElementById("stock").classList.add("done");
            document.getElementById("review").classList.add("done");
            
            document.getElementById("confirm").classList.add("active");                        
            document.getElementById("confirm").classList.remove("done");

        }
        /*if(n==5){
            document.getElementById("fuel").classList.add("done");
            document.getElementById("other").classList.add("done");
            document.getElementById("records").classList.add("done");
            document.getElementById("confirm").classList.add("active");
            document.getElementById("confirm").classList.remove("done");
        }*/
    } 
    const showTab=(n)=>{
        var x = document.getElementsByTagName("fieldset");
        x[n].style.display = "block";
        console.log(n);
        ActiveTab(n);
       
    }
    const nextBtnFunction= (n) => {
        var x = document.getElementsByTagName("fieldset");
        x[currentTab].style.display = "none";
        currentTab = currentTab + n;
        showTab(currentTab);
    }
    
    const nextbtn= document.querySelectorAll('.next')
    Array.from(nextbtn, (nbtn) => {
    nbtn.addEventListener('click',function()
    {
        nextBtnFunction(1);
    })
});

// previousbutton

const prebtn= document.querySelectorAll('.previous')
    Array.from(prebtn, (pbtn) => {
    pbtn.addEventListener('click',function()
    {
        nextBtnFunction(-1);
    })
});
    
})()