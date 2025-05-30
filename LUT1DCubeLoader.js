import {
	ClampToEdgeWrapping,
	DataTexture,
	FloatType,
	LinearEncoding,
	LinearFilter,
	Loader,
	RedFormat,
	UVMapping,
} from 'https://esm.sh/three@0.142.0';

export class LUT1DCubeLoader extends Loader {
	load(path, onLoad, onError) {
		fetch(path)
			.then((res) => res.text())
			.then((text) => onLoad(this.parse(text)))
			.catch(onError);
	}
  parse(text) {
    const lines = text.split('\n');
    const length = Number(lines[0].split(' ').pop());

    // TODO(cleanup): HalfFloat maybe.
    const array = new Float32Array(length);
    for (let i = 1; i < lines.length; i++) {
      array[i - 1] = Number(lines[i].slice(0, 8));
    }

    const texture = new DataTexture(
      array,
      length,
      1,
      RedFormat,
      FloatType,
      UVMapping,
      ClampToEdgeWrapping,
      ClampToEdgeWrapping,
      LinearFilter,
      LinearFilter
    );

    texture.encoding = LinearEncoding;
    texture.flipY = false;
    texture.needsUpdate = true;

    return texture;
  }
}
