const form = document.getElementById('form')?? null;
const solutionDiv = document.getElementById('solution');
let blocks;
form.addEventListener('submit', (e) => {
  e.preventDefault();
  blocks = document.getElementById('blocks').value.split(',').map(Number);

 
  const water = calculateWater(blocks);
  updateVisualization(water);
});

function calculateWater(blocks) {
  const water = [];
  const leftMax = [];
  const rightMax = [];
  let currentLeftMax = 0;
  let currentRightMax = 0;

  for (let i = 0; i < blocks.length; i++) {
    currentLeftMax = Math.max(currentLeftMax, blocks[i]);
    leftMax[i] = currentLeftMax;
  }

  for (let i = blocks.length - 1; i >= 0; i--) {
    currentRightMax = Math.max(currentRightMax, blocks[i]);
    rightMax[i] = currentRightMax;
  }

  for (let i = 0; i < blocks.length; i++) {
    water[i] = Math.min(leftMax[i], rightMax[i]) - blocks[i];
  }

  return water;
}

function updateVisualization(water) {

  solutionDiv.innerHTML = '';

  // Generate an SVG shape to visualize the solution
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (let i = 0; i < water.length; i++) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', i * 50);
    rect.setAttribute('y', 100 - blocks[i]);
    console.log( blocks[i])
    rect.setAttribute('width', 50);
    rect.setAttribute('height', blocks[i]);
    svg.appendChild(rect);
  }
  solutionDiv.appendChild(svg);
}
