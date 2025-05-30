// import { read, write } from 'https://esm.sh/ktx-parse@0.4.5';
// import { ZstdCodec } from 'https://cdn.skypack.dev/zstd-codec';
// //'https://esm.sh/zstd-codec@0.1.4';

// export async function compress(bytes, level = 5) {
//   const container = read(bytes);
//   console.log('compress: ', container);
  
//   const levelData = await new Promise((resolve) => {
//     ZstdCodec.run(zstd => {
//       const simple = new zstd.Simple();
//       const compressed = simple.compress(bytes, level);
//       resolve(compressed);
//     });
//   });
  
//   console.log(bytes.byteLength + ' -> ' + levelData.byteLength);
  
//   return bytes;
// };
