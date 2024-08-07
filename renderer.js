
const { handleSend, showClipboardMsg, capture, testNativeImg } = window.myAPI;
const resultArea = document.querySelector('#result-area');
document.querySelector('#send-message').addEventListener('click', ()=>{
  handleSend();
})

document.querySelector('#send-message2')?.addEventListener('click', ()=>{
  console.log(showClipboardMsg())
})

const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')
const video = document.querySelector('video')

startButton.addEventListener('click', () => {
  navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: {
      width: 500,
      height: 300,
      frameRate: 30
    }
  }).then(stream => {
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }).catch(e => console.log(e))
})

stopButton.addEventListener('click', () => {
  video.pause()
})

document.querySelector('#send-message3').addEventListener('click', async ()=>{
  const result = await capture?.();
  const imgSrc = result?.thumbnail?.crop({
    x: 0,
    y: 0,
    width: 1920,
    height: 1080  
  }).toDataURL();
  const imgDom = document.querySelector('#capture-img');
  imgDom.src = imgSrc;
  console.log(imgSrc)
})

document.querySelector('#send-message4').addEventListener('click', ()=>{
  const result = testNativeImg();
  console.log(result.getSize());
})