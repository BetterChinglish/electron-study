
const { handleSend, showClipboardMsg } = window.myAPI;
const resultArea = document.querySelector('#result-area');
document.querySelector('#send-message').addEventListener('click', ()=>{
  handleSend();
})

document.querySelector('#send-message2')?.addEventListener('click', ()=>{
  console.log(showClipboardMsg())
})