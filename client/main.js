const form   = document.querySelector("form");
const loader = document.querySelector('.loader')

// setting loading gif to not display on default
loader.style.display = "none"

// event listener for submit, adding form data into an object
form.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(form);
  const name     = formData.get("name");
  const content  = formData.get("content");

  const twiver   = {
    name,
    content

  };
  form.style.display   = "none"
  loader.style.display = ""
  console.log(twiver);
}); 
