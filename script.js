import { KTX2Exporter } from 'https://esm.sh/three@0.142.0/examples/jsm/exporters/KTX2Exporter.js';
import { LUT1DCubeLoader } from './LUT1DCubeLoader.js';
import { LUTCubeLoader as LUT3DCubeLoader } from 'https://esm.sh/three@0.142.0/examples/jsm/loaders/LUTCubeLoader.js';
import { getFilesFromDataTransferItems } from "https://esm.sh/@placemarkio/flat-drop-files@1.0.2";

const zoneEl = document.querySelector('.dropzone');
const inputsEl = document.querySelector('.inputs');
const outputsEl = document.querySelector('.outputs');

const loader1D = new LUT1DCubeLoader();
const loader3D = new LUT3DCubeLoader();
const exporter = new KTX2Exporter();

zoneEl.addEventListener('dragenter', (e) => { e.preventDefault(); });
zoneEl.addEventListener('dragover', (e) => { e.preventDefault(); });
zoneEl.addEventListener('drop', (e) => {
  e.preventDefault();
  zoneEl.setAttribute('data-state', 'ready');
  getFilesFromDataTransferItems(e.dataTransfer.items).then(async files => {
    for (const file of files) {
      await processInputFile(file);
    }
  });
});

async function processInputFile(file) {
  // display input file
  const srcEl = document.createElement('li');
  srcEl.textContent = file.name;
  inputsEl.appendChild(srcEl);

  // TODO: Select precision — u8, f16, f32
  // TODO: Support ZSTD compression
  // TODO: Assign color primaries and transfer function
  try {
    // convert and display output file
    const dstEl = document.createElement('li');
    const { name, dimensions, output } = await _processInputFile(file);
    const linkEl = document.createElement('a');
    linkEl.textContent = name;
    linkEl.href = URL.createObjectURL(new Blob([output], {type: 'octet/stream'}));
    linkEl.download = name;
    console.log('name', name);
    dstEl.appendChild(linkEl);
    srcEl.appendChild(createStatsEl(file.size, dimensions));
    dstEl.appendChild(createStatsEl(output.byteLength, dimensions));
    outputsEl.appendChild(dstEl);
  } catch (e) {
    // error reporting
    srcEl.classList.add('error');
    const errorEl = document.createElement('small');
    errorEl.classList.add('error-text');
    errorEl.textContent = e.message;
    srcEl.appendChild(errorEl);
  }
}

async function _processInputFile(file) {
  let name;
  let dimensions;
  let cube;
  let output;

  if (!file.name.endsWith('.cube')) {
    throw new Error('Only 1D or 3D LUTs in ".cube" format supported');
  }
  name = file.name.replace(/\.cube$/, '.ktx2');

  const textContent = (await file.text()).trim();

  if (textContent.includes('LUT_3D_SIZE')) {
    cube = loader3D.parse(textContent);
    const {width, height, depth} = cube.texture3D.source.data;
    dimensions = [width, height, depth];
    output = exporter.parse(cube.texture3D);
  } else if (textContent.includes('LUT_1D_SIZE')) {
    cube = loader1D.parse(textContent);
    const {width, height} = cube.source.data;
    dimensions = [width, height];
    output = exporter.parse(cube);
  } else {
    throw new Error('Only 1D or 3D LUTs in ".cube" format supported');
  }

  // output = await compress(output);

  return { name, dimensions, output };
}

function createStatsEl(byteLength, dimensions) {
  const el = document.createElement('div');
  el.classList.add('stats-text');
  el.textContent = formatBytes(byteLength) + ', ' + dimensions.join('x');
  return el;
}

function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';
	const k = 1000;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

window.tippy('[data-tippy-content]', {
  content: '',
  placement: 'left',
  flip: true
});
