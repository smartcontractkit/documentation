const sat = document.getElementById('docsat');
let rating = 0;
let submitted = false;

const star = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
<path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
</svg>`
const starOutline = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
<path fill="currentColor" d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" />
</svg>`

select = (n) => (event) => {
  console.log('event', event)
  if (n + 1 === rating) {
    rating = 0
  } else {
    rating = n + 1
  }
  submitted = false;
  render();
  const path = 'https://docs2-cl-default-rtdb.firebaseio.com/allratings.json';
  const data = {rating,time:Date.now(),url:window.location.href};
  SULX.post(path, JSON.stringify(data));
}
render = () => {
  sat.innerHTML = `
  <div id="starBox">
  </div>
    <div id="docsatFeedback" style="display:${rating && !submitted ? 'block' : 'none'};position:absolute;right:0;background-color:white;border:1px solid #CCC;padding:8px;">
        Tell us more about your experience.
        <form id="docsatForm">
            <textarea name="feedback" style="width:100%;"></textarea><br/>
            <button type="submit">Submit</button>
        </form>
    </div>`;
  let stars = ''
  for (let i = 0; i < 5; i++) {
    let child = document.createElement('span')
    if (rating > i) {
      child.innerHTML = star;
    } else {
      child.innerHTML = starOutline;
    }
    child.addEventListener('click', select(i))
    document.getElementById('starBox').appendChild(child);
  }

  document.getElementById('docsatForm').addEventListener('submit',(event) => {
    event.preventDefault();
    
    submitted = true;
    const path = 'https://docs2-cl-default-rtdb.firebaseio.com/feedback.json';
    const data = {rating,time:Date.now(),msg:event.target[0].value,url:window.location.href};
    SULX.post(path, JSON.stringify(data));
    render();
  });
}
render()
