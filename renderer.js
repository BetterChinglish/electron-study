
const { handleSend } = window.myAPI;
const resultArea = document.querySelector('#result-area');
document.querySelector('#send-message').addEventListener('click', ()=>{
    handleSend();
})
