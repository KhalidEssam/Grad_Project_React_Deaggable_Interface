function connectElementsWithArrow() {
const container = document.querySelector('.leftcontainer');

if (!container) {
    console.error('Container not found.');
    return;
}

const elements = Array.from(container.querySelectorAll('*'));

elements.forEach((element) => {
    if (element.classList.contains('leftcontainer')) return;

    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    element.appendChild(arrow);
});
}
  

  
export default connectElementsWithArrow