const form    = document.querySelector("form");
const loader  = document.querySelector('.loader')
const twivSelector = document.querySelector('.twivDisplay')

const API     = window.location.hostname === 'localhost' ? 'http://localhost:5000/twivs' : 'https://twiver.now.sh'

// setting loading gif to not display on default
loader.style.display = "none"
 
// event listener for submit, adding form data into an object
form.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(form);
  const name     = formData.get("name");
  const content  = formData.get("content");

  const twiv = {
    name,
    content
  };
  console.log(twiv);
  
  form.style.display   = "none"
  loader.style.display = ""
  
  // fetching data from our server, passing it through JSON.stringify
  fetch(API, {
    method: 'POST',
    body: JSON.stringify(twiv),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
        // setting a timeout to hide the form for 15seconds (rate limit is set to 15sec)
        setTimeout(() => {
          form.style.display = '';
        }, 15000 );
      
      listAllTwivs();
      loader.style.display = 'none';
  })
}); 

// function to get all the 'twivs' created and stored in the database than append them to the screen.
listAllTwivs = () => {
  twivSelector.innerHTML = ''
    fetch(API)
      .then(res => res.json())
      .then(twivs => {
        console.log(twivs)
        //reversing so it comes in order or newest to old
        twivs.reverse()
        // a for each loop creating elements to store the twivs in
        twivs.forEach(twiv => {
          const div = document.createElement('div');

          const header = document.createElement('h3')
          header.textContent = twiv.name
          div.appendChild(header)

          const contents = document.createElement('p')
          contents.textContent = twiv.content
          div.appendChild(contents)

          const date = document.createElement('small')
          date.textContent = new Date(twiv.created)
          div.appendChild(date)

          twivSelector.appendChild(div)
        });
      });
}
