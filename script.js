const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const statsDiv = document.getElementById("stats");
const viewerDiv = document.getElementById("viewer");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return alert("Please select a file!");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log(data);

  statsDiv.innerHTML = `
    <p><strong>Strength:</strong> ${data.stats.strength}</p>
    <p><strong>Speed:</strong> ${data.stats.speed}</p>
    <p><strong>Agility:</strong> ${data.stats.agility}</p>
  `;

  if (data.modelPath) {
    loadModel(data.modelPath);
  }
});

function loadModel(url) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    viewerDiv.clientWidth / viewerDiv.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(viewerDiv.clientWidth, viewerDiv.clientHeight);
  viewerDiv.innerHTML = "";
  viewerDiv.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load(url, (gltf) => {
    scene.add(gltf.scene);
    camera.position.z = 3;

    function animate() {
      requestAnimationFrame(animate);
      gltf.scene.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  });
}
