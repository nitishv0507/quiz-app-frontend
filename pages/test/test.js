// Get all elements with the class "topic"
const boxes = document.querySelectorAll('.topic');

// Iterate through each box and add a click event listener to change the location
boxes.forEach(box => {
    box.style.cursor = 'pointer'; // Change the cursor to a pointer
    box.addEventListener('click', function(e) {
        const link = box.querySelector('.link');
        if (link) {
            window.location.href = link.href;
        }
    });
});