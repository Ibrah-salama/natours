//alerts 
const hideAlert = () =>{

    const el = document.querySelector('.alert')
    if(el) el.parentElement.removeChild(el)
}
// type: 'success or err'
const showAlert = (type,message)=>{
    hideAlert()
    const markup = `<div class="alert alert--${type}">${message}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(hideAlert,5000)
}

//DOM EL 
const loginForm = document.querySelector('.form--login')


const login = async (email,password)=>{
   try{
       const res = await axios({
           method:'POST',
           url:'/api/v1/users/login',
           data:{
               email,
               password
            }
        })
    if(res.data.status === 'success'){
        showAlert('success','Logged in successfully')
        window.setTimeout(()=>{
            location.assign("/")
        },1500)
    }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}

if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email,password)
    })
}

const logout = async () =>{
    try{
        const res = await axios({
            method:'GET',
            url:'/api/v1/users/logout'
         })
         if(res.data.status = 'success'){
             location.reload(true)
         }
    }catch(err){
        showAlert('error','Error loogging out! try again')
    }
}

const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')

//logout button 
const logoutBtn = document.querySelector('.nav__el--logout')
if(logoutBtn) logoutBtn.addEventListener('click',logout)

const updateSettings = async (data , type) =>{
    try{
        const url = type === 'password' ? 
        '/api/v1/users/updateMyPassword' : 
        '/api/v1/users/updateme' 
        const res = await axios({
            method:'PATCH',
            url,
            data
         })
         if(res.data.status = 'success'){
             showAlert('success',` ${type.toUpperCase()} Data updated successfully`)
         }
    }catch(err){ 
        showAlert('error',err.response.data.message)
    }
}

if(userDataForm){
    userDataForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        const form = new FormData()
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const photo = document.getElementById('photo').files[0]
        form.append('name', name)
        form.append('email', email)
        form.append('photo', photo)
        updateSettings(form,'data')
    })
}

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async (e)=>{
        e.preventDefault()

        document.querySelector('.btn--save-password').textContent = 'Updating...'

        const passwordCurrent = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const passwordConfirmed = document.getElementById('password-confirm').value
        await updateSettings({passwordCurrent,password,passwordConfirmed},'password')
        
        document.querySelector('.btn--save-password').textContent = 'Save password'

        document.getElementById('password-current').value =''
        document.getElementById('password').value =''
        document.getElementById('password-confirm').value = ''
    })
}

/// stripe
const bookBtn = document.getElementById("book-tour");

const stripe = Stripe(
  "pk_test_51JZSMUHBP0t2rx9eWQiWnV6Gxooo5W1xJVovNpiDOECXQaikNoy4aNntGRAShYZXrX7QuWkU1PkkAWqeiYQbxRkw00Y29Rt3Fa"
);

const bookTour = async (tourId) => {
  try {
    // 1) get checkout session from API
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) create checkout form + charge credit card
    // console.log(session)
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    showAlert("err".err);
  }
};

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}
