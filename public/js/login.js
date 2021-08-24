//alerts 
const hideAlert = () =>{

    const el = document.querySelector('.alert')
    if(el) el.parentElement.removeChild(el)
}
// type: 'success or err'
const showAlert = (type,message)=>{
    hideAlert()
    const markup = `<div class="alert alert--${type}">${message}</div>`
    console.log(markup);
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    console.log(markup);
    window.setTimeout(hideAlert,5000)
}

//DOM EL 
const loginForm = document.querySelector('.form--login')


const login = async (email,password)=>{
   console.log(email, password);
   try{
       const res = await axios({
           method:'POST',
           url:'http://localhost:3000/api/v1/users/login',
           data:{
               email,
               password
            }
        })
        console.log(email, password);
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
            url:'http://localhost:3000/api/v1/users/logout'
         })
         console.log('llllllllllllllllll', await res.data.status);
         if(res.data.status = 'success'){
             location.reload(true)
         }
    }catch(err){
        console.log('KKKKKKKKKKKKKKKKKKKKK', res.data.status);
        console.log(err.message);
        showAlert('error','Error loogging out! try again')
    }
}

const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')

//logout button 
const logoutBtn = document.querySelector('.nav__el--logout')
if(logoutBtn) logoutBtn.addEventListener('click',logout)

// update user data 
// type is either password or data 
const updateSettings = async (data , type) =>{
    try{
        console.log('ggggggggggggg');
        const url = type === 'password' ? 'http://localhost:3000/api/v1/users/updateMyPassword' : 
        'http://localhost:3000/api/v1/users/updateme' 
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
        const email = document.getElementById('email').value
        const name = document.getElementById('name').value
        console.log(email,name);
        updateSettings({name,email},'data')
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