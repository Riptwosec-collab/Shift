import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Build-time PWA icon generator. No external dependencies.
const folder=path.join(process.cwd(),'icons');
const signature=Buffer.from('89504e470d0a1a0a','hex');
function decode(file){
 const bytes=fs.readFileSync(file);
 if(!bytes.subarray(0,8).equals(signature))throw Error('Invalid Shift source icon');
 let width=0,height=0,palette=null,depth=0,colorType=0,idat=[];
 for(let offset=8;offset<bytes.length;){
  const len=bytes.readUInt32BE(offset),name=bytes.toString('ascii',offset+4,offset+8),chunk=bytes.subarray(offset+8,offset+8+len);
  if(name==='IHDR'){width=chunk.readUInt32BE(0);height=chunk.readUInt32BE(4);depth=chunk[8];colorType=chunk[9]}
  if(name==='PLTE')palette=chunk;
  if(name==='IDAT')idat.push(chunk);
  offset+=len+12;
  if(name==='IEND')break;
 }
 if(depth!==8||colorType!==3||width!==128||height!==128||!palette)throw Error('Expected a 128px indexed Shift icon');
 const data=zlib.inflateSync(Buffer.concat(idat)),rgb=Buffer.alloc(width*height*3);let offset=0,previous=Buffer.alloc(width);
 for(let y=0;y<height;y++){
  const filter=data[offset++],row=Buffer.from(data.subarray(offset,offset+width));offset+=width;
  for(let x=0;x<width;x++){
   const l=x?row[x-1]:0,u=previous[x],ul=x?previous[x-1]:0;
   if(filter===1)row[x]=(row[x]+l)&255;
   else if(filter===2)row[x]=(row[x]+u)&255;
   else if(filter===3)row[x]=(row[x]+((l+u)>>1))&255;
   else if(filter===4){const p=l+u-ul,dl=Math.abs(p-l),du=Math.abs(p-u),dul=Math.abs(p-ul);row[x]=(row[x]+(dl<=du&&dl<=dul?l:du<=dul?u:ul))&255}
   else if(filter!==0)throw Error('Unsupported PNG filter '+filter);
   const source=row[x]*3,dest=(y*width+x)*3;
   if(source+2>=palette.length)throw Error('Invalid Shift icon palette');
   rgb[dest]=palette[source];rgb[dest+1]=palette[source+1];rgb[dest+2]=palette[source+2];
  }
  previous=row;
 }
 return {width,height,rgb};
}
let crcTable=null;
function crc32(bytes){
 if(!crcTable){crcTable=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;crcTable[i]=c>>>0}}
 let c=0xffffffff;for(const v of bytes)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;
}
function chunk(name,data){
 const out=Buffer.alloc(data.length+12);
 out.writeUInt32BE(data.length,0);out.write(name,4,4,'ascii');data.copy(out,8);
 out.writeUInt32BE(crc32(out.subarray(4,8+data.length)),8+data.length);
 return out;
}
function encode(size,bytes){
 const raw=Buffer.alloc(size*(size*3+1));
 for(let y=0;y<size;y++){
  let start=y*(size*3+1);raw[start]=1;
  for(let x=0;x<size*3;x++){const v=bytes[y*size*3+x],left=x>=3?bytes[y*size*3+x-3]:0;raw[start+1+x]=(v-left+256)&255}
 }
 const head=Buffer.alloc(13);head.writeUInt32BE(size,0);head.writeUInt32BE(size,4);head[8]=8;head[9]=2;
 return Buffer.concat([signature,chunk('IHDR',head),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
function resize(input,size,maskable){
 const out=Buffer.alloc(size*size*3),scale=maskable?0.79:1;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=((x+.5)/size-.5)/scale+.5,v=((y+.5)/size-.5)/scale+.5,i=(y*size+x)*3;
  if(u<0||u>=1||v<0||v>=1){out[i]=2;out[i+1]=7;out[i+2]=16;continue}
  const sx=u*input.width-.5,sy=v*input.height-.5,a=Math.max(0,Math.min(input.width-1,Math.floor(sx))),b=Math.max(0,Math.min(input.height-1,Math.floor(sy))),c=Math.min(input.width-1,a+1),d=Math.min(input.height-1,b+1),fx=Math.max(0,Math.min(1,sx-a)),fy=Math.max(0,Math.min(1,sy-b));
  for(let k=0;k<3;k++){
   const px=(xx,yy)=>input.rgb[(yy*input.width+xx)*3+k];
   out[i+k]=Math.round(((1-fx)*px(a,b)+fx*px(c,b))*(1-fy)+((1-fx)*px(a,d)+fx*px(c,d))*fy);
  }
 }
 return encode(size,out);
}
const icon=decode(path.join(folder,'shift-tt-source.png'));
for(const [file,size,mask] of [['shift-192.png',192,false],['shift-512.png',512,false],['shift-maskable-512.png',512,true],['shift-180.png',180,false],['shift-32.png',32,false]]){
 fs.writeFileSync(path.join(folder,file),resize(icon,size,mask));
}
