const forms= document.querySelector(".forms"),
        //pwShowHide = document.querySelectorAll(".forms"),
        links = document.querySelectorAll(".link");

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault(); //preventing form submit
        forms.classList.toggle("show-register");
    })
})