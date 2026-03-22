(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Il="179",js={ROTATE:0,DOLLY:1,PAN:2},Ws={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Kp=0,_u=1,Zp=2,td=1,Jp=2,mi=3,ki=0,en=1,yi=2,zi=0,qs=1,gu=2,vu=3,yu=4,Qp=5,ss=100,tm=101,em=102,nm=103,im=104,sm=200,rm=201,om=202,am=203,Tc=204,wc=205,cm=206,lm=207,um=208,hm=209,dm=210,fm=211,pm=212,mm=213,_m=214,Ac=0,Rc=1,Ic=2,nr=3,Cc=4,Dc=5,Pc=6,Lc=7,ed=0,gm=1,vm=2,Vi=0,ym=1,Sm=2,xm=3,bm=4,Mm=5,Em=6,Tm=7,nd=300,ir=301,sr=302,Uc=303,Nc=304,wa=306,Fc=1e3,os=1001,Oc=1002,Hn=1003,wm=1004,io=1005,ti=1006,za=1007,as=1008,si=1009,id=1010,sd=1011,Fr=1012,Cl=1013,ls=1014,bi=1015,jr=1016,Dl=1017,Pl=1018,Or=1020,rd=35902,od=1021,ad=1022,zn=1023,Br=1026,zr=1027,cd=1028,Ll=1029,ld=1030,Ul=1031,Nl=1033,Lo=33776,Uo=33777,No=33778,Fo=33779,Bc=35840,zc=35841,Vc=35842,kc=35843,Hc=36196,Gc=37492,Wc=37496,Xc=37808,Yc=37809,jc=37810,qc=37811,$c=37812,Kc=37813,Zc=37814,Jc=37815,Qc=37816,tl=37817,el=37818,nl=37819,il=37820,sl=37821,Oo=36492,rl=36494,ol=36495,ud=36283,al=36284,cl=36285,ll=36286,Am=3200,Rm=3201,hd=0,Im=1,Oi="",Mn="srgb",rr="srgb-linear",$o="linear",_e="srgb",ys=7680,Su=519,Cm=512,Dm=513,Pm=514,dd=515,Lm=516,Um=517,Nm=518,Fm=519,xu=35044,bu="300 es",ei=2e3,Ko=2001;class ms{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bo=Math.PI/180,ul=180/Math.PI;function qr(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(je[n&255]+je[n>>8&255]+je[n>>16&255]+je[n>>24&255]+"-"+je[t&255]+je[t>>8&255]+"-"+je[t>>16&15|64]+je[t>>24&255]+"-"+je[e&63|128]+je[e>>8&255]+"-"+je[e>>16&255]+je[e>>24&255]+je[i&255]+je[i>>8&255]+je[i>>16&255]+je[i>>24&255]).toLowerCase()}function te(n,t,e){return Math.max(t,Math.min(e,n))}function Om(n,t){return(n%t+t)%t}function Va(n,t,e){return(1-e)*n+e*t}function yr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function rn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Bm={DEG2RAD:Bo};class Xt{constructor(t=0,e=0){Xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(te(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(te(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class us{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let c=i[s+0],l=i[s+1],u=i[s+2],h=i[s+3];const f=r[o+0],p=r[o+1],g=r[o+2],y=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=y;return}if(h!==y||c!==f||l!==p||u!==g){let m=1-a;const d=c*f+l*p+u*g+h*y,A=d>=0?1:-1,E=1-d*d;if(E>Number.EPSILON){const D=Math.sqrt(E),P=Math.atan2(D,d*A);m=Math.sin(m*P)/D,a=Math.sin(a*P)/D}const b=a*A;if(c=c*m+f*b,l=l*m+p*b,u=u*m+g*b,h=h*m+y*b,m===1-a){const D=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=D,l*=D,u*=D,h*=D}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,i,s,r,o){const a=i[s],c=i[s+1],l=i[s+2],u=i[s+3],h=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+u*h+c*p-l*f,t[e+1]=c*g+u*f+l*h-a*p,t[e+2]=l*g+u*p+a*f-c*h,t[e+3]=u*g-a*h-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(s/2),h=a(r/2),f=c(i/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*u*h+l*p*g,this._y=l*p*h-f*u*g,this._z=l*u*g+f*p*h,this._w=l*u*h-f*p*g;break;case"YXZ":this._x=f*u*h+l*p*g,this._y=l*p*h-f*u*g,this._z=l*u*g-f*p*h,this._w=l*u*h+f*p*g;break;case"ZXY":this._x=f*u*h-l*p*g,this._y=l*p*h+f*u*g,this._z=l*u*g+f*p*h,this._w=l*u*h-f*p*g;break;case"ZYX":this._x=f*u*h-l*p*g,this._y=l*p*h+f*u*g,this._z=l*u*g-f*p*h,this._w=l*u*h+f*p*g;break;case"YZX":this._x=f*u*h+l*p*g,this._y=l*p*h+f*u*g,this._z=l*u*g-f*p*h,this._w=l*u*h-f*p*g;break;case"XZY":this._x=f*u*h-l*p*g,this._y=l*p*h-f*u*g,this._z=l*u*g+f*p*h,this._w=l*u*h+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],h=e[10],f=i+a+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(u-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+u)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=i*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-i*l,this._z=r*u+o*l+i*c-s*a,this._w=o*u-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+i*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-e)*u)/l,f=Math.sin(e*u)/l;return this._w=o*h+this._w*f,this._x=i*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,i=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Mu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Mu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*i),u=2*(a*e-r*s),h=2*(r*i-o*e);return this.x=e+c*l+o*h-a*u,this.y=i+c*u+a*l-r*h,this.z=s+c*h+r*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(te(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ka.copy(this).projectOnVector(t),this.sub(ka)}reflect(t){return this.sub(ka.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(te(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ka=new N,Mu=new us;class jt{constructor(t,e,i,s,r,o,a,c,l){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l)}set(t,e,i,s,r,o,a,c,l){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],p=i[5],g=i[8],y=s[0],m=s[3],d=s[6],A=s[1],E=s[4],b=s[7],D=s[2],P=s[5],C=s[8];return r[0]=o*y+a*A+c*D,r[3]=o*m+a*E+c*P,r[6]=o*d+a*b+c*C,r[1]=l*y+u*A+h*D,r[4]=l*m+u*E+h*P,r[7]=l*d+u*b+h*C,r[2]=f*y+p*A+g*D,r[5]=f*m+p*E+g*P,r[8]=f*d+p*b+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-i*r*u+i*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=u*o-a*l,f=a*c-u*r,p=l*r-o*c,g=e*h+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=h*y,t[1]=(s*l-u*i)*y,t[2]=(a*i-s*o)*y,t[3]=f*y,t[4]=(u*e-s*c)*y,t[5]=(s*r-a*e)*y,t[6]=p*y,t[7]=(i*c-l*e)*y,t[8]=(o*e-i*r)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ha.makeScale(t,e)),this}rotate(t){return this.premultiply(Ha.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ha.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ha=new jt;function fd(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Zo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function zm(){const n=Zo("canvas");return n.style.display="block",n}const Eu={};function $s(n){n in Eu||(Eu[n]=!0,console.warn(n))}function Vm(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const Tu=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wu=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function km(){const n={enabled:!0,workingColorSpace:rr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===_e&&(s.r=Mi(s.r),s.g=Mi(s.g),s.b=Mi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===_e&&(s.r=Ks(s.r),s.g=Ks(s.g),s.b=Ks(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Oi?$o:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return $s("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return $s("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[rr]:{primaries:t,whitePoint:i,transfer:$o,toXYZ:Tu,fromXYZ:wu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Mn},outputColorSpaceConfig:{drawingBufferColorSpace:Mn}},[Mn]:{primaries:t,whitePoint:i,transfer:_e,toXYZ:Tu,fromXYZ:wu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Mn}}}),n}const oe=km();function Mi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ks(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ss;class Hm{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ss===void 0&&(Ss=Zo("canvas")),Ss.width=t.width,Ss.height=t.height;const s=Ss.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Ss}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Zo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Mi(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Mi(e[i]/255)*255):e[i]=Mi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Gm=0;class Fl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gm++}),this.uuid=qr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ga(s[o].image)):r.push(Ga(s[o]))}else r=Ga(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function Ga(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Hm.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wm=0;const Wa=new N;class ln extends ms{constructor(t=ln.DEFAULT_IMAGE,e=ln.DEFAULT_MAPPING,i=os,s=os,r=ti,o=as,a=zn,c=si,l=ln.DEFAULT_ANISOTROPY,u=Oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wm++}),this.uuid=qr(),this.name="",this.source=new Fl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Xt(0,0),this.repeat=new Xt(1,1),this.center=new Xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Wa).x}get height(){return this.source.getSize(Wa).y}get depth(){return this.source.getSize(Wa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==nd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Fc:t.x=t.x-Math.floor(t.x);break;case os:t.x=t.x<0?0:1;break;case Oc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Fc:t.y=t.y-Math.floor(t.y);break;case os:t.y=t.y<0?0:1;break;case Oc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=nd;ln.DEFAULT_ANISOTROPY=1;class Ue{constructor(t=0,e=0,i=0,s=1){Ue.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],u=c[4],h=c[8],f=c[1],p=c[5],g=c[9],y=c[2],m=c[6],d=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(l+1)/2,b=(p+1)/2,D=(d+1)/2,P=(u+f)/4,C=(h+y)/4,F=(g+m)/4;return E>b&&E>D?E<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(E),s=P/i,r=C/i):b>D?b<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),i=P/s,r=F/s):D<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),i=C/r,s=F/r),this.set(i,s,r,e),this}let A=Math.sqrt((m-g)*(m-g)+(h-y)*(h-y)+(f-u)*(f-u));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(h-y)/A,this.z=(f-u)/A,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this.w=te(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this.w=te(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(te(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xm extends ms{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ti,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ue(0,0,t,e),this.scissorTest=!1,this.viewport=new Ue(0,0,t,e);const s={width:t,height:e,depth:i.depth},r=new ln(s);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:ti,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Fl(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hs extends Xm{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class pd extends ln{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Hn,this.minFilter=Hn,this.wrapR=os,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ym extends ln{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Hn,this.minFilter=Hn,this.wrapR=os,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $r{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Pn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Pn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Pn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Pn):Pn.fromBufferAttribute(r,o),Pn.applyMatrix4(t.matrixWorld),this.expandByPoint(Pn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),so.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),so.copy(i.boundingBox)),so.applyMatrix4(t.matrixWorld),this.union(so)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Pn),Pn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Sr),ro.subVectors(this.max,Sr),xs.subVectors(t.a,Sr),bs.subVectors(t.b,Sr),Ms.subVectors(t.c,Sr),Ai.subVectors(bs,xs),Ri.subVectors(Ms,bs),$i.subVectors(xs,Ms);let e=[0,-Ai.z,Ai.y,0,-Ri.z,Ri.y,0,-$i.z,$i.y,Ai.z,0,-Ai.x,Ri.z,0,-Ri.x,$i.z,0,-$i.x,-Ai.y,Ai.x,0,-Ri.y,Ri.x,0,-$i.y,$i.x,0];return!Xa(e,xs,bs,Ms,ro)||(e=[1,0,0,0,1,0,0,0,1],!Xa(e,xs,bs,Ms,ro))?!1:(oo.crossVectors(Ai,Ri),e=[oo.x,oo.y,oo.z],Xa(e,xs,bs,Ms,ro))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Pn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Pn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ui),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ui=[new N,new N,new N,new N,new N,new N,new N,new N],Pn=new N,so=new $r,xs=new N,bs=new N,Ms=new N,Ai=new N,Ri=new N,$i=new N,Sr=new N,ro=new N,oo=new N,Ki=new N;function Xa(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ki.fromArray(n,r);const a=s.x*Math.abs(Ki.x)+s.y*Math.abs(Ki.y)+s.z*Math.abs(Ki.z),c=t.dot(Ki),l=e.dot(Ki),u=i.dot(Ki);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const jm=new $r,xr=new N,Ya=new N;class Aa{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):jm.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;xr.subVectors(t,this.center);const e=xr.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(xr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ya.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(xr.copy(t.center).add(Ya)),this.expandByPoint(xr.copy(t.center).sub(Ya))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const hi=new N,ja=new N,ao=new N,Ii=new N,qa=new N,co=new N,$a=new N;class Ra{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,hi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=hi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(hi.copy(this.origin).addScaledVector(this.direction,e),hi.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ja.copy(t).add(e).multiplyScalar(.5),ao.copy(e).sub(t).normalize(),Ii.copy(this.origin).sub(ja);const r=t.distanceTo(e)*.5,o=-this.direction.dot(ao),a=Ii.dot(this.direction),c=-Ii.dot(ao),l=Ii.lengthSq(),u=Math.abs(1-o*o);let h,f,p,g;if(u>0)if(h=o*c-a,f=o*a-c,g=r*u,h>=0)if(f>=-g)if(f<=g){const y=1/u;h*=y,f*=y,p=h*(h+o*f+2*a)+f*(o*h+f+2*c)+l}else f=r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*c)+l;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-c),r),p=-h*h+f*(f+2*c)+l):f<=g?(h=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-c),r),p=-h*h+f*(f+2*c)+l);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(ja).addScaledVector(ao,f),p}intersectSphere(t,e){hi.subVectors(t.center,this.origin);const i=hi.dot(this.direction),s=hi.dot(hi)-i*i,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(i=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),u>=0?(r=(t.min.y-f.y)*u,o=(t.max.y-f.y)*u):(r=(t.max.y-f.y)*u,o=(t.min.y-f.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-f.z)*h,c=(t.max.z-f.z)*h):(a=(t.max.z-f.z)*h,c=(t.min.z-f.z)*h),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,hi)!==null}intersectTriangle(t,e,i,s,r){qa.subVectors(e,t),co.subVectors(i,t),$a.crossVectors(qa,co);let o=this.direction.dot($a),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ii.subVectors(this.origin,t);const c=a*this.direction.dot(co.crossVectors(Ii,co));if(c<0)return null;const l=a*this.direction.dot(qa.cross(Ii));if(l<0||c+l>o)return null;const u=-a*Ii.dot($a);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pe{constructor(t,e,i,s,r,o,a,c,l,u,h,f,p,g,y,m){Pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l,u,h,f,p,g,y,m)}set(t,e,i,s,r,o,a,c,l,u,h,f,p,g,y,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=u,d[10]=h,d[14]=f,d[3]=p,d[7]=g,d[11]=y,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Es.setFromMatrixColumn(t,0).length(),r=1/Es.setFromMatrixColumn(t,1).length(),o=1/Es.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const f=o*u,p=o*h,g=a*u,y=a*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=p+g*l,e[5]=f-y*l,e[9]=-a*c,e[2]=y-f*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*u,p=c*h,g=l*u,y=l*h;e[0]=f+y*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=p*a-g,e[6]=y+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*u,p=c*h,g=l*u,y=l*h;e[0]=f-y*a,e[4]=-o*h,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*u,e[9]=y-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*u,p=o*h,g=a*u,y=a*h;e[0]=c*u,e[4]=g*l-p,e[8]=f*l+y,e[1]=c*h,e[5]=y*l+f,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,p=o*l,g=a*c,y=a*l;e[0]=c*u,e[4]=y-f*h,e[8]=g*h+p,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=p*h+g,e[10]=f-y*h}else if(t.order==="XZY"){const f=o*c,p=o*l,g=a*c,y=a*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=f*h+y,e[5]=o*u,e[9]=p*h-g,e[2]=g*h-p,e[6]=a*u,e[10]=y*h+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qm,t,$m)}lookAt(t,e,i){const s=this.elements;return pn.subVectors(t,e),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Ci.crossVectors(i,pn),Ci.lengthSq()===0&&(Math.abs(i.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Ci.crossVectors(i,pn)),Ci.normalize(),lo.crossVectors(pn,Ci),s[0]=Ci.x,s[4]=lo.x,s[8]=pn.x,s[1]=Ci.y,s[5]=lo.y,s[9]=pn.y,s[2]=Ci.z,s[6]=lo.z,s[10]=pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],p=i[13],g=i[2],y=i[6],m=i[10],d=i[14],A=i[3],E=i[7],b=i[11],D=i[15],P=s[0],C=s[4],F=s[8],x=s[12],S=s[1],T=s[5],X=s[9],H=s[13],Y=s[2],$=s[6],j=s[10],K=s[14],V=s[3],ot=s[7],ht=s[11],Mt=s[15];return r[0]=o*P+a*S+c*Y+l*V,r[4]=o*C+a*T+c*$+l*ot,r[8]=o*F+a*X+c*j+l*ht,r[12]=o*x+a*H+c*K+l*Mt,r[1]=u*P+h*S+f*Y+p*V,r[5]=u*C+h*T+f*$+p*ot,r[9]=u*F+h*X+f*j+p*ht,r[13]=u*x+h*H+f*K+p*Mt,r[2]=g*P+y*S+m*Y+d*V,r[6]=g*C+y*T+m*$+d*ot,r[10]=g*F+y*X+m*j+d*ht,r[14]=g*x+y*H+m*K+d*Mt,r[3]=A*P+E*S+b*Y+D*V,r[7]=A*C+E*T+b*$+D*ot,r[11]=A*F+E*X+b*j+D*ht,r[15]=A*x+E*H+b*K+D*Mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],h=t[6],f=t[10],p=t[14],g=t[3],y=t[7],m=t[11],d=t[15];return g*(+r*c*h-s*l*h-r*a*f+i*l*f+s*a*p-i*c*p)+y*(+e*c*p-e*l*f+r*o*f-s*o*p+s*l*u-r*c*u)+m*(+e*l*h-e*a*p-r*o*h+i*o*p+r*a*u-i*l*u)+d*(-s*a*u-e*c*h+e*a*f+s*o*h-i*o*f+i*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=t[9],f=t[10],p=t[11],g=t[12],y=t[13],m=t[14],d=t[15],A=h*m*l-y*f*l+y*c*p-a*m*p-h*c*d+a*f*d,E=g*f*l-u*m*l-g*c*p+o*m*p+u*c*d-o*f*d,b=u*y*l-g*h*l+g*a*p-o*y*p-u*a*d+o*h*d,D=g*h*c-u*y*c-g*a*f+o*y*f+u*a*m-o*h*m,P=e*A+i*E+s*b+r*D;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/P;return t[0]=A*C,t[1]=(y*f*r-h*m*r-y*s*p+i*m*p+h*s*d-i*f*d)*C,t[2]=(a*m*r-y*c*r+y*s*l-i*m*l-a*s*d+i*c*d)*C,t[3]=(h*c*r-a*f*r-h*s*l+i*f*l+a*s*p-i*c*p)*C,t[4]=E*C,t[5]=(u*m*r-g*f*r+g*s*p-e*m*p-u*s*d+e*f*d)*C,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*d-e*c*d)*C,t[7]=(o*f*r-u*c*r+u*s*l-e*f*l-o*s*p+e*c*p)*C,t[8]=b*C,t[9]=(g*h*r-u*y*r-g*i*p+e*y*p+u*i*d-e*h*d)*C,t[10]=(o*y*r-g*a*r+g*i*l-e*y*l-o*i*d+e*a*d)*C,t[11]=(u*a*r-o*h*r-u*i*l+e*h*l+o*i*p-e*a*p)*C,t[12]=D*C,t[13]=(u*y*s-g*h*s+g*i*f-e*y*f-u*i*m+e*h*m)*C,t[14]=(g*a*s-o*y*s-g*i*c+e*y*c+o*i*m-e*a*m)*C,t[15]=(o*h*s-u*a*s+u*i*c-e*h*c-o*i*f+e*a*f)*C,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,c=t.z,l=r*o,u=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+i,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,u=o+o,h=a+a,f=r*l,p=r*u,g=r*h,y=o*u,m=o*h,d=a*h,A=c*l,E=c*u,b=c*h,D=i.x,P=i.y,C=i.z;return s[0]=(1-(y+d))*D,s[1]=(p+b)*D,s[2]=(g-E)*D,s[3]=0,s[4]=(p-b)*P,s[5]=(1-(f+d))*P,s[6]=(m+A)*P,s[7]=0,s[8]=(g+E)*C,s[9]=(m-A)*C,s[10]=(1-(f+y))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=Es.set(s[0],s[1],s[2]).length();const o=Es.set(s[4],s[5],s[6]).length(),a=Es.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ln.copy(this);const l=1/r,u=1/o,h=1/a;return Ln.elements[0]*=l,Ln.elements[1]*=l,Ln.elements[2]*=l,Ln.elements[4]*=u,Ln.elements[5]*=u,Ln.elements[6]*=u,Ln.elements[8]*=h,Ln.elements[9]*=h,Ln.elements[10]*=h,e.setFromRotationMatrix(Ln),i.x=r,i.y=o,i.z=a,this}makePerspective(t,e,i,s,r,o,a=ei,c=!1){const l=this.elements,u=2*r/(e-t),h=2*r/(i-s),f=(e+t)/(e-t),p=(i+s)/(i-s);let g,y;if(c)g=r/(o-r),y=o*r/(o-r);else if(a===ei)g=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Ko)g=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=ei,c=!1){const l=this.elements,u=2/(e-t),h=2/(i-s),f=-(e+t)/(e-t),p=-(i+s)/(i-s);let g,y;if(c)g=1/(o-r),y=o/(o-r);else if(a===ei)g=-2/(o-r),y=-(o+r)/(o-r);else if(a===Ko)g=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Es=new N,Ln=new Pe,qm=new N(0,0,0),$m=new N(1,1,1),Ci=new N,lo=new N,pn=new N,Au=new Pe,Ru=new us;class ri{constructor(t=0,e=0,i=0,s=ri.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],h=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(te(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-te(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Au.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Au,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ru.setFromEuler(this),this.setFromQuaternion(Ru,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ri.DEFAULT_ORDER="XYZ";class Ol{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Km=0;const Iu=new N,Ts=new us,di=new Pe,uo=new N,br=new N,Zm=new N,Jm=new us,Cu=new N(1,0,0),Du=new N(0,1,0),Pu=new N(0,0,1),Lu={type:"added"},Qm={type:"removed"},ws={type:"childadded",child:null},Ka={type:"childremoved",child:null};class Xe extends ms{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Km++}),this.uuid=qr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xe.DEFAULT_UP.clone();const t=new N,e=new ri,i=new us,s=new N(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Pe},normalMatrix:{value:new jt}}),this.matrix=new Pe,this.matrixWorld=new Pe,this.matrixAutoUpdate=Xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ol,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ts.setFromAxisAngle(t,e),this.quaternion.multiply(Ts),this}rotateOnWorldAxis(t,e){return Ts.setFromAxisAngle(t,e),this.quaternion.premultiply(Ts),this}rotateX(t){return this.rotateOnAxis(Cu,t)}rotateY(t){return this.rotateOnAxis(Du,t)}rotateZ(t){return this.rotateOnAxis(Pu,t)}translateOnAxis(t,e){return Iu.copy(t).applyQuaternion(this.quaternion),this.position.add(Iu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Cu,t)}translateY(t){return this.translateOnAxis(Du,t)}translateZ(t){return this.translateOnAxis(Pu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?uo.copy(t):uo.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(br,uo,this.up):di.lookAt(uo,br,this.up),this.quaternion.setFromRotationMatrix(di),s&&(di.extractRotation(s.matrixWorld),Ts.setFromRotationMatrix(di),this.quaternion.premultiply(Ts.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Lu),ws.child=t,this.dispatchEvent(ws),ws.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Qm),Ka.child=t,this.dispatchEvent(Ka),Ka.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),di.multiply(t.parent.matrixWorld)),t.applyMatrix4(di),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Lu),ws.child=t,this.dispatchEvent(ws),ws.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,t,Zm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,Jm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),h=o(t.shapes),f=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Xe.DEFAULT_UP=new N(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Un=new N,fi=new N,Za=new N,pi=new N,As=new N,Rs=new N,Uu=new N,Ja=new N,Qa=new N,tc=new N,ec=new Ue,nc=new Ue,ic=new Ue;class Fn{constructor(t=new N,e=new N,i=new N){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Un.subVectors(t,e),s.cross(Un);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Un.subVectors(s,e),fi.subVectors(i,e),Za.subVectors(t,e);const o=Un.dot(Un),a=Un.dot(fi),c=Un.dot(Za),l=fi.dot(fi),u=fi.dot(Za),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;const f=1/h,p=(l*c-a*u)*f,g=(o*u-a*c)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(t,e,i,s,r,o,a,c){return this.getBarycoord(t,e,i,s,pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pi.x),c.addScaledVector(o,pi.y),c.addScaledVector(a,pi.z),c)}static getInterpolatedAttribute(t,e,i,s,r,o){return ec.setScalar(0),nc.setScalar(0),ic.setScalar(0),ec.fromBufferAttribute(t,e),nc.fromBufferAttribute(t,i),ic.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ec,r.x),o.addScaledVector(nc,r.y),o.addScaledVector(ic,r.z),o}static isFrontFacing(t,e,i,s){return Un.subVectors(i,e),fi.subVectors(t,e),Un.cross(fi).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Un.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),Un.cross(fi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Fn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Fn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return Fn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return Fn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Fn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let o,a;As.subVectors(s,i),Rs.subVectors(r,i),Ja.subVectors(t,i);const c=As.dot(Ja),l=Rs.dot(Ja);if(c<=0&&l<=0)return e.copy(i);Qa.subVectors(t,s);const u=As.dot(Qa),h=Rs.dot(Qa);if(u>=0&&h<=u)return e.copy(s);const f=c*h-u*l;if(f<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(i).addScaledVector(As,o);tc.subVectors(t,r);const p=As.dot(tc),g=Rs.dot(tc);if(g>=0&&p<=g)return e.copy(r);const y=p*l-c*g;if(y<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(i).addScaledVector(Rs,a);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return Uu.subVectors(r,s),a=(h-u)/(h-u+(p-g)),e.copy(s).addScaledVector(Uu,a);const d=1/(m+y+f);return o=y*d,a=f*d,e.copy(i).addScaledVector(As,o).addScaledVector(Rs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const md={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},ho={h:0,s:0,l:0};function sc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ie{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Mn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=oe.workingColorSpace){return this.r=t,this.g=e,this.b=i,oe.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=oe.workingColorSpace){if(t=Om(t,1),e=te(e,0,1),i=te(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=sc(o,r,t+1/3),this.g=sc(o,r,t),this.b=sc(o,r,t-1/3)}return oe.colorSpaceToWorking(this,s),this}setStyle(t,e=Mn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Mn){const i=md[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Mi(t.r),this.g=Mi(t.g),this.b=Mi(t.b),this}copyLinearToSRGB(t){return this.r=Ks(t.r),this.g=Ks(t.g),this.b=Ks(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Mn){return oe.workingToColorSpace(qe.copy(this),t),Math.round(te(qe.r*255,0,255))*65536+Math.round(te(qe.g*255,0,255))*256+Math.round(te(qe.b*255,0,255))}getHexString(t=Mn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(qe.copy(this),e);const i=qe.r,s=qe.g,r=qe.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-i)/h+2;break;case r:c=(i-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=Mn){oe.workingToColorSpace(qe.copy(this),t);const e=qe.r,i=qe.g,s=qe.b;return t!==Mn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Di),this.setHSL(Di.h+t,Di.s+e,Di.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Di),t.getHSL(ho);const i=Va(Di.h,ho.h,e),s=Va(Di.s,ho.s,e),r=Va(Di.l,ho.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qe=new ie;ie.NAMES=md;let t_=0;class dr extends ms{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:t_++}),this.uuid=qr(),this.name="",this.type="Material",this.blending=qs,this.side=ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Tc,this.blendDst=wc,this.blendEquation=ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ie(0,0,0),this.blendAlpha=0,this.depthFunc=nr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Su,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ys,this.stencilZFail=ys,this.stencilZPass=ys,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==qs&&(i.blending=this.blending),this.side!==ki&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Tc&&(i.blendSrc=this.blendSrc),this.blendDst!==wc&&(i.blendDst=this.blendDst),this.blendEquation!==ss&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==nr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Su&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ys&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ys&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ys&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Bl extends dr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=ed,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Oe=new N,fo=new Xt;let e_=0;class ii{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:e_++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=xu,this.updateRanges=[],this.gpuType=bi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)fo.fromBufferAttribute(this,e),fo.applyMatrix3(t),this.setXY(e,fo.x,fo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix3(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=yr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=rn(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=yr(e,this.array)),e}setX(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=yr(e,this.array)),e}setY(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=yr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=yr(e,this.array)),e}setW(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array),r=rn(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==xu&&(t.usage=this.usage),t}}class _d extends ii{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class gd extends ii{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class In extends ii{constructor(t,e,i){super(new Float32Array(t),e,i)}}let n_=0;const xn=new Pe,rc=new Xe,Is=new N,mn=new $r,Mr=new $r,We=new N;class ci extends ms{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:n_++}),this.uuid=qr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(fd(t)?gd:_d)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new jt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return xn.makeRotationFromQuaternion(t),this.applyMatrix4(xn),this}rotateX(t){return xn.makeRotationX(t),this.applyMatrix4(xn),this}rotateY(t){return xn.makeRotationY(t),this.applyMatrix4(xn),this}rotateZ(t){return xn.makeRotationZ(t),this.applyMatrix4(xn),this}translate(t,e,i){return xn.makeTranslation(t,e,i),this.applyMatrix4(xn),this}scale(t,e,i){return xn.makeScale(t,e,i),this.applyMatrix4(xn),this}lookAt(t){return rc.lookAt(t),rc.updateMatrix(),this.applyMatrix4(rc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Is).negate(),this.translate(Is.x,Is.y,Is.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new In(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $r);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(We.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(We),We.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(We)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Aa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const i=this.boundingSphere.center;if(mn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Mr.setFromBufferAttribute(a),this.morphTargetsRelative?(We.addVectors(mn.min,Mr.min),mn.expandByPoint(We),We.addVectors(mn.max,Mr.max),mn.expandByPoint(We)):(mn.expandByPoint(Mr.min),mn.expandByPoint(Mr.max))}mn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)We.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(We));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)We.fromBufferAttribute(a,l),c&&(Is.fromBufferAttribute(t,l),We.add(Is)),s=Math.max(s,i.distanceToSquared(We))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ii(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let F=0;F<i.count;F++)a[F]=new N,c[F]=new N;const l=new N,u=new N,h=new N,f=new Xt,p=new Xt,g=new Xt,y=new N,m=new N;function d(F,x,S){l.fromBufferAttribute(i,F),u.fromBufferAttribute(i,x),h.fromBufferAttribute(i,S),f.fromBufferAttribute(r,F),p.fromBufferAttribute(r,x),g.fromBufferAttribute(r,S),u.sub(l),h.sub(l),p.sub(f),g.sub(f);const T=1/(p.x*g.y-g.x*p.y);isFinite(T)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(T),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(T),a[F].add(y),a[x].add(y),a[S].add(y),c[F].add(m),c[x].add(m),c[S].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let F=0,x=A.length;F<x;++F){const S=A[F],T=S.start,X=S.count;for(let H=T,Y=T+X;H<Y;H+=3)d(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const E=new N,b=new N,D=new N,P=new N;function C(F){D.fromBufferAttribute(s,F),P.copy(D);const x=a[F];E.copy(x),E.sub(D.multiplyScalar(D.dot(x))).normalize(),b.crossVectors(P,x);const T=b.dot(c[F])<0?-1:1;o.setXYZW(F,E.x,E.y,E.z,T)}for(let F=0,x=A.length;F<x;++F){const S=A[F],T=S.start,X=S.count;for(let H=T,Y=T+X;H<Y;H+=3)C(t.getX(H+0)),C(t.getX(H+1)),C(t.getX(H+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ii(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const s=new N,r=new N,o=new N,a=new N,c=new N,l=new N,u=new N,h=new N;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),y=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,y),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)We.fromBufferAttribute(t,e),We.normalize(),t.setXYZ(e,We.x,We.y,We.z)}toNonIndexed(){function t(a,c){const l=a.array,u=a.itemSize,h=a.normalized,f=new l.constructor(c.length*u);let p=0,g=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?p=c[y]*a.data.stride+a.offset:p=c[y]*u;for(let d=0;d<u;d++)f[g++]=l[p++]}return new ii(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ci,i=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,i);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){const f=l[u],p=t(f,i);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){const p=l[h];u.push(p.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(e))}const r=t.morphAttributes;for(const l in r){const u=[],h=r[l];for(let f=0,p=h.length;f<p;f++)u.push(h[f].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Nu=new Pe,Zi=new Ra,po=new Aa,Fu=new N,mo=new N,_o=new N,go=new N,oc=new N,vo=new N,Ou=new N,yo=new N;class Vn extends Xe{constructor(t=new ci,e=new Bl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){vo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],h=r[c];u!==0&&(oc.fromBufferAttribute(h,t),o?vo.addScaledVector(oc,u):vo.addScaledVector(oc.sub(e),u))}e.add(vo)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),po.copy(i.boundingSphere),po.applyMatrix4(r),Zi.copy(t.ray).recast(t.near),!(po.containsPoint(Zi.origin)===!1&&(Zi.intersectSphere(po,Fu)===null||Zi.origin.distanceToSquared(Fu)>(t.far-t.near)**2))&&(Nu.copy(r).invert(),Zi.copy(t.ray).applyMatrix4(Nu),!(i.boundingBox!==null&&Zi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Zi)))}_computeIntersections(t,e,i){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){const m=f[g],d=o[m.materialIndex],A=Math.max(m.start,p.start),E=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let b=A,D=E;b<D;b+=3){const P=a.getX(b),C=a.getX(b+1),F=a.getX(b+2);s=So(this,d,t,i,l,u,h,P,C,F),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let m=g,d=y;m<d;m+=3){const A=a.getX(m),E=a.getX(m+1),b=a.getX(m+2);s=So(this,o,t,i,l,u,h,A,E,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){const m=f[g],d=o[m.materialIndex],A=Math.max(m.start,p.start),E=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let b=A,D=E;b<D;b+=3){const P=b,C=b+1,F=b+2;s=So(this,d,t,i,l,u,h,P,C,F),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(c.count,p.start+p.count);for(let m=g,d=y;m<d;m+=3){const A=m,E=m+1,b=m+2;s=So(this,o,t,i,l,u,h,A,E,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function i_(n,t,e,i,s,r,o,a){let c;if(t.side===en?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,t.side===ki,a),c===null)return null;yo.copy(a),yo.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(yo);return l<e.near||l>e.far?null:{distance:l,point:yo.clone(),object:n}}function So(n,t,e,i,s,r,o,a,c,l){n.getVertexPosition(a,mo),n.getVertexPosition(c,_o),n.getVertexPosition(l,go);const u=i_(n,t,e,i,mo,_o,go,Ou);if(u){const h=new N;Fn.getBarycoord(Ou,mo,_o,go,h),s&&(u.uv=Fn.getInterpolatedAttribute(s,a,c,l,h,new Xt)),r&&(u.uv1=Fn.getInterpolatedAttribute(r,a,c,l,h,new Xt)),o&&(u.normal=Fn.getInterpolatedAttribute(o,a,c,l,h,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new N,materialIndex:0};Fn.getNormal(mo,_o,go,f.normal),u.face=f,u.barycoord=h}return u}class Kr extends ci{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],h=[];let f=0,p=0;g("z","y","x",-1,-1,i,e,t,o,r,0),g("z","y","x",1,-1,i,e,-t,o,r,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new In(l,3)),this.setAttribute("normal",new In(u,3)),this.setAttribute("uv",new In(h,2));function g(y,m,d,A,E,b,D,P,C,F,x){const S=b/C,T=D/F,X=b/2,H=D/2,Y=P/2,$=C+1,j=F+1;let K=0,V=0;const ot=new N;for(let ht=0;ht<j;ht++){const Mt=ht*T-H;for(let Kt=0;Kt<$;Kt++){const we=Kt*S-X;ot[y]=we*A,ot[m]=Mt*E,ot[d]=Y,l.push(ot.x,ot.y,ot.z),ot[y]=0,ot[m]=0,ot[d]=P>0?1:-1,u.push(ot.x,ot.y,ot.z),h.push(Kt/C),h.push(1-ht/F),K+=1}}for(let ht=0;ht<F;ht++)for(let Mt=0;Mt<C;Mt++){const Kt=f+Mt+$*ht,we=f+Mt+$*(ht+1),ye=f+(Mt+1)+$*(ht+1),W=f+(Mt+1)+$*ht;c.push(Kt,we,W),c.push(we,ye,W),V+=6}a.addGroup(p,V,x),p+=V,f+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kr(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function or(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Je(n){const t={};for(let e=0;e<n.length;e++){const i=or(n[e]);for(const s in i)t[s]=i[s]}return t}function s_(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function vd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}const r_={clone:or,merge:Je};var o_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,a_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Hi extends dr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=o_,this.fragmentShader=a_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=or(t.uniforms),this.uniformsGroups=s_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class yd extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pe,this.projectionMatrix=new Pe,this.projectionMatrixInverse=new Pe,this.coordinateSystem=ei,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pi=new N,Bu=new Xt,zu=new Xt;class Tn extends yd{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ul*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Bo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ul*2*Math.atan(Math.tan(Bo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z)}getViewSize(t,e){return this.getViewBounds(t,Bu,zu),e.subVectors(zu,Bu)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Bo*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Cs=-90,Ds=1;class c_ extends Xe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Tn(Cs,Ds,t,e);s.layers=this.layers,this.add(s);const r=new Tn(Cs,Ds,t,e);r.layers=this.layers,this.add(r);const o=new Tn(Cs,Ds,t,e);o.layers=this.layers,this.add(o);const a=new Tn(Cs,Ds,t,e);a.layers=this.layers,this.add(a);const c=new Tn(Cs,Ds,t,e);c.layers=this.layers,this.add(c);const l=new Tn(Cs,Ds,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===ei)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ko)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,h=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,s),t.render(e,u),t.setRenderTarget(h,f,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Sd extends ln{constructor(t=[],e=ir,i,s,r,o,a,c,l,u){super(t,e,i,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class l_ extends hs{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Sd(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Kr(5,5,5),r=new Hi({name:"CubemapFromEquirect",uniforms:or(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:en,blending:zi});r.uniforms.tEquirect.value=e;const o=new Vn(s,r),a=e.minFilter;return e.minFilter===as&&(e.minFilter=ti),new c_(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}}class xo extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const u_={type:"move"};class ac{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,i),d=this._getHandJoint(l,y);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(u_)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new xo;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class h_ extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentIntensity=1,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const cc=new N,d_=new N,f_=new jt;class Ni{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=cc.subVectors(i,e).cross(d_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(cc),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||f_.getNormalMatrix(t),s=this.coplanarPoint(cc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ji=new Aa,p_=new Xt(.5,.5),bo=new N;class zl{constructor(t=new Ni,e=new Ni,i=new Ni,s=new Ni,r=new Ni,o=new Ni){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ei,i=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],h=r[5],f=r[6],p=r[7],g=r[8],y=r[9],m=r[10],d=r[11],A=r[12],E=r[13],b=r[14],D=r[15];if(s[0].setComponents(l-o,p-u,d-g,D-A).normalize(),s[1].setComponents(l+o,p+u,d+g,D+A).normalize(),s[2].setComponents(l+a,p+h,d+y,D+E).normalize(),s[3].setComponents(l-a,p-h,d-y,D-E).normalize(),i)s[4].setComponents(c,f,m,b).normalize(),s[5].setComponents(l-c,p-f,d-m,D-b).normalize();else if(s[4].setComponents(l-c,p-f,d-m,D-b).normalize(),e===ei)s[5].setComponents(l+c,p+f,d+m,D+b).normalize();else if(e===Ko)s[5].setComponents(c,f,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ji.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ji.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ji)}intersectsSprite(t){Ji.center.set(0,0,0);const e=p_.distanceTo(t.center);return Ji.radius=.7071067811865476+e,Ji.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ji)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(bo.x=s.normal.x>0?t.max.x:t.min.x,bo.y=s.normal.y>0?t.max.y:t.min.y,bo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(bo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class xd extends dr{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ie(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Vu=new Pe,hl=new Ra,Mo=new Aa,Eo=new N;class m_ extends Xe{constructor(t=new ci,e=new xd){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Mo.copy(i.boundingSphere),Mo.applyMatrix4(s),Mo.radius+=r,t.ray.intersectsSphere(Mo)===!1)return;Vu.copy(s).invert(),hl.copy(t.ray).applyMatrix4(Vu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,h=i.attributes.position;if(l!==null){const f=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=f,y=p;g<y;g++){const m=l.getX(g);Eo.fromBufferAttribute(h,m),ku(Eo,m,c,s,t,e,this)}}else{const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=f,y=p;g<y;g++)Eo.fromBufferAttribute(h,g),ku(Eo,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ku(n,t,e,i,s,r,o){const a=hl.distanceSqToPoint(n);if(a<e){const c=new N;hl.closestPointToPoint(n,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class bd extends ln{constructor(t,e,i=ls,s,r,o,a=Hn,c=Hn,l,u=Br,h=1){if(u!==Br&&u!==zr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:h};super(f,s,r,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Fl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ia extends ci{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(i),c=Math.floor(s),l=a+1,u=c+1,h=t/a,f=e/c,p=[],g=[],y=[],m=[];for(let d=0;d<u;d++){const A=d*f-o;for(let E=0;E<l;E++){const b=E*h-r;g.push(b,-A,0),y.push(0,0,1),m.push(E/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let A=0;A<a;A++){const E=A+l*d,b=A+l*(d+1),D=A+1+l*(d+1),P=A+1+l*d;p.push(E,b,P),p.push(b,D,P)}this.setIndex(p),this.setAttribute("position",new In(g,3)),this.setAttribute("normal",new In(y,3)),this.setAttribute("uv",new In(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ia(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ca extends ci{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new N,f=new N,p=[],g=[],y=[],m=[];for(let d=0;d<=i;d++){const A=[],E=d/i;let b=0;d===0&&o===0?b=.5/e:d===i&&c===Math.PI&&(b=-.5/e);for(let D=0;D<=e;D++){const P=D/e;h.x=-t*Math.cos(s+P*r)*Math.sin(o+E*a),h.y=t*Math.cos(o+E*a),h.z=t*Math.sin(s+P*r)*Math.sin(o+E*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),m.push(P+b,1-E),A.push(l++)}u.push(A)}for(let d=0;d<i;d++)for(let A=0;A<e;A++){const E=u[d][A+1],b=u[d][A],D=u[d+1][A],P=u[d+1][A+1];(d!==0||o>0)&&p.push(E,b,P),(d!==i-1||c<Math.PI)&&p.push(b,D,P)}this.setIndex(p),this.setAttribute("position",new In(g,3)),this.setAttribute("normal",new In(y,3)),this.setAttribute("uv",new In(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ca(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class __ extends dr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ie(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hd,this.normalScale=new Xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class g_ extends dr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Am,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class v_ extends dr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Md extends Xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ie(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const lc=new Pe,Hu=new N,Gu=new N;class y_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xt(512,512),this.mapType=si,this.map=null,this.mapPass=null,this.matrix=new Pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zl,this._frameExtents=new Xt(1,1),this._viewportCount=1,this._viewports=[new Ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Hu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Hu),Gu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Gu),e.updateMatrixWorld(),lc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(lc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(lc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Ed extends yd{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,o=i+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class S_ extends y_{constructor(){super(new Ed(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class x_ extends Md{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new S_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class b_ extends Md{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class M_ extends Tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const Wu=new Pe;class E_{constructor(t,e,i=0,s=1/0){this.ray=new Ra(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Ol,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Wu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Wu),this}intersectObject(t,e=!0,i=[]){return dl(t,this,i,e),i.sort(Xu),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)dl(t[s],this,i,e);return i.sort(Xu),i}}function Xu(n,t){return n.distance-t.distance}function dl(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let o=0,a=r.length;o<a;o++)dl(r[o],t,e,!0)}}class Yu{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=te(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(te(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class T_ extends ms{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function ju(n,t,e,i){const s=w_(i);switch(e){case od:return n*t;case cd:return n*t/s.components*s.byteLength;case Ll:return n*t/s.components*s.byteLength;case ld:return n*t*2/s.components*s.byteLength;case Ul:return n*t*2/s.components*s.byteLength;case ad:return n*t*3/s.components*s.byteLength;case zn:return n*t*4/s.components*s.byteLength;case Nl:return n*t*4/s.components*s.byteLength;case Lo:case Uo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case No:case Fo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case zc:case kc:return Math.max(n,16)*Math.max(t,8)/4;case Bc:case Vc:return Math.max(n,8)*Math.max(t,8)/2;case Hc:case Gc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Wc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Xc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Yc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case jc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case qc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case $c:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Kc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Zc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Jc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Qc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case tl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case el:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case nl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case il:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case sl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Oo:case rl:case ol:return Math.ceil(n/4)*Math.ceil(t/4)*16;case ud:case al:return Math.ceil(n/4)*Math.ceil(t/4)*8;case cl:case ll:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function w_(n){switch(n){case si:case id:return{byteLength:1,components:1};case Fr:case sd:case jr:return{byteLength:2,components:1};case Dl:case Pl:return{byteLength:2,components:4};case ls:case Cl:case bi:return{byteLength:4,components:1};case rd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Il}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Il);function Td(){let n=null,t=!1,e=null,i=null;function s(r,o){e(r,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function A_(n){const t=new WeakMap;function e(a,c){const l=a.array,u=a.usage,h=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),a.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<h.length;p++){const g=h[f],y=h[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++f,h[f]=y)}h.length=f+1;for(let p=0,g=h.length;p<g;p++){const y=h[p];n.bufferSubData(l,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(n.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var R_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,I_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,C_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,D_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,P_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,L_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,U_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,N_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,F_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,O_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,B_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,z_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,V_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,k_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,H_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,G_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,W_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,X_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Y_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,j_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,q_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,$_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,K_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Z_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,J_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Q_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,tg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,eg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ng=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ig=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sg="gl_FragColor = linearToOutputTexel( gl_FragColor );",rg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,og=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ag=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,lg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ug=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,_g=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Sg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,xg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Mg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Eg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,wg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ag=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Rg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ig=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Dg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ug=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ng=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Og=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,kg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Hg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Wg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Yg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,jg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$g=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Kg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Zg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,tv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ev=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,iv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ov=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,av=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,uv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,hv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,dv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,fv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,mv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_v=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,xv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,bv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Mv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ev=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Av=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Iv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Uv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Fv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ov=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Hv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Yv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,$v=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Jv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ty=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ey=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ny=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,iy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ry=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,oy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:R_,alphahash_pars_fragment:I_,alphamap_fragment:C_,alphamap_pars_fragment:D_,alphatest_fragment:P_,alphatest_pars_fragment:L_,aomap_fragment:U_,aomap_pars_fragment:N_,batching_pars_vertex:F_,batching_vertex:O_,begin_vertex:B_,beginnormal_vertex:z_,bsdfs:V_,iridescence_fragment:k_,bumpmap_pars_fragment:H_,clipping_planes_fragment:G_,clipping_planes_pars_fragment:W_,clipping_planes_pars_vertex:X_,clipping_planes_vertex:Y_,color_fragment:j_,color_pars_fragment:q_,color_pars_vertex:$_,color_vertex:K_,common:Z_,cube_uv_reflection_fragment:J_,defaultnormal_vertex:Q_,displacementmap_pars_vertex:tg,displacementmap_vertex:eg,emissivemap_fragment:ng,emissivemap_pars_fragment:ig,colorspace_fragment:sg,colorspace_pars_fragment:rg,envmap_fragment:og,envmap_common_pars_fragment:ag,envmap_pars_fragment:cg,envmap_pars_vertex:lg,envmap_physical_pars_fragment:Sg,envmap_vertex:ug,fog_vertex:hg,fog_pars_vertex:dg,fog_fragment:fg,fog_pars_fragment:pg,gradientmap_pars_fragment:mg,lightmap_pars_fragment:_g,lights_lambert_fragment:gg,lights_lambert_pars_fragment:vg,lights_pars_begin:yg,lights_toon_fragment:xg,lights_toon_pars_fragment:bg,lights_phong_fragment:Mg,lights_phong_pars_fragment:Eg,lights_physical_fragment:Tg,lights_physical_pars_fragment:wg,lights_fragment_begin:Ag,lights_fragment_maps:Rg,lights_fragment_end:Ig,logdepthbuf_fragment:Cg,logdepthbuf_pars_fragment:Dg,logdepthbuf_pars_vertex:Pg,logdepthbuf_vertex:Lg,map_fragment:Ug,map_pars_fragment:Ng,map_particle_fragment:Fg,map_particle_pars_fragment:Og,metalnessmap_fragment:Bg,metalnessmap_pars_fragment:zg,morphinstance_vertex:Vg,morphcolor_vertex:kg,morphnormal_vertex:Hg,morphtarget_pars_vertex:Gg,morphtarget_vertex:Wg,normal_fragment_begin:Xg,normal_fragment_maps:Yg,normal_pars_fragment:jg,normal_pars_vertex:qg,normal_vertex:$g,normalmap_pars_fragment:Kg,clearcoat_normal_fragment_begin:Zg,clearcoat_normal_fragment_maps:Jg,clearcoat_pars_fragment:Qg,iridescence_pars_fragment:tv,opaque_fragment:ev,packing:nv,premultiplied_alpha_fragment:iv,project_vertex:sv,dithering_fragment:rv,dithering_pars_fragment:ov,roughnessmap_fragment:av,roughnessmap_pars_fragment:cv,shadowmap_pars_fragment:lv,shadowmap_pars_vertex:uv,shadowmap_vertex:hv,shadowmask_pars_fragment:dv,skinbase_vertex:fv,skinning_pars_vertex:pv,skinning_vertex:mv,skinnormal_vertex:_v,specularmap_fragment:gv,specularmap_pars_fragment:vv,tonemapping_fragment:yv,tonemapping_pars_fragment:Sv,transmission_fragment:xv,transmission_pars_fragment:bv,uv_pars_fragment:Mv,uv_pars_vertex:Ev,uv_vertex:Tv,worldpos_vertex:wv,background_vert:Av,background_frag:Rv,backgroundCube_vert:Iv,backgroundCube_frag:Cv,cube_vert:Dv,cube_frag:Pv,depth_vert:Lv,depth_frag:Uv,distanceRGBA_vert:Nv,distanceRGBA_frag:Fv,equirect_vert:Ov,equirect_frag:Bv,linedashed_vert:zv,linedashed_frag:Vv,meshbasic_vert:kv,meshbasic_frag:Hv,meshlambert_vert:Gv,meshlambert_frag:Wv,meshmatcap_vert:Xv,meshmatcap_frag:Yv,meshnormal_vert:jv,meshnormal_frag:qv,meshphong_vert:$v,meshphong_frag:Kv,meshphysical_vert:Zv,meshphysical_frag:Jv,meshtoon_vert:Qv,meshtoon_frag:ty,points_vert:ey,points_frag:ny,shadow_vert:iy,shadow_frag:sy,sprite_vert:ry,sprite_frag:oy},rt={common:{diffuse:{value:new ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new Xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new ie(16777215)},opacity:{value:1},center:{value:new Xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},Kn={basic:{uniforms:Je([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Je([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new ie(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Je([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new ie(0)},specular:{value:new ie(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Je([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Je([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new ie(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Je([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Je([rt.points,rt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Je([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Je([rt.common,rt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Je([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Je([rt.sprite,rt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Je([rt.common,rt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Je([rt.lights,rt.fog,{color:{value:new ie(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Kn.physical={uniforms:Je([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new Xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new Xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new ie(0)},specularColor:{value:new ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new Xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const To={r:0,b:0,g:0},Qi=new ri,ay=new Pe;function cy(n,t,e,i,s,r,o){const a=new ie(0);let c=r===!0?0:1,l,u,h=null,f=0,p=null;function g(E){let b=E.isScene===!0?E.background:null;return b&&b.isTexture&&(b=(E.backgroundBlurriness>0?e:t).get(b)),b}function y(E){let b=!1;const D=g(E);D===null?d(a,c):D&&D.isColor&&(d(D,1),b=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(E,b){const D=g(b);D&&(D.isCubeTexture||D.mapping===wa)?(u===void 0&&(u=new Vn(new Kr(1,1,1),new Hi({name:"BackgroundCubeMaterial",uniforms:or(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,C,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Qi.copy(b.backgroundRotation),Qi.x*=-1,Qi.y*=-1,Qi.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Qi.y*=-1,Qi.z*=-1),u.material.uniforms.envMap.value=D,u.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(ay.makeRotationFromEuler(Qi)),u.material.toneMapped=oe.getTransfer(D.colorSpace)!==_e,(h!==D||f!==D.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,h=D,f=D.version,p=n.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):D&&D.isTexture&&(l===void 0&&(l=new Vn(new Ia(2,2),new Hi({name:"BackgroundMaterial",uniforms:or(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:ki,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=D,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=oe.getTransfer(D.colorSpace)!==_e,D.matrixAutoUpdate===!0&&D.updateMatrix(),l.material.uniforms.uvTransform.value.copy(D.matrix),(h!==D||f!==D.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,h=D,f=D.version,p=n.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function d(E,b){E.getRGB(To,vd(n)),i.buffers.color.setClear(To.r,To.g,To.b,b,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,b=1){a.set(E),c=b,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(E){c=E,d(a,c)},render:y,addToRenderList:m,dispose:A}}function ly(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,o=!1;function a(S,T,X,H,Y){let $=!1;const j=h(H,X,T);r!==j&&(r=j,l(r.object)),$=p(S,H,X,Y),$&&g(S,H,X,Y),Y!==null&&t.update(Y,n.ELEMENT_ARRAY_BUFFER),($||o)&&(o=!1,b(S,T,X,H),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function c(){return n.createVertexArray()}function l(S){return n.bindVertexArray(S)}function u(S){return n.deleteVertexArray(S)}function h(S,T,X){const H=X.wireframe===!0;let Y=i[S.id];Y===void 0&&(Y={},i[S.id]=Y);let $=Y[T.id];$===void 0&&($={},Y[T.id]=$);let j=$[H];return j===void 0&&(j=f(c()),$[H]=j),j}function f(S){const T=[],X=[],H=[];for(let Y=0;Y<e;Y++)T[Y]=0,X[Y]=0,H[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:X,attributeDivisors:H,object:S,attributes:{},index:null}}function p(S,T,X,H){const Y=r.attributes,$=T.attributes;let j=0;const K=X.getAttributes();for(const V in K)if(K[V].location>=0){const ht=Y[V];let Mt=$[V];if(Mt===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(Mt=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(Mt=S.instanceColor)),ht===void 0||ht.attribute!==Mt||Mt&&ht.data!==Mt.data)return!0;j++}return r.attributesNum!==j||r.index!==H}function g(S,T,X,H){const Y={},$=T.attributes;let j=0;const K=X.getAttributes();for(const V in K)if(K[V].location>=0){let ht=$[V];ht===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(ht=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(ht=S.instanceColor));const Mt={};Mt.attribute=ht,ht&&ht.data&&(Mt.data=ht.data),Y[V]=Mt,j++}r.attributes=Y,r.attributesNum=j,r.index=H}function y(){const S=r.newAttributes;for(let T=0,X=S.length;T<X;T++)S[T]=0}function m(S){d(S,0)}function d(S,T){const X=r.newAttributes,H=r.enabledAttributes,Y=r.attributeDivisors;X[S]=1,H[S]===0&&(n.enableVertexAttribArray(S),H[S]=1),Y[S]!==T&&(n.vertexAttribDivisor(S,T),Y[S]=T)}function A(){const S=r.newAttributes,T=r.enabledAttributes;for(let X=0,H=T.length;X<H;X++)T[X]!==S[X]&&(n.disableVertexAttribArray(X),T[X]=0)}function E(S,T,X,H,Y,$,j){j===!0?n.vertexAttribIPointer(S,T,X,Y,$):n.vertexAttribPointer(S,T,X,H,Y,$)}function b(S,T,X,H){y();const Y=H.attributes,$=X.getAttributes(),j=T.defaultAttributeValues;for(const K in $){const V=$[K];if(V.location>=0){let ot=Y[K];if(ot===void 0&&(K==="instanceMatrix"&&S.instanceMatrix&&(ot=S.instanceMatrix),K==="instanceColor"&&S.instanceColor&&(ot=S.instanceColor)),ot!==void 0){const ht=ot.normalized,Mt=ot.itemSize,Kt=t.get(ot);if(Kt===void 0)continue;const we=Kt.buffer,ye=Kt.type,W=Kt.bytesPerElement,at=ye===n.INT||ye===n.UNSIGNED_INT||ot.gpuType===Cl;if(ot.isInterleavedBufferAttribute){const it=ot.data,Ft=it.stride,Ot=ot.offset;if(it.isInstancedInterleavedBuffer){for(let Gt=0;Gt<V.locationSize;Gt++)d(V.location+Gt,it.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Gt=0;Gt<V.locationSize;Gt++)m(V.location+Gt);n.bindBuffer(n.ARRAY_BUFFER,we);for(let Gt=0;Gt<V.locationSize;Gt++)E(V.location+Gt,Mt/V.locationSize,ye,ht,Ft*W,(Ot+Mt/V.locationSize*Gt)*W,at)}else{if(ot.isInstancedBufferAttribute){for(let it=0;it<V.locationSize;it++)d(V.location+it,ot.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let it=0;it<V.locationSize;it++)m(V.location+it);n.bindBuffer(n.ARRAY_BUFFER,we);for(let it=0;it<V.locationSize;it++)E(V.location+it,Mt/V.locationSize,ye,ht,Mt*W,Mt/V.locationSize*it*W,at)}}else if(j!==void 0){const ht=j[K];if(ht!==void 0)switch(ht.length){case 2:n.vertexAttrib2fv(V.location,ht);break;case 3:n.vertexAttrib3fv(V.location,ht);break;case 4:n.vertexAttrib4fv(V.location,ht);break;default:n.vertexAttrib1fv(V.location,ht)}}}}A()}function D(){F();for(const S in i){const T=i[S];for(const X in T){const H=T[X];for(const Y in H)u(H[Y].object),delete H[Y];delete T[X]}delete i[S]}}function P(S){if(i[S.id]===void 0)return;const T=i[S.id];for(const X in T){const H=T[X];for(const Y in H)u(H[Y].object),delete H[Y];delete T[X]}delete i[S.id]}function C(S){for(const T in i){const X=i[T];if(X[S.id]===void 0)continue;const H=X[S.id];for(const Y in H)u(H[Y].object),delete H[Y];delete X[S.id]}}function F(){x(),o=!0,r!==s&&(r=s,l(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:F,resetDefaultState:x,dispose:D,releaseStatesOfGeometry:P,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:A}}function uy(n,t,e){let i;function s(l){i=l}function r(l,u){n.drawArrays(i,l,u),e.update(u,i,1)}function o(l,u,h){h!==0&&(n.drawArraysInstanced(i,l,u,h),e.update(u,i,h))}function a(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];e.update(p,i,1)}function c(l,u,h,f){if(h===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],u[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,u,0,f,0,h);let g=0;for(let y=0;y<h;y++)g+=u[y]*f[y];e.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function hy(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==zn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const F=C===jr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==si&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==bi&&!F)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,P=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:A,maxVaryings:E,maxFragmentUniforms:b,vertexTextures:D,maxSamples:P}}function dy(n){const t=this;let e=null,i=0,s=!1,r=!1;const o=new Ni,a=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||s;return s=f,i=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){e=u(h,f,0)},this.setState=function(h,f,p){const g=h.clippingPlanes,y=h.clipIntersection,m=h.clipShadows,d=n.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{const A=r?0:i,E=A*4;let b=d.clippingState||null;c.value=b,b=u(g,f,E,p);for(let D=0;D!==E;++D)b[D]=e[D];d.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,f,p,g){const y=h!==null?h.length:0;let m=null;if(y!==0){if(m=c.value,g!==!0||m===null){const d=p+y*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(m===null||m.length<d)&&(m=new Float32Array(d));for(let E=0,b=p;E!==y;++E,b+=4)o.copy(h[E]).applyMatrix4(A,a),o.normal.toArray(m,b),m[b+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function fy(n){let t=new WeakMap;function e(o,a){return a===Uc?o.mapping=ir:a===Nc&&(o.mapping=sr),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Uc||a===Nc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new l_(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}const Xs=4,qu=[.125,.215,.35,.446,.526,.582],rs=20,uc=new Ed,$u=new ie;let hc=null,dc=0,fc=0,pc=!1;const ns=(1+Math.sqrt(5))/2,Ps=1/ns,Ku=[new N(-ns,Ps,0),new N(ns,Ps,0),new N(-Ps,0,ns),new N(Ps,0,ns),new N(0,ns,-Ps),new N(0,ns,Ps),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],py=new N;class Zu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,r={}){const{size:o=256,position:a=py}=r;hc=this._renderer.getRenderTarget(),dc=this._renderer.getActiveCubeFace(),fc=this._renderer.getActiveMipmapLevel(),pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=th(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(hc,dc,fc),this._renderer.xr.enabled=pc,t.scissorTest=!1,wo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ir||t.mapping===sr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),hc=this._renderer.getRenderTarget(),dc=this._renderer.getActiveCubeFace(),fc=this._renderer.getActiveMipmapLevel(),pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:ti,minFilter:ti,generateMipmaps:!1,type:jr,format:zn,colorSpace:rr,depthBuffer:!1},s=Ju(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ju(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=my(r)),this._blurMaterial=_y(r,t,e)}return s}_compileMaterial(t){const e=new Vn(this._lodPlanes[0],t);this._renderer.compile(e,uc)}_sceneToCubeUV(t,e,i,s,r){const c=new Tn(90,1,e,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor($u),h.toneMapping=Vi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const y=new Bl({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),m=new Vn(new Kr,y);let d=!1;const A=t.background;A?A.isColor&&(y.color.copy(A),t.background=null,d=!0):(y.color.copy($u),d=!0);for(let E=0;E<6;E++){const b=E%3;b===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[E],r.y,r.z)):b===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[E]));const D=this._cubeSize;wo(s,b*D,E>2?D:0,D,D),h.setRenderTarget(s),d&&h.render(m,c),h.render(t,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=A}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ir||t.mapping===sr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=th()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Vn(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;wo(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,uc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ku[(s-r-1)%Ku.length];this._blur(t,r-1,r,o,a)}e.autoClear=i}_blur(t,e,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",r),this._halfBlur(o,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Vn(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*rs-1),y=r/g,m=isFinite(r)?1+Math.floor(u*y):rs;m>rs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${rs}`);const d=[];let A=0;for(let C=0;C<rs;++C){const F=C/y,x=Math.exp(-F*F/2);d.push(x),C===0?A+=x:C<m&&(A+=2*x)}for(let C=0;C<d.length;C++)d[C]=d[C]/A;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:E}=this;f.dTheta.value=g,f.mipInt.value=E-i;const b=this._sizeLods[s],D=3*b*(s>E-Xs?s-E+Xs:0),P=4*(this._cubeSize-b);wo(e,D,P,3*b,2*b),c.setRenderTarget(e),c.render(h,uc)}}function my(n){const t=[],e=[],i=[];let s=n;const r=n-Xs+1+qu.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>n-Xs?c=qu[o-n+Xs-1]:o===0&&(c=0),i.push(c);const l=1/(a-2),u=-l,h=1+l,f=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,y=3,m=2,d=1,A=new Float32Array(y*g*p),E=new Float32Array(m*g*p),b=new Float32Array(d*g*p);for(let P=0;P<p;P++){const C=P%3*2/3-1,F=P>2?0:-1,x=[C,F,0,C+2/3,F,0,C+2/3,F+1,0,C,F,0,C+2/3,F+1,0,C,F+1,0];A.set(x,y*g*P),E.set(f,m*g*P);const S=[P,P,P,P,P,P];b.set(S,d*g*P)}const D=new ci;D.setAttribute("position",new ii(A,y)),D.setAttribute("uv",new ii(E,m)),D.setAttribute("faceIndex",new ii(b,d)),t.push(D),s>Xs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ju(n,t,e){const i=new hs(n,t,e);return i.texture.mapping=wa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wo(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function _y(n,t,e){const i=new Float32Array(rs),s=new N(0,1,0);return new Hi({name:"SphericalGaussianBlur",defines:{n:rs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Qu(){return new Hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function th(){return new Hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Vl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function gy(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===Uc||c===Nc,u=c===ir||c===sr;if(l||u){let h=t.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new Zu(n)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return l&&p&&p.height>0||u&&p&&s(p)?(e===null&&(e=new Zu(n)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function vy(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&$s("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function yy(n,t,e,i){const s={},r=new WeakMap;function o(h){const f=h.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(h,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(h){const f=h.attributes;for(const p in f)t.update(f[p],n.ARRAY_BUFFER)}function l(h){const f=[],p=h.index,g=h.attributes.position;let y=0;if(p!==null){const A=p.array;y=p.version;for(let E=0,b=A.length;E<b;E+=3){const D=A[E+0],P=A[E+1],C=A[E+2];f.push(D,P,P,C,C,D)}}else if(g!==void 0){const A=g.array;y=g.version;for(let E=0,b=A.length/3-1;E<b;E+=3){const D=E+0,P=E+1,C=E+2;f.push(D,P,P,C,C,D)}}else return;const m=new(fd(f)?gd:_d)(f,1);m.version=y;const d=r.get(h);d&&t.remove(d),r.set(h,m)}function u(h){const f=r.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&l(h)}else l(h);return r.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function Sy(n,t,e){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,p){n.drawElements(i,p,r,f*o),e.update(p,i,1)}function l(f,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,f*o,g),e.update(p,i,g))}function u(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];e.update(m,i,1)}function h(f,p,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)l(f[d]/o,p[d],y[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,f,0,y,0,g);let d=0;for(let A=0;A<g;A++)d+=p[A]*y[A];e.update(d,i,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function xy(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function by(n,t,e){const i=new WeakMap,s=new Ue;function r(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==h){let S=function(){F.dispose(),i.delete(a),a.removeEventListener("dispose",S)};var p=S;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,y=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],E=a.morphAttributes.color||[];let b=0;g===!0&&(b=1),y===!0&&(b=2),m===!0&&(b=3);let D=a.attributes.position.count*b,P=1;D>t.maxTextureSize&&(P=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const C=new Float32Array(D*P*4*h),F=new pd(C,D,P,h);F.type=bi,F.needsUpdate=!0;const x=b*4;for(let T=0;T<h;T++){const X=d[T],H=A[T],Y=E[T],$=D*P*4*T;for(let j=0;j<X.count;j++){const K=j*x;g===!0&&(s.fromBufferAttribute(X,j),C[$+K+0]=s.x,C[$+K+1]=s.y,C[$+K+2]=s.z,C[$+K+3]=0),y===!0&&(s.fromBufferAttribute(H,j),C[$+K+4]=s.x,C[$+K+5]=s.y,C[$+K+6]=s.z,C[$+K+7]=0),m===!0&&(s.fromBufferAttribute(Y,j),C[$+K+8]=s.x,C[$+K+9]=s.y,C[$+K+10]=s.z,C[$+K+11]=Y.itemSize===4?s.w:1)}}f={count:h,texture:F,size:new Xt(D,P)},i.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const y=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",y),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function My(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return h}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}const wd=new ln,eh=new bd(1,1),Ad=new pd,Rd=new Ym,Id=new Sd,nh=[],ih=[],sh=new Float32Array(16),rh=new Float32Array(9),oh=new Float32Array(4);function fr(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=nh[s];if(r===void 0&&(r=new Float32Array(s),nh[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function ke(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function He(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Da(n,t){let e=ih[t];e===void 0&&(e=new Int32Array(t),ih[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Ey(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Ty(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;n.uniform2fv(this.addr,t),He(e,t)}}function wy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;n.uniform3fv(this.addr,t),He(e,t)}}function Ay(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;n.uniform4fv(this.addr,t),He(e,t)}}function Ry(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ke(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),He(e,t)}else{if(ke(e,i))return;oh.set(i),n.uniformMatrix2fv(this.addr,!1,oh),He(e,i)}}function Iy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ke(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),He(e,t)}else{if(ke(e,i))return;rh.set(i),n.uniformMatrix3fv(this.addr,!1,rh),He(e,i)}}function Cy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(ke(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),He(e,t)}else{if(ke(e,i))return;sh.set(i),n.uniformMatrix4fv(this.addr,!1,sh),He(e,i)}}function Dy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Py(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;n.uniform2iv(this.addr,t),He(e,t)}}function Ly(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;n.uniform3iv(this.addr,t),He(e,t)}}function Uy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;n.uniform4iv(this.addr,t),He(e,t)}}function Ny(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Fy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;n.uniform2uiv(this.addr,t),He(e,t)}}function Oy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;n.uniform3uiv(this.addr,t),He(e,t)}}function By(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;n.uniform4uiv(this.addr,t),He(e,t)}}function zy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(eh.compareFunction=dd,r=eh):r=wd,e.setTexture2D(t||r,s)}function Vy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Rd,s)}function ky(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Id,s)}function Hy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Ad,s)}function Gy(n){switch(n){case 5126:return Ey;case 35664:return Ty;case 35665:return wy;case 35666:return Ay;case 35674:return Ry;case 35675:return Iy;case 35676:return Cy;case 5124:case 35670:return Dy;case 35667:case 35671:return Py;case 35668:case 35672:return Ly;case 35669:case 35673:return Uy;case 5125:return Ny;case 36294:return Fy;case 36295:return Oy;case 36296:return By;case 35678:case 36198:case 36298:case 36306:case 35682:return zy;case 35679:case 36299:case 36307:return Vy;case 35680:case 36300:case 36308:case 36293:return ky;case 36289:case 36303:case 36311:case 36292:return Hy}}function Wy(n,t){n.uniform1fv(this.addr,t)}function Xy(n,t){const e=fr(t,this.size,2);n.uniform2fv(this.addr,e)}function Yy(n,t){const e=fr(t,this.size,3);n.uniform3fv(this.addr,e)}function jy(n,t){const e=fr(t,this.size,4);n.uniform4fv(this.addr,e)}function qy(n,t){const e=fr(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function $y(n,t){const e=fr(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Ky(n,t){const e=fr(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Zy(n,t){n.uniform1iv(this.addr,t)}function Jy(n,t){n.uniform2iv(this.addr,t)}function Qy(n,t){n.uniform3iv(this.addr,t)}function t0(n,t){n.uniform4iv(this.addr,t)}function e0(n,t){n.uniform1uiv(this.addr,t)}function n0(n,t){n.uniform2uiv(this.addr,t)}function i0(n,t){n.uniform3uiv(this.addr,t)}function s0(n,t){n.uniform4uiv(this.addr,t)}function r0(n,t,e){const i=this.cache,s=t.length,r=Da(e,s);ke(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||wd,r[o])}function o0(n,t,e){const i=this.cache,s=t.length,r=Da(e,s);ke(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Rd,r[o])}function a0(n,t,e){const i=this.cache,s=t.length,r=Da(e,s);ke(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Id,r[o])}function c0(n,t,e){const i=this.cache,s=t.length,r=Da(e,s);ke(i,r)||(n.uniform1iv(this.addr,r),He(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ad,r[o])}function l0(n){switch(n){case 5126:return Wy;case 35664:return Xy;case 35665:return Yy;case 35666:return jy;case 35674:return qy;case 35675:return $y;case 35676:return Ky;case 5124:case 35670:return Zy;case 35667:case 35671:return Jy;case 35668:case 35672:return Qy;case 35669:case 35673:return t0;case 5125:return e0;case 36294:return n0;case 36295:return i0;case 36296:return s0;case 35678:case 36198:case 36298:case 36306:case 35682:return r0;case 35679:case 36299:case 36307:return o0;case 35680:case 36300:case 36308:case 36293:return a0;case 36289:case 36303:case 36311:case 36292:return c0}}class u0{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Gy(e.type)}}class h0{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=l0(e.type)}}class d0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],i)}}}const mc=/(\w+)(\])?(\[|\.)?/g;function ah(n,t){n.seq.push(t),n.map[t.id]=t}function f0(n,t,e){const i=n.name,s=i.length;for(mc.lastIndex=0;;){const r=mc.exec(i),o=mc.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){ah(e,l===void 0?new u0(a,n,t):new h0(a,n,t));break}else{let h=e.map[a];h===void 0&&(h=new d0(a),ah(e,h)),e=h}}}class zo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);f0(r,o,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function ch(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const p0=37297;let m0=0;function _0(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}const lh=new jt;function g0(n){oe._getMatrix(lh,oe.workingColorSpace,n);const t=`mat3( ${lh.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(n)){case $o:return[t,"LinearTransferOETF"];case _e:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function uh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+_0(n.getShaderSource(t),a)}else return r}function v0(n,t){const e=g0(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function y0(n,t){let e;switch(t){case ym:e="Linear";break;case Sm:e="Reinhard";break;case xm:e="Cineon";break;case bm:e="ACESFilmic";break;case Em:e="AgX";break;case Tm:e="Neutral";break;case Mm:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ao=new N;function S0(){oe.getLuminanceCoefficients(Ao);const n=Ao.x.toFixed(4),t=Ao.y.toFixed(4),e=Ao.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function x0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wr).join(`
`)}function b0(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function M0(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),o=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function wr(n){return n!==""}function hh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function dh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const E0=/^[ \t]*#include +<([\w\d./]+)>/gm;function fl(n){return n.replace(E0,w0)}const T0=new Map;function w0(n,t){let e=$t[t];if(e===void 0){const i=T0.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return fl(e)}const A0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fh(n){return n.replace(A0,R0)}function R0(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ph(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function I0(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===td?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Jp?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mi&&(t="SHADOWMAP_TYPE_VSM"),t}function C0(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ir:case sr:t="ENVMAP_TYPE_CUBE";break;case wa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function D0(n){let t="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===sr&&(t="ENVMAP_MODE_REFRACTION"),t}function P0(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ed:t="ENVMAP_BLENDING_MULTIPLY";break;case gm:t="ENVMAP_BLENDING_MIX";break;case vm:t="ENVMAP_BLENDING_ADD";break}return t}function L0(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function U0(n,t,e,i){const s=n.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=I0(e),l=C0(e),u=D0(e),h=P0(e),f=L0(e),p=x0(e),g=b0(r),y=s.createProgram();let m,d,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(wr).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(wr).join(`
`),d.length>0&&(d+=`
`)):(m=[ph(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wr).join(`
`),d=[ph(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Vi?"#define TONE_MAPPING":"",e.toneMapping!==Vi?$t.tonemapping_pars_fragment:"",e.toneMapping!==Vi?y0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,v0("linearToOutputTexel",e.outputColorSpace),S0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(wr).join(`
`)),o=fl(o),o=hh(o,e),o=dh(o,e),a=fl(a),a=hh(a,e),a=dh(a,e),o=fh(o),a=fh(a),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===bu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===bu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const E=A+m+o,b=A+d+a,D=ch(s,s.VERTEX_SHADER,E),P=ch(s,s.FRAGMENT_SHADER,b);s.attachShader(y,D),s.attachShader(y,P),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(T){if(n.debug.checkShaderErrors){const X=s.getProgramInfoLog(y)||"",H=s.getShaderInfoLog(D)||"",Y=s.getShaderInfoLog(P)||"",$=X.trim(),j=H.trim(),K=Y.trim();let V=!0,ot=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(V=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,D,P);else{const ht=uh(s,D,"vertex"),Mt=uh(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+$+`
`+ht+`
`+Mt)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(j===""||K==="")&&(ot=!1);ot&&(T.diagnostics={runnable:V,programLog:$,vertexShader:{log:j,prefix:m},fragmentShader:{log:K,prefix:d}})}s.deleteShader(D),s.deleteShader(P),F=new zo(s,y),x=M0(s,y)}let F;this.getUniforms=function(){return F===void 0&&C(this),F};let x;this.getAttributes=function(){return x===void 0&&C(this),x};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(y,p0)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=m0++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=D,this.fragmentShader=P,this}let N0=0;class F0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new O0(t),e.set(t,i)),i}}class O0{constructor(t){this.id=N0++,this.code=t,this.usedTimes=0}}function B0(n,t,e,i,s,r,o){const a=new Ol,c=new F0,l=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,S,T,X,H){const Y=X.fog,$=H.geometry,j=x.isMeshStandardMaterial?X.environment:null,K=(x.isMeshStandardMaterial?e:t).get(x.envMap||j),V=K&&K.mapping===wa?K.image.height:null,ot=g[x.type];x.precision!==null&&(p=s.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const ht=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Mt=ht!==void 0?ht.length:0;let Kt=0;$.morphAttributes.position!==void 0&&(Kt=1),$.morphAttributes.normal!==void 0&&(Kt=2),$.morphAttributes.color!==void 0&&(Kt=3);let we,ye,W,at;if(ot){const ce=Kn[ot];we=ce.vertexShader,ye=ce.fragmentShader}else we=x.vertexShader,ye=x.fragmentShader,c.update(x),W=c.getVertexShaderID(x),at=c.getFragmentShaderID(x);const it=n.getRenderTarget(),Ft=n.state.buffers.depth.getReversed(),Ot=H.isInstancedMesh===!0,Gt=H.isBatchedMesh===!0,Ne=!!x.map,se=!!x.matcap,w=!!K,xe=!!x.aoMap,It=!!x.lightMap,ae=!!x.bumpMap,bt=!!x.normalMap,Ae=!!x.displacementMap,pt=!!x.emissiveMap,Zt=!!x.metalnessMap,Ge=!!x.roughnessMap,Fe=x.anisotropy>0,M=x.clearcoat>0,_=x.dispersion>0,O=x.iridescence>0,G=x.sheen>0,Z=x.transmission>0,k=Fe&&!!x.anisotropyMap,xt=M&&!!x.clearcoatMap,nt=M&&!!x.clearcoatNormalMap,gt=M&&!!x.clearcoatRoughnessMap,vt=O&&!!x.iridescenceMap,tt=O&&!!x.iridescenceThicknessMap,ut=G&&!!x.sheenColorMap,zt=G&&!!x.sheenRoughnessMap,yt=!!x.specularMap,ct=!!x.specularColorMap,Yt=!!x.specularIntensityMap,R=Z&&!!x.transmissionMap,et=Z&&!!x.thicknessMap,st=!!x.gradientMap,ft=!!x.alphaMap,J=x.alphaTest>0,q=!!x.alphaHash,_t=!!x.extensions;let Wt=Vi;x.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Wt=n.toneMapping);const be={shaderID:ot,shaderType:x.type,shaderName:x.name,vertexShader:we,fragmentShader:ye,defines:x.defines,customVertexShaderID:W,customFragmentShaderID:at,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:Gt,batchingColor:Gt&&H._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&H.instanceColor!==null,instancingMorph:Ot&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:it===null?n.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:rr,alphaToCoverage:!!x.alphaToCoverage,map:Ne,matcap:se,envMap:w,envMapMode:w&&K.mapping,envMapCubeUVHeight:V,aoMap:xe,lightMap:It,bumpMap:ae,normalMap:bt,displacementMap:f&&Ae,emissiveMap:pt,normalMapObjectSpace:bt&&x.normalMapType===Im,normalMapTangentSpace:bt&&x.normalMapType===hd,metalnessMap:Zt,roughnessMap:Ge,anisotropy:Fe,anisotropyMap:k,clearcoat:M,clearcoatMap:xt,clearcoatNormalMap:nt,clearcoatRoughnessMap:gt,dispersion:_,iridescence:O,iridescenceMap:vt,iridescenceThicknessMap:tt,sheen:G,sheenColorMap:ut,sheenRoughnessMap:zt,specularMap:yt,specularColorMap:ct,specularIntensityMap:Yt,transmission:Z,transmissionMap:R,thicknessMap:et,gradientMap:st,opaque:x.transparent===!1&&x.blending===qs&&x.alphaToCoverage===!1,alphaMap:ft,alphaTest:J,alphaHash:q,combine:x.combine,mapUv:Ne&&y(x.map.channel),aoMapUv:xe&&y(x.aoMap.channel),lightMapUv:It&&y(x.lightMap.channel),bumpMapUv:ae&&y(x.bumpMap.channel),normalMapUv:bt&&y(x.normalMap.channel),displacementMapUv:Ae&&y(x.displacementMap.channel),emissiveMapUv:pt&&y(x.emissiveMap.channel),metalnessMapUv:Zt&&y(x.metalnessMap.channel),roughnessMapUv:Ge&&y(x.roughnessMap.channel),anisotropyMapUv:k&&y(x.anisotropyMap.channel),clearcoatMapUv:xt&&y(x.clearcoatMap.channel),clearcoatNormalMapUv:nt&&y(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&y(x.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&y(x.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&y(x.iridescenceThicknessMap.channel),sheenColorMapUv:ut&&y(x.sheenColorMap.channel),sheenRoughnessMapUv:zt&&y(x.sheenRoughnessMap.channel),specularMapUv:yt&&y(x.specularMap.channel),specularColorMapUv:ct&&y(x.specularColorMap.channel),specularIntensityMapUv:Yt&&y(x.specularIntensityMap.channel),transmissionMapUv:R&&y(x.transmissionMap.channel),thicknessMapUv:et&&y(x.thicknessMap.channel),alphaMapUv:ft&&y(x.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(bt||Fe),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!$.attributes.uv&&(Ne||ft),fog:!!Y,useFog:x.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ft,skinning:H.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:Mt,morphTextureStride:Kt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&T.length>0,shadowMapType:n.shadowMap.type,toneMapping:Wt,decodeVideoTexture:Ne&&x.map.isVideoTexture===!0&&oe.getTransfer(x.map.colorSpace)===_e,decodeVideoTextureEmissive:pt&&x.emissiveMap.isVideoTexture===!0&&oe.getTransfer(x.emissiveMap.colorSpace)===_e,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===yi,flipSided:x.side===en,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:_t&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_t&&x.extensions.multiDraw===!0||Gt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return be.vertexUv1s=l.has(1),be.vertexUv2s=l.has(2),be.vertexUv3s=l.has(3),l.clear(),be}function d(x){const S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(const T in x.defines)S.push(T),S.push(x.defines[T]);return x.isRawShaderMaterial===!1&&(A(S,x),E(S,x),S.push(n.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function A(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function E(x,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),x.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),x.push(a.mask)}function b(x){const S=g[x.type];let T;if(S){const X=Kn[S];T=r_.clone(X.uniforms)}else T=x.uniforms;return T}function D(x,S){let T;for(let X=0,H=u.length;X<H;X++){const Y=u[X];if(Y.cacheKey===S){T=Y,++T.usedTimes;break}}return T===void 0&&(T=new U0(n,S,x,r),u.push(T)),T}function P(x){if(--x.usedTimes===0){const S=u.indexOf(x);u[S]=u[u.length-1],u.pop(),x.destroy()}}function C(x){c.remove(x)}function F(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:b,acquireProgram:D,releaseProgram:P,releaseShaderCache:C,programs:u,dispose:F}}function z0(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function V0(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function mh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function _h(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(h,f,p,g,y,m){let d=n[t];return d===void 0?(d={id:h.id,object:h,geometry:f,material:p,groupOrder:g,renderOrder:h.renderOrder,z:y,group:m},n[t]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=y,d.group=m),t++,d}function a(h,f,p,g,y,m){const d=o(h,f,p,g,y,m);p.transmission>0?i.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(h,f,p,g,y,m){const d=o(h,f,p,g,y,m);p.transmission>0?i.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function l(h,f){e.length>1&&e.sort(h||V0),i.length>1&&i.sort(f||mh),s.length>1&&s.sort(f||mh)}function u(){for(let h=t,f=n.length;h<f;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function k0(){let n=new WeakMap;function t(i,s){const r=n.get(i);let o;return r===void 0?(o=new _h,n.set(i,[o])):s>=r.length?(o=new _h,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function H0(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new ie};break;case"SpotLight":e={position:new N,direction:new N,color:new ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new ie,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new ie,groundColor:new ie};break;case"RectAreaLight":e={color:new ie,position:new N,halfWidth:new N,halfHeight:new N};break}return n[t.id]=e,e}}}function G0(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let W0=0;function X0(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Y0(n){const t=new H0,e=G0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new N);const s=new N,r=new Pe,o=new Pe;function a(l){let u=0,h=0,f=0;for(let x=0;x<9;x++)i.probe[x].set(0,0,0);let p=0,g=0,y=0,m=0,d=0,A=0,E=0,b=0,D=0,P=0,C=0;l.sort(X0);for(let x=0,S=l.length;x<S;x++){const T=l[x],X=T.color,H=T.intensity,Y=T.distance,$=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)u+=X.r*H,h+=X.g*H,f+=X.b*H;else if(T.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(T.sh.coefficients[j],H);C++}else if(T.isDirectionalLight){const j=t.get(T);if(j.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const K=T.shadow,V=e.get(T);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,i.directionalShadow[p]=V,i.directionalShadowMap[p]=$,i.directionalShadowMatrix[p]=T.shadow.matrix,A++}i.directional[p]=j,p++}else if(T.isSpotLight){const j=t.get(T);j.position.setFromMatrixPosition(T.matrixWorld),j.color.copy(X).multiplyScalar(H),j.distance=Y,j.coneCos=Math.cos(T.angle),j.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),j.decay=T.decay,i.spot[y]=j;const K=T.shadow;if(T.map&&(i.spotLightMap[D]=T.map,D++,K.updateMatrices(T),T.castShadow&&P++),i.spotLightMatrix[y]=K.matrix,T.castShadow){const V=e.get(T);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,i.spotShadow[y]=V,i.spotShadowMap[y]=$,b++}y++}else if(T.isRectAreaLight){const j=t.get(T);j.color.copy(X).multiplyScalar(H),j.halfWidth.set(T.width*.5,0,0),j.halfHeight.set(0,T.height*.5,0),i.rectArea[m]=j,m++}else if(T.isPointLight){const j=t.get(T);if(j.color.copy(T.color).multiplyScalar(T.intensity),j.distance=T.distance,j.decay=T.decay,T.castShadow){const K=T.shadow,V=e.get(T);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,V.shadowCameraNear=K.camera.near,V.shadowCameraFar=K.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=$,i.pointShadowMatrix[g]=T.shadow.matrix,E++}i.point[g]=j,g++}else if(T.isHemisphereLight){const j=t.get(T);j.skyColor.copy(T.color).multiplyScalar(H),j.groundColor.copy(T.groundColor).multiplyScalar(H),i.hemi[d]=j,d++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=rt.LTC_FLOAT_1,i.rectAreaLTC2=rt.LTC_FLOAT_2):(i.rectAreaLTC1=rt.LTC_HALF_1,i.rectAreaLTC2=rt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const F=i.hash;(F.directionalLength!==p||F.pointLength!==g||F.spotLength!==y||F.rectAreaLength!==m||F.hemiLength!==d||F.numDirectionalShadows!==A||F.numPointShadows!==E||F.numSpotShadows!==b||F.numSpotMaps!==D||F.numLightProbes!==C)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=m,i.point.length=g,i.hemi.length=d,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=b+D-P,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=C,F.directionalLength=p,F.pointLength=g,F.spotLength=y,F.rectAreaLength=m,F.hemiLength=d,F.numDirectionalShadows=A,F.numPointShadows=E,F.numSpotShadows=b,F.numSpotMaps=D,F.numLightProbes=C,i.version=W0++)}function c(l,u){let h=0,f=0,p=0,g=0,y=0;const m=u.matrixWorldInverse;for(let d=0,A=l.length;d<A;d++){const E=l[d];if(E.isDirectionalLight){const b=i.directional[h];b.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),h++}else if(E.isSpotLight){const b=i.spot[p];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),p++}else if(E.isRectAreaLight){const b=i.rectArea[g];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),b.halfWidth.set(E.width*.5,0,0),b.halfHeight.set(0,E.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){const b=i.point[f];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(m),f++}else if(E.isHemisphereLight){const b=i.hemi[y];b.direction.setFromMatrixPosition(E.matrixWorld),b.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:i}}function gh(n){const t=new Y0(n),e=[],i=[];function s(u){l.camera=u,e.length=0,i.length=0}function r(u){e.push(u)}function o(u){i.push(u)}function a(){t.setup(e)}function c(u){t.setupView(e,u)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function j0(n){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new gh(n),t.set(s,[a])):r>=o.length?(a=new gh(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}const q0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function K0(n,t,e){let i=new zl;const s=new Xt,r=new Xt,o=new Ue,a=new g_({depthPacking:Rm}),c=new v_,l={},u=e.maxTextureSize,h={[ki]:en,[en]:ki,[yi]:yi},f=new Hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xt},radius:{value:4}},vertexShader:q0,fragmentShader:$0}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new ci;g.setAttribute("position",new ii(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Vn(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=td;let d=this.type;this.render=function(P,C,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;const x=n.getRenderTarget(),S=n.getActiveCubeFace(),T=n.getActiveMipmapLevel(),X=n.state;X.setBlending(zi),X.buffers.depth.getReversed()?X.buffers.color.setClear(0,0,0,0):X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const H=d!==mi&&this.type===mi,Y=d===mi&&this.type!==mi;for(let $=0,j=P.length;$<j;$++){const K=P[$],V=K.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ot=V.getFrameExtents();if(s.multiply(ot),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ot.x),s.x=r.x*ot.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ot.y),s.y=r.y*ot.y,V.mapSize.y=r.y)),V.map===null||H===!0||Y===!0){const Mt=this.type!==mi?{minFilter:Hn,magFilter:Hn}:{};V.map!==null&&V.map.dispose(),V.map=new hs(s.x,s.y,Mt),V.map.texture.name=K.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const ht=V.getViewportCount();for(let Mt=0;Mt<ht;Mt++){const Kt=V.getViewport(Mt);o.set(r.x*Kt.x,r.y*Kt.y,r.x*Kt.z,r.y*Kt.w),X.viewport(o),V.updateMatrices(K,Mt),i=V.getFrustum(),b(C,F,V.camera,K,this.type)}V.isPointLightShadow!==!0&&this.type===mi&&A(V,F),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,n.setRenderTarget(x,S,T)};function A(P,C){const F=t.update(y);f.defines.VSM_SAMPLES!==P.blurSamples&&(f.defines.VSM_SAMPLES=P.blurSamples,p.defines.VSM_SAMPLES=P.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new hs(s.x,s.y)),f.uniforms.shadow_pass.value=P.map.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,n.setRenderTarget(P.mapPass),n.clear(),n.renderBufferDirect(C,null,F,f,y,null),p.uniforms.shadow_pass.value=P.mapPass.texture,p.uniforms.resolution.value=P.mapSize,p.uniforms.radius.value=P.radius,n.setRenderTarget(P.map),n.clear(),n.renderBufferDirect(C,null,F,p,y,null)}function E(P,C,F,x){let S=null;const T=F.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(T!==void 0)S=T;else if(S=F.isPointLight===!0?c:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const X=S.uuid,H=C.uuid;let Y=l[X];Y===void 0&&(Y={},l[X]=Y);let $=Y[H];$===void 0&&($=S.clone(),Y[H]=$,C.addEventListener("dispose",D)),S=$}if(S.visible=C.visible,S.wireframe=C.wireframe,x===mi?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:h[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,F.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const X=n.properties.get(S);X.light=F}return S}function b(P,C,F,x,S){if(P.visible===!1)return;if(P.layers.test(C.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&S===mi)&&(!P.frustumCulled||i.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,P.matrixWorld);const H=t.update(P),Y=P.material;if(Array.isArray(Y)){const $=H.groups;for(let j=0,K=$.length;j<K;j++){const V=$[j],ot=Y[V.materialIndex];if(ot&&ot.visible){const ht=E(P,ot,x,S);P.onBeforeShadow(n,P,C,F,H,ht,V),n.renderBufferDirect(F,null,H,ht,P,V),P.onAfterShadow(n,P,C,F,H,ht,V)}}}else if(Y.visible){const $=E(P,Y,x,S);P.onBeforeShadow(n,P,C,F,H,$,null),n.renderBufferDirect(F,null,H,$,P,null),P.onAfterShadow(n,P,C,F,H,$,null)}}const X=P.children;for(let H=0,Y=X.length;H<Y;H++)b(X[H],C,F,x,S)}function D(P){P.target.removeEventListener("dispose",D);for(const F in l){const x=l[F],S=P.target.uuid;S in x&&(x[S].dispose(),delete x[S])}}}const Z0={[Ac]:Rc,[Ic]:Pc,[Cc]:Lc,[nr]:Dc,[Rc]:Ac,[Pc]:Ic,[Lc]:Cc,[Dc]:nr};function J0(n,t){function e(){let R=!1;const et=new Ue;let st=null;const ft=new Ue(0,0,0,0);return{setMask:function(J){st!==J&&!R&&(n.colorMask(J,J,J,J),st=J)},setLocked:function(J){R=J},setClear:function(J,q,_t,Wt,be){be===!0&&(J*=Wt,q*=Wt,_t*=Wt),et.set(J,q,_t,Wt),ft.equals(et)===!1&&(n.clearColor(J,q,_t,Wt),ft.copy(et))},reset:function(){R=!1,st=null,ft.set(-1,0,0,0)}}}function i(){let R=!1,et=!1,st=null,ft=null,J=null;return{setReversed:function(q){if(et!==q){const _t=t.get("EXT_clip_control");q?_t.clipControlEXT(_t.LOWER_LEFT_EXT,_t.ZERO_TO_ONE_EXT):_t.clipControlEXT(_t.LOWER_LEFT_EXT,_t.NEGATIVE_ONE_TO_ONE_EXT),et=q;const Wt=J;J=null,this.setClear(Wt)}},getReversed:function(){return et},setTest:function(q){q?it(n.DEPTH_TEST):Ft(n.DEPTH_TEST)},setMask:function(q){st!==q&&!R&&(n.depthMask(q),st=q)},setFunc:function(q){if(et&&(q=Z0[q]),ft!==q){switch(q){case Ac:n.depthFunc(n.NEVER);break;case Rc:n.depthFunc(n.ALWAYS);break;case Ic:n.depthFunc(n.LESS);break;case nr:n.depthFunc(n.LEQUAL);break;case Cc:n.depthFunc(n.EQUAL);break;case Dc:n.depthFunc(n.GEQUAL);break;case Pc:n.depthFunc(n.GREATER);break;case Lc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ft=q}},setLocked:function(q){R=q},setClear:function(q){J!==q&&(et&&(q=1-q),n.clearDepth(q),J=q)},reset:function(){R=!1,st=null,ft=null,J=null,et=!1}}}function s(){let R=!1,et=null,st=null,ft=null,J=null,q=null,_t=null,Wt=null,be=null;return{setTest:function(ce){R||(ce?it(n.STENCIL_TEST):Ft(n.STENCIL_TEST))},setMask:function(ce){et!==ce&&!R&&(n.stencilMask(ce),et=ce)},setFunc:function(ce,li,Xn){(st!==ce||ft!==li||J!==Xn)&&(n.stencilFunc(ce,li,Xn),st=ce,ft=li,J=Xn)},setOp:function(ce,li,Xn){(q!==ce||_t!==li||Wt!==Xn)&&(n.stencilOp(ce,li,Xn),q=ce,_t=li,Wt=Xn)},setLocked:function(ce){R=ce},setClear:function(ce){be!==ce&&(n.clearStencil(ce),be=ce)},reset:function(){R=!1,et=null,st=null,ft=null,J=null,q=null,_t=null,Wt=null,be=null}}}const r=new e,o=new i,a=new s,c=new WeakMap,l=new WeakMap;let u={},h={},f=new WeakMap,p=[],g=null,y=!1,m=null,d=null,A=null,E=null,b=null,D=null,P=null,C=new ie(0,0,0),F=0,x=!1,S=null,T=null,X=null,H=null,Y=null;const $=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,K=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(V)[1]),j=K>=1):V.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),j=K>=2);let ot=null,ht={};const Mt=n.getParameter(n.SCISSOR_BOX),Kt=n.getParameter(n.VIEWPORT),we=new Ue().fromArray(Mt),ye=new Ue().fromArray(Kt);function W(R,et,st,ft){const J=new Uint8Array(4),q=n.createTexture();n.bindTexture(R,q),n.texParameteri(R,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(R,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let _t=0;_t<st;_t++)R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY?n.texImage3D(et,0,n.RGBA,1,1,ft,0,n.RGBA,n.UNSIGNED_BYTE,J):n.texImage2D(et+_t,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,J);return q}const at={};at[n.TEXTURE_2D]=W(n.TEXTURE_2D,n.TEXTURE_2D,1),at[n.TEXTURE_CUBE_MAP]=W(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),at[n.TEXTURE_2D_ARRAY]=W(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),at[n.TEXTURE_3D]=W(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),it(n.DEPTH_TEST),o.setFunc(nr),ae(!1),bt(_u),it(n.CULL_FACE),xe(zi);function it(R){u[R]!==!0&&(n.enable(R),u[R]=!0)}function Ft(R){u[R]!==!1&&(n.disable(R),u[R]=!1)}function Ot(R,et){return h[R]!==et?(n.bindFramebuffer(R,et),h[R]=et,R===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=et),R===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=et),!0):!1}function Gt(R,et){let st=p,ft=!1;if(R){st=f.get(et),st===void 0&&(st=[],f.set(et,st));const J=R.textures;if(st.length!==J.length||st[0]!==n.COLOR_ATTACHMENT0){for(let q=0,_t=J.length;q<_t;q++)st[q]=n.COLOR_ATTACHMENT0+q;st.length=J.length,ft=!0}}else st[0]!==n.BACK&&(st[0]=n.BACK,ft=!0);ft&&n.drawBuffers(st)}function Ne(R){return g!==R?(n.useProgram(R),g=R,!0):!1}const se={[ss]:n.FUNC_ADD,[tm]:n.FUNC_SUBTRACT,[em]:n.FUNC_REVERSE_SUBTRACT};se[nm]=n.MIN,se[im]=n.MAX;const w={[sm]:n.ZERO,[rm]:n.ONE,[om]:n.SRC_COLOR,[Tc]:n.SRC_ALPHA,[dm]:n.SRC_ALPHA_SATURATE,[um]:n.DST_COLOR,[cm]:n.DST_ALPHA,[am]:n.ONE_MINUS_SRC_COLOR,[wc]:n.ONE_MINUS_SRC_ALPHA,[hm]:n.ONE_MINUS_DST_COLOR,[lm]:n.ONE_MINUS_DST_ALPHA,[fm]:n.CONSTANT_COLOR,[pm]:n.ONE_MINUS_CONSTANT_COLOR,[mm]:n.CONSTANT_ALPHA,[_m]:n.ONE_MINUS_CONSTANT_ALPHA};function xe(R,et,st,ft,J,q,_t,Wt,be,ce){if(R===zi){y===!0&&(Ft(n.BLEND),y=!1);return}if(y===!1&&(it(n.BLEND),y=!0),R!==Qp){if(R!==m||ce!==x){if((d!==ss||b!==ss)&&(n.blendEquation(n.FUNC_ADD),d=ss,b=ss),ce)switch(R){case qs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case gu:n.blendFunc(n.ONE,n.ONE);break;case vu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case yu:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}else switch(R){case qs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case gu:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case vu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}A=null,E=null,D=null,P=null,C.set(0,0,0),F=0,m=R,x=ce}return}J=J||et,q=q||st,_t=_t||ft,(et!==d||J!==b)&&(n.blendEquationSeparate(se[et],se[J]),d=et,b=J),(st!==A||ft!==E||q!==D||_t!==P)&&(n.blendFuncSeparate(w[st],w[ft],w[q],w[_t]),A=st,E=ft,D=q,P=_t),(Wt.equals(C)===!1||be!==F)&&(n.blendColor(Wt.r,Wt.g,Wt.b,be),C.copy(Wt),F=be),m=R,x=!1}function It(R,et){R.side===yi?Ft(n.CULL_FACE):it(n.CULL_FACE);let st=R.side===en;et&&(st=!st),ae(st),R.blending===qs&&R.transparent===!1?xe(zi):xe(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.blendColor,R.blendAlpha,R.premultipliedAlpha),o.setFunc(R.depthFunc),o.setTest(R.depthTest),o.setMask(R.depthWrite),r.setMask(R.colorWrite);const ft=R.stencilWrite;a.setTest(ft),ft&&(a.setMask(R.stencilWriteMask),a.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),a.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),pt(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===!0?it(n.SAMPLE_ALPHA_TO_COVERAGE):Ft(n.SAMPLE_ALPHA_TO_COVERAGE)}function ae(R){S!==R&&(R?n.frontFace(n.CW):n.frontFace(n.CCW),S=R)}function bt(R){R!==Kp?(it(n.CULL_FACE),R!==T&&(R===_u?n.cullFace(n.BACK):R===Zp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ft(n.CULL_FACE),T=R}function Ae(R){R!==X&&(j&&n.lineWidth(R),X=R)}function pt(R,et,st){R?(it(n.POLYGON_OFFSET_FILL),(H!==et||Y!==st)&&(n.polygonOffset(et,st),H=et,Y=st)):Ft(n.POLYGON_OFFSET_FILL)}function Zt(R){R?it(n.SCISSOR_TEST):Ft(n.SCISSOR_TEST)}function Ge(R){R===void 0&&(R=n.TEXTURE0+$-1),ot!==R&&(n.activeTexture(R),ot=R)}function Fe(R,et,st){st===void 0&&(ot===null?st=n.TEXTURE0+$-1:st=ot);let ft=ht[st];ft===void 0&&(ft={type:void 0,texture:void 0},ht[st]=ft),(ft.type!==R||ft.texture!==et)&&(ot!==st&&(n.activeTexture(st),ot=st),n.bindTexture(R,et||at[R]),ft.type=R,ft.texture=et)}function M(){const R=ht[ot];R!==void 0&&R.type!==void 0&&(n.bindTexture(R.type,null),R.type=void 0,R.texture=void 0)}function _(){try{n.compressedTexImage2D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function O(){try{n.compressedTexImage3D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function G(){try{n.texSubImage2D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function Z(){try{n.texSubImage3D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function k(){try{n.compressedTexSubImage2D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function xt(){try{n.compressedTexSubImage3D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function nt(){try{n.texStorage2D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function gt(){try{n.texStorage3D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function vt(){try{n.texImage2D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function tt(){try{n.texImage3D(...arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function ut(R){we.equals(R)===!1&&(n.scissor(R.x,R.y,R.z,R.w),we.copy(R))}function zt(R){ye.equals(R)===!1&&(n.viewport(R.x,R.y,R.z,R.w),ye.copy(R))}function yt(R,et){let st=l.get(et);st===void 0&&(st=new WeakMap,l.set(et,st));let ft=st.get(R);ft===void 0&&(ft=n.getUniformBlockIndex(et,R.name),st.set(R,ft))}function ct(R,et){const ft=l.get(et).get(R);c.get(et)!==ft&&(n.uniformBlockBinding(et,ft,R.__bindingPointIndex),c.set(et,ft))}function Yt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ot=null,ht={},h={},f=new WeakMap,p=[],g=null,y=!1,m=null,d=null,A=null,E=null,b=null,D=null,P=null,C=new ie(0,0,0),F=0,x=!1,S=null,T=null,X=null,H=null,Y=null,we.set(0,0,n.canvas.width,n.canvas.height),ye.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:it,disable:Ft,bindFramebuffer:Ot,drawBuffers:Gt,useProgram:Ne,setBlending:xe,setMaterial:It,setFlipSided:ae,setCullFace:bt,setLineWidth:Ae,setPolygonOffset:pt,setScissorTest:Zt,activeTexture:Ge,bindTexture:Fe,unbindTexture:M,compressedTexImage2D:_,compressedTexImage3D:O,texImage2D:vt,texImage3D:tt,updateUBOMapping:yt,uniformBlockBinding:ct,texStorage2D:nt,texStorage3D:gt,texSubImage2D:G,texSubImage3D:Z,compressedTexSubImage2D:k,compressedTexSubImage3D:xt,scissor:ut,viewport:zt,reset:Yt}}function Q0(n,t,e,i,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Xt,u=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(M,_){return p?new OffscreenCanvas(M,_):Zo("canvas")}function y(M,_,O){let G=1;const Z=Fe(M);if((Z.width>O||Z.height>O)&&(G=O/Math.max(Z.width,Z.height)),G<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){const k=Math.floor(G*Z.width),xt=Math.floor(G*Z.height);h===void 0&&(h=g(k,xt));const nt=_?g(k,xt):h;return nt.width=k,nt.height=xt,nt.getContext("2d").drawImage(M,0,0,k,xt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+k+"x"+xt+")."),nt}else return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),M;return M}function m(M){return M.generateMipmaps}function d(M){n.generateMipmap(M)}function A(M){return M.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?n.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function E(M,_,O,G,Z=!1){if(M!==null){if(n[M]!==void 0)return n[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let k=_;if(_===n.RED&&(O===n.FLOAT&&(k=n.R32F),O===n.HALF_FLOAT&&(k=n.R16F),O===n.UNSIGNED_BYTE&&(k=n.R8)),_===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(k=n.R8UI),O===n.UNSIGNED_SHORT&&(k=n.R16UI),O===n.UNSIGNED_INT&&(k=n.R32UI),O===n.BYTE&&(k=n.R8I),O===n.SHORT&&(k=n.R16I),O===n.INT&&(k=n.R32I)),_===n.RG&&(O===n.FLOAT&&(k=n.RG32F),O===n.HALF_FLOAT&&(k=n.RG16F),O===n.UNSIGNED_BYTE&&(k=n.RG8)),_===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(k=n.RG8UI),O===n.UNSIGNED_SHORT&&(k=n.RG16UI),O===n.UNSIGNED_INT&&(k=n.RG32UI),O===n.BYTE&&(k=n.RG8I),O===n.SHORT&&(k=n.RG16I),O===n.INT&&(k=n.RG32I)),_===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(k=n.RGB8UI),O===n.UNSIGNED_SHORT&&(k=n.RGB16UI),O===n.UNSIGNED_INT&&(k=n.RGB32UI),O===n.BYTE&&(k=n.RGB8I),O===n.SHORT&&(k=n.RGB16I),O===n.INT&&(k=n.RGB32I)),_===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(k=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(k=n.RGBA16UI),O===n.UNSIGNED_INT&&(k=n.RGBA32UI),O===n.BYTE&&(k=n.RGBA8I),O===n.SHORT&&(k=n.RGBA16I),O===n.INT&&(k=n.RGBA32I)),_===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(k=n.RGB9_E5),_===n.RGBA){const xt=Z?$o:oe.getTransfer(G);O===n.FLOAT&&(k=n.RGBA32F),O===n.HALF_FLOAT&&(k=n.RGBA16F),O===n.UNSIGNED_BYTE&&(k=xt===_e?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(k=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(k=n.RGB5_A1)}return(k===n.R16F||k===n.R32F||k===n.RG16F||k===n.RG32F||k===n.RGBA16F||k===n.RGBA32F)&&t.get("EXT_color_buffer_float"),k}function b(M,_){let O;return M?_===null||_===ls||_===Or?O=n.DEPTH24_STENCIL8:_===bi?O=n.DEPTH32F_STENCIL8:_===Fr&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ls||_===Or?O=n.DEPTH_COMPONENT24:_===bi?O=n.DEPTH_COMPONENT32F:_===Fr&&(O=n.DEPTH_COMPONENT16),O}function D(M,_){return m(M)===!0||M.isFramebufferTexture&&M.minFilter!==Hn&&M.minFilter!==ti?Math.log2(Math.max(_.width,_.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?_.mipmaps.length:1}function P(M){const _=M.target;_.removeEventListener("dispose",P),F(_),_.isVideoTexture&&u.delete(_)}function C(M){const _=M.target;_.removeEventListener("dispose",C),S(_)}function F(M){const _=i.get(M);if(_.__webglInit===void 0)return;const O=M.source,G=f.get(O);if(G){const Z=G[_.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&x(M),Object.keys(G).length===0&&f.delete(O)}i.remove(M)}function x(M){const _=i.get(M);n.deleteTexture(_.__webglTexture);const O=M.source,G=f.get(O);delete G[_.__cacheKey],o.memory.textures--}function S(M){const _=i.get(M);if(M.depthTexture&&(M.depthTexture.dispose(),i.remove(M.depthTexture)),M.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(_.__webglFramebuffer[G]))for(let Z=0;Z<_.__webglFramebuffer[G].length;Z++)n.deleteFramebuffer(_.__webglFramebuffer[G][Z]);else n.deleteFramebuffer(_.__webglFramebuffer[G]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[G])}else{if(Array.isArray(_.__webglFramebuffer))for(let G=0;G<_.__webglFramebuffer.length;G++)n.deleteFramebuffer(_.__webglFramebuffer[G]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let G=0;G<_.__webglColorRenderbuffer.length;G++)_.__webglColorRenderbuffer[G]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[G]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=M.textures;for(let G=0,Z=O.length;G<Z;G++){const k=i.get(O[G]);k.__webglTexture&&(n.deleteTexture(k.__webglTexture),o.memory.textures--),i.remove(O[G])}i.remove(M)}let T=0;function X(){T=0}function H(){const M=T;return M>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+s.maxTextures),T+=1,M}function Y(M){const _=[];return _.push(M.wrapS),_.push(M.wrapT),_.push(M.wrapR||0),_.push(M.magFilter),_.push(M.minFilter),_.push(M.anisotropy),_.push(M.internalFormat),_.push(M.format),_.push(M.type),_.push(M.generateMipmaps),_.push(M.premultiplyAlpha),_.push(M.flipY),_.push(M.unpackAlignment),_.push(M.colorSpace),_.join()}function $(M,_){const O=i.get(M);if(M.isVideoTexture&&Zt(M),M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&O.__version!==M.version){const G=M.image;if(G===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{at(O,M,_);return}}else M.isExternalTexture&&(O.__webglTexture=M.sourceTexture?M.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+_)}function j(M,_){const O=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){at(O,M,_);return}e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+_)}function K(M,_){const O=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){at(O,M,_);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+_)}function V(M,_){const O=i.get(M);if(M.version>0&&O.__version!==M.version){it(O,M,_);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+_)}const ot={[Fc]:n.REPEAT,[os]:n.CLAMP_TO_EDGE,[Oc]:n.MIRRORED_REPEAT},ht={[Hn]:n.NEAREST,[wm]:n.NEAREST_MIPMAP_NEAREST,[io]:n.NEAREST_MIPMAP_LINEAR,[ti]:n.LINEAR,[za]:n.LINEAR_MIPMAP_NEAREST,[as]:n.LINEAR_MIPMAP_LINEAR},Mt={[Cm]:n.NEVER,[Fm]:n.ALWAYS,[Dm]:n.LESS,[dd]:n.LEQUAL,[Pm]:n.EQUAL,[Nm]:n.GEQUAL,[Lm]:n.GREATER,[Um]:n.NOTEQUAL};function Kt(M,_){if(_.type===bi&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===ti||_.magFilter===za||_.magFilter===io||_.magFilter===as||_.minFilter===ti||_.minFilter===za||_.minFilter===io||_.minFilter===as)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(M,n.TEXTURE_WRAP_S,ot[_.wrapS]),n.texParameteri(M,n.TEXTURE_WRAP_T,ot[_.wrapT]),(M===n.TEXTURE_3D||M===n.TEXTURE_2D_ARRAY)&&n.texParameteri(M,n.TEXTURE_WRAP_R,ot[_.wrapR]),n.texParameteri(M,n.TEXTURE_MAG_FILTER,ht[_.magFilter]),n.texParameteri(M,n.TEXTURE_MIN_FILTER,ht[_.minFilter]),_.compareFunction&&(n.texParameteri(M,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(M,n.TEXTURE_COMPARE_FUNC,Mt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Hn||_.minFilter!==io&&_.minFilter!==as||_.type===bi&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(M,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function we(M,_){let O=!1;M.__webglInit===void 0&&(M.__webglInit=!0,_.addEventListener("dispose",P));const G=_.source;let Z=f.get(G);Z===void 0&&(Z={},f.set(G,Z));const k=Y(_);if(k!==M.__cacheKey){Z[k]===void 0&&(Z[k]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),Z[k].usedTimes++;const xt=Z[M.__cacheKey];xt!==void 0&&(Z[M.__cacheKey].usedTimes--,xt.usedTimes===0&&x(_)),M.__cacheKey=k,M.__webglTexture=Z[k].texture}return O}function ye(M,_,O){return Math.floor(Math.floor(M/O)/_)}function W(M,_,O,G){const k=M.updateRanges;if(k.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,O,G,_.data);else{k.sort((tt,ut)=>tt.start-ut.start);let xt=0;for(let tt=1;tt<k.length;tt++){const ut=k[xt],zt=k[tt],yt=ut.start+ut.count,ct=ye(zt.start,_.width,4),Yt=ye(ut.start,_.width,4);zt.start<=yt+1&&ct===Yt&&ye(zt.start+zt.count-1,_.width,4)===ct?ut.count=Math.max(ut.count,zt.start+zt.count-ut.start):(++xt,k[xt]=zt)}k.length=xt+1;const nt=n.getParameter(n.UNPACK_ROW_LENGTH),gt=n.getParameter(n.UNPACK_SKIP_PIXELS),vt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let tt=0,ut=k.length;tt<ut;tt++){const zt=k[tt],yt=Math.floor(zt.start/4),ct=Math.ceil(zt.count/4),Yt=yt%_.width,R=Math.floor(yt/_.width),et=ct,st=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Yt),n.pixelStorei(n.UNPACK_SKIP_ROWS,R),e.texSubImage2D(n.TEXTURE_2D,0,Yt,R,et,st,O,G,_.data)}M.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,nt),n.pixelStorei(n.UNPACK_SKIP_PIXELS,gt),n.pixelStorei(n.UNPACK_SKIP_ROWS,vt)}}function at(M,_,O){let G=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(G=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(G=n.TEXTURE_3D);const Z=we(M,_),k=_.source;e.bindTexture(G,M.__webglTexture,n.TEXTURE0+O);const xt=i.get(k);if(k.version!==xt.__version||Z===!0){e.activeTexture(n.TEXTURE0+O);const nt=oe.getPrimaries(oe.workingColorSpace),gt=_.colorSpace===Oi?null:oe.getPrimaries(_.colorSpace),vt=_.colorSpace===Oi||nt===gt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let tt=y(_.image,!1,s.maxTextureSize);tt=Ge(_,tt);const ut=r.convert(_.format,_.colorSpace),zt=r.convert(_.type);let yt=E(_.internalFormat,ut,zt,_.colorSpace,_.isVideoTexture);Kt(G,_);let ct;const Yt=_.mipmaps,R=_.isVideoTexture!==!0,et=xt.__version===void 0||Z===!0,st=k.dataReady,ft=D(_,tt);if(_.isDepthTexture)yt=b(_.format===zr,_.type),et&&(R?e.texStorage2D(n.TEXTURE_2D,1,yt,tt.width,tt.height):e.texImage2D(n.TEXTURE_2D,0,yt,tt.width,tt.height,0,ut,zt,null));else if(_.isDataTexture)if(Yt.length>0){R&&et&&e.texStorage2D(n.TEXTURE_2D,ft,yt,Yt[0].width,Yt[0].height);for(let J=0,q=Yt.length;J<q;J++)ct=Yt[J],R?st&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ct.width,ct.height,ut,zt,ct.data):e.texImage2D(n.TEXTURE_2D,J,yt,ct.width,ct.height,0,ut,zt,ct.data);_.generateMipmaps=!1}else R?(et&&e.texStorage2D(n.TEXTURE_2D,ft,yt,tt.width,tt.height),st&&W(_,tt,ut,zt)):e.texImage2D(n.TEXTURE_2D,0,yt,tt.width,tt.height,0,ut,zt,tt.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){R&&et&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ft,yt,Yt[0].width,Yt[0].height,tt.depth);for(let J=0,q=Yt.length;J<q;J++)if(ct=Yt[J],_.format!==zn)if(ut!==null)if(R){if(st)if(_.layerUpdates.size>0){const _t=ju(ct.width,ct.height,_.format,_.type);for(const Wt of _.layerUpdates){const be=ct.data.subarray(Wt*_t/ct.data.BYTES_PER_ELEMENT,(Wt+1)*_t/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,Wt,ct.width,ct.height,1,ut,be)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ct.width,ct.height,tt.depth,ut,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,yt,ct.width,ct.height,tt.depth,0,ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else R?st&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ct.width,ct.height,tt.depth,ut,zt,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,J,yt,ct.width,ct.height,tt.depth,0,ut,zt,ct.data)}else{R&&et&&e.texStorage2D(n.TEXTURE_2D,ft,yt,Yt[0].width,Yt[0].height);for(let J=0,q=Yt.length;J<q;J++)ct=Yt[J],_.format!==zn?ut!==null?R?st&&e.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,ct.width,ct.height,ut,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,J,yt,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):R?st&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ct.width,ct.height,ut,zt,ct.data):e.texImage2D(n.TEXTURE_2D,J,yt,ct.width,ct.height,0,ut,zt,ct.data)}else if(_.isDataArrayTexture)if(R){if(et&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ft,yt,tt.width,tt.height,tt.depth),st)if(_.layerUpdates.size>0){const J=ju(tt.width,tt.height,_.format,_.type);for(const q of _.layerUpdates){const _t=tt.data.subarray(q*J/tt.data.BYTES_PER_ELEMENT,(q+1)*J/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,q,tt.width,tt.height,1,ut,zt,_t)}_.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ut,zt,tt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,yt,tt.width,tt.height,tt.depth,0,ut,zt,tt.data);else if(_.isData3DTexture)R?(et&&e.texStorage3D(n.TEXTURE_3D,ft,yt,tt.width,tt.height,tt.depth),st&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ut,zt,tt.data)):e.texImage3D(n.TEXTURE_3D,0,yt,tt.width,tt.height,tt.depth,0,ut,zt,tt.data);else if(_.isFramebufferTexture){if(et)if(R)e.texStorage2D(n.TEXTURE_2D,ft,yt,tt.width,tt.height);else{let J=tt.width,q=tt.height;for(let _t=0;_t<ft;_t++)e.texImage2D(n.TEXTURE_2D,_t,yt,J,q,0,ut,zt,null),J>>=1,q>>=1}}else if(Yt.length>0){if(R&&et){const J=Fe(Yt[0]);e.texStorage2D(n.TEXTURE_2D,ft,yt,J.width,J.height)}for(let J=0,q=Yt.length;J<q;J++)ct=Yt[J],R?st&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ut,zt,ct):e.texImage2D(n.TEXTURE_2D,J,yt,ut,zt,ct);_.generateMipmaps=!1}else if(R){if(et){const J=Fe(tt);e.texStorage2D(n.TEXTURE_2D,ft,yt,J.width,J.height)}st&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ut,zt,tt)}else e.texImage2D(n.TEXTURE_2D,0,yt,ut,zt,tt);m(_)&&d(G),xt.__version=k.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function it(M,_,O){if(_.image.length!==6)return;const G=we(M,_),Z=_.source;e.bindTexture(n.TEXTURE_CUBE_MAP,M.__webglTexture,n.TEXTURE0+O);const k=i.get(Z);if(Z.version!==k.__version||G===!0){e.activeTexture(n.TEXTURE0+O);const xt=oe.getPrimaries(oe.workingColorSpace),nt=_.colorSpace===Oi?null:oe.getPrimaries(_.colorSpace),gt=_.colorSpace===Oi||xt===nt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const vt=_.isCompressedTexture||_.image[0].isCompressedTexture,tt=_.image[0]&&_.image[0].isDataTexture,ut=[];for(let q=0;q<6;q++)!vt&&!tt?ut[q]=y(_.image[q],!0,s.maxCubemapSize):ut[q]=tt?_.image[q].image:_.image[q],ut[q]=Ge(_,ut[q]);const zt=ut[0],yt=r.convert(_.format,_.colorSpace),ct=r.convert(_.type),Yt=E(_.internalFormat,yt,ct,_.colorSpace),R=_.isVideoTexture!==!0,et=k.__version===void 0||G===!0,st=Z.dataReady;let ft=D(_,zt);Kt(n.TEXTURE_CUBE_MAP,_);let J;if(vt){R&&et&&e.texStorage2D(n.TEXTURE_CUBE_MAP,ft,Yt,zt.width,zt.height);for(let q=0;q<6;q++){J=ut[q].mipmaps;for(let _t=0;_t<J.length;_t++){const Wt=J[_t];_.format!==zn?yt!==null?R?st&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t,0,0,Wt.width,Wt.height,yt,Wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t,Yt,Wt.width,Wt.height,0,Wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):R?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t,0,0,Wt.width,Wt.height,yt,ct,Wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t,Yt,Wt.width,Wt.height,0,yt,ct,Wt.data)}}}else{if(J=_.mipmaps,R&&et){J.length>0&&ft++;const q=Fe(ut[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,ft,Yt,q.width,q.height)}for(let q=0;q<6;q++)if(tt){R?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,ut[q].width,ut[q].height,yt,ct,ut[q].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Yt,ut[q].width,ut[q].height,0,yt,ct,ut[q].data);for(let _t=0;_t<J.length;_t++){const be=J[_t].image[q].image;R?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t+1,0,0,be.width,be.height,yt,ct,be.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t+1,Yt,be.width,be.height,0,yt,ct,be.data)}}else{R?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,yt,ct,ut[q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Yt,yt,ct,ut[q]);for(let _t=0;_t<J.length;_t++){const Wt=J[_t];R?st&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t+1,0,0,yt,ct,Wt.image[q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,_t+1,Yt,yt,ct,Wt.image[q])}}}m(_)&&d(n.TEXTURE_CUBE_MAP),k.__version=Z.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function Ft(M,_,O,G,Z,k){const xt=r.convert(O.format,O.colorSpace),nt=r.convert(O.type),gt=E(O.internalFormat,xt,nt,O.colorSpace),vt=i.get(_),tt=i.get(O);if(tt.__renderTarget=_,!vt.__hasExternalTextures){const ut=Math.max(1,_.width>>k),zt=Math.max(1,_.height>>k);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,k,gt,ut,zt,_.depth,0,xt,nt,null):e.texImage2D(Z,k,gt,ut,zt,0,xt,nt,null)}e.bindFramebuffer(n.FRAMEBUFFER,M),pt(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,G,Z,tt.__webglTexture,0,Ae(_)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,G,Z,tt.__webglTexture,k),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ot(M,_,O){if(n.bindRenderbuffer(n.RENDERBUFFER,M),_.depthBuffer){const G=_.depthTexture,Z=G&&G.isDepthTexture?G.type:null,k=b(_.stencilBuffer,Z),xt=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=Ae(_);pt(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,nt,k,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,nt,k,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,k,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,xt,n.RENDERBUFFER,M)}else{const G=_.textures;for(let Z=0;Z<G.length;Z++){const k=G[Z],xt=r.convert(k.format,k.colorSpace),nt=r.convert(k.type),gt=E(k.internalFormat,xt,nt,k.colorSpace),vt=Ae(_);O&&pt(_)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,vt,gt,_.width,_.height):pt(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,vt,gt,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,gt,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Gt(M,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,M),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const G=i.get(_.depthTexture);G.__renderTarget=_,(!G.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),$(_.depthTexture,0);const Z=G.__webglTexture,k=Ae(_);if(_.depthTexture.format===Br)pt(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Z,0,k):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Z,0);else if(_.depthTexture.format===zr)pt(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Z,0,k):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Ne(M){const _=i.get(M),O=M.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==M.depthTexture){const G=M.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),G){const Z=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,G.removeEventListener("dispose",Z)};G.addEventListener("dispose",Z),_.__depthDisposeCallback=Z}_.__boundDepthTexture=G}if(M.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const G=M.texture.mipmaps;G&&G.length>0?Gt(_.__webglFramebuffer[0],M):Gt(_.__webglFramebuffer,M)}else if(O){_.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[G]),_.__webglDepthbuffer[G]===void 0)_.__webglDepthbuffer[G]=n.createRenderbuffer(),Ot(_.__webglDepthbuffer[G],M,!1);else{const Z=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,k=_.__webglDepthbuffer[G];n.bindRenderbuffer(n.RENDERBUFFER,k),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,k)}}else{const G=M.texture.mipmaps;if(G&&G.length>0?e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),Ot(_.__webglDepthbuffer,M,!1);else{const Z=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,k=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,k),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,k)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function se(M,_,O){const G=i.get(M);_!==void 0&&Ft(G.__webglFramebuffer,M,M.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ne(M)}function w(M){const _=M.texture,O=i.get(M),G=i.get(_);M.addEventListener("dispose",C);const Z=M.textures,k=M.isWebGLCubeRenderTarget===!0,xt=Z.length>1;if(xt||(G.__webglTexture===void 0&&(G.__webglTexture=n.createTexture()),G.__version=_.version,o.memory.textures++),k){O.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[nt]=[];for(let gt=0;gt<_.mipmaps.length;gt++)O.__webglFramebuffer[nt][gt]=n.createFramebuffer()}else O.__webglFramebuffer[nt]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let nt=0;nt<_.mipmaps.length;nt++)O.__webglFramebuffer[nt]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(xt)for(let nt=0,gt=Z.length;nt<gt;nt++){const vt=i.get(Z[nt]);vt.__webglTexture===void 0&&(vt.__webglTexture=n.createTexture(),o.memory.textures++)}if(M.samples>0&&pt(M)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let nt=0;nt<Z.length;nt++){const gt=Z[nt];O.__webglColorRenderbuffer[nt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[nt]);const vt=r.convert(gt.format,gt.colorSpace),tt=r.convert(gt.type),ut=E(gt.internalFormat,vt,tt,gt.colorSpace,M.isXRRenderTarget===!0),zt=Ae(M);n.renderbufferStorageMultisample(n.RENDERBUFFER,zt,ut,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+nt,n.RENDERBUFFER,O.__webglColorRenderbuffer[nt])}n.bindRenderbuffer(n.RENDERBUFFER,null),M.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),Ot(O.__webglDepthRenderbuffer,M,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(k){e.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture),Kt(n.TEXTURE_CUBE_MAP,_);for(let nt=0;nt<6;nt++)if(_.mipmaps&&_.mipmaps.length>0)for(let gt=0;gt<_.mipmaps.length;gt++)Ft(O.__webglFramebuffer[nt][gt],M,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,gt);else Ft(O.__webglFramebuffer[nt],M,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(_)&&d(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(xt){for(let nt=0,gt=Z.length;nt<gt;nt++){const vt=Z[nt],tt=i.get(vt);let ut=n.TEXTURE_2D;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(ut=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ut,tt.__webglTexture),Kt(ut,vt),Ft(O.__webglFramebuffer,M,vt,n.COLOR_ATTACHMENT0+nt,ut,0),m(vt)&&d(ut)}e.unbindTexture()}else{let nt=n.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(nt=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(nt,G.__webglTexture),Kt(nt,_),_.mipmaps&&_.mipmaps.length>0)for(let gt=0;gt<_.mipmaps.length;gt++)Ft(O.__webglFramebuffer[gt],M,_,n.COLOR_ATTACHMENT0,nt,gt);else Ft(O.__webglFramebuffer,M,_,n.COLOR_ATTACHMENT0,nt,0);m(_)&&d(nt),e.unbindTexture()}M.depthBuffer&&Ne(M)}function xe(M){const _=M.textures;for(let O=0,G=_.length;O<G;O++){const Z=_[O];if(m(Z)){const k=A(M),xt=i.get(Z).__webglTexture;e.bindTexture(k,xt),d(k),e.unbindTexture()}}}const It=[],ae=[];function bt(M){if(M.samples>0){if(pt(M)===!1){const _=M.textures,O=M.width,G=M.height;let Z=n.COLOR_BUFFER_BIT;const k=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,xt=i.get(M),nt=_.length>1;if(nt)for(let vt=0;vt<_.length;vt++)e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer);const gt=M.texture.mipmaps;gt&&gt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let vt=0;vt<_.length;vt++){if(M.resolveDepthBuffer&&(M.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),nt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,xt.__webglColorRenderbuffer[vt]);const tt=i.get(_[vt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,tt,0)}n.blitFramebuffer(0,0,O,G,0,0,O,G,Z,n.NEAREST),c===!0&&(It.length=0,ae.length=0,It.push(n.COLOR_ATTACHMENT0+vt),M.depthBuffer&&M.resolveDepthBuffer===!1&&(It.push(k),ae.push(k),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ae)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,It))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),nt)for(let vt=0;vt<_.length;vt++){e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,xt.__webglColorRenderbuffer[vt]);const tt=i.get(_[vt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,tt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.resolveDepthBuffer===!1&&c){const _=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function Ae(M){return Math.min(s.maxSamples,M.samples)}function pt(M){const _=i.get(M);return M.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Zt(M){const _=o.render.frame;u.get(M)!==_&&(u.set(M,_),M.update())}function Ge(M,_){const O=M.colorSpace,G=M.format,Z=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||O!==rr&&O!==Oi&&(oe.getTransfer(O)===_e?(G!==zn||Z!==si)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),_}function Fe(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(l.width=M.naturalWidth||M.width,l.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(l.width=M.displayWidth,l.height=M.displayHeight):(l.width=M.width,l.height=M.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=X,this.setTexture2D=$,this.setTexture2DArray=j,this.setTexture3D=K,this.setTextureCube=V,this.rebindTextures=se,this.setupRenderTarget=w,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=Ft,this.useMultisampledRTT=pt}function tS(n,t){function e(i,s=Oi){let r;const o=oe.getTransfer(s);if(i===si)return n.UNSIGNED_BYTE;if(i===Dl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Pl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===rd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===id)return n.BYTE;if(i===sd)return n.SHORT;if(i===Fr)return n.UNSIGNED_SHORT;if(i===Cl)return n.INT;if(i===ls)return n.UNSIGNED_INT;if(i===bi)return n.FLOAT;if(i===jr)return n.HALF_FLOAT;if(i===od)return n.ALPHA;if(i===ad)return n.RGB;if(i===zn)return n.RGBA;if(i===Br)return n.DEPTH_COMPONENT;if(i===zr)return n.DEPTH_STENCIL;if(i===cd)return n.RED;if(i===Ll)return n.RED_INTEGER;if(i===ld)return n.RG;if(i===Ul)return n.RG_INTEGER;if(i===Nl)return n.RGBA_INTEGER;if(i===Lo||i===Uo||i===No||i===Fo)if(o===_e)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Lo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===No)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Lo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Uo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===No)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Fo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Bc||i===zc||i===Vc||i===kc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Bc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===zc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Vc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===kc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Hc||i===Gc||i===Wc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Hc||i===Gc)return o===_e?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Wc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Xc||i===Yc||i===jc||i===qc||i===$c||i===Kc||i===Zc||i===Jc||i===Qc||i===tl||i===el||i===nl||i===il||i===sl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Xc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Yc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===jc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===qc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$c)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Kc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Zc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Jc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Qc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===tl)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===el)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===nl)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===il)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===sl)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Oo||i===rl||i===ol)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Oo)return o===_e?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===rl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ol)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ud||i===al||i===cl||i===ll)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Oo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===al)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===cl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ll)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Or?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class Cd extends ln{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}}const eS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class iS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Cd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Hi({vertexShader:eS,fragmentShader:nS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Vn(new Ia(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class sS extends ms{constructor(t,e){super();const i=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,f=null,p=null,g=null;const y=new iS,m={},d=e.getContextAttributes();let A=null,E=null;const b=[],D=[],P=new Xt;let C=null;const F=new Tn;F.viewport=new Ue;const x=new Tn;x.viewport=new Ue;const S=[F,x],T=new M_;let X=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let at=b[W];return at===void 0&&(at=new ac,b[W]=at),at.getTargetRaySpace()},this.getControllerGrip=function(W){let at=b[W];return at===void 0&&(at=new ac,b[W]=at),at.getGripSpace()},this.getHand=function(W){let at=b[W];return at===void 0&&(at=new ac,b[W]=at),at.getHandSpace()};function Y(W){const at=D.indexOf(W.inputSource);if(at===-1)return;const it=b[at];it!==void 0&&(it.update(W.inputSource,W.frame,l||o),it.dispatchEvent({type:W.type,data:W.inputSource}))}function $(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",j);for(let W=0;W<b.length;W++){const at=D[W];at!==null&&(D[W]=null,b[W].disconnect(at))}X=null,H=null,y.reset();for(const W in m)delete m[W];t.setRenderTarget(A),p=null,f=null,h=null,s=null,E=null,ye.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(W){l=W},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(A=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",$),s.addEventListener("inputsourceschange",j),d.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(P),typeof XRWebGLBinding<"u"&&(h=new XRWebGLBinding(s,e)),h!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,Ft=null,Ot=null;d.depth&&(Ot=d.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=d.stencil?zr:Br,Ft=d.stencil?Or:ls);const Gt={colorFormat:e.RGBA8,depthFormat:Ot,scaleFactor:r};f=h.createProjectionLayer(Gt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),E=new hs(f.textureWidth,f.textureHeight,{format:zn,type:si,depthTexture:new bd(f.textureWidth,f.textureHeight,Ft,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:d.stencil,colorSpace:t.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const it={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),E=new hs(p.framebufferWidth,p.framebufferHeight,{format:zn,type:si,colorSpace:t.outputColorSpace,stencilBuffer:d.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),ye.setContext(s),ye.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function j(W){for(let at=0;at<W.removed.length;at++){const it=W.removed[at],Ft=D.indexOf(it);Ft>=0&&(D[Ft]=null,b[Ft].disconnect(it))}for(let at=0;at<W.added.length;at++){const it=W.added[at];let Ft=D.indexOf(it);if(Ft===-1){for(let Gt=0;Gt<b.length;Gt++)if(Gt>=D.length){D.push(it),Ft=Gt;break}else if(D[Gt]===null){D[Gt]=it,Ft=Gt;break}if(Ft===-1)break}const Ot=b[Ft];Ot&&Ot.connect(it)}}const K=new N,V=new N;function ot(W,at,it){K.setFromMatrixPosition(at.matrixWorld),V.setFromMatrixPosition(it.matrixWorld);const Ft=K.distanceTo(V),Ot=at.projectionMatrix.elements,Gt=it.projectionMatrix.elements,Ne=Ot[14]/(Ot[10]-1),se=Ot[14]/(Ot[10]+1),w=(Ot[9]+1)/Ot[5],xe=(Ot[9]-1)/Ot[5],It=(Ot[8]-1)/Ot[0],ae=(Gt[8]+1)/Gt[0],bt=Ne*It,Ae=Ne*ae,pt=Ft/(-It+ae),Zt=pt*-It;if(at.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Zt),W.translateZ(pt),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),Ot[10]===-1)W.projectionMatrix.copy(at.projectionMatrix),W.projectionMatrixInverse.copy(at.projectionMatrixInverse);else{const Ge=Ne+pt,Fe=se+pt,M=bt-Zt,_=Ae+(Ft-Zt),O=w*se/Fe*Ge,G=xe*se/Fe*Ge;W.projectionMatrix.makePerspective(M,_,O,G,Ge,Fe),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function ht(W,at){at===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(at.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let at=W.near,it=W.far;y.texture!==null&&(y.depthNear>0&&(at=y.depthNear),y.depthFar>0&&(it=y.depthFar)),T.near=x.near=F.near=at,T.far=x.far=F.far=it,(X!==T.near||H!==T.far)&&(s.updateRenderState({depthNear:T.near,depthFar:T.far}),X=T.near,H=T.far),T.layers.mask=W.layers.mask|6,F.layers.mask=T.layers.mask&3,x.layers.mask=T.layers.mask&5;const Ft=W.parent,Ot=T.cameras;ht(T,Ft);for(let Gt=0;Gt<Ot.length;Gt++)ht(Ot[Gt],Ft);Ot.length===2?ot(T,F,x):T.projectionMatrix.copy(F.projectionMatrix),Mt(W,T,Ft)};function Mt(W,at,it){it===null?W.matrix.copy(at.matrixWorld):(W.matrix.copy(it.matrixWorld),W.matrix.invert(),W.matrix.multiply(at.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(at.projectionMatrix),W.projectionMatrixInverse.copy(at.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=ul*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(W){c=W,f!==null&&(f.fixedFoveation=W),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=W)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(T)},this.getCameraTexture=function(W){return m[W]};let Kt=null;function we(W,at){if(u=at.getViewerPose(l||o),g=at,u!==null){const it=u.views;p!==null&&(t.setRenderTargetFramebuffer(E,p.framebuffer),t.setRenderTarget(E));let Ft=!1;it.length!==T.cameras.length&&(T.cameras.length=0,Ft=!0);for(let se=0;se<it.length;se++){const w=it[se];let xe=null;if(p!==null)xe=p.getViewport(w);else{const ae=h.getViewSubImage(f,w);xe=ae.viewport,se===0&&(t.setRenderTargetTextures(E,ae.colorTexture,ae.depthStencilTexture),t.setRenderTarget(E))}let It=S[se];It===void 0&&(It=new Tn,It.layers.enable(se),It.viewport=new Ue,S[se]=It),It.matrix.fromArray(w.transform.matrix),It.matrix.decompose(It.position,It.quaternion,It.scale),It.projectionMatrix.fromArray(w.projectionMatrix),It.projectionMatrixInverse.copy(It.projectionMatrix).invert(),It.viewport.set(xe.x,xe.y,xe.width,xe.height),se===0&&(T.matrix.copy(It.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),Ft===!0&&T.cameras.push(It)}const Ot=s.enabledFeatures;if(Ot&&Ot.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&h){const se=h.getDepthInformation(it[0]);se&&se.isValid&&se.texture&&y.init(se,s.renderState)}if(Ot&&Ot.includes("camera-access")&&(t.state.unbindTexture(),h))for(let se=0;se<it.length;se++){const w=it[se].camera;if(w){let xe=m[w];xe||(xe=new Cd,m[w]=xe);const It=h.getCameraImage(w);xe.sourceTexture=It}}}for(let it=0;it<b.length;it++){const Ft=D[it],Ot=b[it];Ft!==null&&Ot!==void 0&&Ot.update(Ft,at,l||o)}Kt&&Kt(W,at),at.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:at}),g=null}const ye=new Td;ye.setAnimationLoop(we),this.setAnimationLoop=function(W){Kt=W},this.dispose=function(){}}}const ts=new ri,rS=new Pe;function oS(n,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,vd(n)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,A,E,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),h(m,d)):d.isMeshPhongMaterial?(r(m,d),u(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,b)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),y(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,A,E):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===en&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===en&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const A=t.get(d),E=A.envMap,b=A.envMapRotation;E&&(m.envMap.value=E,ts.copy(b),ts.x*=-1,ts.y*=-1,ts.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ts.y*=-1,ts.z*=-1),m.envMapRotation.value.setFromMatrix4(rS.makeRotationFromEuler(ts)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,A,E){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*A,m.scale.value=E*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function h(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,A){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===en&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function y(m,d){const A=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function aS(n,t,e,i){let s={},r={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,E){const b=E.program;i.uniformBlockBinding(A,b)}function l(A,E){let b=s[A.id];b===void 0&&(g(A),b=u(A),s[A.id]=b,A.addEventListener("dispose",m));const D=E.program;i.updateUBOMapping(A,D);const P=t.render.frame;r[A.id]!==P&&(f(A),r[A.id]=P)}function u(A){const E=h();A.__bindingPointIndex=E;const b=n.createBuffer(),D=A.__size,P=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,D,P),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,E,b),b}function h(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const E=s[A.id],b=A.uniforms,D=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let P=0,C=b.length;P<C;P++){const F=Array.isArray(b[P])?b[P]:[b[P]];for(let x=0,S=F.length;x<S;x++){const T=F[x];if(p(T,P,x,D)===!0){const X=T.__offset,H=Array.isArray(T.value)?T.value:[T.value];let Y=0;for(let $=0;$<H.length;$++){const j=H[$],K=y(j);typeof j=="number"||typeof j=="boolean"?(T.__data[0]=j,n.bufferSubData(n.UNIFORM_BUFFER,X+Y,T.__data)):j.isMatrix3?(T.__data[0]=j.elements[0],T.__data[1]=j.elements[1],T.__data[2]=j.elements[2],T.__data[3]=0,T.__data[4]=j.elements[3],T.__data[5]=j.elements[4],T.__data[6]=j.elements[5],T.__data[7]=0,T.__data[8]=j.elements[6],T.__data[9]=j.elements[7],T.__data[10]=j.elements[8],T.__data[11]=0):(j.toArray(T.__data,Y),Y+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,X,T.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(A,E,b,D){const P=A.value,C=E+"_"+b;if(D[C]===void 0)return typeof P=="number"||typeof P=="boolean"?D[C]=P:D[C]=P.clone(),!0;{const F=D[C];if(typeof P=="number"||typeof P=="boolean"){if(F!==P)return D[C]=P,!0}else if(F.equals(P)===!1)return F.copy(P),!0}return!1}function g(A){const E=A.uniforms;let b=0;const D=16;for(let C=0,F=E.length;C<F;C++){const x=Array.isArray(E[C])?E[C]:[E[C]];for(let S=0,T=x.length;S<T;S++){const X=x[S],H=Array.isArray(X.value)?X.value:[X.value];for(let Y=0,$=H.length;Y<$;Y++){const j=H[Y],K=y(j),V=b%D,ot=V%K.boundary,ht=V+ot;b+=ot,ht!==0&&D-ht<K.storage&&(b+=D-ht),X.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=b,b+=K.storage}}}const P=b%D;return P>0&&(b+=D-P),A.__size=b,A.__cache={},this}function y(A){const E={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(E.boundary=4,E.storage=4):A.isVector2?(E.boundary=8,E.storage=8):A.isVector3||A.isColor?(E.boundary=16,E.storage=12):A.isVector4?(E.boundary=16,E.storage=16):A.isMatrix3?(E.boundary=48,E.storage=48):A.isMatrix4?(E.boundary=64,E.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),E}function m(A){const E=A.target;E.removeEventListener("dispose",m);const b=o.indexOf(E.__bindingPointIndex);o.splice(b,1),n.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function d(){for(const A in s)n.deleteBuffer(s[A]);o=[],s={},r={}}return{bind:c,update:l,dispose:d}}class cS{constructor(t={}){const{canvas:e=zm(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),y=new Int32Array(4);let m=null,d=null;const A=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let D=!1;this._outputColorSpace=Mn;let P=0,C=0,F=null,x=-1,S=null;const T=new Ue,X=new Ue;let H=null;const Y=new ie(0);let $=0,j=e.width,K=e.height,V=1,ot=null,ht=null;const Mt=new Ue(0,0,j,K),Kt=new Ue(0,0,j,K);let we=!1;const ye=new zl;let W=!1,at=!1;const it=new Pe,Ft=new N,Ot=new Ue,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ne=!1;function se(){return F===null?V:1}let w=i;function xe(v,L){return e.getContext(v,L)}try{const v={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Il}`),e.addEventListener("webglcontextlost",st,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",J,!1),w===null){const L="webgl2";if(w=xe(L,v),w===null)throw xe(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw console.error("THREE.WebGLRenderer: "+v.message),v}let It,ae,bt,Ae,pt,Zt,Ge,Fe,M,_,O,G,Z,k,xt,nt,gt,vt,tt,ut,zt,yt,ct,Yt;function R(){It=new vy(w),It.init(),yt=new tS(w,It),ae=new hy(w,It,t,yt),bt=new J0(w,It),ae.reversedDepthBuffer&&f&&bt.buffers.depth.setReversed(!0),Ae=new xy(w),pt=new z0,Zt=new Q0(w,It,bt,pt,ae,yt,Ae),Ge=new fy(b),Fe=new gy(b),M=new A_(w),ct=new ly(w,M),_=new yy(w,M,Ae,ct),O=new My(w,_,M,Ae),tt=new by(w,ae,Zt),nt=new dy(pt),G=new B0(b,Ge,Fe,It,ae,ct,nt),Z=new oS(b,pt),k=new k0,xt=new j0(It),vt=new cy(b,Ge,Fe,bt,O,p,c),gt=new K0(b,O,ae),Yt=new aS(w,Ae,ae,bt),ut=new uy(w,It,Ae),zt=new Sy(w,It,Ae),Ae.programs=G.programs,b.capabilities=ae,b.extensions=It,b.properties=pt,b.renderLists=k,b.shadowMap=gt,b.state=bt,b.info=Ae}R();const et=new sS(b,w);this.xr=et,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){const v=It.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=It.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(v){v!==void 0&&(V=v,this.setSize(j,K,!1))},this.getSize=function(v){return v.set(j,K)},this.setSize=function(v,L,B=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=v,K=L,e.width=Math.floor(v*V),e.height=Math.floor(L*V),B===!0&&(e.style.width=v+"px",e.style.height=L+"px"),this.setViewport(0,0,v,L)},this.getDrawingBufferSize=function(v){return v.set(j*V,K*V).floor()},this.setDrawingBufferSize=function(v,L,B){j=v,K=L,V=B,e.width=Math.floor(v*B),e.height=Math.floor(L*B),this.setViewport(0,0,v,L)},this.getCurrentViewport=function(v){return v.copy(T)},this.getViewport=function(v){return v.copy(Mt)},this.setViewport=function(v,L,B,z){v.isVector4?Mt.set(v.x,v.y,v.z,v.w):Mt.set(v,L,B,z),bt.viewport(T.copy(Mt).multiplyScalar(V).round())},this.getScissor=function(v){return v.copy(Kt)},this.setScissor=function(v,L,B,z){v.isVector4?Kt.set(v.x,v.y,v.z,v.w):Kt.set(v,L,B,z),bt.scissor(X.copy(Kt).multiplyScalar(V).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(v){bt.setScissorTest(we=v)},this.setOpaqueSort=function(v){ot=v},this.setTransparentSort=function(v){ht=v},this.getClearColor=function(v){return v.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor(...arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha(...arguments)},this.clear=function(v=!0,L=!0,B=!0){let z=0;if(v){let U=!1;if(F!==null){const Q=F.texture.format;U=Q===Nl||Q===Ul||Q===Ll}if(U){const Q=F.texture.type,lt=Q===si||Q===ls||Q===Fr||Q===Or||Q===Dl||Q===Pl,mt=vt.getClearColor(),dt=vt.getClearAlpha(),Bt=mt.r,kt=mt.g,Et=mt.b;lt?(g[0]=Bt,g[1]=kt,g[2]=Et,g[3]=dt,w.clearBufferuiv(w.COLOR,0,g)):(y[0]=Bt,y[1]=kt,y[2]=Et,y[3]=dt,w.clearBufferiv(w.COLOR,0,y))}else z|=w.COLOR_BUFFER_BIT}L&&(z|=w.DEPTH_BUFFER_BIT),B&&(z|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",st,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",J,!1),vt.dispose(),k.dispose(),xt.dispose(),pt.dispose(),Ge.dispose(),Fe.dispose(),O.dispose(),ct.dispose(),Yt.dispose(),G.dispose(),et.dispose(),et.removeEventListener("sessionstart",Xn),et.removeEventListener("sessionend",uu),ji.stop()};function st(v){v.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const v=Ae.autoReset,L=gt.enabled,B=gt.autoUpdate,z=gt.needsUpdate,U=gt.type;R(),Ae.autoReset=v,gt.enabled=L,gt.autoUpdate=B,gt.needsUpdate=z,gt.type=U}function J(v){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function q(v){const L=v.target;L.removeEventListener("dispose",q),_t(L)}function _t(v){Wt(v),pt.remove(v)}function Wt(v){const L=pt.get(v).programs;L!==void 0&&(L.forEach(function(B){G.releaseProgram(B)}),v.isShaderMaterial&&G.releaseShaderCache(v))}this.renderBufferDirect=function(v,L,B,z,U,Q){L===null&&(L=Gt);const lt=U.isMesh&&U.matrixWorld.determinant()<0,mt=Wp(v,L,B,z,U);bt.setMaterial(z,lt);let dt=B.index,Bt=1;if(z.wireframe===!0){if(dt=_.getWireframeAttribute(B),dt===void 0)return;Bt=2}const kt=B.drawRange,Et=B.attributes.position;let ee=kt.start*Bt,me=(kt.start+kt.count)*Bt;Q!==null&&(ee=Math.max(ee,Q.start*Bt),me=Math.min(me,(Q.start+Q.count)*Bt)),dt!==null?(ee=Math.max(ee,0),me=Math.min(me,dt.count)):Et!=null&&(ee=Math.max(ee,0),me=Math.min(me,Et.count));const Le=me-ee;if(Le<0||Le===1/0)return;ct.setup(U,z,mt,B,dt);let Ee,Se=ut;if(dt!==null&&(Ee=M.get(dt),Se=zt,Se.setIndex(Ee)),U.isMesh)z.wireframe===!0?(bt.setLineWidth(z.wireframeLinewidth*se()),Se.setMode(w.LINES)):Se.setMode(w.TRIANGLES);else if(U.isLine){let Ct=z.linewidth;Ct===void 0&&(Ct=1),bt.setLineWidth(Ct*se()),U.isLineSegments?Se.setMode(w.LINES):U.isLineLoop?Se.setMode(w.LINE_LOOP):Se.setMode(w.LINE_STRIP)}else U.isPoints?Se.setMode(w.POINTS):U.isSprite&&Se.setMode(w.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)$s("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Se.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(It.get("WEBGL_multi_draw"))Se.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ct=U._multiDrawStarts,Ie=U._multiDrawCounts,re=U._multiDrawCount,dn=dt?M.get(dt).bytesPerElement:1,vs=pt.get(z).currentProgram.getUniforms();for(let fn=0;fn<re;fn++)vs.setValue(w,"_gl_DrawID",fn),Se.render(Ct[fn]/dn,Ie[fn])}else if(U.isInstancedMesh)Se.renderInstances(ee,Le,U.count);else if(B.isInstancedBufferGeometry){const Ct=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Ie=Math.min(B.instanceCount,Ct);Se.renderInstances(ee,Le,Ie)}else Se.render(ee,Le)};function be(v,L,B){v.transparent===!0&&v.side===yi&&v.forceSinglePass===!1?(v.side=en,v.needsUpdate=!0,no(v,L,B),v.side=ki,v.needsUpdate=!0,no(v,L,B),v.side=yi):no(v,L,B)}this.compile=function(v,L,B=null){B===null&&(B=v),d=xt.get(B),d.init(L),E.push(d),B.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),v!==B&&v.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),d.setupLights();const z=new Set;return v.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const Q=U.material;if(Q)if(Array.isArray(Q))for(let lt=0;lt<Q.length;lt++){const mt=Q[lt];be(mt,B,U),z.add(mt)}else be(Q,B,U),z.add(Q)}),d=E.pop(),z},this.compileAsync=function(v,L,B=null){const z=this.compile(v,L,B);return new Promise(U=>{function Q(){if(z.forEach(function(lt){pt.get(lt).currentProgram.isReady()&&z.delete(lt)}),z.size===0){U(v);return}setTimeout(Q,10)}It.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let ce=null;function li(v){ce&&ce(v)}function Xn(){ji.stop()}function uu(){ji.start()}const ji=new Td;ji.setAnimationLoop(li),typeof self<"u"&&ji.setContext(self),this.setAnimationLoop=function(v){ce=v,et.setAnimationLoop(v),v===null?ji.stop():ji.start()},et.addEventListener("sessionstart",Xn),et.addEventListener("sessionend",uu),this.render=function(v,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(L),L=et.getCamera()),v.isScene===!0&&v.onBeforeRender(b,v,L,F),d=xt.get(v,E.length),d.init(L),E.push(d),it.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),ye.setFromProjectionMatrix(it,ei,L.reversedDepth),at=this.localClippingEnabled,W=nt.init(this.clippingPlanes,at),m=k.get(v,A.length),m.init(),A.push(m),et.enabled===!0&&et.isPresenting===!0){const Q=b.xr.getDepthSensingMesh();Q!==null&&Oa(Q,L,-1/0,b.sortObjects)}Oa(v,L,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(ot,ht),Ne=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,Ne&&vt.addToRenderList(m,v),this.info.render.frame++,W===!0&&nt.beginShadows();const B=d.state.shadowsArray;gt.render(B,v,L),W===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,U=m.transmissive;if(d.setupLights(),L.isArrayCamera){const Q=L.cameras;if(U.length>0)for(let lt=0,mt=Q.length;lt<mt;lt++){const dt=Q[lt];du(z,U,v,dt)}Ne&&vt.render(v);for(let lt=0,mt=Q.length;lt<mt;lt++){const dt=Q[lt];hu(m,v,dt,dt.viewport)}}else U.length>0&&du(z,U,v,L),Ne&&vt.render(v),hu(m,v,L);F!==null&&C===0&&(Zt.updateMultisampleRenderTarget(F),Zt.updateRenderTargetMipmap(F)),v.isScene===!0&&v.onAfterRender(b,v,L),ct.resetDefaultState(),x=-1,S=null,E.pop(),E.length>0?(d=E[E.length-1],W===!0&&nt.setGlobalState(b.clippingPlanes,d.state.camera)):d=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function Oa(v,L,B,z){if(v.visible===!1)return;if(v.layers.test(L.layers)){if(v.isGroup)B=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(L);else if(v.isLight)d.pushLight(v),v.castShadow&&d.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||ye.intersectsSprite(v)){z&&Ot.setFromMatrixPosition(v.matrixWorld).applyMatrix4(it);const lt=O.update(v),mt=v.material;mt.visible&&m.push(v,lt,mt,B,Ot.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||ye.intersectsObject(v))){const lt=O.update(v),mt=v.material;if(z&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Ot.copy(v.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),Ot.copy(lt.boundingSphere.center)),Ot.applyMatrix4(v.matrixWorld).applyMatrix4(it)),Array.isArray(mt)){const dt=lt.groups;for(let Bt=0,kt=dt.length;Bt<kt;Bt++){const Et=dt[Bt],ee=mt[Et.materialIndex];ee&&ee.visible&&m.push(v,lt,ee,B,Ot.z,Et)}}else mt.visible&&m.push(v,lt,mt,B,Ot.z,null)}}const Q=v.children;for(let lt=0,mt=Q.length;lt<mt;lt++)Oa(Q[lt],L,B,z)}function hu(v,L,B,z){const U=v.opaque,Q=v.transmissive,lt=v.transparent;d.setupLightsView(B),W===!0&&nt.setGlobalState(b.clippingPlanes,B),z&&bt.viewport(T.copy(z)),U.length>0&&eo(U,L,B),Q.length>0&&eo(Q,L,B),lt.length>0&&eo(lt,L,B),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function du(v,L,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[z.id]===void 0&&(d.state.transmissionRenderTarget[z.id]=new hs(1,1,{generateMipmaps:!0,type:It.has("EXT_color_buffer_half_float")||It.has("EXT_color_buffer_float")?jr:si,minFilter:as,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:oe.workingColorSpace}));const Q=d.state.transmissionRenderTarget[z.id],lt=z.viewport||T;Q.setSize(lt.z*b.transmissionResolutionScale,lt.w*b.transmissionResolutionScale);const mt=b.getRenderTarget(),dt=b.getActiveCubeFace(),Bt=b.getActiveMipmapLevel();b.setRenderTarget(Q),b.getClearColor(Y),$=b.getClearAlpha(),$<1&&b.setClearColor(16777215,.5),b.clear(),Ne&&vt.render(B);const kt=b.toneMapping;b.toneMapping=Vi;const Et=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),d.setupLightsView(z),W===!0&&nt.setGlobalState(b.clippingPlanes,z),eo(v,B,z),Zt.updateMultisampleRenderTarget(Q),Zt.updateRenderTargetMipmap(Q),It.has("WEBGL_multisampled_render_to_texture")===!1){let ee=!1;for(let me=0,Le=L.length;me<Le;me++){const Ee=L[me],Se=Ee.object,Ct=Ee.geometry,Ie=Ee.material,re=Ee.group;if(Ie.side===yi&&Se.layers.test(z.layers)){const dn=Ie.side;Ie.side=en,Ie.needsUpdate=!0,fu(Se,B,z,Ct,Ie,re),Ie.side=dn,Ie.needsUpdate=!0,ee=!0}}ee===!0&&(Zt.updateMultisampleRenderTarget(Q),Zt.updateRenderTargetMipmap(Q))}b.setRenderTarget(mt,dt,Bt),b.setClearColor(Y,$),Et!==void 0&&(z.viewport=Et),b.toneMapping=kt}function eo(v,L,B){const z=L.isScene===!0?L.overrideMaterial:null;for(let U=0,Q=v.length;U<Q;U++){const lt=v[U],mt=lt.object,dt=lt.geometry,Bt=lt.group;let kt=lt.material;kt.allowOverride===!0&&z!==null&&(kt=z),mt.layers.test(B.layers)&&fu(mt,L,B,dt,kt,Bt)}}function fu(v,L,B,z,U,Q){v.onBeforeRender(b,L,B,z,U,Q),v.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),U.onBeforeRender(b,L,B,z,v,Q),U.transparent===!0&&U.side===yi&&U.forceSinglePass===!1?(U.side=en,U.needsUpdate=!0,b.renderBufferDirect(B,L,z,U,v,Q),U.side=ki,U.needsUpdate=!0,b.renderBufferDirect(B,L,z,U,v,Q),U.side=yi):b.renderBufferDirect(B,L,z,U,v,Q),v.onAfterRender(b,L,B,z,U,Q)}function no(v,L,B){L.isScene!==!0&&(L=Gt);const z=pt.get(v),U=d.state.lights,Q=d.state.shadowsArray,lt=U.state.version,mt=G.getParameters(v,U.state,Q,L,B),dt=G.getProgramCacheKey(mt);let Bt=z.programs;z.environment=v.isMeshStandardMaterial?L.environment:null,z.fog=L.fog,z.envMap=(v.isMeshStandardMaterial?Fe:Ge).get(v.envMap||z.environment),z.envMapRotation=z.environment!==null&&v.envMap===null?L.environmentRotation:v.envMapRotation,Bt===void 0&&(v.addEventListener("dispose",q),Bt=new Map,z.programs=Bt);let kt=Bt.get(dt);if(kt!==void 0){if(z.currentProgram===kt&&z.lightsStateVersion===lt)return mu(v,mt),kt}else mt.uniforms=G.getUniforms(v),v.onBeforeCompile(mt,b),kt=G.acquireProgram(mt,dt),Bt.set(dt,kt),z.uniforms=mt.uniforms;const Et=z.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Et.clippingPlanes=nt.uniform),mu(v,mt),z.needsLights=Yp(v),z.lightsStateVersion=lt,z.needsLights&&(Et.ambientLightColor.value=U.state.ambient,Et.lightProbe.value=U.state.probe,Et.directionalLights.value=U.state.directional,Et.directionalLightShadows.value=U.state.directionalShadow,Et.spotLights.value=U.state.spot,Et.spotLightShadows.value=U.state.spotShadow,Et.rectAreaLights.value=U.state.rectArea,Et.ltc_1.value=U.state.rectAreaLTC1,Et.ltc_2.value=U.state.rectAreaLTC2,Et.pointLights.value=U.state.point,Et.pointLightShadows.value=U.state.pointShadow,Et.hemisphereLights.value=U.state.hemi,Et.directionalShadowMap.value=U.state.directionalShadowMap,Et.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Et.spotShadowMap.value=U.state.spotShadowMap,Et.spotLightMatrix.value=U.state.spotLightMatrix,Et.spotLightMap.value=U.state.spotLightMap,Et.pointShadowMap.value=U.state.pointShadowMap,Et.pointShadowMatrix.value=U.state.pointShadowMatrix),z.currentProgram=kt,z.uniformsList=null,kt}function pu(v){if(v.uniformsList===null){const L=v.currentProgram.getUniforms();v.uniformsList=zo.seqWithValue(L.seq,v.uniforms)}return v.uniformsList}function mu(v,L){const B=pt.get(v);B.outputColorSpace=L.outputColorSpace,B.batching=L.batching,B.batchingColor=L.batchingColor,B.instancing=L.instancing,B.instancingColor=L.instancingColor,B.instancingMorph=L.instancingMorph,B.skinning=L.skinning,B.morphTargets=L.morphTargets,B.morphNormals=L.morphNormals,B.morphColors=L.morphColors,B.morphTargetsCount=L.morphTargetsCount,B.numClippingPlanes=L.numClippingPlanes,B.numIntersection=L.numClipIntersection,B.vertexAlphas=L.vertexAlphas,B.vertexTangents=L.vertexTangents,B.toneMapping=L.toneMapping}function Wp(v,L,B,z,U){L.isScene!==!0&&(L=Gt),Zt.resetTextureUnits();const Q=L.fog,lt=z.isMeshStandardMaterial?L.environment:null,mt=F===null?b.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:rr,dt=(z.isMeshStandardMaterial?Fe:Ge).get(z.envMap||lt),Bt=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,kt=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Et=!!B.morphAttributes.position,ee=!!B.morphAttributes.normal,me=!!B.morphAttributes.color;let Le=Vi;z.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(Le=b.toneMapping);const Ee=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Se=Ee!==void 0?Ee.length:0,Ct=pt.get(z),Ie=d.state.lights;if(W===!0&&(at===!0||v!==S)){const Ze=v===S&&z.id===x;nt.setState(z,v,Ze)}let re=!1;z.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==Ie.state.version||Ct.outputColorSpace!==mt||U.isBatchedMesh&&Ct.batching===!1||!U.isBatchedMesh&&Ct.batching===!0||U.isBatchedMesh&&Ct.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ct.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ct.instancing===!1||!U.isInstancedMesh&&Ct.instancing===!0||U.isSkinnedMesh&&Ct.skinning===!1||!U.isSkinnedMesh&&Ct.skinning===!0||U.isInstancedMesh&&Ct.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ct.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ct.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ct.instancingMorph===!1&&U.morphTexture!==null||Ct.envMap!==dt||z.fog===!0&&Ct.fog!==Q||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==nt.numPlanes||Ct.numIntersection!==nt.numIntersection)||Ct.vertexAlphas!==Bt||Ct.vertexTangents!==kt||Ct.morphTargets!==Et||Ct.morphNormals!==ee||Ct.morphColors!==me||Ct.toneMapping!==Le||Ct.morphTargetsCount!==Se)&&(re=!0):(re=!0,Ct.__version=z.version);let dn=Ct.currentProgram;re===!0&&(dn=no(z,L,U));let vs=!1,fn=!1,vr=!1;const Ce=dn.getUniforms(),yn=Ct.uniforms;if(bt.useProgram(dn.program)&&(vs=!0,fn=!0,vr=!0),z.id!==x&&(x=z.id,fn=!0),vs||S!==v){bt.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),Ce.setValue(w,"projectionMatrix",v.projectionMatrix),Ce.setValue(w,"viewMatrix",v.matrixWorldInverse);const sn=Ce.map.cameraPosition;sn!==void 0&&sn.setValue(w,Ft.setFromMatrixPosition(v.matrixWorld)),ae.logarithmicDepthBuffer&&Ce.setValue(w,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&Ce.setValue(w,"isOrthographic",v.isOrthographicCamera===!0),S!==v&&(S=v,fn=!0,vr=!0)}if(U.isSkinnedMesh){Ce.setOptional(w,U,"bindMatrix"),Ce.setOptional(w,U,"bindMatrixInverse");const Ze=U.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),Ce.setValue(w,"boneTexture",Ze.boneTexture,Zt))}U.isBatchedMesh&&(Ce.setOptional(w,U,"batchingTexture"),Ce.setValue(w,"batchingTexture",U._matricesTexture,Zt),Ce.setOptional(w,U,"batchingIdTexture"),Ce.setValue(w,"batchingIdTexture",U._indirectTexture,Zt),Ce.setOptional(w,U,"batchingColorTexture"),U._colorsTexture!==null&&Ce.setValue(w,"batchingColorTexture",U._colorsTexture,Zt));const Sn=B.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&tt.update(U,B,dn),(fn||Ct.receiveShadow!==U.receiveShadow)&&(Ct.receiveShadow=U.receiveShadow,Ce.setValue(w,"receiveShadow",U.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(yn.envMap.value=dt,yn.flipEnvMap.value=dt.isCubeTexture&&dt.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&L.environment!==null&&(yn.envMapIntensity.value=L.environmentIntensity),fn&&(Ce.setValue(w,"toneMappingExposure",b.toneMappingExposure),Ct.needsLights&&Xp(yn,vr),Q&&z.fog===!0&&Z.refreshFogUniforms(yn,Q),Z.refreshMaterialUniforms(yn,z,V,K,d.state.transmissionRenderTarget[v.id]),zo.upload(w,pu(Ct),yn,Zt)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(zo.upload(w,pu(Ct),yn,Zt),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&Ce.setValue(w,"center",U.center),Ce.setValue(w,"modelViewMatrix",U.modelViewMatrix),Ce.setValue(w,"normalMatrix",U.normalMatrix),Ce.setValue(w,"modelMatrix",U.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Ze=z.uniformsGroups;for(let sn=0,Ba=Ze.length;sn<Ba;sn++){const qi=Ze[sn];Yt.update(qi,dn),Yt.bind(qi,dn)}}return dn}function Xp(v,L){v.ambientLightColor.needsUpdate=L,v.lightProbe.needsUpdate=L,v.directionalLights.needsUpdate=L,v.directionalLightShadows.needsUpdate=L,v.pointLights.needsUpdate=L,v.pointLightShadows.needsUpdate=L,v.spotLights.needsUpdate=L,v.spotLightShadows.needsUpdate=L,v.rectAreaLights.needsUpdate=L,v.hemisphereLights.needsUpdate=L}function Yp(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(v,L,B){const z=pt.get(v);z.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),pt.get(v.texture).__webglTexture=L,pt.get(v.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,L){const B=pt.get(v);B.__webglFramebuffer=L,B.__useDefaultFramebuffer=L===void 0};const jp=w.createFramebuffer();this.setRenderTarget=function(v,L=0,B=0){F=v,P=L,C=B;let z=!0,U=null,Q=!1,lt=!1;if(v){const dt=pt.get(v);if(dt.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(w.FRAMEBUFFER,null),z=!1;else if(dt.__webglFramebuffer===void 0)Zt.setupRenderTarget(v);else if(dt.__hasExternalTextures)Zt.rebindTextures(v,pt.get(v.texture).__webglTexture,pt.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Et=v.depthTexture;if(dt.__boundDepthTexture!==Et){if(Et!==null&&pt.has(Et)&&(v.width!==Et.image.width||v.height!==Et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Zt.setupDepthRenderbuffer(v)}}const Bt=v.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(lt=!0);const kt=pt.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(kt[L])?U=kt[L][B]:U=kt[L],Q=!0):v.samples>0&&Zt.useMultisampledRTT(v)===!1?U=pt.get(v).__webglMultisampledFramebuffer:Array.isArray(kt)?U=kt[B]:U=kt,T.copy(v.viewport),X.copy(v.scissor),H=v.scissorTest}else T.copy(Mt).multiplyScalar(V).floor(),X.copy(Kt).multiplyScalar(V).floor(),H=we;if(B!==0&&(U=jp),bt.bindFramebuffer(w.FRAMEBUFFER,U)&&z&&bt.drawBuffers(v,U),bt.viewport(T),bt.scissor(X),bt.setScissorTest(H),Q){const dt=pt.get(v.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+L,dt.__webglTexture,B)}else if(lt){const dt=L;for(let Bt=0;Bt<v.textures.length;Bt++){const kt=pt.get(v.textures[Bt]);w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0+Bt,kt.__webglTexture,B,dt)}}else if(v!==null&&B!==0){const dt=pt.get(v.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,dt.__webglTexture,B)}x=-1},this.readRenderTargetPixels=function(v,L,B,z,U,Q,lt,mt=0){if(!(v&&v.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=pt.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&lt!==void 0&&(dt=dt[lt]),dt){bt.bindFramebuffer(w.FRAMEBUFFER,dt);try{const Bt=v.textures[mt],kt=Bt.format,Et=Bt.type;if(!ae.textureFormatReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ae.textureTypeReadable(Et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=v.width-z&&B>=0&&B<=v.height-U&&(v.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+mt),w.readPixels(L,B,z,U,yt.convert(kt),yt.convert(Et),Q))}finally{const Bt=F!==null?pt.get(F).__webglFramebuffer:null;bt.bindFramebuffer(w.FRAMEBUFFER,Bt)}}},this.readRenderTargetPixelsAsync=async function(v,L,B,z,U,Q,lt,mt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=pt.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&lt!==void 0&&(dt=dt[lt]),dt)if(L>=0&&L<=v.width-z&&B>=0&&B<=v.height-U){bt.bindFramebuffer(w.FRAMEBUFFER,dt);const Bt=v.textures[mt],kt=Bt.format,Et=Bt.type;if(!ae.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ae.textureTypeReadable(Et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ee=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,ee),w.bufferData(w.PIXEL_PACK_BUFFER,Q.byteLength,w.STREAM_READ),v.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+mt),w.readPixels(L,B,z,U,yt.convert(kt),yt.convert(Et),0);const me=F!==null?pt.get(F).__webglFramebuffer:null;bt.bindFramebuffer(w.FRAMEBUFFER,me);const Le=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await Vm(w,Le,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,ee),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,Q),w.deleteBuffer(ee),w.deleteSync(Le),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,L=null,B=0){const z=Math.pow(2,-B),U=Math.floor(v.image.width*z),Q=Math.floor(v.image.height*z),lt=L!==null?L.x:0,mt=L!==null?L.y:0;Zt.setTexture2D(v,0),w.copyTexSubImage2D(w.TEXTURE_2D,B,0,0,lt,mt,U,Q),bt.unbindTexture()};const qp=w.createFramebuffer(),$p=w.createFramebuffer();this.copyTextureToTexture=function(v,L,B=null,z=null,U=0,Q=null){Q===null&&(U!==0?($s("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=U,U=0):Q=0);let lt,mt,dt,Bt,kt,Et,ee,me,Le;const Ee=v.isCompressedTexture?v.mipmaps[Q]:v.image;if(B!==null)lt=B.max.x-B.min.x,mt=B.max.y-B.min.y,dt=B.isBox3?B.max.z-B.min.z:1,Bt=B.min.x,kt=B.min.y,Et=B.isBox3?B.min.z:0;else{const Sn=Math.pow(2,-U);lt=Math.floor(Ee.width*Sn),mt=Math.floor(Ee.height*Sn),v.isDataArrayTexture?dt=Ee.depth:v.isData3DTexture?dt=Math.floor(Ee.depth*Sn):dt=1,Bt=0,kt=0,Et=0}z!==null?(ee=z.x,me=z.y,Le=z.z):(ee=0,me=0,Le=0);const Se=yt.convert(L.format),Ct=yt.convert(L.type);let Ie;L.isData3DTexture?(Zt.setTexture3D(L,0),Ie=w.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(Zt.setTexture2DArray(L,0),Ie=w.TEXTURE_2D_ARRAY):(Zt.setTexture2D(L,0),Ie=w.TEXTURE_2D),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,L.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,L.unpackAlignment);const re=w.getParameter(w.UNPACK_ROW_LENGTH),dn=w.getParameter(w.UNPACK_IMAGE_HEIGHT),vs=w.getParameter(w.UNPACK_SKIP_PIXELS),fn=w.getParameter(w.UNPACK_SKIP_ROWS),vr=w.getParameter(w.UNPACK_SKIP_IMAGES);w.pixelStorei(w.UNPACK_ROW_LENGTH,Ee.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,Ee.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Bt),w.pixelStorei(w.UNPACK_SKIP_ROWS,kt),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Et);const Ce=v.isDataArrayTexture||v.isData3DTexture,yn=L.isDataArrayTexture||L.isData3DTexture;if(v.isDepthTexture){const Sn=pt.get(v),Ze=pt.get(L),sn=pt.get(Sn.__renderTarget),Ba=pt.get(Ze.__renderTarget);bt.bindFramebuffer(w.READ_FRAMEBUFFER,sn.__webglFramebuffer),bt.bindFramebuffer(w.DRAW_FRAMEBUFFER,Ba.__webglFramebuffer);for(let qi=0;qi<dt;qi++)Ce&&(w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,pt.get(v).__webglTexture,U,Et+qi),w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,pt.get(L).__webglTexture,Q,Le+qi)),w.blitFramebuffer(Bt,kt,lt,mt,ee,me,lt,mt,w.DEPTH_BUFFER_BIT,w.NEAREST);bt.bindFramebuffer(w.READ_FRAMEBUFFER,null),bt.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else if(U!==0||v.isRenderTargetTexture||pt.has(v)){const Sn=pt.get(v),Ze=pt.get(L);bt.bindFramebuffer(w.READ_FRAMEBUFFER,qp),bt.bindFramebuffer(w.DRAW_FRAMEBUFFER,$p);for(let sn=0;sn<dt;sn++)Ce?w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Sn.__webglTexture,U,Et+sn):w.framebufferTexture2D(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Sn.__webglTexture,U),yn?w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Ze.__webglTexture,Q,Le+sn):w.framebufferTexture2D(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Ze.__webglTexture,Q),U!==0?w.blitFramebuffer(Bt,kt,lt,mt,ee,me,lt,mt,w.COLOR_BUFFER_BIT,w.NEAREST):yn?w.copyTexSubImage3D(Ie,Q,ee,me,Le+sn,Bt,kt,lt,mt):w.copyTexSubImage2D(Ie,Q,ee,me,Bt,kt,lt,mt);bt.bindFramebuffer(w.READ_FRAMEBUFFER,null),bt.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else yn?v.isDataTexture||v.isData3DTexture?w.texSubImage3D(Ie,Q,ee,me,Le,lt,mt,dt,Se,Ct,Ee.data):L.isCompressedArrayTexture?w.compressedTexSubImage3D(Ie,Q,ee,me,Le,lt,mt,dt,Se,Ee.data):w.texSubImage3D(Ie,Q,ee,me,Le,lt,mt,dt,Se,Ct,Ee):v.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,Q,ee,me,lt,mt,Se,Ct,Ee.data):v.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,Q,ee,me,Ee.width,Ee.height,Se,Ee.data):w.texSubImage2D(w.TEXTURE_2D,Q,ee,me,lt,mt,Se,Ct,Ee);w.pixelStorei(w.UNPACK_ROW_LENGTH,re),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,dn),w.pixelStorei(w.UNPACK_SKIP_PIXELS,vs),w.pixelStorei(w.UNPACK_SKIP_ROWS,fn),w.pixelStorei(w.UNPACK_SKIP_IMAGES,vr),Q===0&&L.generateMipmaps&&w.generateMipmap(Ie),bt.unbindTexture()},this.copyTextureToTexture3D=function(v,L,B=null,z=null,U=0){return $s('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(v,L,B,z,U)},this.initRenderTarget=function(v){pt.get(v).__webglFramebuffer===void 0&&Zt.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Zt.setTextureCube(v,0):v.isData3DTexture?Zt.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Zt.setTexture2DArray(v,0):Zt.setTexture2D(v,0),bt.unbindTexture()},this.resetState=function(){P=0,C=0,F=null,bt.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}}const vh={type:"change"},kl={type:"start"},Dd={type:"end"},Ro=new Ra,yh=new Ni,lS=Math.cos(70*Bm.DEG2RAD),ze=new N,on=2*Math.PI,ge={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},_c=1e-6;class uS extends T_{constructor(t,e=null){super(t,e),this.state=ge.NONE,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:js.ROTATE,MIDDLE:js.DOLLY,RIGHT:js.PAN},this.touches={ONE:Ws.ROTATE,TWO:Ws.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new N,this._lastQuaternion=new us,this._lastTargetPosition=new N,this._quat=new us().setFromUnitVectors(t.up,new N(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Yu,this._sphericalDelta=new Yu,this._scale=1,this._panOffset=new N,this._rotateStart=new Xt,this._rotateEnd=new Xt,this._rotateDelta=new Xt,this._panStart=new Xt,this._panEnd=new Xt,this._panDelta=new Xt,this._dollyStart=new Xt,this._dollyEnd=new Xt,this._dollyDelta=new Xt,this._dollyDirection=new N,this._mouse=new Xt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=dS.bind(this),this._onPointerDown=hS.bind(this),this._onPointerUp=fS.bind(this),this._onContextMenu=SS.bind(this),this._onMouseWheel=_S.bind(this),this._onKeyDown=gS.bind(this),this._onTouchStart=vS.bind(this),this._onTouchMove=yS.bind(this),this._onMouseDown=pS.bind(this),this._onMouseMove=mS.bind(this),this._interceptControlDown=xS.bind(this),this._interceptControlUp=bS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(vh),this.update(),this.state=ge.NONE}update(t=null){const e=this.object.position;ze.copy(e).sub(this.target),ze.applyQuaternion(this._quat),this._spherical.setFromVector3(ze),this.autoRotate&&this.state===ge.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=on:i>Math.PI&&(i-=on),s<-Math.PI?s+=on:s>Math.PI&&(s-=on),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(ze.setFromSpherical(this._spherical),ze.applyQuaternion(this._quatInverse),e.copy(this.target).add(ze),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=ze.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const a=new N(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new N(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=ze.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ro.origin.copy(this.object.position),Ro.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ro.direction))<lS?this.object.lookAt(this.target):(yh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ro.intersectPlane(yh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>_c||8*(1-this._lastQuaternion.dot(this.object.quaternion))>_c||this._lastTargetPosition.distanceToSquared(this.target)>_c?(this.dispatchEvent(vh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?on/60*this.autoRotateSpeed*t:on/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ze.setFromMatrixColumn(e,0),ze.multiplyScalar(-t),this._panOffset.add(ze)}_panUp(t,e){this.screenSpacePanning===!0?ze.setFromMatrixColumn(e,1):(ze.setFromMatrixColumn(e,0),ze.crossVectors(this.object.up,ze)),ze.multiplyScalar(t),this._panOffset.add(ze)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ze.copy(s).sub(this.target);let r=ze.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(on*this._rotateDelta.x/e.clientHeight),this._rotateUp(on*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(on*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-on*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(on*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-on*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(on*this._rotateDelta.x/e.clientHeight),this._rotateUp(on*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Xt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function hS(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function dS(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function fS(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Dd),this.state=ge.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function pS(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case js.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ge.DOLLY;break;case js.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ge.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ge.ROTATE}break;case js.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ge.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ge.PAN}break;default:this.state=ge.NONE}this.state!==ge.NONE&&this.dispatchEvent(kl)}function mS(n){switch(this.state){case ge.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ge.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ge.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function _S(n){this.enabled===!1||this.enableZoom===!1||this.state!==ge.NONE||(n.preventDefault(),this.dispatchEvent(kl),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Dd))}function gS(n){this.enabled!==!1&&this._handleKeyDown(n)}function vS(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ws.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ge.TOUCH_ROTATE;break;case Ws.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ge.TOUCH_PAN;break;default:this.state=ge.NONE}break;case 2:switch(this.touches.TWO){case Ws.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ge.TOUCH_DOLLY_PAN;break;case Ws.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ge.TOUCH_DOLLY_ROTATE;break;default:this.state=ge.NONE}break;default:this.state=ge.NONE}this.state!==ge.NONE&&this.dispatchEvent(kl)}function yS(n){switch(this._trackPointer(n),this.state){case ge.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ge.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ge.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ge.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ge.NONE}}function SS(n){this.enabled!==!1&&n.preventDefault()}function xS(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function bS(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ht(n,t,e,i){function s(r){return r instanceof e?r:new e(function(o){o(r)})}return new(e||(e=Promise))(function(r,o){function a(u){try{l(i.next(u))}catch(h){o(h)}}function c(u){try{l(i.throw(u))}catch(h){o(h)}}function l(u){u.done?r(u.value):s(u.value).then(a,c)}l((i=i.apply(n,t||[])).next())})}function Sh(n){var t=typeof Symbol=="function"&&Symbol.iterator,e=t&&n[t],i=0;if(e)return e.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&i>=n.length&&(n=void 0),{value:n&&n[i++],done:!n}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function qt(n){return this instanceof qt?(this.v=n,this):new qt(n)}function ni(n,t,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=e.apply(n,t||[]),s,r=[];return s=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",o),s[Symbol.asyncIterator]=function(){return this},s;function o(p){return function(g){return Promise.resolve(g).then(p,h)}}function a(p,g){i[p]&&(s[p]=function(y){return new Promise(function(m,d){r.push([p,y,m,d])>1||c(p,y)})},g&&(s[p]=g(s[p])))}function c(p,g){try{l(i[p](g))}catch(y){f(r[0][3],y)}}function l(p){p.value instanceof qt?Promise.resolve(p.value.v).then(u,h):f(r[0][2],p)}function u(p){c("next",p)}function h(p){c("throw",p)}function f(p,g){p(g),r.shift(),r.length&&c(r[0][0],r[0][1])}}function Vo(n){var t,e;return t={},i("next"),i("throw",function(s){throw s}),i("return"),t[Symbol.iterator]=function(){return this},t;function i(s,r){t[s]=n[s]?function(o){return(e=!e)?{value:qt(n[s](o)),done:!1}:r?r(o):o}:r}}function Zs(n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=n[Symbol.asyncIterator],e;return t?t.call(n):(n=typeof Sh=="function"?Sh(n):n[Symbol.iterator](),e={},i("next"),i("throw"),i("return"),e[Symbol.asyncIterator]=function(){return this},e);function i(r){e[r]=n[r]&&function(o){return new Promise(function(a,c){o=n[r](o),s(a,c,o.done,o.value)})}}function s(r,o,a,c){Promise.resolve(c).then(function(l){r({value:l,done:a})},o)}}const xh=new TextDecoder("utf-8"),pl=xh.decode.bind(xh),MS=new TextEncoder,Hl=n=>MS.encode(n),ES=n=>typeof n=="number",TS=n=>typeof n=="boolean",Qe=n=>typeof n=="function",Gn=n=>n!=null&&Object(n)===n,Vr=n=>Gn(n)&&Qe(n.then),Pa=n=>Gn(n)&&Qe(n[Symbol.iterator]),Gl=n=>Gn(n)&&Qe(n[Symbol.asyncIterator]),ml=n=>Gn(n)&&Gn(n.schema),Pd=n=>Gn(n)&&"done"in n&&"value"in n,Ld=n=>Gn(n)&&Qe(n.stat)&&ES(n.fd),Ud=n=>Gn(n)&&Wl(n.body),Nd=n=>"_getDOMStream"in n&&"_getNodeStream"in n,Wl=n=>Gn(n)&&Qe(n.cancel)&&Qe(n.getReader)&&!Nd(n),Fd=n=>Gn(n)&&Qe(n.read)&&Qe(n.pipe)&&TS(n.readable)&&!Nd(n),wS=n=>Gn(n)&&Qe(n.clear)&&Qe(n.bytes)&&Qe(n.position)&&Qe(n.setPosition)&&Qe(n.capacity)&&Qe(n.getBufferIdentifier)&&Qe(n.createLong),Xl=typeof SharedArrayBuffer<"u"?SharedArrayBuffer:ArrayBuffer;function AS(n){const t=n[0]?[n[0]]:[];let e,i,s,r;for(let o,a,c=0,l=0,u=n.length;++c<u;){if(o=t[l],a=n[c],!o||!a||o.buffer!==a.buffer||a.byteOffset<o.byteOffset){a&&(t[++l]=a);continue}if({byteOffset:e,byteLength:s}=o,{byteOffset:i,byteLength:r}=a,e+s<i||i+r<e){a&&(t[++l]=a);continue}t[l]=new Uint8Array(o.buffer,e,i-e+r)}return t}function bh(n,t,e=0,i=t.byteLength){const s=n.byteLength,r=new Uint8Array(n.buffer,n.byteOffset,s),o=new Uint8Array(t.buffer,t.byteOffset,Math.min(i,s));return r.set(o,e),n}function oi(n,t){const e=AS(n),i=e.reduce((u,h)=>u+h.byteLength,0);let s,r,o,a=0,c=-1;const l=Math.min(t||Number.POSITIVE_INFINITY,i);for(const u=e.length;++c<u;){if(s=e[c],r=s.subarray(0,Math.min(s.length,l-a)),l<=a+r.length){r.length<s.length?e[c]=s.subarray(r.length):r.length===s.length&&c++,o?bh(o,r,a):o=r;break}bh(o||(o=new Uint8Array(l)),r,a),a+=r.length}return[o||new Uint8Array(0),e.slice(c),i-(o?o.byteLength:0)]}function pe(n,t){let e=Pd(t)?t.value:t;return e instanceof n?n===Uint8Array?new n(e.buffer,e.byteOffset,e.byteLength):e:e?(typeof e=="string"&&(e=Hl(e)),e instanceof ArrayBuffer?new n(e):e instanceof Xl?new n(e):wS(e)?pe(n,e.bytes()):ArrayBuffer.isView(e)?e.byteLength<=0?new n(0):new n(e.buffer,e.byteOffset,e.byteLength/n.BYTES_PER_ELEMENT):n.from(e)):new n(0)}const Er=n=>pe(Int32Array,n),Mh=n=>pe(BigInt64Array,n),ne=n=>pe(Uint8Array,n),_l=n=>(n.next(),n);function*RS(n,t){const e=function*(s){yield s},i=typeof t=="string"||ArrayBuffer.isView(t)||t instanceof ArrayBuffer||t instanceof Xl?e(t):Pa(t)?t:e(t);return yield*_l((function*(s){let r=null;do r=s.next(yield pe(n,r));while(!r.done)})(i[Symbol.iterator]())),new n}const IS=n=>RS(Uint8Array,n);function Od(n,t){return ni(this,arguments,function*(){if(Vr(t))return yield qt(yield qt(yield*Vo(Zs(Od(n,yield qt(t))))));const i=function(o){return ni(this,arguments,function*(){yield yield qt(yield qt(o))})},s=function(o){return ni(this,arguments,function*(){yield qt(yield*Vo(Zs(_l((function*(a){let c=null;do c=a.next(yield c?.value);while(!c.done)})(o[Symbol.iterator]())))))})},r=typeof t=="string"||ArrayBuffer.isView(t)||t instanceof ArrayBuffer||t instanceof Xl?i(t):Pa(t)?s(t):Gl(t)?t:i(t);return yield qt(yield*Vo(Zs(_l((function(o){return ni(this,arguments,function*(){let a=null;do a=yield qt(o.next(yield yield qt(pe(n,a))));while(!a.done)})})(r[Symbol.asyncIterator]()))))),yield qt(new n)})}const CS=n=>Od(Uint8Array,n);function DS(n,t){let e=0;const i=n.length;if(i!==t.length)return!1;if(i>0)do if(n[e]!==t[e])return!1;while(++e<i);return!0}const En={fromIterable(n){return Io(PS(n))},fromAsyncIterable(n){return Io(LS(n))},fromDOMStream(n){return Io(US(n))},fromNodeStream(n){return Io(FS(n))},toDOMStream(n,t){throw new Error('"toDOMStream" not available in this environment')},toNodeStream(n,t){throw new Error('"toNodeStream" not available in this environment')}},Io=n=>(n.next(),n);function*PS(n){let t,e=!1,i=[],s,r,o,a=0;function c(){return r==="peek"?oi(i,o)[0]:([s,i,a]=oi(i,o),s)}({cmd:r,size:o}=(yield null)||{cmd:"read",size:0});const l=IS(n)[Symbol.iterator]();try{do if({done:t,value:s}=Number.isNaN(o-a)?l.next():l.next(o-a),!t&&s.byteLength>0&&(i.push(s),a+=s.byteLength),t||o<=a)do({cmd:r,size:o}=yield c());while(o<a);while(!t)}catch(u){e=!0,typeof l.throw=="function"&&l.throw(u)}finally{e===!1&&typeof l.return=="function"&&l.return(null)}return null}function LS(n){return ni(this,arguments,function*(){let e,i=!1,s=[],r,o,a,c=0;function l(){return o==="peek"?oi(s,a)[0]:([r,s,c]=oi(s,a),r)}({cmd:o,size:a}=(yield yield qt(null))||{cmd:"read",size:0});const u=CS(n)[Symbol.asyncIterator]();try{do if({done:e,value:r}=Number.isNaN(a-c)?yield qt(u.next()):yield qt(u.next(a-c)),!e&&r.byteLength>0&&(s.push(r),c+=r.byteLength),e||a<=c)do({cmd:o,size:a}=yield yield qt(l()));while(a<c);while(!e)}catch(h){i=!0,typeof u.throw=="function"&&(yield qt(u.throw(h)))}finally{i===!1&&typeof u.return=="function"&&(yield qt(u.return(new Uint8Array(0))))}return yield qt(null)})}function US(n){return ni(this,arguments,function*(){let e=!1,i=!1,s=[],r,o,a,c=0;function l(){return o==="peek"?oi(s,a)[0]:([r,s,c]=oi(s,a),r)}({cmd:o,size:a}=(yield yield qt(null))||{cmd:"read",size:0});const u=new NS(n);try{do if({done:e,value:r}=Number.isNaN(a-c)?yield qt(u.read()):yield qt(u.read(a-c)),!e&&r.byteLength>0&&(s.push(ne(r)),c+=r.byteLength),e||a<=c)do({cmd:o,size:a}=yield yield qt(l()));while(a<c);while(!e)}catch(h){i=!0,yield qt(u.cancel(h))}finally{i===!1?yield qt(u.cancel()):n.locked&&u.releaseLock()}return yield qt(null)})}class NS{constructor(t){this.source=t,this.reader=null,this.reader=this.source.getReader(),this.reader.closed.catch(()=>{})}get closed(){return this.reader?this.reader.closed.catch(()=>{}):Promise.resolve()}releaseLock(){this.reader&&this.reader.releaseLock(),this.reader=null}cancel(t){return Ht(this,void 0,void 0,function*(){const{reader:e,source:i}=this;e&&(yield e.cancel(t).catch(()=>{})),i&&i.locked&&this.releaseLock()})}read(t){return Ht(this,void 0,void 0,function*(){if(t===0)return{done:this.reader==null,value:new Uint8Array(0)};const e=yield this.reader.read();return!e.done&&(e.value=ne(e)),e})}}const gc=(n,t)=>{const e=s=>i([t,s]);let i;return[t,e,new Promise(s=>(i=s)&&n.once(t,e))]};function FS(n){return ni(this,arguments,function*(){const e=[];let i="error",s=!1,r=null,o,a,c=0,l=[],u;function h(){return o==="peek"?oi(l,a)[0]:([u,l,c]=oi(l,a),u)}if({cmd:o,size:a}=(yield yield qt(null))||{cmd:"read",size:0},n.isTTY)return yield yield qt(new Uint8Array(0)),yield qt(null);try{e[0]=gc(n,"end"),e[1]=gc(n,"error");do{if(e[2]=gc(n,"readable"),[i,r]=yield qt(Promise.race(e.map(p=>p[2]))),i==="error")break;if((s=i==="end")||(Number.isFinite(a-c)?(u=ne(n.read(a-c)),u.byteLength<a-c&&(u=ne(n.read()))):u=ne(n.read()),u.byteLength>0&&(l.push(u),c+=u.byteLength)),s||a<=c)do({cmd:o,size:a}=yield yield qt(h()));while(a<c)}while(!s)}finally{yield qt(f(e,i==="error"?r:null))}return yield qt(null);function f(p,g){return u=l=null,new Promise((y,m)=>{for(const[d,A]of p)n.off(d,A);try{const d=n.destroy;d&&d.call(n,g),g=void 0}catch(d){g=d||g}finally{g!=null?m(g):y()}})}})}var Be;(function(n){n[n.V1=0]="V1",n[n.V2=1]="V2",n[n.V3=2]="V3",n[n.V4=3]="V4",n[n.V5=4]="V5"})(Be||(Be={}));var un;(function(n){n[n.Sparse=0]="Sparse",n[n.Dense=1]="Dense"})(un||(un={}));var Ke;(function(n){n[n.HALF=0]="HALF",n[n.SINGLE=1]="SINGLE",n[n.DOUBLE=2]="DOUBLE"})(Ke||(Ke={}));var Cn;(function(n){n[n.DAY=0]="DAY",n[n.MILLISECOND=1]="MILLISECOND"})(Cn||(Cn={}));var Ut;(function(n){n[n.SECOND=0]="SECOND",n[n.MILLISECOND=1]="MILLISECOND",n[n.MICROSECOND=2]="MICROSECOND",n[n.NANOSECOND=3]="NANOSECOND"})(Ut||(Ut={}));var Ye;(function(n){n[n.YEAR_MONTH=0]="YEAR_MONTH",n[n.DAY_TIME=1]="DAY_TIME",n[n.MONTH_DAY_NANO=2]="MONTH_DAY_NANO"})(Ye||(Ye={}));const vc=2,Zn=4,Si=4,he=4,Fi=new Int32Array(2),Eh=new Float32Array(Fi.buffer),Th=new Float64Array(Fi.buffer),Co=new Uint16Array(new Uint8Array([1,0]).buffer)[0]===1;var gl;(function(n){n[n.UTF8_BYTES=1]="UTF8_BYTES",n[n.UTF16_STRING=2]="UTF16_STRING"})(gl||(gl={}));let ds=class Bd{constructor(t){this.bytes_=t,this.position_=0,this.text_decoder_=new TextDecoder}static allocate(t){return new Bd(new Uint8Array(t))}clear(){this.position_=0}bytes(){return this.bytes_}position(){return this.position_}setPosition(t){this.position_=t}capacity(){return this.bytes_.length}readInt8(t){return this.readUint8(t)<<24>>24}readUint8(t){return this.bytes_[t]}readInt16(t){return this.readUint16(t)<<16>>16}readUint16(t){return this.bytes_[t]|this.bytes_[t+1]<<8}readInt32(t){return this.bytes_[t]|this.bytes_[t+1]<<8|this.bytes_[t+2]<<16|this.bytes_[t+3]<<24}readUint32(t){return this.readInt32(t)>>>0}readInt64(t){return BigInt.asIntN(64,BigInt(this.readUint32(t))+(BigInt(this.readUint32(t+4))<<BigInt(32)))}readUint64(t){return BigInt.asUintN(64,BigInt(this.readUint32(t))+(BigInt(this.readUint32(t+4))<<BigInt(32)))}readFloat32(t){return Fi[0]=this.readInt32(t),Eh[0]}readFloat64(t){return Fi[Co?0:1]=this.readInt32(t),Fi[Co?1:0]=this.readInt32(t+4),Th[0]}writeInt8(t,e){this.bytes_[t]=e}writeUint8(t,e){this.bytes_[t]=e}writeInt16(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8}writeUint16(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8}writeInt32(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8,this.bytes_[t+2]=e>>16,this.bytes_[t+3]=e>>24}writeUint32(t,e){this.bytes_[t]=e,this.bytes_[t+1]=e>>8,this.bytes_[t+2]=e>>16,this.bytes_[t+3]=e>>24}writeInt64(t,e){this.writeInt32(t,Number(BigInt.asIntN(32,e))),this.writeInt32(t+4,Number(BigInt.asIntN(32,e>>BigInt(32))))}writeUint64(t,e){this.writeUint32(t,Number(BigInt.asUintN(32,e))),this.writeUint32(t+4,Number(BigInt.asUintN(32,e>>BigInt(32))))}writeFloat32(t,e){Eh[0]=e,this.writeInt32(t,Fi[0])}writeFloat64(t,e){Th[0]=e,this.writeInt32(t,Fi[Co?0:1]),this.writeInt32(t+4,Fi[Co?1:0])}getBufferIdentifier(){if(this.bytes_.length<this.position_+Zn+Si)throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");let t="";for(let e=0;e<Si;e++)t+=String.fromCharCode(this.readInt8(this.position_+Zn+e));return t}__offset(t,e){const i=t-this.readInt32(t);return e<this.readInt16(i)?this.readInt16(i+e):0}__union(t,e){return t.bb_pos=e+this.readInt32(e),t.bb=this,t}__string(t,e){t+=this.readInt32(t);const i=this.readInt32(t);t+=Zn;const s=this.bytes_.subarray(t,t+i);return e===gl.UTF8_BYTES?s:this.text_decoder_.decode(s)}__union_with_string(t,e){return typeof t=="string"?this.__string(e):this.__union(t,e)}__indirect(t){return t+this.readInt32(t)}__vector(t){return t+this.readInt32(t)+Zn}__vector_len(t){return this.readInt32(t+this.readInt32(t))}__has_identifier(t){if(t.length!=Si)throw new Error("FlatBuffers: file identifier must be length "+Si);for(let e=0;e<Si;e++)if(t.charCodeAt(e)!=this.readInt8(this.position()+Zn+e))return!1;return!0}createScalarList(t,e){const i=[];for(let s=0;s<e;++s){const r=t(s);r!==null&&i.push(r)}return i}createObjList(t,e){const i=[];for(let s=0;s<e;++s){const r=t(s);r!==null&&i.push(r.unpack())}return i}},zd=class Vd{constructor(t){this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null,this.text_encoder=new TextEncoder;let e;t?e=t:e=1024,this.bb=ds.allocate(e),this.space=e}clear(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null}forceDefaults(t){this.force_defaults=t}dataBuffer(){return this.bb}asUint8Array(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())}prep(t,e){t>this.minalign&&(this.minalign=t);const i=~(this.bb.capacity()-this.space+e)+1&t-1;for(;this.space<i+t+e;){const s=this.bb.capacity();this.bb=Vd.growByteBuffer(this.bb),this.space+=this.bb.capacity()-s}this.pad(i)}pad(t){for(let e=0;e<t;e++)this.bb.writeInt8(--this.space,0)}writeInt8(t){this.bb.writeInt8(this.space-=1,t)}writeInt16(t){this.bb.writeInt16(this.space-=2,t)}writeInt32(t){this.bb.writeInt32(this.space-=4,t)}writeInt64(t){this.bb.writeInt64(this.space-=8,t)}writeFloat32(t){this.bb.writeFloat32(this.space-=4,t)}writeFloat64(t){this.bb.writeFloat64(this.space-=8,t)}addInt8(t){this.prep(1,0),this.writeInt8(t)}addInt16(t){this.prep(2,0),this.writeInt16(t)}addInt32(t){this.prep(4,0),this.writeInt32(t)}addInt64(t){this.prep(8,0),this.writeInt64(t)}addFloat32(t){this.prep(4,0),this.writeFloat32(t)}addFloat64(t){this.prep(8,0),this.writeFloat64(t)}addFieldInt8(t,e,i){(this.force_defaults||e!=i)&&(this.addInt8(e),this.slot(t))}addFieldInt16(t,e,i){(this.force_defaults||e!=i)&&(this.addInt16(e),this.slot(t))}addFieldInt32(t,e,i){(this.force_defaults||e!=i)&&(this.addInt32(e),this.slot(t))}addFieldInt64(t,e,i){(this.force_defaults||e!==i)&&(this.addInt64(e),this.slot(t))}addFieldFloat32(t,e,i){(this.force_defaults||e!=i)&&(this.addFloat32(e),this.slot(t))}addFieldFloat64(t,e,i){(this.force_defaults||e!=i)&&(this.addFloat64(e),this.slot(t))}addFieldOffset(t,e,i){(this.force_defaults||e!=i)&&(this.addOffset(e),this.slot(t))}addFieldStruct(t,e,i){e!=i&&(this.nested(e),this.slot(t))}nested(t){if(t!=this.offset())throw new TypeError("FlatBuffers: struct must be serialized inline.")}notNested(){if(this.isNested)throw new TypeError("FlatBuffers: object serialization must not be nested.")}slot(t){this.vtable!==null&&(this.vtable[t]=this.offset())}offset(){return this.bb.capacity()-this.space}static growByteBuffer(t){const e=t.capacity();if(e&3221225472)throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");const i=e<<1,s=ds.allocate(i);return s.setPosition(i-e),s.bytes().set(t.bytes(),i-e),s}addOffset(t){this.prep(Zn,0),this.writeInt32(this.offset()-t+Zn)}startObject(t){this.notNested(),this.vtable==null&&(this.vtable=[]),this.vtable_in_use=t;for(let e=0;e<t;e++)this.vtable[e]=0;this.isNested=!0,this.object_start=this.offset()}endObject(){if(this.vtable==null||!this.isNested)throw new Error("FlatBuffers: endObject called without startObject");this.addInt32(0);const t=this.offset();let e=this.vtable_in_use-1;for(;e>=0&&this.vtable[e]==0;e--);const i=e+1;for(;e>=0;e--)this.addInt16(this.vtable[e]!=0?t-this.vtable[e]:0);const s=2;this.addInt16(t-this.object_start);const r=(i+s)*vc;this.addInt16(r);let o=0;const a=this.space;t:for(e=0;e<this.vtables.length;e++){const c=this.bb.capacity()-this.vtables[e];if(r==this.bb.readInt16(c)){for(let l=vc;l<r;l+=vc)if(this.bb.readInt16(a+l)!=this.bb.readInt16(c+l))continue t;o=this.vtables[e];break}}return o?(this.space=this.bb.capacity()-t,this.bb.writeInt32(this.space,o-t)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-t,this.offset()-t)),this.isNested=!1,t}finish(t,e,i){const s=i?he:0;if(e){const r=e;if(this.prep(this.minalign,Zn+Si+s),r.length!=Si)throw new TypeError("FlatBuffers: file identifier must be length "+Si);for(let o=Si-1;o>=0;o--)this.writeInt8(r.charCodeAt(o))}this.prep(this.minalign,Zn+s),this.addOffset(t),s&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)}finishSizePrefixed(t,e){this.finish(t,e,!0)}requiredField(t,e){const i=this.bb.capacity()-t,s=i-this.bb.readInt32(i);if(!(e<this.bb.readInt16(s)&&this.bb.readInt16(s+e)!=0))throw new TypeError("FlatBuffers: field "+e+" must be set")}startVector(t,e,i){this.notNested(),this.vector_num_elems=e,this.prep(Zn,t*e),this.prep(i,t*e)}endVector(){return this.writeInt32(this.vector_num_elems),this.offset()}createSharedString(t){if(!t)return 0;if(this.string_maps||(this.string_maps=new Map),this.string_maps.has(t))return this.string_maps.get(t);const e=this.createString(t);return this.string_maps.set(t,e),e}createString(t){if(t==null)return 0;let e;return t instanceof Uint8Array?e=t:e=this.text_encoder.encode(t),this.addInt8(0),this.startVector(1,e.length,1),this.bb.setPosition(this.space-=e.length),this.bb.bytes().set(e,this.space),this.endVector()}createByteVector(t){return t==null?0:(this.startVector(1,t.length,1),this.bb.setPosition(this.space-=t.length),this.bb.bytes().set(t,this.space),this.endVector())}createObjectOffset(t){return t===null?0:typeof t=="string"?this.createString(t):t.pack(this)}createObjectOffsetList(t){const e=[];for(let i=0;i<t.length;++i){const s=t[i];if(s!==null)e.push(this.createObjectOffset(s));else throw new TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.")}return e}createStructOffsetList(t,e){return e(this,t.length),this.createObjectOffsetList(t.slice().reverse()),this.endVector()}};var kr;(function(n){n[n.BUFFER=0]="BUFFER"})(kr||(kr={}));var fs;(function(n){n[n.LZ4_FRAME=0]="LZ4_FRAME",n[n.ZSTD=1]="ZSTD"})(fs||(fs={}));let Ar=class is{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsBodyCompression(t,e){return(e||new is).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsBodyCompression(t,e){return t.setPosition(t.position()+he),(e||new is).__init(t.readInt32(t.position())+t.position(),t)}codec(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt8(this.bb_pos+t):fs.LZ4_FRAME}method(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readInt8(this.bb_pos+t):kr.BUFFER}static startBodyCompression(t){t.startObject(2)}static addCodec(t,e){t.addFieldInt8(0,e,fs.LZ4_FRAME)}static addMethod(t,e){t.addFieldInt8(1,e,kr.BUFFER)}static endBodyCompression(t){return t.endObject()}static createBodyCompression(t,e,i){return is.startBodyCompression(t),is.addCodec(t,e),is.addMethod(t,i),is.endBodyCompression(t)}};class kd{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}offset(){return this.bb.readInt64(this.bb_pos)}length(){return this.bb.readInt64(this.bb_pos+8)}static sizeOf(){return 16}static createBuffer(t,e,i){return t.prep(8,16),t.writeInt64(BigInt(i??0)),t.writeInt64(BigInt(e??0)),t.offset()}}let Hd=class{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}length(){return this.bb.readInt64(this.bb_pos)}nullCount(){return this.bb.readInt64(this.bb_pos+8)}static sizeOf(){return 16}static createFieldNode(t,e,i){return t.prep(8,16),t.writeInt64(BigInt(i??0)),t.writeInt64(BigInt(e??0)),t.offset()}},jn=class vl{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsRecordBatch(t,e){return(e||new vl).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsRecordBatch(t,e){return t.setPosition(t.position()+he),(e||new vl).__init(t.readInt32(t.position())+t.position(),t)}length(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}nodes(t,e){const i=this.bb.__offset(this.bb_pos,6);return i?(e||new Hd).__init(this.bb.__vector(this.bb_pos+i)+t*16,this.bb):null}nodesLength(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__vector_len(this.bb_pos+t):0}buffers(t,e){const i=this.bb.__offset(this.bb_pos,8);return i?(e||new kd).__init(this.bb.__vector(this.bb_pos+i)+t*16,this.bb):null}buffersLength(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__vector_len(this.bb_pos+t):0}compression(t){const e=this.bb.__offset(this.bb_pos,10);return e?(t||new Ar).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}static startRecordBatch(t){t.startObject(4)}static addLength(t,e){t.addFieldInt64(0,e,BigInt("0"))}static addNodes(t,e){t.addFieldOffset(1,e,0)}static startNodesVector(t,e){t.startVector(16,e,8)}static addBuffers(t,e){t.addFieldOffset(2,e,0)}static startBuffersVector(t,e){t.startVector(16,e,8)}static addCompression(t,e){t.addFieldOffset(3,e,0)}static endRecordBatch(t){return t.endObject()}},Us=class yl{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDictionaryBatch(t,e){return(e||new yl).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDictionaryBatch(t,e){return t.setPosition(t.position()+he),(e||new yl).__init(t.readInt32(t.position())+t.position(),t)}id(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}data(t){const e=this.bb.__offset(this.bb_pos,6);return e?(t||new jn).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}isDelta(){const t=this.bb.__offset(this.bb_pos,8);return t?!!this.bb.readInt8(this.bb_pos+t):!1}static startDictionaryBatch(t){t.startObject(3)}static addId(t,e){t.addFieldInt64(0,e,BigInt("0"))}static addData(t,e){t.addFieldOffset(1,e,0)}static addIsDelta(t,e){t.addFieldInt8(2,+e,0)}static endDictionaryBatch(t){return t.endObject()}};var ar;(function(n){n[n.Little=0]="Little",n[n.Big=1]="Big"})(ar||(ar={}));var Jo;(function(n){n[n.DenseArray=0]="DenseArray"})(Jo||(Jo={}));class gn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsInt(t,e){return(e||new gn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsInt(t,e){return t.setPosition(t.position()+he),(e||new gn).__init(t.readInt32(t.position())+t.position(),t)}bitWidth(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}isSigned(){const t=this.bb.__offset(this.bb_pos,6);return t?!!this.bb.readInt8(this.bb_pos+t):!1}static startInt(t){t.startObject(2)}static addBitWidth(t,e){t.addFieldInt32(0,e,0)}static addIsSigned(t,e){t.addFieldInt8(1,+e,0)}static endInt(t){return t.endObject()}static createInt(t,e,i){return gn.startInt(t),gn.addBitWidth(t,e),gn.addIsSigned(t,i),gn.endInt(t)}}class xi{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDictionaryEncoding(t,e){return(e||new xi).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDictionaryEncoding(t,e){return t.setPosition(t.position()+he),(e||new xi).__init(t.readInt32(t.position())+t.position(),t)}id(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}indexType(t){const e=this.bb.__offset(this.bb_pos,6);return e?(t||new gn).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}isOrdered(){const t=this.bb.__offset(this.bb_pos,8);return t?!!this.bb.readInt8(this.bb_pos+t):!1}dictionaryKind(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.readInt16(this.bb_pos+t):Jo.DenseArray}static startDictionaryEncoding(t){t.startObject(4)}static addId(t,e){t.addFieldInt64(0,e,BigInt("0"))}static addIndexType(t,e){t.addFieldOffset(1,e,0)}static addIsOrdered(t,e){t.addFieldInt8(2,+e,0)}static addDictionaryKind(t,e){t.addFieldInt16(3,e,Jo.DenseArray)}static endDictionaryEncoding(t){return t.endObject()}}class Ve{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsKeyValue(t,e){return(e||new Ve).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsKeyValue(t,e){return t.setPosition(t.position()+he),(e||new Ve).__init(t.readInt32(t.position())+t.position(),t)}key(t){const e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__string(this.bb_pos+e,t):null}value(t){const e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__string(this.bb_pos+e,t):null}static startKeyValue(t){t.startObject(2)}static addKey(t,e){t.addFieldOffset(0,e,0)}static addValue(t,e){t.addFieldOffset(1,e,0)}static endKeyValue(t){return t.endObject()}static createKeyValue(t,e,i){return Ve.startKeyValue(t),Ve.addKey(t,e),Ve.addValue(t,i),Ve.endKeyValue(t)}}let wh=class Rr{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsBinary(t,e){return(e||new Rr).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsBinary(t,e){return t.setPosition(t.position()+he),(e||new Rr).__init(t.readInt32(t.position())+t.position(),t)}static startBinary(t){t.startObject(0)}static endBinary(t){return t.endObject()}static createBinary(t){return Rr.startBinary(t),Rr.endBinary(t)}},Ah=class Ir{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsBool(t,e){return(e||new Ir).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsBool(t,e){return t.setPosition(t.position()+he),(e||new Ir).__init(t.readInt32(t.position())+t.position(),t)}static startBool(t){t.startObject(0)}static endBool(t){return t.endObject()}static createBool(t){return Ir.startBool(t),Ir.endBool(t)}},ko=class Ns{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDate(t,e){return(e||new Ns).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDate(t,e){return t.setPosition(t.position()+he),(e||new Ns).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Cn.MILLISECOND}static startDate(t){t.startObject(1)}static addUnit(t,e){t.addFieldInt16(0,e,Cn.MILLISECOND)}static endDate(t){return t.endObject()}static createDate(t,e){return Ns.startDate(t),Ns.addUnit(t,e),Ns.endDate(t)}},Fs=class Ui{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDecimal(t,e){return(e||new Ui).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDecimal(t,e){return t.setPosition(t.position()+he),(e||new Ui).__init(t.readInt32(t.position())+t.position(),t)}precision(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}scale(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readInt32(this.bb_pos+t):0}bitWidth(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readInt32(this.bb_pos+t):128}static startDecimal(t){t.startObject(3)}static addPrecision(t,e){t.addFieldInt32(0,e,0)}static addScale(t,e){t.addFieldInt32(1,e,0)}static addBitWidth(t,e){t.addFieldInt32(2,e,128)}static endDecimal(t){return t.endObject()}static createDecimal(t,e,i,s){return Ui.startDecimal(t),Ui.addPrecision(t,e),Ui.addScale(t,i),Ui.addBitWidth(t,s),Ui.endDecimal(t)}},Ho=class Os{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsDuration(t,e){return(e||new Os).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsDuration(t,e){return t.setPosition(t.position()+he),(e||new Os).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Ut.MILLISECOND}static startDuration(t){t.startObject(1)}static addUnit(t,e){t.addFieldInt16(0,e,Ut.MILLISECOND)}static endDuration(t){return t.endObject()}static createDuration(t,e){return Os.startDuration(t),Os.addUnit(t,e),Os.endDuration(t)}},Go=class Bs{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFixedSizeBinary(t,e){return(e||new Bs).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFixedSizeBinary(t,e){return t.setPosition(t.position()+he),(e||new Bs).__init(t.readInt32(t.position())+t.position(),t)}byteWidth(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}static startFixedSizeBinary(t){t.startObject(1)}static addByteWidth(t,e){t.addFieldInt32(0,e,0)}static endFixedSizeBinary(t){return t.endObject()}static createFixedSizeBinary(t,e){return Bs.startFixedSizeBinary(t),Bs.addByteWidth(t,e),Bs.endFixedSizeBinary(t)}},Wo=class zs{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFixedSizeList(t,e){return(e||new zs).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFixedSizeList(t,e){return t.setPosition(t.position()+he),(e||new zs).__init(t.readInt32(t.position())+t.position(),t)}listSize(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):0}static startFixedSizeList(t){t.startObject(1)}static addListSize(t,e){t.addFieldInt32(0,e,0)}static endFixedSizeList(t){return t.endObject()}static createFixedSizeList(t,e){return zs.startFixedSizeList(t),zs.addListSize(t,e),zs.endFixedSizeList(t)}};class Jn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFloatingPoint(t,e){return(e||new Jn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFloatingPoint(t,e){return t.setPosition(t.position()+he),(e||new Jn).__init(t.readInt32(t.position())+t.position(),t)}precision(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Ke.HALF}static startFloatingPoint(t){t.startObject(1)}static addPrecision(t,e){t.addFieldInt16(0,e,Ke.HALF)}static endFloatingPoint(t){return t.endObject()}static createFloatingPoint(t,e){return Jn.startFloatingPoint(t),Jn.addPrecision(t,e),Jn.endFloatingPoint(t)}}class Qn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsInterval(t,e){return(e||new Qn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsInterval(t,e){return t.setPosition(t.position()+he),(e||new Qn).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Ye.YEAR_MONTH}static startInterval(t){t.startObject(1)}static addUnit(t,e){t.addFieldInt16(0,e,Ye.YEAR_MONTH)}static endInterval(t){return t.endObject()}static createInterval(t,e){return Qn.startInterval(t),Qn.addUnit(t,e),Qn.endInterval(t)}}let Rh=class Cr{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsLargeBinary(t,e){return(e||new Cr).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsLargeBinary(t,e){return t.setPosition(t.position()+he),(e||new Cr).__init(t.readInt32(t.position())+t.position(),t)}static startLargeBinary(t){t.startObject(0)}static endLargeBinary(t){return t.endObject()}static createLargeBinary(t){return Cr.startLargeBinary(t),Cr.endLargeBinary(t)}},Ih=class Dr{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsLargeUtf8(t,e){return(e||new Dr).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsLargeUtf8(t,e){return t.setPosition(t.position()+he),(e||new Dr).__init(t.readInt32(t.position())+t.position(),t)}static startLargeUtf8(t){t.startObject(0)}static endLargeUtf8(t){return t.endObject()}static createLargeUtf8(t){return Dr.startLargeUtf8(t),Dr.endLargeUtf8(t)}},Ch=class Pr{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsList(t,e){return(e||new Pr).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsList(t,e){return t.setPosition(t.position()+he),(e||new Pr).__init(t.readInt32(t.position())+t.position(),t)}static startList(t){t.startObject(0)}static endList(t){return t.endObject()}static createList(t){return Pr.startList(t),Pr.endList(t)}},Xo=class Vs{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsMap(t,e){return(e||new Vs).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsMap(t,e){return t.setPosition(t.position()+he),(e||new Vs).__init(t.readInt32(t.position())+t.position(),t)}keysSorted(){const t=this.bb.__offset(this.bb_pos,4);return t?!!this.bb.readInt8(this.bb_pos+t):!1}static startMap(t){t.startObject(1)}static addKeysSorted(t,e){t.addFieldInt8(0,+e,0)}static endMap(t){return t.endObject()}static createMap(t,e){return Vs.startMap(t),Vs.addKeysSorted(t,e),Vs.endMap(t)}},Dh=class Lr{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsNull(t,e){return(e||new Lr).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsNull(t,e){return t.setPosition(t.position()+he),(e||new Lr).__init(t.readInt32(t.position())+t.position(),t)}static startNull(t){t.startObject(0)}static endNull(t){return t.endObject()}static createNull(t){return Lr.startNull(t),Lr.endNull(t)}};class cs{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsStruct_(t,e){return(e||new cs).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsStruct_(t,e){return t.setPosition(t.position()+he),(e||new cs).__init(t.readInt32(t.position())+t.position(),t)}static startStruct_(t){t.startObject(0)}static endStruct_(t){return t.endObject()}static createStruct_(t){return cs.startStruct_(t),cs.endStruct_(t)}}class wn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsTime(t,e){return(e||new wn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsTime(t,e){return t.setPosition(t.position()+he),(e||new wn).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Ut.MILLISECOND}bitWidth(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readInt32(this.bb_pos+t):32}static startTime(t){t.startObject(2)}static addUnit(t,e){t.addFieldInt16(0,e,Ut.MILLISECOND)}static addBitWidth(t,e){t.addFieldInt32(1,e,32)}static endTime(t){return t.endObject()}static createTime(t,e,i){return wn.startTime(t),wn.addUnit(t,e),wn.addBitWidth(t,i),wn.endTime(t)}}class An{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsTimestamp(t,e){return(e||new An).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsTimestamp(t,e){return t.setPosition(t.position()+he),(e||new An).__init(t.readInt32(t.position())+t.position(),t)}unit(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Ut.SECOND}timezone(t){const e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__string(this.bb_pos+e,t):null}static startTimestamp(t){t.startObject(2)}static addUnit(t,e){t.addFieldInt16(0,e,Ut.SECOND)}static addTimezone(t,e){t.addFieldOffset(1,e,0)}static endTimestamp(t){return t.endObject()}static createTimestamp(t,e,i){return An.startTimestamp(t),An.addUnit(t,e),An.addTimezone(t,i),An.endTimestamp(t)}}class cn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsUnion(t,e){return(e||new cn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsUnion(t,e){return t.setPosition(t.position()+he),(e||new cn).__init(t.readInt32(t.position())+t.position(),t)}mode(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):un.Sparse}typeIds(t){const e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt32(this.bb.__vector(this.bb_pos+e)+t*4):0}typeIdsLength(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__vector_len(this.bb_pos+t):0}typeIdsArray(){const t=this.bb.__offset(this.bb_pos,6);return t?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+t),this.bb.__vector_len(this.bb_pos+t)):null}static startUnion(t){t.startObject(2)}static addMode(t,e){t.addFieldInt16(0,e,un.Sparse)}static addTypeIds(t,e){t.addFieldOffset(1,e,0)}static createTypeIdsVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addInt32(e[i]);return t.endVector()}static startTypeIdsVector(t,e){t.startVector(4,e,4)}static endUnion(t){return t.endObject()}static createUnion(t,e,i){return cn.startUnion(t),cn.addMode(t,e),cn.addTypeIds(t,i),cn.endUnion(t)}}let Ph=class Ur{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsUtf8(t,e){return(e||new Ur).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsUtf8(t,e){return t.setPosition(t.position()+he),(e||new Ur).__init(t.readInt32(t.position())+t.position(),t)}static startUtf8(t){t.startObject(0)}static endUtf8(t){return t.endObject()}static createUtf8(t){return Ur.startUtf8(t),Ur.endUtf8(t)}};var Me;(function(n){n[n.NONE=0]="NONE",n[n.Null=1]="Null",n[n.Int=2]="Int",n[n.FloatingPoint=3]="FloatingPoint",n[n.Binary=4]="Binary",n[n.Utf8=5]="Utf8",n[n.Bool=6]="Bool",n[n.Decimal=7]="Decimal",n[n.Date=8]="Date",n[n.Time=9]="Time",n[n.Timestamp=10]="Timestamp",n[n.Interval=11]="Interval",n[n.List=12]="List",n[n.Struct_=13]="Struct_",n[n.Union=14]="Union",n[n.FixedSizeBinary=15]="FixedSizeBinary",n[n.FixedSizeList=16]="FixedSizeList",n[n.Map=17]="Map",n[n.Duration=18]="Duration",n[n.LargeBinary=19]="LargeBinary",n[n.LargeUtf8=20]="LargeUtf8",n[n.LargeList=21]="LargeList",n[n.RunEndEncoded=22]="RunEndEncoded"})(Me||(Me={}));let bn=class Yo{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsField(t,e){return(e||new Yo).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsField(t,e){return t.setPosition(t.position()+he),(e||new Yo).__init(t.readInt32(t.position())+t.position(),t)}name(t){const e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__string(this.bb_pos+e,t):null}nullable(){const t=this.bb.__offset(this.bb_pos,6);return t?!!this.bb.readInt8(this.bb_pos+t):!1}typeType(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readUint8(this.bb_pos+t):Me.NONE}type(t){const e=this.bb.__offset(this.bb_pos,10);return e?this.bb.__union(t,this.bb_pos+e):null}dictionary(t){const e=this.bb.__offset(this.bb_pos,12);return e?(t||new xi).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}children(t,e){const i=this.bb.__offset(this.bb_pos,14);return i?(e||new Yo).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}childrenLength(){const t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__vector_len(this.bb_pos+t):0}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,16);return i?(e||new Ve).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,16);return t?this.bb.__vector_len(this.bb_pos+t):0}static startField(t){t.startObject(7)}static addName(t,e){t.addFieldOffset(0,e,0)}static addNullable(t,e){t.addFieldInt8(1,+e,0)}static addTypeType(t,e){t.addFieldInt8(2,e,Me.NONE)}static addType(t,e){t.addFieldOffset(3,e,0)}static addDictionary(t,e){t.addFieldOffset(4,e,0)}static addChildren(t,e){t.addFieldOffset(5,e,0)}static createChildrenVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startChildrenVector(t,e){t.startVector(4,e,4)}static addCustomMetadata(t,e){t.addFieldOffset(6,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static endField(t){return t.endObject()}},qn=class _i{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsSchema(t,e){return(e||new _i).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsSchema(t,e){return t.setPosition(t.position()+he),(e||new _i).__init(t.readInt32(t.position())+t.position(),t)}endianness(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):ar.Little}fields(t,e){const i=this.bb.__offset(this.bb_pos,6);return i?(e||new bn).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}fieldsLength(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__vector_len(this.bb_pos+t):0}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,8);return i?(e||new Ve).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__vector_len(this.bb_pos+t):0}features(t){const e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readInt64(this.bb.__vector(this.bb_pos+e)+t*8):BigInt(0)}featuresLength(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.__vector_len(this.bb_pos+t):0}static startSchema(t){t.startObject(4)}static addEndianness(t,e){t.addFieldInt16(0,e,ar.Little)}static addFields(t,e){t.addFieldOffset(1,e,0)}static createFieldsVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startFieldsVector(t,e){t.startVector(4,e,4)}static addCustomMetadata(t,e){t.addFieldOffset(2,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static addFeatures(t,e){t.addFieldOffset(3,e,0)}static createFeaturesVector(t,e){t.startVector(8,e.length,8);for(let i=e.length-1;i>=0;i--)t.addInt64(e[i]);return t.endVector()}static startFeaturesVector(t,e){t.startVector(8,e,8)}static endSchema(t){return t.endObject()}static finishSchemaBuffer(t,e){t.finish(e)}static finishSizePrefixedSchemaBuffer(t,e){t.finish(e,void 0,!0)}static createSchema(t,e,i,s,r){return _i.startSchema(t),_i.addEndianness(t,e),_i.addFields(t,i),_i.addCustomMetadata(t,s),_i.addFeatures(t,r),_i.endSchema(t)}};var le;(function(n){n[n.NONE=0]="NONE",n[n.Schema=1]="Schema",n[n.DictionaryBatch=2]="DictionaryBatch",n[n.RecordBatch=3]="RecordBatch",n[n.Tensor=4]="Tensor",n[n.SparseTensor=5]="SparseTensor"})(le||(le={}));var I;(function(n){n[n.NONE=0]="NONE",n[n.Null=1]="Null",n[n.Int=2]="Int",n[n.Float=3]="Float",n[n.Binary=4]="Binary",n[n.Utf8=5]="Utf8",n[n.Bool=6]="Bool",n[n.Decimal=7]="Decimal",n[n.Date=8]="Date",n[n.Time=9]="Time",n[n.Timestamp=10]="Timestamp",n[n.Interval=11]="Interval",n[n.List=12]="List",n[n.Struct=13]="Struct",n[n.Union=14]="Union",n[n.FixedSizeBinary=15]="FixedSizeBinary",n[n.FixedSizeList=16]="FixedSizeList",n[n.Map=17]="Map",n[n.Duration=18]="Duration",n[n.LargeBinary=19]="LargeBinary",n[n.LargeUtf8=20]="LargeUtf8",n[n.Dictionary=-1]="Dictionary",n[n.Int8=-2]="Int8",n[n.Int16=-3]="Int16",n[n.Int32=-4]="Int32",n[n.Int64=-5]="Int64",n[n.Uint8=-6]="Uint8",n[n.Uint16=-7]="Uint16",n[n.Uint32=-8]="Uint32",n[n.Uint64=-9]="Uint64",n[n.Float16=-10]="Float16",n[n.Float32=-11]="Float32",n[n.Float64=-12]="Float64",n[n.DateDay=-13]="DateDay",n[n.DateMillisecond=-14]="DateMillisecond",n[n.TimestampSecond=-15]="TimestampSecond",n[n.TimestampMillisecond=-16]="TimestampMillisecond",n[n.TimestampMicrosecond=-17]="TimestampMicrosecond",n[n.TimestampNanosecond=-18]="TimestampNanosecond",n[n.TimeSecond=-19]="TimeSecond",n[n.TimeMillisecond=-20]="TimeMillisecond",n[n.TimeMicrosecond=-21]="TimeMicrosecond",n[n.TimeNanosecond=-22]="TimeNanosecond",n[n.DenseUnion=-23]="DenseUnion",n[n.SparseUnion=-24]="SparseUnion",n[n.IntervalDayTime=-25]="IntervalDayTime",n[n.IntervalYearMonth=-26]="IntervalYearMonth",n[n.DurationSecond=-27]="DurationSecond",n[n.DurationMillisecond=-28]="DurationMillisecond",n[n.DurationMicrosecond=-29]="DurationMicrosecond",n[n.DurationNanosecond=-30]="DurationNanosecond",n[n.IntervalMonthDayNano=-31]="IntervalMonthDayNano"})(I||(I={}));var gi;(function(n){n[n.OFFSET=0]="OFFSET",n[n.DATA=1]="DATA",n[n.VALIDITY=2]="VALIDITY",n[n.TYPE=3]="TYPE"})(gi||(gi={}));const OS=void 0;function Hr(n){if(n===null)return"null";if(n===OS)return"undefined";switch(typeof n){case"number":return`${n}`;case"bigint":return`${n}`;case"string":return`"${n}"`}return typeof n[Symbol.toPrimitive]=="function"?n[Symbol.toPrimitive]("string"):ArrayBuffer.isView(n)?n instanceof BigInt64Array||n instanceof BigUint64Array?`[${[...n].map(t=>Hr(t))}]`:`[${n}]`:ArrayBuffer.isView(n)?`[${n}]`:JSON.stringify(n,(t,e)=>typeof e=="bigint"?`${e}`:e)}function Re(n){if(typeof n=="bigint"&&(n<Number.MIN_SAFE_INTEGER||n>Number.MAX_SAFE_INTEGER))throw new TypeError(`${n} is not safe to convert to a number.`);return Number(n)}function Gd(n,t){return Re(n/t)+Re(n%t)/Re(t)}const BS=Symbol.for("isArrowBigNum");function Wn(n,...t){return t.length===0?Object.setPrototypeOf(pe(this.TypedArray,n),this.constructor.prototype):Object.setPrototypeOf(new this.TypedArray(n,...t),this.constructor.prototype)}Wn.prototype[BS]=!0;Wn.prototype.toJSON=function(){return`"${Wr(this)}"`};Wn.prototype.valueOf=function(n){return Wd(this,n)};Wn.prototype.toString=function(){return Wr(this)};Wn.prototype[Symbol.toPrimitive]=function(n="default"){switch(n){case"number":return Wd(this);case"string":return Wr(this);case"default":return kS(this)}return Wr(this)};function Js(...n){return Wn.apply(this,n)}function Qs(...n){return Wn.apply(this,n)}function Gr(...n){return Wn.apply(this,n)}Object.setPrototypeOf(Js.prototype,Object.create(Int32Array.prototype));Object.setPrototypeOf(Qs.prototype,Object.create(Uint32Array.prototype));Object.setPrototypeOf(Gr.prototype,Object.create(Uint32Array.prototype));Object.assign(Js.prototype,Wn.prototype,{constructor:Js,signed:!0,TypedArray:Int32Array,BigIntArray:BigInt64Array});Object.assign(Qs.prototype,Wn.prototype,{constructor:Qs,signed:!1,TypedArray:Uint32Array,BigIntArray:BigUint64Array});Object.assign(Gr.prototype,Wn.prototype,{constructor:Gr,signed:!0,TypedArray:Uint32Array,BigIntArray:BigUint64Array});const zS=BigInt(4294967296)*BigInt(4294967296),VS=zS-BigInt(1);function Wd(n,t){const{buffer:e,byteOffset:i,byteLength:s,signed:r}=n,o=new BigUint64Array(e,i,s/8),a=r&&o.at(-1)&BigInt(1)<<BigInt(63);let c=BigInt(0),l=0;if(a){for(const u of o)c|=(u^VS)*(BigInt(1)<<BigInt(64*l++));c*=BigInt(-1),c-=BigInt(1)}else for(const u of o)c|=u*(BigInt(1)<<BigInt(64*l++));if(typeof t=="number"&&t>0){const u=BigInt("1".padEnd(t+1,"0")),h=c/u,f=a?-(c%u):c%u,p=Re(h),g=`${f}`.padStart(t,"0");return+`${a&&p===0?"-":""}${p}.${g}`}return Re(c)}function Wr(n){if(n.byteLength===8)return`${new n.BigIntArray(n.buffer,n.byteOffset,1)[0]}`;if(!n.signed)return yc(n);let t=new Uint16Array(n.buffer,n.byteOffset,n.byteLength/2);if(new Int16Array([t.at(-1)])[0]>=0)return yc(n);t=t.slice();let i=1;for(let r=0;r<t.length;r++){const o=t[r],a=~o+i;t[r]=a,i&=o===0?1:0}return`-${yc(t)}`}function kS(n){return n.byteLength===8?new n.BigIntArray(n.buffer,n.byteOffset,1)[0]:Wr(n)}function yc(n){let t="";const e=new Uint32Array(2);let i=new Uint16Array(n.buffer,n.byteOffset,n.byteLength/2);const s=new Uint32Array((i=new Uint16Array(i).reverse()).buffer);let r=-1;const o=i.length-1;do{for(e[0]=i[r=0];r<o;)i[r++]=e[1]=e[0]/10,e[0]=(e[0]-e[1]*10<<16)+i[r];i[r]=e[1]=e[0]/10,e[0]=e[0]-e[1]*10,t=`${e[0]}${t}`}while(s[0]||s[1]||s[2]||s[3]);return t??"0"}class Yl{static new(t,e){switch(e){case!0:return new Js(t);case!1:return new Qs(t)}switch(t.constructor){case Int8Array:case Int16Array:case Int32Array:case BigInt64Array:return new Js(t)}return t.byteLength===16?new Gr(t):new Qs(t)}static signed(t){return new Js(t)}static unsigned(t){return new Qs(t)}static decimal(t){return new Gr(t)}constructor(t,e){return Yl.new(t,e)}}var Xd,Yd,jd,qd,$d,Kd,Zd,Jd,Qd,tf,ef,nf,sf,rf,of,af,cf,lf,uf,hf,df,ff;class St{static isNull(t){return t?.typeId===I.Null}static isInt(t){return t?.typeId===I.Int}static isFloat(t){return t?.typeId===I.Float}static isBinary(t){return t?.typeId===I.Binary}static isLargeBinary(t){return t?.typeId===I.LargeBinary}static isUtf8(t){return t?.typeId===I.Utf8}static isLargeUtf8(t){return t?.typeId===I.LargeUtf8}static isBool(t){return t?.typeId===I.Bool}static isDecimal(t){return t?.typeId===I.Decimal}static isDate(t){return t?.typeId===I.Date}static isTime(t){return t?.typeId===I.Time}static isTimestamp(t){return t?.typeId===I.Timestamp}static isInterval(t){return t?.typeId===I.Interval}static isDuration(t){return t?.typeId===I.Duration}static isList(t){return t?.typeId===I.List}static isStruct(t){return t?.typeId===I.Struct}static isUnion(t){return t?.typeId===I.Union}static isFixedSizeBinary(t){return t?.typeId===I.FixedSizeBinary}static isFixedSizeList(t){return t?.typeId===I.FixedSizeList}static isMap(t){return t?.typeId===I.Map}static isDictionary(t){return t?.typeId===I.Dictionary}static isDenseUnion(t){return St.isUnion(t)&&t.mode===un.Dense}static isSparseUnion(t){return St.isUnion(t)&&t.mode===un.Sparse}constructor(t){this.typeId=t}}Xd=Symbol.toStringTag;St[Xd]=(n=>(n.children=null,n.ArrayType=Array,n.OffsetArrayType=Int32Array,n[Symbol.toStringTag]="DataType"))(St.prototype);class Gi extends St{constructor(){super(I.Null)}toString(){return"Null"}}Yd=Symbol.toStringTag;Gi[Yd]=(n=>n[Symbol.toStringTag]="Null")(Gi.prototype);class ps extends St{constructor(t,e){super(I.Int),this.isSigned=t,this.bitWidth=e}get ArrayType(){switch(this.bitWidth){case 8:return this.isSigned?Int8Array:Uint8Array;case 16:return this.isSigned?Int16Array:Uint16Array;case 32:return this.isSigned?Int32Array:Uint32Array;case 64:return this.isSigned?BigInt64Array:BigUint64Array}throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`)}toString(){return`${this.isSigned?"I":"Ui"}nt${this.bitWidth}`}}jd=Symbol.toStringTag;ps[jd]=(n=>(n.isSigned=null,n.bitWidth=null,n[Symbol.toStringTag]="Int"))(ps.prototype);class Xr extends ps{constructor(){super(!0,32)}get ArrayType(){return Int32Array}}Object.defineProperty(Xr.prototype,"ArrayType",{value:Int32Array});class Qo extends St{constructor(t){super(I.Float),this.precision=t}get ArrayType(){switch(this.precision){case Ke.HALF:return Uint16Array;case Ke.SINGLE:return Float32Array;case Ke.DOUBLE:return Float64Array}throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`)}toString(){return`Float${this.precision<<5||16}`}}qd=Symbol.toStringTag;Qo[qd]=(n=>(n.precision=null,n[Symbol.toStringTag]="Float"))(Qo.prototype);class ta extends St{constructor(){super(I.Binary)}toString(){return"Binary"}}$d=Symbol.toStringTag;ta[$d]=(n=>(n.ArrayType=Uint8Array,n[Symbol.toStringTag]="Binary"))(ta.prototype);class ea extends St{constructor(){super(I.LargeBinary)}toString(){return"LargeBinary"}}Kd=Symbol.toStringTag;ea[Kd]=(n=>(n.ArrayType=Uint8Array,n.OffsetArrayType=BigInt64Array,n[Symbol.toStringTag]="LargeBinary"))(ea.prototype);class na extends St{constructor(){super(I.Utf8)}toString(){return"Utf8"}}Zd=Symbol.toStringTag;na[Zd]=(n=>(n.ArrayType=Uint8Array,n[Symbol.toStringTag]="Utf8"))(na.prototype);class ia extends St{constructor(){super(I.LargeUtf8)}toString(){return"LargeUtf8"}}Jd=Symbol.toStringTag;ia[Jd]=(n=>(n.ArrayType=Uint8Array,n.OffsetArrayType=BigInt64Array,n[Symbol.toStringTag]="LargeUtf8"))(ia.prototype);class sa extends St{constructor(){super(I.Bool)}toString(){return"Bool"}}Qd=Symbol.toStringTag;sa[Qd]=(n=>(n.ArrayType=Uint8Array,n[Symbol.toStringTag]="Bool"))(sa.prototype);class ra extends St{constructor(t,e,i=128){super(I.Decimal),this.scale=t,this.precision=e,this.bitWidth=i}toString(){return`Decimal[${this.precision}e${this.scale>0?"+":""}${this.scale}]`}}tf=Symbol.toStringTag;ra[tf]=(n=>(n.scale=null,n.precision=null,n.ArrayType=Uint32Array,n[Symbol.toStringTag]="Decimal"))(ra.prototype);class oa extends St{constructor(t){super(I.Date),this.unit=t}toString(){return`Date${(this.unit+1)*32}<${Cn[this.unit]}>`}get ArrayType(){return this.unit===Cn.DAY?Int32Array:BigInt64Array}}ef=Symbol.toStringTag;oa[ef]=(n=>(n.unit=null,n[Symbol.toStringTag]="Date"))(oa.prototype);class aa extends St{constructor(t,e){super(I.Time),this.unit=t,this.bitWidth=e}toString(){return`Time${this.bitWidth}<${Ut[this.unit]}>`}get ArrayType(){switch(this.bitWidth){case 32:return Int32Array;case 64:return BigInt64Array}throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`)}}nf=Symbol.toStringTag;aa[nf]=(n=>(n.unit=null,n.bitWidth=null,n[Symbol.toStringTag]="Time"))(aa.prototype);class ca extends St{constructor(t,e){super(I.Timestamp),this.unit=t,this.timezone=e}toString(){return`Timestamp<${Ut[this.unit]}${this.timezone?`, ${this.timezone}`:""}>`}}sf=Symbol.toStringTag;ca[sf]=(n=>(n.unit=null,n.timezone=null,n.ArrayType=BigInt64Array,n[Symbol.toStringTag]="Timestamp"))(ca.prototype);class la extends St{constructor(t){super(I.Interval),this.unit=t}toString(){return`Interval<${Ye[this.unit]}>`}}rf=Symbol.toStringTag;la[rf]=(n=>(n.unit=null,n.ArrayType=Int32Array,n[Symbol.toStringTag]="Interval"))(la.prototype);class ua extends St{constructor(t){super(I.Duration),this.unit=t}toString(){return`Duration<${Ut[this.unit]}>`}}of=Symbol.toStringTag;ua[of]=(n=>(n.unit=null,n.ArrayType=BigInt64Array,n[Symbol.toStringTag]="Duration"))(ua.prototype);class ha extends St{constructor(t){super(I.List),this.children=[t]}toString(){return`List<${this.valueType}>`}get valueType(){return this.children[0].type}get valueField(){return this.children[0]}get ArrayType(){return this.valueType.ArrayType}}af=Symbol.toStringTag;ha[af]=(n=>(n.children=null,n[Symbol.toStringTag]="List"))(ha.prototype);class tn extends St{constructor(t){super(I.Struct),this.children=t}toString(){return`Struct<{${this.children.map(t=>`${t.name}:${t.type}`).join(", ")}}>`}}cf=Symbol.toStringTag;tn[cf]=(n=>(n.children=null,n[Symbol.toStringTag]="Struct"))(tn.prototype);class da extends St{constructor(t,e,i){super(I.Union),this.mode=t,this.children=i,this.typeIds=e=Int32Array.from(e),this.typeIdToChildIndex=e.reduce((s,r,o)=>(s[r]=o)&&s||s,Object.create(null))}toString(){return`${this[Symbol.toStringTag]}<${this.children.map(t=>`${t.type}`).join(" | ")}>`}}lf=Symbol.toStringTag;da[lf]=(n=>(n.mode=null,n.typeIds=null,n.children=null,n.typeIdToChildIndex=null,n.ArrayType=Int8Array,n[Symbol.toStringTag]="Union"))(da.prototype);class fa extends St{constructor(t){super(I.FixedSizeBinary),this.byteWidth=t}toString(){return`FixedSizeBinary[${this.byteWidth}]`}}uf=Symbol.toStringTag;fa[uf]=(n=>(n.byteWidth=null,n.ArrayType=Uint8Array,n[Symbol.toStringTag]="FixedSizeBinary"))(fa.prototype);class pa extends St{constructor(t,e){super(I.FixedSizeList),this.listSize=t,this.children=[e]}get valueType(){return this.children[0].type}get valueField(){return this.children[0]}get ArrayType(){return this.valueType.ArrayType}toString(){return`FixedSizeList[${this.listSize}]<${this.valueType}>`}}hf=Symbol.toStringTag;pa[hf]=(n=>(n.children=null,n.listSize=null,n[Symbol.toStringTag]="FixedSizeList"))(pa.prototype);class ma extends St{constructor(t,e=!1){var i,s,r;if(super(I.Map),this.children=[t],this.keysSorted=e,t&&(t.name="entries",!((i=t?.type)===null||i===void 0)&&i.children)){const o=(s=t?.type)===null||s===void 0?void 0:s.children[0];o&&(o.name="key");const a=(r=t?.type)===null||r===void 0?void 0:r.children[1];a&&(a.name="value")}}get keyType(){return this.children[0].type.children[0].type}get valueType(){return this.children[0].type.children[1].type}get childType(){return this.children[0].type}toString(){return`Map<{${this.children[0].type.children.map(t=>`${t.name}:${t.type}`).join(", ")}}>`}}df=Symbol.toStringTag;ma[df]=(n=>(n.children=null,n.keysSorted=null,n[Symbol.toStringTag]="Map_"))(ma.prototype);const HS=(n=>()=>++n)(-1);class cr extends St{constructor(t,e,i,s){super(I.Dictionary),this.indices=e,this.dictionary=t,this.isOrdered=s||!1,this.id=i==null?HS():Re(i)}get children(){return this.dictionary.children}get valueType(){return this.dictionary}get ArrayType(){return this.dictionary.ArrayType}toString(){return`Dictionary<${this.indices}, ${this.dictionary}>`}}ff=Symbol.toStringTag;cr[ff]=(n=>(n.id=null,n.indices=null,n.isOrdered=null,n.dictionary=null,n[Symbol.toStringTag]="Dictionary"))(cr.prototype);function vi(n){const t=n;switch(n.typeId){case I.Decimal:return n.bitWidth/32;case I.Interval:return t.unit===Ye.MONTH_DAY_NANO?4:1+t.unit;case I.FixedSizeList:return t.listSize;case I.FixedSizeBinary:return t.byteWidth;default:return 1}}class Jt{visitMany(t,...e){return t.map((i,s)=>this.visit(i,...e.map(r=>r[s])))}visit(...t){return this.getVisitFn(t[0],!1).apply(this,t)}getVisitFn(t,e=!0){return GS(this,t,e)}getVisitFnByTypeId(t,e=!0){return ks(this,t,e)}visitNull(t,...e){return null}visitBool(t,...e){return null}visitInt(t,...e){return null}visitFloat(t,...e){return null}visitUtf8(t,...e){return null}visitLargeUtf8(t,...e){return null}visitBinary(t,...e){return null}visitLargeBinary(t,...e){return null}visitFixedSizeBinary(t,...e){return null}visitDate(t,...e){return null}visitTimestamp(t,...e){return null}visitTime(t,...e){return null}visitDecimal(t,...e){return null}visitList(t,...e){return null}visitStruct(t,...e){return null}visitUnion(t,...e){return null}visitDictionary(t,...e){return null}visitInterval(t,...e){return null}visitDuration(t,...e){return null}visitFixedSizeList(t,...e){return null}visitMap(t,...e){return null}}function GS(n,t,e=!0){return typeof t=="number"?ks(n,t,e):typeof t=="string"&&t in I?ks(n,I[t],e):t&&t instanceof St?ks(n,Lh(t),e):t?.type&&t.type instanceof St?ks(n,Lh(t.type),e):ks(n,I.NONE,e)}function ks(n,t,e=!0){let i=null;switch(t){case I.Null:i=n.visitNull;break;case I.Bool:i=n.visitBool;break;case I.Int:i=n.visitInt;break;case I.Int8:i=n.visitInt8||n.visitInt;break;case I.Int16:i=n.visitInt16||n.visitInt;break;case I.Int32:i=n.visitInt32||n.visitInt;break;case I.Int64:i=n.visitInt64||n.visitInt;break;case I.Uint8:i=n.visitUint8||n.visitInt;break;case I.Uint16:i=n.visitUint16||n.visitInt;break;case I.Uint32:i=n.visitUint32||n.visitInt;break;case I.Uint64:i=n.visitUint64||n.visitInt;break;case I.Float:i=n.visitFloat;break;case I.Float16:i=n.visitFloat16||n.visitFloat;break;case I.Float32:i=n.visitFloat32||n.visitFloat;break;case I.Float64:i=n.visitFloat64||n.visitFloat;break;case I.Utf8:i=n.visitUtf8;break;case I.LargeUtf8:i=n.visitLargeUtf8;break;case I.Binary:i=n.visitBinary;break;case I.LargeBinary:i=n.visitLargeBinary;break;case I.FixedSizeBinary:i=n.visitFixedSizeBinary;break;case I.Date:i=n.visitDate;break;case I.DateDay:i=n.visitDateDay||n.visitDate;break;case I.DateMillisecond:i=n.visitDateMillisecond||n.visitDate;break;case I.Timestamp:i=n.visitTimestamp;break;case I.TimestampSecond:i=n.visitTimestampSecond||n.visitTimestamp;break;case I.TimestampMillisecond:i=n.visitTimestampMillisecond||n.visitTimestamp;break;case I.TimestampMicrosecond:i=n.visitTimestampMicrosecond||n.visitTimestamp;break;case I.TimestampNanosecond:i=n.visitTimestampNanosecond||n.visitTimestamp;break;case I.Time:i=n.visitTime;break;case I.TimeSecond:i=n.visitTimeSecond||n.visitTime;break;case I.TimeMillisecond:i=n.visitTimeMillisecond||n.visitTime;break;case I.TimeMicrosecond:i=n.visitTimeMicrosecond||n.visitTime;break;case I.TimeNanosecond:i=n.visitTimeNanosecond||n.visitTime;break;case I.Decimal:i=n.visitDecimal;break;case I.List:i=n.visitList;break;case I.Struct:i=n.visitStruct;break;case I.Union:i=n.visitUnion;break;case I.DenseUnion:i=n.visitDenseUnion||n.visitUnion;break;case I.SparseUnion:i=n.visitSparseUnion||n.visitUnion;break;case I.Dictionary:i=n.visitDictionary;break;case I.Interval:i=n.visitInterval;break;case I.IntervalDayTime:i=n.visitIntervalDayTime||n.visitInterval;break;case I.IntervalYearMonth:i=n.visitIntervalYearMonth||n.visitInterval;break;case I.IntervalMonthDayNano:i=n.visitIntervalMonthDayNano||n.visitInterval;break;case I.Duration:i=n.visitDuration;break;case I.DurationSecond:i=n.visitDurationSecond||n.visitDuration;break;case I.DurationMillisecond:i=n.visitDurationMillisecond||n.visitDuration;break;case I.DurationMicrosecond:i=n.visitDurationMicrosecond||n.visitDuration;break;case I.DurationNanosecond:i=n.visitDurationNanosecond||n.visitDuration;break;case I.FixedSizeList:i=n.visitFixedSizeList;break;case I.Map:i=n.visitMap;break}if(typeof i=="function")return i;if(!e)return()=>null;throw new Error(`Unrecognized type '${I[t]}'`)}function Lh(n){switch(n.typeId){case I.Null:return I.Null;case I.Int:{const{bitWidth:t,isSigned:e}=n;switch(t){case 8:return e?I.Int8:I.Uint8;case 16:return e?I.Int16:I.Uint16;case 32:return e?I.Int32:I.Uint32;case 64:return e?I.Int64:I.Uint64}return I.Int}case I.Float:switch(n.precision){case Ke.HALF:return I.Float16;case Ke.SINGLE:return I.Float32;case Ke.DOUBLE:return I.Float64}return I.Float;case I.Binary:return I.Binary;case I.LargeBinary:return I.LargeBinary;case I.Utf8:return I.Utf8;case I.LargeUtf8:return I.LargeUtf8;case I.Bool:return I.Bool;case I.Decimal:return I.Decimal;case I.Time:switch(n.unit){case Ut.SECOND:return I.TimeSecond;case Ut.MILLISECOND:return I.TimeMillisecond;case Ut.MICROSECOND:return I.TimeMicrosecond;case Ut.NANOSECOND:return I.TimeNanosecond}return I.Time;case I.Timestamp:switch(n.unit){case Ut.SECOND:return I.TimestampSecond;case Ut.MILLISECOND:return I.TimestampMillisecond;case Ut.MICROSECOND:return I.TimestampMicrosecond;case Ut.NANOSECOND:return I.TimestampNanosecond}return I.Timestamp;case I.Date:switch(n.unit){case Cn.DAY:return I.DateDay;case Cn.MILLISECOND:return I.DateMillisecond}return I.Date;case I.Interval:switch(n.unit){case Ye.DAY_TIME:return I.IntervalDayTime;case Ye.YEAR_MONTH:return I.IntervalYearMonth;case Ye.MONTH_DAY_NANO:return I.IntervalMonthDayNano}return I.Interval;case I.Duration:switch(n.unit){case Ut.SECOND:return I.DurationSecond;case Ut.MILLISECOND:return I.DurationMillisecond;case Ut.MICROSECOND:return I.DurationMicrosecond;case Ut.NANOSECOND:return I.DurationNanosecond}return I.Duration;case I.Map:return I.Map;case I.List:return I.List;case I.Struct:return I.Struct;case I.Union:switch(n.mode){case un.Dense:return I.DenseUnion;case un.Sparse:return I.SparseUnion}return I.Union;case I.FixedSizeBinary:return I.FixedSizeBinary;case I.FixedSizeList:return I.FixedSizeList;case I.Dictionary:return I.Dictionary}throw new Error(`Unrecognized type '${I[n.typeId]}'`)}Jt.prototype.visitInt8=null;Jt.prototype.visitInt16=null;Jt.prototype.visitInt32=null;Jt.prototype.visitInt64=null;Jt.prototype.visitUint8=null;Jt.prototype.visitUint16=null;Jt.prototype.visitUint32=null;Jt.prototype.visitUint64=null;Jt.prototype.visitFloat16=null;Jt.prototype.visitFloat32=null;Jt.prototype.visitFloat64=null;Jt.prototype.visitDateDay=null;Jt.prototype.visitDateMillisecond=null;Jt.prototype.visitTimestampSecond=null;Jt.prototype.visitTimestampMillisecond=null;Jt.prototype.visitTimestampMicrosecond=null;Jt.prototype.visitTimestampNanosecond=null;Jt.prototype.visitTimeSecond=null;Jt.prototype.visitTimeMillisecond=null;Jt.prototype.visitTimeMicrosecond=null;Jt.prototype.visitTimeNanosecond=null;Jt.prototype.visitDenseUnion=null;Jt.prototype.visitSparseUnion=null;Jt.prototype.visitIntervalDayTime=null;Jt.prototype.visitIntervalYearMonth=null;Jt.prototype.visitIntervalMonthDayNano=null;Jt.prototype.visitDuration=null;Jt.prototype.visitDurationSecond=null;Jt.prototype.visitDurationMillisecond=null;Jt.prototype.visitDurationMicrosecond=null;Jt.prototype.visitDurationNanosecond=null;const pf=new Float64Array(1),Ls=new Uint32Array(pf.buffer);function mf(n){const t=(n&31744)>>10,e=(n&1023)/1024,i=Math.pow(-1,(n&32768)>>15);switch(t){case 31:return i*(e?Number.NaN:1/0);case 0:return i*(e?6103515625e-14*e:0)}return i*Math.pow(2,t-15)*(1+e)}function WS(n){if(n!==n)return 32256;pf[0]=n;const t=(Ls[1]&2147483648)>>16&65535;let e=Ls[1]&2146435072,i=0;return e>=1089470464?Ls[0]>0?e=31744:(e=(e&2080374784)>>16,i=(Ls[1]&1048575)>>10):e<=1056964608?(i=1048576+(Ls[1]&1048575),i=1048576+(i<<(e>>20)-998)>>21,e=0):(e=e-1056964608>>10,i=(Ls[1]&1048575)+512>>10),t|e|i&65535}class Dt extends Jt{}function Nt(n){return(t,e,i)=>{if(t.setValid(e,i!=null))return n(t,e,i)}}const XS=(n,t,e)=>{n[t]=Math.floor(e/864e5)},_f=(n,t,e,i)=>{if(e+1<t.length){const s=Re(t[e]),r=Re(t[e+1]);n.set(i.subarray(0,r-s),s)}},YS=({offset:n,values:t},e,i)=>{const s=n+e;i?t[s>>3]|=1<<s%8:t[s>>3]&=~(1<<s%8)},Ti=({values:n},t,e)=>{n[t]=e},jl=({values:n},t,e)=>{n[t]=e},gf=({values:n},t,e)=>{n[t]=WS(e)},jS=(n,t,e)=>{switch(n.type.precision){case Ke.HALF:return gf(n,t,e);case Ke.SINGLE:case Ke.DOUBLE:return jl(n,t,e)}},vf=({values:n},t,e)=>{XS(n,t,e.valueOf())},yf=({values:n},t,e)=>{n[t]=BigInt(e)},qS=({stride:n,values:t},e,i)=>{t.set(i.subarray(0,n),n*e)},Sf=({values:n,valueOffsets:t},e,i)=>_f(n,t,e,i),xf=({values:n,valueOffsets:t},e,i)=>_f(n,t,e,Hl(i)),$S=(n,t,e)=>{n.type.unit===Cn.DAY?vf(n,t,e):yf(n,t,e)},bf=({values:n},t,e)=>{n[t]=BigInt(e/1e3)},Mf=({values:n},t,e)=>{n[t]=BigInt(e)},Ef=({values:n},t,e)=>{n[t]=BigInt(e*1e3)},Tf=({values:n},t,e)=>{n[t]=BigInt(e*1e6)},KS=(n,t,e)=>{switch(n.type.unit){case Ut.SECOND:return bf(n,t,e);case Ut.MILLISECOND:return Mf(n,t,e);case Ut.MICROSECOND:return Ef(n,t,e);case Ut.NANOSECOND:return Tf(n,t,e)}},wf=({values:n},t,e)=>{n[t]=e},Af=({values:n},t,e)=>{n[t]=e},Rf=({values:n},t,e)=>{n[t]=e},If=({values:n},t,e)=>{n[t]=e},ZS=(n,t,e)=>{switch(n.type.unit){case Ut.SECOND:return wf(n,t,e);case Ut.MILLISECOND:return Af(n,t,e);case Ut.MICROSECOND:return Rf(n,t,e);case Ut.NANOSECOND:return If(n,t,e)}},JS=({values:n,stride:t},e,i)=>{n.set(i.subarray(0,t),t*e)},QS=(n,t,e)=>{const i=n.children[0],s=n.valueOffsets,r=Dn.getVisitFn(i);if(Array.isArray(e))for(let o=-1,a=s[t],c=s[t+1];a<c;)r(i,a++,e[++o]);else for(let o=-1,a=s[t],c=s[t+1];a<c;)r(i,a++,e.get(++o))},tx=(n,t,e)=>{const i=n.children[0],{valueOffsets:s}=n,r=Dn.getVisitFn(i);let{[t]:o,[t+1]:a}=s;const c=e instanceof Map?e.entries():Object.entries(e);for(const l of c)if(r(i,o,l),++o>=a)break},ex=(n,t)=>(e,i,s,r)=>i&&e(i,n,t[r]),nx=(n,t)=>(e,i,s,r)=>i&&e(i,n,t.get(r)),ix=(n,t)=>(e,i,s,r)=>i&&e(i,n,t.get(s.name)),sx=(n,t)=>(e,i,s,r)=>i&&e(i,n,t[s.name]),rx=(n,t,e)=>{const i=n.type.children.map(r=>Dn.getVisitFn(r.type)),s=e instanceof Map?ix(t,e):e instanceof ve?nx(t,e):Array.isArray(e)?ex(t,e):sx(t,e);n.type.children.forEach((r,o)=>s(i[o],n.children[o],r,o))},ox=(n,t,e)=>{n.type.mode===un.Dense?Cf(n,t,e):Df(n,t,e)},Cf=(n,t,e)=>{const i=n.type.typeIdToChildIndex[n.typeIds[t]],s=n.children[i];Dn.visit(s,n.valueOffsets[t],e)},Df=(n,t,e)=>{const i=n.type.typeIdToChildIndex[n.typeIds[t]],s=n.children[i];Dn.visit(s,t,e)},ax=(n,t,e)=>{var i;(i=n.dictionary)===null||i===void 0||i.set(n.values[t],e)},cx=(n,t,e)=>{switch(n.type.unit){case Ye.YEAR_MONTH:return Lf(n,t,e);case Ye.DAY_TIME:return Pf(n,t,e);case Ye.MONTH_DAY_NANO:return Uf(n,t,e)}},Pf=({values:n},t,e)=>{n.set(e.subarray(0,2),2*t)},Lf=({values:n},t,e)=>{n[t]=e[0]*12+e[1]%12},Uf=({values:n,stride:t},e,i)=>{n.set(i.subarray(0,t),t*e)},Nf=({values:n},t,e)=>{n[t]=e},Ff=({values:n},t,e)=>{n[t]=e},Of=({values:n},t,e)=>{n[t]=e},Bf=({values:n},t,e)=>{n[t]=e},lx=(n,t,e)=>{switch(n.type.unit){case Ut.SECOND:return Nf(n,t,e);case Ut.MILLISECOND:return Ff(n,t,e);case Ut.MICROSECOND:return Of(n,t,e);case Ut.NANOSECOND:return Bf(n,t,e)}},ux=(n,t,e)=>{const{stride:i}=n,s=n.children[0],r=Dn.getVisitFn(s);if(Array.isArray(e))for(let o=-1,a=t*i;++o<i;)r(s,a+o,e[o]);else for(let o=-1,a=t*i;++o<i;)r(s,a+o,e.get(o))};Dt.prototype.visitBool=Nt(YS);Dt.prototype.visitInt=Nt(Ti);Dt.prototype.visitInt8=Nt(Ti);Dt.prototype.visitInt16=Nt(Ti);Dt.prototype.visitInt32=Nt(Ti);Dt.prototype.visitInt64=Nt(Ti);Dt.prototype.visitUint8=Nt(Ti);Dt.prototype.visitUint16=Nt(Ti);Dt.prototype.visitUint32=Nt(Ti);Dt.prototype.visitUint64=Nt(Ti);Dt.prototype.visitFloat=Nt(jS);Dt.prototype.visitFloat16=Nt(gf);Dt.prototype.visitFloat32=Nt(jl);Dt.prototype.visitFloat64=Nt(jl);Dt.prototype.visitUtf8=Nt(xf);Dt.prototype.visitLargeUtf8=Nt(xf);Dt.prototype.visitBinary=Nt(Sf);Dt.prototype.visitLargeBinary=Nt(Sf);Dt.prototype.visitFixedSizeBinary=Nt(qS);Dt.prototype.visitDate=Nt($S);Dt.prototype.visitDateDay=Nt(vf);Dt.prototype.visitDateMillisecond=Nt(yf);Dt.prototype.visitTimestamp=Nt(KS);Dt.prototype.visitTimestampSecond=Nt(bf);Dt.prototype.visitTimestampMillisecond=Nt(Mf);Dt.prototype.visitTimestampMicrosecond=Nt(Ef);Dt.prototype.visitTimestampNanosecond=Nt(Tf);Dt.prototype.visitTime=Nt(ZS);Dt.prototype.visitTimeSecond=Nt(wf);Dt.prototype.visitTimeMillisecond=Nt(Af);Dt.prototype.visitTimeMicrosecond=Nt(Rf);Dt.prototype.visitTimeNanosecond=Nt(If);Dt.prototype.visitDecimal=Nt(JS);Dt.prototype.visitList=Nt(QS);Dt.prototype.visitStruct=Nt(rx);Dt.prototype.visitUnion=Nt(ox);Dt.prototype.visitDenseUnion=Nt(Cf);Dt.prototype.visitSparseUnion=Nt(Df);Dt.prototype.visitDictionary=Nt(ax);Dt.prototype.visitInterval=Nt(cx);Dt.prototype.visitIntervalDayTime=Nt(Pf);Dt.prototype.visitIntervalYearMonth=Nt(Lf);Dt.prototype.visitIntervalMonthDayNano=Nt(Uf);Dt.prototype.visitDuration=Nt(lx);Dt.prototype.visitDurationSecond=Nt(Nf);Dt.prototype.visitDurationMillisecond=Nt(Ff);Dt.prototype.visitDurationMicrosecond=Nt(Of);Dt.prototype.visitDurationNanosecond=Nt(Bf);Dt.prototype.visitFixedSizeList=Nt(ux);Dt.prototype.visitMap=Nt(tx);const Dn=new Dt,Nn=Symbol.for("parent"),tr=Symbol.for("rowIndex");class ql{constructor(t,e){return this[Nn]=t,this[tr]=e,new Proxy(this,fx)}toArray(){return Object.values(this.toJSON())}toJSON(){const t=this[tr],e=this[Nn],i=e.type.children,s={};for(let r=-1,o=i.length;++r<o;)s[i[r].name]=hn.visit(e.children[r],t);return s}toString(){return`{${[...this].map(([t,e])=>`${Hr(t)}: ${Hr(e)}`).join(", ")}}`}[Symbol.for("nodejs.util.inspect.custom")](){return this.toString()}[Symbol.iterator](){return new hx(this[Nn],this[tr])}}class hx{constructor(t,e){this.childIndex=0,this.children=t.children,this.rowIndex=e,this.childFields=t.type.children,this.numChildren=this.childFields.length}[Symbol.iterator](){return this}next(){const t=this.childIndex;return t<this.numChildren?(this.childIndex=t+1,{done:!1,value:[this.childFields[t].name,hn.visit(this.children[t],this.rowIndex)]}):{done:!0,value:null}}}Object.defineProperties(ql.prototype,{[Symbol.toStringTag]:{enumerable:!1,configurable:!1,value:"Row"},[Nn]:{writable:!0,enumerable:!1,configurable:!1,value:null},[tr]:{writable:!0,enumerable:!1,configurable:!1,value:-1}});class dx{isExtensible(){return!1}deleteProperty(){return!1}preventExtensions(){return!0}ownKeys(t){return t[Nn].type.children.map(e=>e.name)}has(t,e){return t[Nn].type.children.some(i=>i.name===e)}getOwnPropertyDescriptor(t,e){if(t[Nn].type.children.some(i=>i.name===e))return{writable:!0,enumerable:!0,configurable:!0}}get(t,e){if(Reflect.has(t,e))return t[e];const i=t[Nn].type.children.findIndex(s=>s.name===e);if(i!==-1){const s=hn.visit(t[Nn].children[i],t[tr]);return Reflect.set(t,e,s),s}}set(t,e,i){const s=t[Nn].type.children.findIndex(r=>r.name===e);return s!==-1?(Dn.visit(t[Nn].children[s],t[tr],i),Reflect.set(t,e,i)):Reflect.has(t,e)||typeof e=="symbol"?Reflect.set(t,e,i):!1}}const fx=new dx;class Tt extends Jt{}function Pt(n){return(t,e)=>t.getValid(e)?n(t,e):null}const px=(n,t)=>864e5*n[t],mx=(n,t)=>null,zf=(n,t,e)=>{if(e+1>=t.length)return null;const i=Re(t[e]),s=Re(t[e+1]);return n.subarray(i,s)},_x=({offset:n,values:t},e)=>{const i=n+e;return(t[i>>3]&1<<i%8)!==0},Vf=({values:n},t)=>px(n,t),kf=({values:n},t)=>Re(n[t]),Yi=({stride:n,values:t},e)=>t[n*e],gx=({stride:n,values:t},e)=>mf(t[n*e]),Hf=({values:n},t)=>n[t],vx=({stride:n,values:t},e)=>t.subarray(n*e,n*(e+1)),Gf=({values:n,valueOffsets:t},e)=>zf(n,t,e),Wf=({values:n,valueOffsets:t},e)=>{const i=zf(n,t,e);return i!==null?pl(i):null},yx=({values:n},t)=>n[t],Sx=({type:n,values:t},e)=>n.precision!==Ke.HALF?t[e]:mf(t[e]),xx=(n,t)=>n.type.unit===Cn.DAY?Vf(n,t):kf(n,t),Xf=({values:n},t)=>1e3*Re(n[t]),Yf=({values:n},t)=>Re(n[t]),jf=({values:n},t)=>Gd(n[t],BigInt(1e3)),qf=({values:n},t)=>Gd(n[t],BigInt(1e6)),bx=(n,t)=>{switch(n.type.unit){case Ut.SECOND:return Xf(n,t);case Ut.MILLISECOND:return Yf(n,t);case Ut.MICROSECOND:return jf(n,t);case Ut.NANOSECOND:return qf(n,t)}},$f=({values:n},t)=>n[t],Kf=({values:n},t)=>n[t],Zf=({values:n},t)=>n[t],Jf=({values:n},t)=>n[t],Mx=(n,t)=>{switch(n.type.unit){case Ut.SECOND:return $f(n,t);case Ut.MILLISECOND:return Kf(n,t);case Ut.MICROSECOND:return Zf(n,t);case Ut.NANOSECOND:return Jf(n,t)}},Ex=({values:n,stride:t},e)=>Yl.decimal(n.subarray(t*e,t*(e+1))),Tx=(n,t)=>{const{valueOffsets:e,stride:i,children:s}=n,{[t*i]:r,[t*i+1]:o}=e,c=s[0].slice(r,o-r);return new ve([c])},wx=(n,t)=>{const{valueOffsets:e,children:i}=n,{[t]:s,[t+1]:r}=e,o=i[0];return new $l(o.slice(s,r-s))},Ax=(n,t)=>new ql(n,t),Rx=(n,t)=>n.type.mode===un.Dense?Qf(n,t):tp(n,t),Qf=(n,t)=>{const e=n.type.typeIdToChildIndex[n.typeIds[t]],i=n.children[e];return hn.visit(i,n.valueOffsets[t])},tp=(n,t)=>{const e=n.type.typeIdToChildIndex[n.typeIds[t]],i=n.children[e];return hn.visit(i,t)},Ix=(n,t)=>{var e;return(e=n.dictionary)===null||e===void 0?void 0:e.get(n.values[t])},Cx=(n,t)=>n.type.unit===Ye.MONTH_DAY_NANO?ip(n,t):n.type.unit===Ye.DAY_TIME?ep(n,t):np(n,t),ep=({values:n},t)=>n.subarray(2*t,2*(t+1)),np=({values:n},t)=>{const e=n[t],i=new Int32Array(2);return i[0]=Math.trunc(e/12),i[1]=Math.trunc(e%12),i},ip=({values:n},t)=>n.subarray(4*t,4*(t+1)),sp=({values:n},t)=>n[t],rp=({values:n},t)=>n[t],op=({values:n},t)=>n[t],ap=({values:n},t)=>n[t],Dx=(n,t)=>{switch(n.type.unit){case Ut.SECOND:return sp(n,t);case Ut.MILLISECOND:return rp(n,t);case Ut.MICROSECOND:return op(n,t);case Ut.NANOSECOND:return ap(n,t)}},Px=(n,t)=>{const{stride:e,children:i}=n,r=i[0].slice(t*e,e);return new ve([r])};Tt.prototype.visitNull=Pt(mx);Tt.prototype.visitBool=Pt(_x);Tt.prototype.visitInt=Pt(yx);Tt.prototype.visitInt8=Pt(Yi);Tt.prototype.visitInt16=Pt(Yi);Tt.prototype.visitInt32=Pt(Yi);Tt.prototype.visitInt64=Pt(Hf);Tt.prototype.visitUint8=Pt(Yi);Tt.prototype.visitUint16=Pt(Yi);Tt.prototype.visitUint32=Pt(Yi);Tt.prototype.visitUint64=Pt(Hf);Tt.prototype.visitFloat=Pt(Sx);Tt.prototype.visitFloat16=Pt(gx);Tt.prototype.visitFloat32=Pt(Yi);Tt.prototype.visitFloat64=Pt(Yi);Tt.prototype.visitUtf8=Pt(Wf);Tt.prototype.visitLargeUtf8=Pt(Wf);Tt.prototype.visitBinary=Pt(Gf);Tt.prototype.visitLargeBinary=Pt(Gf);Tt.prototype.visitFixedSizeBinary=Pt(vx);Tt.prototype.visitDate=Pt(xx);Tt.prototype.visitDateDay=Pt(Vf);Tt.prototype.visitDateMillisecond=Pt(kf);Tt.prototype.visitTimestamp=Pt(bx);Tt.prototype.visitTimestampSecond=Pt(Xf);Tt.prototype.visitTimestampMillisecond=Pt(Yf);Tt.prototype.visitTimestampMicrosecond=Pt(jf);Tt.prototype.visitTimestampNanosecond=Pt(qf);Tt.prototype.visitTime=Pt(Mx);Tt.prototype.visitTimeSecond=Pt($f);Tt.prototype.visitTimeMillisecond=Pt(Kf);Tt.prototype.visitTimeMicrosecond=Pt(Zf);Tt.prototype.visitTimeNanosecond=Pt(Jf);Tt.prototype.visitDecimal=Pt(Ex);Tt.prototype.visitList=Pt(Tx);Tt.prototype.visitStruct=Pt(Ax);Tt.prototype.visitUnion=Pt(Rx);Tt.prototype.visitDenseUnion=Pt(Qf);Tt.prototype.visitSparseUnion=Pt(tp);Tt.prototype.visitDictionary=Pt(Ix);Tt.prototype.visitInterval=Pt(Cx);Tt.prototype.visitIntervalDayTime=Pt(ep);Tt.prototype.visitIntervalYearMonth=Pt(np);Tt.prototype.visitIntervalMonthDayNano=Pt(ip);Tt.prototype.visitDuration=Pt(Dx);Tt.prototype.visitDurationSecond=Pt(sp);Tt.prototype.visitDurationMillisecond=Pt(rp);Tt.prototype.visitDurationMicrosecond=Pt(op);Tt.prototype.visitDurationNanosecond=Pt(ap);Tt.prototype.visitFixedSizeList=Pt(Px);Tt.prototype.visitMap=Pt(wx);const hn=new Tt,Hs=Symbol.for("keys"),er=Symbol.for("vals"),Gs=Symbol.for("kKeysAsStrings"),Sl=Symbol.for("_kKeysAsStrings");class $l{constructor(t){return this[Hs]=new ve([t.children[0]]).memoize(),this[er]=t.children[1],new Proxy(this,new Ux)}get[Gs](){return this[Sl]||(this[Sl]=Array.from(this[Hs].toArray(),String))}[Symbol.iterator](){return new Lx(this[Hs],this[er])}get size(){return this[Hs].length}toArray(){return Object.values(this.toJSON())}toJSON(){const t=this[Hs],e=this[er],i={};for(let s=-1,r=t.length;++s<r;)i[t.get(s)]=hn.visit(e,s);return i}toString(){return`{${[...this].map(([t,e])=>`${Hr(t)}: ${Hr(e)}`).join(", ")}}`}[Symbol.for("nodejs.util.inspect.custom")](){return this.toString()}}class Lx{constructor(t,e){this.keys=t,this.vals=e,this.keyIndex=0,this.numKeys=t.length}[Symbol.iterator](){return this}next(){const t=this.keyIndex;return t===this.numKeys?{done:!0,value:null}:(this.keyIndex++,{done:!1,value:[this.keys.get(t),hn.visit(this.vals,t)]})}}class Ux{isExtensible(){return!1}deleteProperty(){return!1}preventExtensions(){return!0}ownKeys(t){return t[Gs]}has(t,e){return t[Gs].includes(e)}getOwnPropertyDescriptor(t,e){if(t[Gs].indexOf(e)!==-1)return{writable:!0,enumerable:!0,configurable:!0}}get(t,e){if(Reflect.has(t,e))return t[e];const i=t[Gs].indexOf(e);if(i!==-1){const s=hn.visit(Reflect.get(t,er),i);return Reflect.set(t,e,s),s}}set(t,e,i){const s=t[Gs].indexOf(e);return s!==-1?(Dn.visit(Reflect.get(t,er),s,i),Reflect.set(t,e,i)):Reflect.has(t,e)?Reflect.set(t,e,i):!1}}Object.defineProperties($l.prototype,{[Symbol.toStringTag]:{enumerable:!1,configurable:!1,value:"Row"},[Hs]:{writable:!0,enumerable:!1,configurable:!1,value:null},[er]:{writable:!0,enumerable:!1,configurable:!1,value:null},[Sl]:{writable:!0,enumerable:!1,configurable:!1,value:null}});let Uh;function cp(n,t,e,i){const{length:s=0}=n;let r=typeof t!="number"?0:t,o=typeof e!="number"?s:e;return r<0&&(r=(r%s+s)%s),o<0&&(o=(o%s+s)%s),o<r&&(Uh=r,r=o,o=Uh),o>s&&(o=s),i?i(n,r,o):[r,o]}const Kl=(n,t)=>n<0?t+n:n,Nh=n=>n!==n;function pr(n){if(typeof n!=="object"||n===null)return Nh(n)?Nh:e=>e===n;if(n instanceof Date){const e=n.valueOf();return i=>i instanceof Date?i.valueOf()===e:!1}return ArrayBuffer.isView(n)?e=>e?DS(n,e):!1:n instanceof Map?Fx(n):Array.isArray(n)?Nx(n):n instanceof ve?Ox(n):Bx(n,!0)}function Nx(n){const t=[];for(let e=-1,i=n.length;++e<i;)t[e]=pr(n[e]);return La(t)}function Fx(n){let t=-1;const e=[];for(const i of n.values())e[++t]=pr(i);return La(e)}function Ox(n){const t=[];for(let e=-1,i=n.length;++e<i;)t[e]=pr(n.get(e));return La(t)}function Bx(n,t=!1){const e=Object.keys(n);if(!t&&e.length===0)return()=>!1;const i=[];for(let s=-1,r=e.length;++s<r;)i[s]=pr(n[e[s]]);return La(i,e)}function La(n,t){return e=>{if(!e||typeof e!="object")return!1;switch(e.constructor){case Array:return zx(n,e);case Map:return Fh(n,e,e.keys());case $l:case ql:case Object:case void 0:return Fh(n,e,t||Object.keys(e))}return e instanceof ve?Vx(n,e):!1}}function zx(n,t){const e=n.length;if(t.length!==e)return!1;for(let i=-1;++i<e;)if(!n[i](t[i]))return!1;return!0}function Vx(n,t){const e=n.length;if(t.length!==e)return!1;for(let i=-1;++i<e;)if(!n[i](t.get(i)))return!1;return!0}function Fh(n,t,e){const i=e[Symbol.iterator](),s=t instanceof Map?t.keys():Object.keys(t)[Symbol.iterator](),r=t instanceof Map?t.values():Object.values(t)[Symbol.iterator]();let o=0;const a=n.length;let c=r.next(),l=i.next(),u=s.next();for(;o<a&&!l.done&&!u.done&&!c.done&&!(l.value!==u.value||!n[o](c.value));++o,l=i.next(),u=s.next(),c=r.next());return o===a&&l.done&&u.done&&c.done?!0:(i.return&&i.return(),s.return&&s.return(),r.return&&r.return(),!1)}function lp(n,t,e,i){return(e&1<<i)!==0}function kx(n,t,e,i){return(e&1<<i)>>i}function Oh(n,t,e){const i=e.byteLength+7&-8;if(n>0||e.byteLength<i){const s=new Uint8Array(i);return s.set(n%8===0?e.subarray(n>>3):xl(new Zl(e,n,t,null,lp)).subarray(0,i)),s}return e}function xl(n){const t=[];let e=0,i=0,s=0;for(const o of n)o&&(s|=1<<i),++i===8&&(t[e++]=s,s=i=0);(e===0||i>0)&&(t[e++]=s);const r=new Uint8Array(t.length+7&-8);return r.set(t),r}class Zl{constructor(t,e,i,s,r){this.bytes=t,this.length=i,this.context=s,this.get=r,this.bit=e%8,this.byteIndex=e>>3,this.byte=t[this.byteIndex++],this.index=0}next(){return this.index<this.length?(this.bit===8&&(this.bit=0,this.byte=this.bytes[this.byteIndex++]),{value:this.get(this.context,this.index++,this.byte,this.bit++)}):{done:!0,value:null}}[Symbol.iterator](){return this}}function bl(n,t,e){if(e-t<=0)return 0;if(e-t<8){let r=0;for(const o of new Zl(n,t,e-t,n,kx))r+=o;return r}const i=e>>3<<3,s=t+(t%8===0?0:8-t%8);return bl(n,t,s)+bl(n,i,e)+Hx(n,s>>3,i-s>>3)}function Hx(n,t,e){let i=0,s=Math.trunc(t);const r=new DataView(n.buffer,n.byteOffset,n.byteLength),o=e===void 0?n.byteLength:s+e;for(;o-s>=4;)i+=Sc(r.getUint32(s)),s+=4;for(;o-s>=2;)i+=Sc(r.getUint16(s)),s+=2;for(;o-s>=1;)i+=Sc(r.getUint8(s)),s+=1;return i}function Sc(n){let t=Math.trunc(n);return t=t-(t>>>1&1431655765),t=(t&858993459)+(t>>>2&858993459),(t+(t>>>4)&252645135)*16843009>>>24}const Gx=-1;class de{get typeId(){return this.type.typeId}get ArrayType(){return this.type.ArrayType}get buffers(){return[this.valueOffsets,this.values,this.nullBitmap,this.typeIds]}get nullable(){if(this._nullCount!==0){const{type:t}=this;return St.isSparseUnion(t)?this.children.some(e=>e.nullable):St.isDenseUnion(t)?this.children.some(e=>e.nullable):this.nullBitmap&&this.nullBitmap.byteLength>0}return!0}get byteLength(){let t=0;const{valueOffsets:e,values:i,nullBitmap:s,typeIds:r}=this;return e&&(t+=e.byteLength),i&&(t+=i.byteLength),s&&(t+=s.byteLength),r&&(t+=r.byteLength),this.children.reduce((o,a)=>o+a.byteLength,t)}get nullCount(){if(St.isUnion(this.type))return this.children.reduce((i,s)=>i+s.nullCount,0);let t=this._nullCount,e;return t<=Gx&&(e=this.nullBitmap)&&(this._nullCount=t=e.length===0?0:this.length-bl(e,this.offset,this.offset+this.length)),t}constructor(t,e,i,s,r,o=[],a){this.type=t,this.children=o,this.dictionary=a,this.offset=Math.floor(Math.max(e||0,0)),this.length=Math.floor(Math.max(i||0,0)),this._nullCount=Math.floor(Math.max(s||0,-1));let c;r instanceof de?(this.stride=r.stride,this.values=r.values,this.typeIds=r.typeIds,this.nullBitmap=r.nullBitmap,this.valueOffsets=r.valueOffsets):(this.stride=vi(t),r&&((c=r[0])&&(this.valueOffsets=c),(c=r[1])&&(this.values=c),(c=r[2])&&(this.nullBitmap=c),(c=r[3])&&(this.typeIds=c)))}getValid(t){const{type:e}=this;if(St.isUnion(e)){const i=e,s=this.children[i.typeIdToChildIndex[this.typeIds[t]]],r=i.mode===un.Dense?this.valueOffsets[t]:t;return s.getValid(r)}if(this.nullable&&this.nullCount>0){const i=this.offset+t;return(this.nullBitmap[i>>3]&1<<i%8)!==0}return!0}setValid(t,e){let i;const{type:s}=this;if(St.isUnion(s)){const r=s,o=this.children[r.typeIdToChildIndex[this.typeIds[t]]],a=r.mode===un.Dense?this.valueOffsets[t]:t;i=o.getValid(a),o.setValid(a,e)}else{let{nullBitmap:r}=this;const{offset:o,length:a}=this,c=o+t,l=1<<c%8,u=c>>3;(!r||r.byteLength<=u)&&(r=new Uint8Array((o+a+63&-64)>>3).fill(255),this.nullCount>0?(r.set(Oh(o,a,this.nullBitmap),0),Object.assign(this,{nullBitmap:r})):Object.assign(this,{nullBitmap:r,_nullCount:0}));const h=r[u];i=(h&l)!==0,r[u]=e?h|l:h&~l}return i!==!!e&&(this._nullCount=this.nullCount+(e?-1:1)),e}clone(t=this.type,e=this.offset,i=this.length,s=this._nullCount,r=this,o=this.children){return new de(t,e,i,s,r,o,this.dictionary)}slice(t,e){const{stride:i,typeId:s,children:r}=this,o=+(this._nullCount===0)-1,a=s===16?i:1,c=this._sliceBuffers(t,e,i,s);return this.clone(this.type,this.offset+t,e,o,c,r.length===0||this.valueOffsets?r:this._sliceChildren(r,a*t,a*e))}_changeLengthAndBackfillNullBitmap(t){if(this.typeId===I.Null)return this.clone(this.type,0,t,0);const{length:e,nullCount:i}=this,s=new Uint8Array((t+63&-64)>>3).fill(255,0,e>>3);s[e>>3]=(1<<e-(e&-8))-1,i>0&&s.set(Oh(this.offset,e,this.nullBitmap),0);const r=this.buffers;return r[gi.VALIDITY]=s,this.clone(this.type,0,t,i+(t-e),r)}_sliceBuffers(t,e,i,s){let r;const{buffers:o}=this;return(r=o[gi.TYPE])&&(o[gi.TYPE]=r.subarray(t,t+e)),(r=o[gi.OFFSET])&&(o[gi.OFFSET]=r.subarray(t,t+e+1))||(r=o[gi.DATA])&&(o[gi.DATA]=s===6?r:r.subarray(i*t,i*(t+e))),o}_sliceChildren(t,e,i){return t.map(s=>s.slice(e,i))}}de.prototype.children=Object.freeze([]);class Nr extends Jt{visit(t){return this.getVisitFn(t.type).call(this,t)}visitNull(t){const{["type"]:e,["offset"]:i=0,["length"]:s=0}=t;return new de(e,i,s,s)}visitBool(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length>>3,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitInt(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitFloat(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitUtf8(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.data),r=ne(t.nullBitmap),o=Er(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new de(e,i,a,c,[o,s,r])}visitLargeUtf8(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.data),r=ne(t.nullBitmap),o=Mh(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new de(e,i,a,c,[o,s,r])}visitBinary(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.data),r=ne(t.nullBitmap),o=Er(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new de(e,i,a,c,[o,s,r])}visitLargeBinary(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.data),r=ne(t.nullBitmap),o=Mh(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new de(e,i,a,c,[o,s,r])}visitFixedSizeBinary(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length/vi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitDate(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length/vi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitTimestamp(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length/vi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitTime(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length/vi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitDecimal(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length/vi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitList(t){const{["type"]:e,["offset"]:i=0,["child"]:s}=t,r=ne(t.nullBitmap),o=Er(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new de(e,i,a,c,[o,void 0,r],[s])}visitStruct(t){const{["type"]:e,["offset"]:i=0,["children"]:s=[]}=t,r=ne(t.nullBitmap),{length:o=s.reduce((c,{length:l})=>Math.max(c,l),0),nullCount:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,void 0,r],s)}visitUnion(t){const{["type"]:e,["offset"]:i=0,["children"]:s=[]}=t,r=pe(e.ArrayType,t.typeIds),{["length"]:o=r.length,["nullCount"]:a=-1}=t;if(St.isSparseUnion(e))return new de(e,i,o,a,[void 0,void 0,void 0,r],s);const c=Er(t.valueOffsets);return new de(e,i,o,a,[c,void 0,void 0,r],s)}visitDictionary(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.indices.ArrayType,t.data),{["dictionary"]:o=new ve([new Nr().visit({type:e.dictionary})])}=t,{["length"]:a=r.length,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new de(e,i,a,c,[void 0,r,s],[],o)}visitInterval(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length/vi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitDuration(t){const{["type"]:e,["offset"]:i=0}=t,s=ne(t.nullBitmap),r=pe(e.ArrayType,t.data),{["length"]:o=r.length,["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,r,s])}visitFixedSizeList(t){const{["type"]:e,["offset"]:i=0,["child"]:s=new Nr().visit({type:e.valueType})}=t,r=ne(t.nullBitmap),{["length"]:o=s.length/vi(e),["nullCount"]:a=t.nullBitmap?-1:0}=t;return new de(e,i,o,a,[void 0,void 0,r],[s])}visitMap(t){const{["type"]:e,["offset"]:i=0,["child"]:s=new Nr().visit({type:e.childType})}=t,r=ne(t.nullBitmap),o=Er(t.valueOffsets),{["length"]:a=o.length-1,["nullCount"]:c=t.nullBitmap?-1:0}=t;return new de(e,i,a,c,[o,void 0,r],[s])}}const Wx=new Nr;function Qt(n){return Wx.visit(n)}class Bh{constructor(t=0,e){this.numChunks=t,this.getChunkIterator=e,this.chunkIndex=0,this.chunkIterator=this.getChunkIterator(0)}next(){for(;this.chunkIndex<this.numChunks;){const t=this.chunkIterator.next();if(!t.done)return t;++this.chunkIndex<this.numChunks&&(this.chunkIterator=this.getChunkIterator(this.chunkIndex))}return{done:!0,value:null}}[Symbol.iterator](){return this}}function Xx(n){return n.some(t=>t.nullable)}function up(n){return n.reduce((t,e)=>t+e.nullCount,0)}function hp(n){return n.reduce((t,e,i)=>(t[i+1]=t[i]+e.length,t),new Uint32Array(n.length+1))}function dp(n,t,e,i){const s=[];for(let r=-1,o=n.length;++r<o;){const a=n[r],c=t[r],{length:l}=a;if(c>=i)break;if(e>=c+l)continue;if(c>=e&&c+l<=i){s.push(a);continue}const u=Math.max(0,e-c),h=Math.min(i-c,l);s.push(a.slice(u,h-u))}return s.length===0&&s.push(n[0].slice(0,0)),s}function Jl(n,t,e,i){let s=0,r=0,o=t.length-1;do{if(s>=o-1)return e<t[o]?i(n,s,e-t[s]):null;r=s+Math.trunc((o-s)*.5),e<t[r]?o=r:s=r}while(s<o)}function Ql(n,t){return n.getValid(t)}function _a(n){function t(e,i,s){return n(e[i],s)}return function(e){const i=this.data;return Jl(i,this._offsets,e,t)}}function fp(n){let t;function e(i,s,r){return n(i[s],r,t)}return function(i,s){const r=this.data;t=s;const o=Jl(r,this._offsets,i,e);return t=void 0,o}}function pp(n){let t;function e(i,s,r){let o=r,a=0,c=0;for(let l=s-1,u=i.length;++l<u;){const h=i[l];if(~(a=n(h,t,o)))return c+a;o=0,c+=h.length}return-1}return function(i,s){t=i;const r=this.data,o=typeof s!="number"?e(r,0,0):Jl(r,this._offsets,s,e);return t=void 0,o}}class wt extends Jt{}function Yx(n,t){return t===null&&n.length>0?0:-1}function jx(n,t){const{nullBitmap:e}=n;if(!e||n.nullCount<=0)return-1;let i=0;for(const s of new Zl(e,n.offset+(t||0),n.length,e,lp)){if(!s)return i;++i}return-1}function Vt(n,t,e){if(t===void 0)return-1;if(t===null)switch(n.typeId){case I.Union:break;case I.Dictionary:break;default:return jx(n,e)}const i=hn.getVisitFn(n),s=pr(t);for(let r=(e||0)-1,o=n.length;++r<o;)if(s(i(n,r)))return r;return-1}function mp(n,t,e){const i=hn.getVisitFn(n),s=pr(t);for(let r=(e||0)-1,o=n.length;++r<o;)if(s(i(n,r)))return r;return-1}wt.prototype.visitNull=Yx;wt.prototype.visitBool=Vt;wt.prototype.visitInt=Vt;wt.prototype.visitInt8=Vt;wt.prototype.visitInt16=Vt;wt.prototype.visitInt32=Vt;wt.prototype.visitInt64=Vt;wt.prototype.visitUint8=Vt;wt.prototype.visitUint16=Vt;wt.prototype.visitUint32=Vt;wt.prototype.visitUint64=Vt;wt.prototype.visitFloat=Vt;wt.prototype.visitFloat16=Vt;wt.prototype.visitFloat32=Vt;wt.prototype.visitFloat64=Vt;wt.prototype.visitUtf8=Vt;wt.prototype.visitLargeUtf8=Vt;wt.prototype.visitBinary=Vt;wt.prototype.visitLargeBinary=Vt;wt.prototype.visitFixedSizeBinary=Vt;wt.prototype.visitDate=Vt;wt.prototype.visitDateDay=Vt;wt.prototype.visitDateMillisecond=Vt;wt.prototype.visitTimestamp=Vt;wt.prototype.visitTimestampSecond=Vt;wt.prototype.visitTimestampMillisecond=Vt;wt.prototype.visitTimestampMicrosecond=Vt;wt.prototype.visitTimestampNanosecond=Vt;wt.prototype.visitTime=Vt;wt.prototype.visitTimeSecond=Vt;wt.prototype.visitTimeMillisecond=Vt;wt.prototype.visitTimeMicrosecond=Vt;wt.prototype.visitTimeNanosecond=Vt;wt.prototype.visitDecimal=Vt;wt.prototype.visitList=Vt;wt.prototype.visitStruct=Vt;wt.prototype.visitUnion=Vt;wt.prototype.visitDenseUnion=mp;wt.prototype.visitSparseUnion=mp;wt.prototype.visitDictionary=Vt;wt.prototype.visitInterval=Vt;wt.prototype.visitIntervalDayTime=Vt;wt.prototype.visitIntervalYearMonth=Vt;wt.prototype.visitIntervalMonthDayNano=Vt;wt.prototype.visitDuration=Vt;wt.prototype.visitDurationSecond=Vt;wt.prototype.visitDurationMillisecond=Vt;wt.prototype.visitDurationMicrosecond=Vt;wt.prototype.visitDurationNanosecond=Vt;wt.prototype.visitFixedSizeList=Vt;wt.prototype.visitMap=Vt;const ga=new wt;class At extends Jt{}function Lt(n){const{type:t}=n;if(n.nullCount===0&&n.stride===1&&(St.isInt(t)&&t.bitWidth!==64||St.isTime(t)&&t.bitWidth!==64||St.isFloat(t)&&t.precision!==Ke.HALF))return new Bh(n.data.length,i=>{const s=n.data[i];return s.values.subarray(0,s.length)[Symbol.iterator]()});let e=0;return new Bh(n.data.length,i=>{const r=n.data[i].length,o=n.slice(e,e+r);return e+=r,new qx(o)})}class qx{constructor(t){this.vector=t,this.index=0}next(){return this.index<this.vector.length?{value:this.vector.get(this.index++)}:{done:!0,value:null}}[Symbol.iterator](){return this}}At.prototype.visitNull=Lt;At.prototype.visitBool=Lt;At.prototype.visitInt=Lt;At.prototype.visitInt8=Lt;At.prototype.visitInt16=Lt;At.prototype.visitInt32=Lt;At.prototype.visitInt64=Lt;At.prototype.visitUint8=Lt;At.prototype.visitUint16=Lt;At.prototype.visitUint32=Lt;At.prototype.visitUint64=Lt;At.prototype.visitFloat=Lt;At.prototype.visitFloat16=Lt;At.prototype.visitFloat32=Lt;At.prototype.visitFloat64=Lt;At.prototype.visitUtf8=Lt;At.prototype.visitLargeUtf8=Lt;At.prototype.visitBinary=Lt;At.prototype.visitLargeBinary=Lt;At.prototype.visitFixedSizeBinary=Lt;At.prototype.visitDate=Lt;At.prototype.visitDateDay=Lt;At.prototype.visitDateMillisecond=Lt;At.prototype.visitTimestamp=Lt;At.prototype.visitTimestampSecond=Lt;At.prototype.visitTimestampMillisecond=Lt;At.prototype.visitTimestampMicrosecond=Lt;At.prototype.visitTimestampNanosecond=Lt;At.prototype.visitTime=Lt;At.prototype.visitTimeSecond=Lt;At.prototype.visitTimeMillisecond=Lt;At.prototype.visitTimeMicrosecond=Lt;At.prototype.visitTimeNanosecond=Lt;At.prototype.visitDecimal=Lt;At.prototype.visitList=Lt;At.prototype.visitStruct=Lt;At.prototype.visitUnion=Lt;At.prototype.visitDenseUnion=Lt;At.prototype.visitSparseUnion=Lt;At.prototype.visitDictionary=Lt;At.prototype.visitInterval=Lt;At.prototype.visitIntervalDayTime=Lt;At.prototype.visitIntervalYearMonth=Lt;At.prototype.visitIntervalMonthDayNano=Lt;At.prototype.visitDuration=Lt;At.prototype.visitDurationSecond=Lt;At.prototype.visitDurationMillisecond=Lt;At.prototype.visitDurationMicrosecond=Lt;At.prototype.visitDurationNanosecond=Lt;At.prototype.visitFixedSizeList=Lt;At.prototype.visitMap=Lt;const tu=new At;var _p;const gp={},vp={};class ve{constructor(t){var e,i,s;const r=t[0]instanceof ve?t.flatMap(a=>a.data):t;if(r.length===0||r.some(a=>!(a instanceof de)))throw new TypeError("Vector constructor expects an Array of Data instances.");const o=(e=r[0])===null||e===void 0?void 0:e.type;switch(r.length){case 0:this._offsets=[0];break;case 1:{const{get:a,set:c,indexOf:l}=gp[o.typeId],u=r[0];this.isValid=h=>Ql(u,h),this.get=h=>a(u,h),this.set=(h,f)=>c(u,h,f),this.indexOf=h=>l(u,h),this._offsets=[0,u.length];break}default:Object.setPrototypeOf(this,vp[o.typeId]),this._offsets=hp(r);break}this.data=r,this.type=o,this.stride=vi(o),this.numChildren=(s=(i=o.children)===null||i===void 0?void 0:i.length)!==null&&s!==void 0?s:0,this.length=this._offsets.at(-1)}get byteLength(){return this.data.reduce((t,e)=>t+e.byteLength,0)}get nullable(){return Xx(this.data)}get nullCount(){return up(this.data)}get ArrayType(){return this.type.ArrayType}get[Symbol.toStringTag](){return`${this.VectorName}<${this.type[Symbol.toStringTag]}>`}get VectorName(){return`${I[this.type.typeId]}Vector`}isValid(t){return!1}get(t){return null}at(t){return this.get(Kl(t,this.length))}set(t,e){}indexOf(t,e){return-1}includes(t,e){return this.indexOf(t,e)>-1}[Symbol.iterator](){return tu.visit(this)}concat(...t){return new ve(this.data.concat(t.flatMap(e=>e.data).flat(Number.POSITIVE_INFINITY)))}slice(t,e){return new ve(cp(this,t,e,({data:i,_offsets:s},r,o)=>dp(i,s,r,o)))}toJSON(){return[...this]}toArray(){const{type:t,data:e,length:i,stride:s,ArrayType:r}=this;switch(t.typeId){case I.Int:case I.Float:case I.Decimal:case I.Time:case I.Timestamp:switch(e.length){case 0:return new r;case 1:return e[0].values.subarray(0,i*s);default:return e.reduce((o,{values:a,length:c})=>(o.array.set(a.subarray(0,c*s),o.offset),o.offset+=c*s,o),{array:new r(i*s),offset:0}).array}}return[...this]}toString(){return`[${[...this].join(",")}]`}getChild(t){var e;return this.getChildAt((e=this.type.children)===null||e===void 0?void 0:e.findIndex(i=>i.name===t))}getChildAt(t){return t>-1&&t<this.numChildren?new ve(this.data.map(({children:e})=>e[t])):null}get isMemoized(){return St.isDictionary(this.type)?this.data[0].dictionary.isMemoized:!1}memoize(){if(St.isDictionary(this.type)){const t=new va(this.data[0].dictionary),e=this.data.map(i=>{const s=i.clone();return s.dictionary=t,s});return new ve(e)}return new va(this)}unmemoize(){if(St.isDictionary(this.type)&&this.isMemoized){const t=this.data[0].dictionary.unmemoize(),e=this.data.map(i=>{const s=i.clone();return s.dictionary=t,s});return new ve(e)}return this}}_p=Symbol.toStringTag;ve[_p]=(n=>{n.type=St.prototype,n.data=[],n.length=0,n.stride=1,n.numChildren=0,n._offsets=new Uint32Array([0]),n[Symbol.isConcatSpreadable]=!0;const t=Object.keys(I).map(e=>I[e]).filter(e=>typeof e=="number"&&e!==I.NONE);for(const e of t){const i=hn.getVisitFnByTypeId(e),s=Dn.getVisitFnByTypeId(e),r=ga.getVisitFnByTypeId(e);gp[e]={get:i,set:s,indexOf:r},vp[e]=Object.create(n,{isValid:{value:_a(Ql)},get:{value:_a(hn.getVisitFnByTypeId(e))},set:{value:fp(Dn.getVisitFnByTypeId(e))},indexOf:{value:pp(ga.getVisitFnByTypeId(e))}})}return"Vector"})(ve.prototype);class va extends ve{constructor(t){super(t.data);const e=this.get,i=this.set,s=this.slice,r=new Array(this.length);Object.defineProperty(this,"get",{value(o){const a=r[o];if(a!==void 0)return a;const c=e.call(this,o);return r[o]=c,c}}),Object.defineProperty(this,"set",{value(o,a){i.call(this,o,a),r[o]=a}}),Object.defineProperty(this,"slice",{value:(o,a)=>new va(s.call(this,o,a))}),Object.defineProperty(this,"isMemoized",{value:!0}),Object.defineProperty(this,"unmemoize",{value:()=>new ve(this.data)}),Object.defineProperty(this,"memoize",{value:()=>this})}}class Ml{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}offset(){return this.bb.readInt64(this.bb_pos)}metaDataLength(){return this.bb.readInt32(this.bb_pos+8)}bodyLength(){return this.bb.readInt64(this.bb_pos+16)}static sizeOf(){return 24}static createBlock(t,e,i,s){return t.prep(8,24),t.writeInt64(BigInt(s??0)),t.pad(4),t.writeInt32(i),t.writeInt64(BigInt(e??0)),t.offset()}}class _n{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsFooter(t,e){return(e||new _n).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsFooter(t,e){return t.setPosition(t.position()+he),(e||new _n).__init(t.readInt32(t.position())+t.position(),t)}version(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Be.V1}schema(t){const e=this.bb.__offset(this.bb_pos,6);return e?(t||new qn).__init(this.bb.__indirect(this.bb_pos+e),this.bb):null}dictionaries(t,e){const i=this.bb.__offset(this.bb_pos,8);return i?(e||new Ml).__init(this.bb.__vector(this.bb_pos+i)+t*24,this.bb):null}dictionariesLength(){const t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__vector_len(this.bb_pos+t):0}recordBatches(t,e){const i=this.bb.__offset(this.bb_pos,10);return i?(e||new Ml).__init(this.bb.__vector(this.bb_pos+i)+t*24,this.bb):null}recordBatchesLength(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.__vector_len(this.bb_pos+t):0}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,12);return i?(e||new Ve).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,12);return t?this.bb.__vector_len(this.bb_pos+t):0}static startFooter(t){t.startObject(5)}static addVersion(t,e){t.addFieldInt16(0,e,Be.V1)}static addSchema(t,e){t.addFieldOffset(1,e,0)}static addDictionaries(t,e){t.addFieldOffset(2,e,0)}static startDictionariesVector(t,e){t.startVector(24,e,8)}static addRecordBatches(t,e){t.addFieldOffset(3,e,0)}static startRecordBatchesVector(t,e){t.startVector(24,e,8)}static addCustomMetadata(t,e){t.addFieldOffset(4,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static endFooter(t){return t.endObject()}static finishFooterBuffer(t,e){t.finish(e)}static finishSizePrefixedFooterBuffer(t,e){t.finish(e,void 0,!0)}}class ue{constructor(t=[],e,i,s=Be.V5){this.fields=t||[],this.metadata=e||new Map,i||(i=El(this.fields)),this.dictionaries=i,this.metadataVersion=s}get[Symbol.toStringTag](){return"Schema"}get names(){return this.fields.map(t=>t.name)}toString(){return`Schema<{ ${this.fields.map((t,e)=>`${e}: ${t}`).join(", ")} }>`}select(t){const e=new Set(t),i=this.fields.filter(s=>e.has(s.name));return new ue(i,this.metadata)}selectAt(t){const e=t.map(i=>this.fields[i]).filter(Boolean);return new ue(e,this.metadata)}assign(...t){const e=t[0]instanceof ue?t[0]:Array.isArray(t[0])?new ue(t[0]):new ue(t),i=[...this.fields],s=Do(Do(new Map,this.metadata),e.metadata),r=e.fields.filter(a=>{const c=i.findIndex(l=>l.name===a.name);return~c?(i[c]=a.clone({metadata:Do(Do(new Map,i[c].metadata),a.metadata)}))&&!1:!0}),o=El(r,new Map);return new ue([...i,...r],s,new Map([...this.dictionaries,...o]))}}ue.prototype.fields=null;ue.prototype.metadata=null;ue.prototype.dictionaries=null;class Te{static new(...t){let[e,i,s,r]=t;return t[0]&&typeof t[0]=="object"&&({name:e}=t[0],i===void 0&&(i=t[0].type),s===void 0&&(s=t[0].nullable),r===void 0&&(r=t[0].metadata)),new Te(`${e}`,i,s,r)}constructor(t,e,i=!1,s){this.name=t,this.type=e,this.nullable=i,this.metadata=s||new Map}get typeId(){return this.type.typeId}get[Symbol.toStringTag](){return"Field"}toString(){return`${this.name}: ${this.type}`}clone(...t){let[e,i,s,r]=t;return!t[0]||typeof t[0]!="object"?[e=this.name,i=this.type,s=this.nullable,r=this.metadata]=t:{name:e=this.name,type:i=this.type,nullable:s=this.nullable,metadata:r=this.metadata}=t[0],Te.new(e,i,s,r)}}Te.prototype.type=null;Te.prototype.name=null;Te.prototype.nullable=null;Te.prototype.metadata=null;function Do(n,t){return new Map([...n||new Map,...t||new Map])}function El(n,t=new Map){for(let e=-1,i=n.length;++e<i;){const r=n[e].type;if(St.isDictionary(r)){if(!t.has(r.id))t.set(r.id,r.dictionary);else if(t.get(r.id)!==r.dictionary)throw new Error("Cannot create Schema containing two different dictionaries with the same Id")}r.children&&r.children.length>0&&El(r.children,t)}return t}var $x=zd,Kx=ds;class eu{static decode(t){t=new Kx(ne(t));const e=_n.getRootAsFooter(t),i=ue.decode(e.schema(),new Map,e.version());return new Zx(i,e)}static encode(t){const e=new $x,i=ue.encode(e,t.schema);_n.startRecordBatchesVector(e,t.numRecordBatches);for(const o of[...t.recordBatches()].slice().reverse())lr.encode(e,o);const s=e.endVector();_n.startDictionariesVector(e,t.numDictionaries);for(const o of[...t.dictionaryBatches()].slice().reverse())lr.encode(e,o);const r=e.endVector();return _n.startFooter(e),_n.addSchema(e,i),_n.addVersion(e,Be.V5),_n.addRecordBatches(e,s),_n.addDictionaries(e,r),_n.finishFooterBuffer(e,_n.endFooter(e)),e.asUint8Array()}get numRecordBatches(){return this._recordBatches.length}get numDictionaries(){return this._dictionaryBatches.length}constructor(t,e=Be.V5,i,s){this.schema=t,this.version=e,i&&(this._recordBatches=i),s&&(this._dictionaryBatches=s)}*recordBatches(){for(let t,e=-1,i=this.numRecordBatches;++e<i;)(t=this.getRecordBatch(e))&&(yield t)}*dictionaryBatches(){for(let t,e=-1,i=this.numDictionaries;++e<i;)(t=this.getDictionaryBatch(e))&&(yield t)}getRecordBatch(t){return t>=0&&t<this.numRecordBatches&&this._recordBatches[t]||null}getDictionaryBatch(t){return t>=0&&t<this.numDictionaries&&this._dictionaryBatches[t]||null}}class Zx extends eu{get numRecordBatches(){return this._footer.recordBatchesLength()}get numDictionaries(){return this._footer.dictionariesLength()}constructor(t,e){super(t,e.version()),this._footer=e}getRecordBatch(t){if(t>=0&&t<this.numRecordBatches){const e=this._footer.recordBatches(t);if(e)return lr.decode(e)}return null}getDictionaryBatch(t){if(t>=0&&t<this.numDictionaries){const e=this._footer.dictionaries(t);if(e)return lr.decode(e)}return null}}class lr{static decode(t){return new lr(t.metaDataLength(),t.bodyLength(),t.offset())}static encode(t,e){const{metaDataLength:i}=e,s=BigInt(e.offset),r=BigInt(e.bodyLength);return Ml.createBlock(t,s,i,r)}constructor(t,e,i){this.metaDataLength=t,this.offset=Re(i),this.bodyLength=Re(e)}}let Li=class Yn{constructor(){this.bb=null,this.bb_pos=0}__init(t,e){return this.bb_pos=t,this.bb=e,this}static getRootAsMessage(t,e){return(e||new Yn).__init(t.readInt32(t.position())+t.position(),t)}static getSizePrefixedRootAsMessage(t,e){return t.setPosition(t.position()+he),(e||new Yn).__init(t.readInt32(t.position())+t.position(),t)}version(){const t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt16(this.bb_pos+t):Be.V1}headerType(){const t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readUint8(this.bb_pos+t):le.NONE}header(t){const e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__union(t,this.bb_pos+e):null}bodyLength(){const t=this.bb.__offset(this.bb_pos,10);return t?this.bb.readInt64(this.bb_pos+t):BigInt("0")}customMetadata(t,e){const i=this.bb.__offset(this.bb_pos,12);return i?(e||new Ve).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+t*4),this.bb):null}customMetadataLength(){const t=this.bb.__offset(this.bb_pos,12);return t?this.bb.__vector_len(this.bb_pos+t):0}static startMessage(t){t.startObject(5)}static addVersion(t,e){t.addFieldInt16(0,e,Be.V1)}static addHeaderType(t,e){t.addFieldInt8(1,e,le.NONE)}static addHeader(t,e){t.addFieldOffset(2,e,0)}static addBodyLength(t,e){t.addFieldInt64(3,e,BigInt("0"))}static addCustomMetadata(t,e){t.addFieldOffset(4,e,0)}static createCustomMetadataVector(t,e){t.startVector(4,e.length,4);for(let i=e.length-1;i>=0;i--)t.addOffset(e[i]);return t.endVector()}static startCustomMetadataVector(t,e){t.startVector(4,e,4)}static endMessage(t){return t.endObject()}static finishMessageBuffer(t,e){t.finish(e)}static finishSizePrefixedMessageBuffer(t,e){t.finish(e,void 0,!0)}static createMessage(t,e,i,s,r,o){return Yn.startMessage(t),Yn.addVersion(t,e),Yn.addHeaderType(t,i),Yn.addHeader(t,s),Yn.addBodyLength(t,r),Yn.addCustomMetadata(t,o),Yn.endMessage(t)}};class Jx extends Jt{visit(t,e){return t==null||e==null?void 0:super.visit(t,e)}visitNull(t,e){return Dh.startNull(e),Dh.endNull(e)}visitInt(t,e){return gn.startInt(e),gn.addBitWidth(e,t.bitWidth),gn.addIsSigned(e,t.isSigned),gn.endInt(e)}visitFloat(t,e){return Jn.startFloatingPoint(e),Jn.addPrecision(e,t.precision),Jn.endFloatingPoint(e)}visitBinary(t,e){return wh.startBinary(e),wh.endBinary(e)}visitLargeBinary(t,e){return Rh.startLargeBinary(e),Rh.endLargeBinary(e)}visitBool(t,e){return Ah.startBool(e),Ah.endBool(e)}visitUtf8(t,e){return Ph.startUtf8(e),Ph.endUtf8(e)}visitLargeUtf8(t,e){return Ih.startLargeUtf8(e),Ih.endLargeUtf8(e)}visitDecimal(t,e){return Fs.startDecimal(e),Fs.addScale(e,t.scale),Fs.addPrecision(e,t.precision),Fs.addBitWidth(e,t.bitWidth),Fs.endDecimal(e)}visitDate(t,e){return ko.startDate(e),ko.addUnit(e,t.unit),ko.endDate(e)}visitTime(t,e){return wn.startTime(e),wn.addUnit(e,t.unit),wn.addBitWidth(e,t.bitWidth),wn.endTime(e)}visitTimestamp(t,e){const i=t.timezone&&e.createString(t.timezone)||void 0;return An.startTimestamp(e),An.addUnit(e,t.unit),i!==void 0&&An.addTimezone(e,i),An.endTimestamp(e)}visitInterval(t,e){return Qn.startInterval(e),Qn.addUnit(e,t.unit),Qn.endInterval(e)}visitDuration(t,e){return Ho.startDuration(e),Ho.addUnit(e,t.unit),Ho.endDuration(e)}visitList(t,e){return Ch.startList(e),Ch.endList(e)}visitStruct(t,e){return cs.startStruct_(e),cs.endStruct_(e)}visitUnion(t,e){cn.startTypeIdsVector(e,t.typeIds.length);const i=cn.createTypeIdsVector(e,t.typeIds);return cn.startUnion(e),cn.addMode(e,t.mode),cn.addTypeIds(e,i),cn.endUnion(e)}visitDictionary(t,e){const i=this.visit(t.indices,e);return xi.startDictionaryEncoding(e),xi.addId(e,BigInt(t.id)),xi.addIsOrdered(e,t.isOrdered),i!==void 0&&xi.addIndexType(e,i),xi.endDictionaryEncoding(e)}visitFixedSizeBinary(t,e){return Go.startFixedSizeBinary(e),Go.addByteWidth(e,t.byteWidth),Go.endFixedSizeBinary(e)}visitFixedSizeList(t,e){return Wo.startFixedSizeList(e),Wo.addListSize(e,t.listSize),Wo.endFixedSizeList(e)}visitMap(t,e){return Xo.startMap(e),Xo.addKeysSorted(e,t.keysSorted),Xo.endMap(e)}}const xc=new Jx;function Qx(n,t=new Map){return new ue(eb(n,t),jo(n.metadata),t)}function yp(n){return new vn(n.count,Sp(n.columns),xp(n.columns),null)}function tb(n){return new ai(yp(n.data),n.id,n.isDelta)}function eb(n,t){return(n.fields||[]).filter(Boolean).map(e=>Te.fromJSON(e,t))}function zh(n,t){return(n.children||[]).filter(Boolean).map(e=>Te.fromJSON(e,t))}function Sp(n){return(n||[]).reduce((t,e)=>[...t,new mr(e.count,nb(e.VALIDITY)),...Sp(e.children)],[])}function xp(n,t=[]){for(let e=-1,i=(n||[]).length;++e<i;){const s=n[e];s.VALIDITY&&t.push(new kn(t.length,s.VALIDITY.length)),s.TYPE_ID&&t.push(new kn(t.length,s.TYPE_ID.length)),s.OFFSET&&t.push(new kn(t.length,s.OFFSET.length)),s.DATA&&t.push(new kn(t.length,s.DATA.length)),t=xp(s.children,t)}return t}function nb(n){return(n||[]).reduce((t,e)=>t+ +(e===0),0)}function ib(n,t){let e,i,s,r,o,a;return!t||!(r=n.dictionary)?(o=kh(n,zh(n,t)),s=new Te(n.name,o,n.nullable,jo(n.metadata))):t.has(e=r.id)?(i=(i=r.indexType)?Vh(i):new Xr,a=new cr(t.get(e),i,e,r.isOrdered),s=new Te(n.name,a,n.nullable,jo(n.metadata))):(i=(i=r.indexType)?Vh(i):new Xr,t.set(e,o=kh(n,zh(n,t))),a=new cr(o,i,e,r.isOrdered),s=new Te(n.name,a,n.nullable,jo(n.metadata))),s||null}function jo(n=[]){return new Map(n.map(({key:t,value:e})=>[t,e]))}function Vh(n){return new ps(n.isSigned,n.bitWidth)}function kh(n,t){const e=n.type.name;switch(e){case"NONE":return new Gi;case"null":return new Gi;case"binary":return new ta;case"largebinary":return new ea;case"utf8":return new na;case"largeutf8":return new ia;case"bool":return new sa;case"list":return new ha((t||[])[0]);case"struct":return new tn(t||[]);case"struct_":return new tn(t||[])}switch(e){case"int":{const i=n.type;return new ps(i.isSigned,i.bitWidth)}case"floatingpoint":{const i=n.type;return new Qo(Ke[i.precision])}case"decimal":{const i=n.type;return new ra(i.scale,i.precision,i.bitWidth)}case"date":{const i=n.type;return new oa(Cn[i.unit])}case"time":{const i=n.type;return new aa(Ut[i.unit],i.bitWidth)}case"timestamp":{const i=n.type;return new ca(Ut[i.unit],i.timezone)}case"interval":{const i=n.type;return new la(Ye[i.unit])}case"duration":{const i=n.type;return new ua(Ut[i.unit])}case"union":{const i=n.type,[s,...r]=(i.mode+"").toLowerCase(),o=s.toUpperCase()+r.join("");return new da(un[o],i.typeIds||[],t||[])}case"fixedsizebinary":{const i=n.type;return new fa(i.byteWidth)}case"fixedsizelist":{const i=n.type;return new pa(i.listSize,(t||[])[0])}case"map":{const i=n.type;return new ma((t||[])[0],i.keysSorted)}}throw new Error(`Unrecognized type: "${e}"`)}var sb=zd,rb=ds;class On{static fromJSON(t,e){const i=new On(0,Be.V5,e);return i._createHeader=ob(t,e),i}static decode(t){t=new rb(ne(t));const e=Li.getRootAsMessage(t),i=e.bodyLength(),s=e.version(),r=e.headerType(),o=new On(i,s,r);return o._createHeader=ab(e,r),o}static encode(t){const e=new sb;let i=-1;return t.isSchema()?i=ue.encode(e,t.header()):t.isRecordBatch()?i=vn.encode(e,t.header()):t.isDictionaryBatch()&&(i=ai.encode(e,t.header())),Li.startMessage(e),Li.addVersion(e,Be.V5),Li.addHeader(e,i),Li.addHeaderType(e,t.headerType),Li.addBodyLength(e,BigInt(t.bodyLength)),Li.finishMessageBuffer(e,Li.endMessage(e)),e.asUint8Array()}static from(t,e=0){if(t instanceof ue)return new On(0,Be.V5,le.Schema,t);if(t instanceof vn)return new On(e,Be.V5,le.RecordBatch,t);if(t instanceof ai)return new On(e,Be.V5,le.DictionaryBatch,t);throw new Error(`Unrecognized Message header: ${t}`)}get type(){return this.headerType}get version(){return this._version}get headerType(){return this._headerType}get compression(){return this._compression}get bodyLength(){return this._bodyLength}header(){return this._createHeader()}isSchema(){return this.headerType===le.Schema}isRecordBatch(){return this.headerType===le.RecordBatch}isDictionaryBatch(){return this.headerType===le.DictionaryBatch}constructor(t,e,i,s){this._version=e,this._headerType=i,this.body=new Uint8Array(0),this._compression=s?.compression,s&&(this._createHeader=()=>s),this._bodyLength=Re(t)}}let vn=class{get nodes(){return this._nodes}get length(){return this._length}get buffers(){return this._buffers}get compression(){return this._compression}constructor(t,e,i,s){this._nodes=e,this._buffers=i,this._length=Re(t),this._compression=s}};class ai{get id(){return this._id}get data(){return this._data}get isDelta(){return this._isDelta}get length(){return this.data.length}get nodes(){return this.data.nodes}get buffers(){return this.data.buffers}constructor(t,e,i=!1){this._data=t,this._isDelta=i,this._id=Re(e)}}class kn{constructor(t,e){this.offset=Re(t),this.length=Re(e)}}class mr{constructor(t,e){this.length=Re(t),this.nullCount=Re(e)}}class nu{constructor(t,e=kr.BUFFER){this.type=t,this.method=e}}function ob(n,t){return(()=>{switch(t){case le.Schema:return ue.fromJSON(n);case le.RecordBatch:return vn.fromJSON(n);case le.DictionaryBatch:return ai.fromJSON(n)}throw new Error(`Unrecognized Message type: { name: ${le[t]}, type: ${t} }`)})}function ab(n,t){return(()=>{switch(t){case le.Schema:return ue.decode(n.header(new qn),new Map,n.version());case le.RecordBatch:return vn.decode(n.header(new jn),n.version());case le.DictionaryBatch:return ai.decode(n.header(new Us),n.version())}throw new Error(`Unrecognized Message type: { name: ${le[t]}, type: ${t} }`)})}Te.encode=vb;Te.decode=_b;Te.fromJSON=ib;ue.encode=gb;ue.decode=cb;ue.fromJSON=Qx;vn.encode=yb;vn.decode=lb;vn.fromJSON=yp;ai.encode=Sb;ai.decode=ub;ai.fromJSON=tb;mr.encode=xb;mr.decode=db;kn.encode=bb;kn.decode=hb;nu.encode=Mp;nu.decode=bp;function cb(n,t=new Map,e=Be.V5){const i=mb(n,t);return new ue(i,qo(n),t,e)}function lb(n,t=Be.V5){return new vn(n.length(),fb(n),pb(n,t),bp(n.compression()))}function ub(n,t=Be.V5){return new ai(vn.decode(n.data(),t),n.id(),n.isDelta())}function hb(n){return new kn(n.offset(),n.length())}function db(n){return new mr(n.length(),n.nullCount())}function fb(n){const t=[];for(let e,i=-1,s=-1,r=n.nodesLength();++i<r;)(e=n.nodes(i))&&(t[++s]=mr.decode(e));return t}function pb(n,t){const e=[];for(let i,s=-1,r=-1,o=n.buffersLength();++s<o;)(i=n.buffers(s))&&(t<Be.V4&&(i.bb_pos+=8*(s+1)),e[++r]=kn.decode(i));return e}function mb(n,t){const e=[];for(let i,s=-1,r=-1,o=n.fieldsLength();++s<o;)(i=n.fields(s))&&(e[++r]=Te.decode(i,t));return e}function Hh(n,t){const e=[];for(let i,s=-1,r=-1,o=n.childrenLength();++s<o;)(i=n.children(s))&&(e[++r]=Te.decode(i,t));return e}function _b(n,t){let e,i,s,r,o,a;return!t||!(a=n.dictionary())?(s=Wh(n,Hh(n,t)),i=new Te(n.name(),s,n.nullable(),qo(n))):t.has(e=Re(a.id()))?(r=(r=a.indexType())?Gh(r):new Xr,o=new cr(t.get(e),r,e,a.isOrdered()),i=new Te(n.name(),o,n.nullable(),qo(n))):(r=(r=a.indexType())?Gh(r):new Xr,t.set(e,s=Wh(n,Hh(n,t))),o=new cr(s,r,e,a.isOrdered()),i=new Te(n.name(),o,n.nullable(),qo(n))),i||null}function qo(n){const t=new Map;if(n)for(let e,i,s=-1,r=Math.trunc(n.customMetadataLength());++s<r;)(e=n.customMetadata(s))&&(i=e.key())!=null&&t.set(i,e.value());return t}function Gh(n){return new ps(n.isSigned(),n.bitWidth())}function Wh(n,t){const e=n.typeType();switch(e){case Me.NONE:return new Gi;case Me.Null:return new Gi;case Me.Binary:return new ta;case Me.LargeBinary:return new ea;case Me.Utf8:return new na;case Me.LargeUtf8:return new ia;case Me.Bool:return new sa;case Me.List:return new ha((t||[])[0]);case Me.Struct_:return new tn(t||[])}switch(e){case Me.Int:{const i=n.type(new gn);return new ps(i.isSigned(),i.bitWidth())}case Me.FloatingPoint:{const i=n.type(new Jn);return new Qo(i.precision())}case Me.Decimal:{const i=n.type(new Fs);return new ra(i.scale(),i.precision(),i.bitWidth())}case Me.Date:{const i=n.type(new ko);return new oa(i.unit())}case Me.Time:{const i=n.type(new wn);return new aa(i.unit(),i.bitWidth())}case Me.Timestamp:{const i=n.type(new An);return new ca(i.unit(),i.timezone())}case Me.Interval:{const i=n.type(new Qn);return new la(i.unit())}case Me.Duration:{const i=n.type(new Ho);return new ua(i.unit())}case Me.Union:{const i=n.type(new cn);return new da(i.mode(),i.typeIdsArray()||[],t||[])}case Me.FixedSizeBinary:{const i=n.type(new Go);return new fa(i.byteWidth())}case Me.FixedSizeList:{const i=n.type(new Wo);return new pa(i.listSize(),(t||[])[0])}case Me.Map:{const i=n.type(new Xo);return new ma((t||[])[0],i.keysSorted())}}throw new Error(`Unrecognized type: "${Me[e]}" (${e})`)}function bp(n){return n?new nu(n.codec(),n.method()):null}function gb(n,t){const e=t.fields.map(r=>Te.encode(n,r));qn.startFieldsVector(n,e.length);const i=qn.createFieldsVector(n,e),s=t.metadata&&t.metadata.size>0?qn.createCustomMetadataVector(n,[...t.metadata].map(([r,o])=>{const a=n.createString(`${r}`),c=n.createString(`${o}`);return Ve.startKeyValue(n),Ve.addKey(n,a),Ve.addValue(n,c),Ve.endKeyValue(n)})):-1;return qn.startSchema(n),qn.addFields(n,i),qn.addEndianness(n,Mb?ar.Little:ar.Big),s!==-1&&qn.addCustomMetadata(n,s),qn.endSchema(n)}function vb(n,t){let e=-1,i=-1,s=-1;const r=t.type;let o=t.typeId;St.isDictionary(r)?(o=r.dictionary.typeId,s=xc.visit(r,n),i=xc.visit(r.dictionary,n)):i=xc.visit(r,n);const a=(r.children||[]).map(u=>Te.encode(n,u)),c=bn.createChildrenVector(n,a),l=t.metadata&&t.metadata.size>0?bn.createCustomMetadataVector(n,[...t.metadata].map(([u,h])=>{const f=n.createString(`${u}`),p=n.createString(`${h}`);return Ve.startKeyValue(n),Ve.addKey(n,f),Ve.addValue(n,p),Ve.endKeyValue(n)})):-1;return t.name&&(e=n.createString(t.name)),bn.startField(n),bn.addType(n,i),bn.addTypeType(n,o),bn.addChildren(n,c),bn.addNullable(n,!!t.nullable),e!==-1&&bn.addName(n,e),s!==-1&&bn.addDictionary(n,s),l!==-1&&bn.addCustomMetadata(n,l),bn.endField(n)}function yb(n,t){const e=t.nodes||[],i=t.buffers||[];jn.startNodesVector(n,e.length);for(const a of e.slice().reverse())mr.encode(n,a);const s=n.endVector();jn.startBuffersVector(n,i.length);for(const a of i.slice().reverse())kn.encode(n,a);const r=n.endVector();let o=null;return t.compression!==null&&(o=Mp(n,t.compression)),jn.startRecordBatch(n),jn.addLength(n,BigInt(t.length)),jn.addNodes(n,s),jn.addBuffers(n,r),t.compression!==null&&o&&jn.addCompression(n,o),jn.endRecordBatch(n)}function Mp(n,t){return Ar.startBodyCompression(n),Ar.addCodec(n,t.type),Ar.addMethod(n,t.method),Ar.endBodyCompression(n)}function Sb(n,t){const e=vn.encode(n,t.data);return Us.startDictionaryBatch(n),Us.addId(n,BigInt(t.id)),Us.addIsDelta(n,t.isDelta),Us.addData(n,e),Us.endDictionaryBatch(n)}function xb(n,t){return Hd.createFieldNode(n,BigInt(t.length),BigInt(t.nullCount))}function bb(n,t){return kd.createBuffer(n,BigInt(t.offset),BigInt(t.length))}const Mb=(()=>{const n=new ArrayBuffer(2);return new DataView(n).setInt16(0,256,!0),new Int16Array(n)[0]===256})(),De=Object.freeze({done:!0,value:void 0});class Xh{constructor(t){this._json=t}get schema(){return this._json.schema}get batches(){return this._json.batches||[]}get dictionaries(){return this._json.dictionaries||[]}}class Ep{tee(){return this._getDOMStream().tee()}pipe(t,e){return this._getNodeStream().pipe(t,e)}pipeTo(t,e){return this._getDOMStream().pipeTo(t,e)}pipeThrough(t,e){return this._getDOMStream().pipeThrough(t,e)}_getDOMStream(){return this._DOMStream||(this._DOMStream=this.toDOMStream())}_getNodeStream(){return this._nodeStream||(this._nodeStream=this.toNodeStream())}}class Eb extends Ep{constructor(){super(),this._values=[],this.resolvers=[],this._closedPromise=new Promise(t=>this._closedPromiseResolve=t)}get closed(){return this._closedPromise}cancel(t){return Ht(this,void 0,void 0,function*(){yield this.return(t)})}write(t){this._ensureOpen()&&(this.resolvers.length<=0?this._values.push(t):this.resolvers.shift().resolve({done:!1,value:t}))}abort(t){this._closedPromiseResolve&&(this.resolvers.length<=0?this._error={error:t}:this.resolvers.shift().reject({done:!0,value:t}))}close(){if(this._closedPromiseResolve){const{resolvers:t}=this;for(;t.length>0;)t.shift().resolve(De);this._closedPromiseResolve(),this._closedPromiseResolve=void 0}}[Symbol.asyncIterator](){return this}toDOMStream(t){return En.toDOMStream(this._closedPromiseResolve||this._error?this:this._values,t)}toNodeStream(t){return En.toNodeStream(this._closedPromiseResolve||this._error?this:this._values,t)}throw(t){return Ht(this,void 0,void 0,function*(){return yield this.abort(t),De})}return(t){return Ht(this,void 0,void 0,function*(){return yield this.close(),De})}read(t){return Ht(this,void 0,void 0,function*(){return(yield this.next(t,"read")).value})}peek(t){return Ht(this,void 0,void 0,function*(){return(yield this.next(t,"peek")).value})}next(...t){return this._values.length>0?Promise.resolve({done:!1,value:this._values.shift()}):this._error?Promise.reject({done:!0,value:this._error.error}):this._closedPromiseResolve?new Promise((e,i)=>{this.resolvers.push({resolve:e,reject:i})}):Promise.resolve(De)}_ensureOpen(){if(this._closedPromiseResolve)return!0;throw new Error("AsyncQueue is closed")}}class Tb extends Eb{write(t){if((t=ne(t)).byteLength>0)return super.write(t)}toString(t=!1){return t?pl(this.toUint8Array(!0)):this.toUint8Array(!1).then(pl)}toUint8Array(t=!1){return t?oi(this._values)[0]:Ht(this,void 0,void 0,function*(){var e,i,s,r;const o=[];let a=0;try{for(var c=!0,l=Zs(this),u;u=yield l.next(),e=u.done,!e;c=!0){r=u.value,c=!1;const h=r;o.push(h),a+=h.byteLength}}catch(h){i={error:h}}finally{try{!c&&!e&&(s=l.return)&&(yield s.call(l))}finally{if(i)throw i.error}}return oi(o,a)[0]})}}class ya{constructor(t){t&&(this.source=new wb(En.fromIterable(t)))}[Symbol.iterator](){return this}next(t){return this.source.next(t)}throw(t){return this.source.throw(t)}return(t){return this.source.return(t)}peek(t){return this.source.peek(t)}read(t){return this.source.read(t)}}class ur{constructor(t){t instanceof ur?this.source=t.source:t instanceof Tb?this.source=new es(En.fromAsyncIterable(t)):Fd(t)?this.source=new es(En.fromNodeStream(t)):Wl(t)?this.source=new es(En.fromDOMStream(t)):Ud(t)?this.source=new es(En.fromDOMStream(t.body)):Pa(t)?this.source=new es(En.fromIterable(t)):Vr(t)?this.source=new es(En.fromAsyncIterable(t)):Gl(t)&&(this.source=new es(En.fromAsyncIterable(t)))}[Symbol.asyncIterator](){return this}next(t){return this.source.next(t)}throw(t){return this.source.throw(t)}return(t){return this.source.return(t)}get closed(){return this.source.closed}cancel(t){return this.source.cancel(t)}peek(t){return this.source.peek(t)}read(t){return this.source.read(t)}}class wb{constructor(t){this.source=t}cancel(t){this.return(t)}peek(t){return this.next(t,"peek").value}read(t){return this.next(t,"read").value}next(t,e="read"){return this.source.next({cmd:e,size:t})}throw(t){return Object.create(this.source.throw&&this.source.throw(t)||De)}return(t){return Object.create(this.source.return&&this.source.return(t)||De)}}class es{constructor(t){this.source=t,this._closedPromise=new Promise(e=>this._closedPromiseResolve=e)}cancel(t){return Ht(this,void 0,void 0,function*(){yield this.return(t)})}get closed(){return this._closedPromise}read(t){return Ht(this,void 0,void 0,function*(){return(yield this.next(t,"read")).value})}peek(t){return Ht(this,void 0,void 0,function*(){return(yield this.next(t,"peek")).value})}next(t){return Ht(this,arguments,void 0,function*(e,i="read"){return yield this.source.next({cmd:i,size:e})})}throw(t){return Ht(this,void 0,void 0,function*(){const e=this.source.throw&&(yield this.source.throw(t))||De;return this._closedPromiseResolve&&this._closedPromiseResolve(),this._closedPromiseResolve=void 0,Object.create(e)})}return(t){return Ht(this,void 0,void 0,function*(){const e=this.source.return&&(yield this.source.return(t))||De;return this._closedPromiseResolve&&this._closedPromiseResolve(),this._closedPromiseResolve=void 0,Object.create(e)})}}class Yh extends ya{constructor(t,e){super(),this.position=0,this.buffer=ne(t),this.size=e===void 0?this.buffer.byteLength:e}readInt32(t){const{buffer:e,byteOffset:i}=this.readAt(t,4);return new DataView(e,i).getInt32(0,!0)}seek(t){return this.position=Math.min(t,this.size),t<this.size}read(t){const{buffer:e,size:i,position:s}=this;return e&&s<i?(typeof t!="number"&&(t=Number.POSITIVE_INFINITY),this.position=Math.min(i,s+Math.min(i-s,t)),e.subarray(s,this.position)):null}readAt(t,e){const i=this.buffer,s=Math.min(this.size,t+e);return i?i.subarray(t,s):new Uint8Array(e)}close(){this.buffer&&(this.buffer=null)}throw(t){return this.close(),{done:!0,value:t}}return(t){return this.close(),{done:!0,value:t}}}class Sa extends ur{constructor(t,e){super(),this.position=0,this._handle=t,typeof e=="number"?this.size=e:this._pending=Ht(this,void 0,void 0,function*(){this.size=(yield t.stat()).size,delete this._pending})}readInt32(t){return Ht(this,void 0,void 0,function*(){const{buffer:e,byteOffset:i}=yield this.readAt(t,4);return new DataView(e,i).getInt32(0,!0)})}seek(t){return Ht(this,void 0,void 0,function*(){return this._pending&&(yield this._pending),this.position=Math.min(t,this.size),t<this.size})}read(t){return Ht(this,void 0,void 0,function*(){this._pending&&(yield this._pending);const{_handle:e,size:i,position:s}=this;if(e&&s<i){typeof t!="number"&&(t=Number.POSITIVE_INFINITY);let r=s,o=0,a=0;const c=Math.min(i,r+Math.min(i-r,t)),l=new Uint8Array(Math.max(0,(this.position=c)-r));for(;(r+=a)<c&&(o+=a)<l.byteLength;)({bytesRead:a}=yield e.read(l,o,l.byteLength-o,r));return l}return null})}readAt(t,e){return Ht(this,void 0,void 0,function*(){this._pending&&(yield this._pending);const{_handle:i,size:s}=this;if(i&&t+e<s){const r=Math.min(s,t+e),o=new Uint8Array(r-t);return(yield i.read(o,0,e,t)).buffer}return new Uint8Array(e)})}close(){return Ht(this,void 0,void 0,function*(){const t=this._handle;this._handle=null,t&&(yield t.close())})}throw(t){return Ht(this,void 0,void 0,function*(){return yield this.close(),{done:!0,value:t}})}return(t){return Ht(this,void 0,void 0,function*(){return yield this.close(),{done:!0,value:t}})}}const Ab=65536;function Ys(n){return n<0&&(n=4294967295+n+1),`0x${n.toString(16)}`}const hr=8,iu=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8];class Tp{constructor(t){this.buffer=t}high(){return this.buffer[1]}low(){return this.buffer[0]}_times(t){const e=new Uint32Array([this.buffer[1]>>>16,this.buffer[1]&65535,this.buffer[0]>>>16,this.buffer[0]&65535]),i=new Uint32Array([t.buffer[1]>>>16,t.buffer[1]&65535,t.buffer[0]>>>16,t.buffer[0]&65535]);let s=e[3]*i[3];this.buffer[0]=s&65535;let r=s>>>16;return s=e[2]*i[3],r+=s,s=e[3]*i[2]>>>0,r+=s,this.buffer[0]+=r<<16,this.buffer[1]=r>>>0<s?Ab:0,this.buffer[1]+=r>>>16,this.buffer[1]+=e[1]*i[3]+e[2]*i[2]+e[3]*i[1],this.buffer[1]+=e[0]*i[3]+e[1]*i[2]+e[2]*i[1]+e[3]*i[0]<<16,this}_plus(t){const e=this.buffer[0]+t.buffer[0]>>>0;this.buffer[1]+=t.buffer[1],e<this.buffer[0]>>>0&&++this.buffer[1],this.buffer[0]=e}lessThan(t){return this.buffer[1]<t.buffer[1]||this.buffer[1]===t.buffer[1]&&this.buffer[0]<t.buffer[0]}equals(t){return this.buffer[1]===t.buffer[1]&&this.buffer[0]==t.buffer[0]}greaterThan(t){return t.lessThan(this)}hex(){return`${Ys(this.buffer[1])} ${Ys(this.buffer[0])}`}}class fe extends Tp{times(t){return this._times(t),this}plus(t){return this._plus(t),this}static from(t,e=new Uint32Array(2)){return fe.fromString(typeof t=="string"?t:t.toString(),e)}static fromNumber(t,e=new Uint32Array(2)){return fe.fromString(t.toString(),e)}static fromString(t,e=new Uint32Array(2)){const i=t.length,s=new fe(e);for(let r=0;r<i;){const o=hr<i-r?hr:i-r,a=new fe(new Uint32Array([Number.parseInt(t.slice(r,r+o),10),0])),c=new fe(new Uint32Array([iu[o],0]));s.times(c),s.plus(a),r+=o}return s}static convertArray(t){const e=new Uint32Array(t.length*2);for(let i=-1,s=t.length;++i<s;)fe.from(t[i],new Uint32Array(e.buffer,e.byteOffset+2*i*4,2));return e}static multiply(t,e){return new fe(new Uint32Array(t.buffer)).times(e)}static add(t,e){return new fe(new Uint32Array(t.buffer)).plus(e)}}class an extends Tp{negate(){return this.buffer[0]=~this.buffer[0]+1,this.buffer[1]=~this.buffer[1],this.buffer[0]==0&&++this.buffer[1],this}times(t){return this._times(t),this}plus(t){return this._plus(t),this}lessThan(t){const e=this.buffer[1]<<0,i=t.buffer[1]<<0;return e<i||e===i&&this.buffer[0]<t.buffer[0]}static from(t,e=new Uint32Array(2)){return an.fromString(typeof t=="string"?t:t.toString(),e)}static fromNumber(t,e=new Uint32Array(2)){return an.fromString(t.toString(),e)}static fromString(t,e=new Uint32Array(2)){const i=t.startsWith("-"),s=t.length,r=new an(e);for(let o=i?1:0;o<s;){const a=hr<s-o?hr:s-o,c=new an(new Uint32Array([Number.parseInt(t.slice(o,o+a),10),0])),l=new an(new Uint32Array([iu[a],0]));r.times(l),r.plus(c),o+=a}return i?r.negate():r}static convertArray(t){const e=new Uint32Array(t.length*2);for(let i=-1,s=t.length;++i<s;)an.from(t[i],new Uint32Array(e.buffer,e.byteOffset+2*i*4,2));return e}static multiply(t,e){return new an(new Uint32Array(t.buffer)).times(e)}static add(t,e){return new an(new Uint32Array(t.buffer)).plus(e)}}class $n{constructor(t){this.buffer=t}high(){return new an(new Uint32Array(this.buffer.buffer,this.buffer.byteOffset+8,2))}low(){return new an(new Uint32Array(this.buffer.buffer,this.buffer.byteOffset,2))}negate(){return this.buffer[0]=~this.buffer[0]+1,this.buffer[1]=~this.buffer[1],this.buffer[2]=~this.buffer[2],this.buffer[3]=~this.buffer[3],this.buffer[0]==0&&++this.buffer[1],this.buffer[1]==0&&++this.buffer[2],this.buffer[2]==0&&++this.buffer[3],this}times(t){const e=new fe(new Uint32Array([this.buffer[3],0])),i=new fe(new Uint32Array([this.buffer[2],0])),s=new fe(new Uint32Array([this.buffer[1],0])),r=new fe(new Uint32Array([this.buffer[0],0])),o=new fe(new Uint32Array([t.buffer[3],0])),a=new fe(new Uint32Array([t.buffer[2],0])),c=new fe(new Uint32Array([t.buffer[1],0])),l=new fe(new Uint32Array([t.buffer[0],0]));let u=fe.multiply(r,l);this.buffer[0]=u.low();const h=new fe(new Uint32Array([u.high(),0]));return u=fe.multiply(s,l),h.plus(u),u=fe.multiply(r,c),h.plus(u),this.buffer[1]=h.low(),this.buffer[3]=h.lessThan(u)?1:0,this.buffer[2]=h.high(),new fe(new Uint32Array(this.buffer.buffer,this.buffer.byteOffset+8,2)).plus(fe.multiply(i,l)).plus(fe.multiply(s,c)).plus(fe.multiply(r,a)),this.buffer[3]+=fe.multiply(e,l).plus(fe.multiply(i,c)).plus(fe.multiply(s,a)).plus(fe.multiply(r,o)).low(),this}plus(t){const e=new Uint32Array(4);return e[3]=this.buffer[3]+t.buffer[3]>>>0,e[2]=this.buffer[2]+t.buffer[2]>>>0,e[1]=this.buffer[1]+t.buffer[1]>>>0,e[0]=this.buffer[0]+t.buffer[0]>>>0,e[0]<this.buffer[0]>>>0&&++e[1],e[1]<this.buffer[1]>>>0&&++e[2],e[2]<this.buffer[2]>>>0&&++e[3],this.buffer[3]=e[3],this.buffer[2]=e[2],this.buffer[1]=e[1],this.buffer[0]=e[0],this}hex(){return`${Ys(this.buffer[3])} ${Ys(this.buffer[2])} ${Ys(this.buffer[1])} ${Ys(this.buffer[0])}`}static multiply(t,e){return new $n(new Uint32Array(t.buffer)).times(e)}static add(t,e){return new $n(new Uint32Array(t.buffer)).plus(e)}static from(t,e=new Uint32Array(4)){return $n.fromString(typeof t=="string"?t:t.toString(),e)}static fromNumber(t,e=new Uint32Array(4)){return $n.fromString(t.toString(),e)}static fromString(t,e=new Uint32Array(4)){const i=t.startsWith("-"),s=t.length,r=new $n(e);for(let o=i?1:0;o<s;){const a=hr<s-o?hr:s-o,c=new $n(new Uint32Array([Number.parseInt(t.slice(o,o+a),10),0,0,0])),l=new $n(new Uint32Array([iu[a],0,0,0]));r.times(l),r.plus(c),o+=a}return i?r.negate():r}static convertArray(t){const e=new Uint32Array(t.length*4);for(let i=-1,s=t.length;++i<s;)$n.from(t[i],new Uint32Array(e.buffer,e.byteOffset+16*i,4));return e}}function Rb(n){var t,e;const i=n.length,s=new Int32Array(i*2);for(let r=0,o=0;r<i;r++){const a=n[r];s[o++]=(t=a.days)!==null&&t!==void 0?t:0,s[o++]=(e=a.milliseconds)!==null&&e!==void 0?e:0}return s}function Ib(n){var t,e;const i=n.length,s=new Int32Array(i*4);for(let r=0,o=0;r<i;r++){const a=n[r];s[o++]=(t=a.months)!==null&&t!==void 0?t:0,s[o++]=(e=a.days)!==null&&e!==void 0?e:0;const c=a.nanoseconds;c?(s[o++]=Number(BigInt(c)&BigInt(4294967295)),s[o++]=Number(BigInt(c)>>BigInt(32))):o+=2}return s}class su extends Jt{constructor(t,e,i,s,r=Be.V5){super(),this.nodesIndex=-1,this.buffersIndex=-1,this.bytes=t,this.nodes=e,this.buffers=i,this.dictionaries=s,this.metadataVersion=r}visit(t){return super.visit(t instanceof Te?t.type:t)}visitNull(t,{length:e}=this.nextFieldNode()){return Qt({type:t,length:e})}visitBool(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitInt(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitFloat(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitUtf8(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitLargeUtf8(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitBinary(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitLargeBinary(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),data:this.readData(t)})}visitFixedSizeBinary(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitDate(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitTimestamp(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitTime(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitDecimal(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitList(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),child:this.visit(t.children[0])})}visitStruct(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),children:this.visitMany(t.children)})}visitUnion(t,{length:e,nullCount:i}=this.nextFieldNode()){return this.metadataVersion<Be.V5&&this.readNullBitmap(t,i),t.mode===un.Sparse?this.visitSparseUnion(t,{length:e,nullCount:i}):this.visitDenseUnion(t,{length:e,nullCount:i})}visitDenseUnion(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,typeIds:this.readTypeIds(t),valueOffsets:this.readOffsets(t),children:this.visitMany(t.children)})}visitSparseUnion(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,typeIds:this.readTypeIds(t),children:this.visitMany(t.children)})}visitDictionary(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t.indices),dictionary:this.readDictionary(t)})}visitInterval(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitDuration(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),data:this.readData(t)})}visitFixedSizeList(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),child:this.visit(t.children[0])})}visitMap(t,{length:e,nullCount:i}=this.nextFieldNode()){return Qt({type:t,length:e,nullCount:i,nullBitmap:this.readNullBitmap(t,i),valueOffsets:this.readOffsets(t),child:this.visit(t.children[0])})}nextFieldNode(){return this.nodes[++this.nodesIndex]}nextBufferRange(){return this.buffers[++this.buffersIndex]}readNullBitmap(t,e,i=this.nextBufferRange()){return e>0&&this.readData(t,i)||new Uint8Array(0)}readOffsets(t,e){return this.readData(t,e)}readTypeIds(t,e){return this.readData(t,e)}readData(t,{length:e,offset:i}=this.nextBufferRange()){return this.bytes.subarray(i,i+e)}readDictionary(t){return this.dictionaries.get(t.id)}}class Cb extends su{constructor(t,e,i,s,r){super(new Uint8Array(0),e,i,s,r),this.sources=t}readNullBitmap(t,e,{offset:i}=this.nextBufferRange()){return e<=0?new Uint8Array(0):xl(this.sources[i])}readOffsets(t,{offset:e}=this.nextBufferRange()){return pe(Uint8Array,pe(t.OffsetArrayType,this.sources[e]))}readTypeIds(t,{offset:e}=this.nextBufferRange()){return pe(Uint8Array,pe(t.ArrayType,this.sources[e]))}readData(t,{offset:e}=this.nextBufferRange()){const{sources:i}=this;if(St.isTimestamp(t))return pe(Uint8Array,an.convertArray(i[e]));if((St.isInt(t)||St.isTime(t))&&t.bitWidth===64||St.isDuration(t))return pe(Uint8Array,an.convertArray(i[e]));if(St.isDate(t)&&t.unit===Cn.MILLISECOND)return pe(Uint8Array,an.convertArray(i[e]));if(St.isDecimal(t))return pe(Uint8Array,$n.convertArray(i[e]));if(St.isBinary(t)||St.isLargeBinary(t)||St.isFixedSizeBinary(t))return Db(i[e]);if(St.isBool(t))return xl(i[e]);if(St.isUtf8(t)||St.isLargeUtf8(t))return Hl(i[e].join(""));if(St.isInterval(t))switch(t.unit){case Ye.DAY_TIME:return Rb(i[e]);case Ye.MONTH_DAY_NANO:return Ib(i[e])}return pe(Uint8Array,pe(t.ArrayType,i[e].map(s=>+s)))}}function Db(n){const t=n.join(""),e=new Uint8Array(t.length/2);for(let i=0;i<t.length;i+=2)e[i>>1]=Number.parseInt(t.slice(i,i+2),16);return e}class Pb extends su{constructor(t,e,i,s,r){super(new Uint8Array(0),e,i,s,r),this.bodyChunks=t}readData(t,e=this.nextBufferRange()){return this.bodyChunks[this.buffersIndex]}}class Rt extends Jt{compareSchemas(t,e){return t===e||e instanceof t.constructor&&this.compareManyFields(t.fields,e.fields)}compareManyFields(t,e){return t===e||Array.isArray(t)&&Array.isArray(e)&&t.length===e.length&&t.every((i,s)=>this.compareFields(i,e[s]))}compareFields(t,e){return t===e||e instanceof t.constructor&&t.name===e.name&&t.nullable===e.nullable&&this.visit(t.type,e.type)}}function nn(n,t){return t instanceof n.constructor}function _s(n,t){return n===t||nn(n,t)}function wi(n,t){return n===t||nn(n,t)&&n.bitWidth===t.bitWidth&&n.isSigned===t.isSigned}function Ua(n,t){return n===t||nn(n,t)&&n.precision===t.precision}function Lb(n,t){return n===t||nn(n,t)&&n.byteWidth===t.byteWidth}function ru(n,t){return n===t||nn(n,t)&&n.unit===t.unit}function Zr(n,t){return n===t||nn(n,t)&&n.unit===t.unit&&n.timezone===t.timezone}function Jr(n,t){return n===t||nn(n,t)&&n.unit===t.unit&&n.bitWidth===t.bitWidth}function Ub(n,t){return n===t||nn(n,t)&&n.children.length===t.children.length&&Wi.compareManyFields(n.children,t.children)}function Nb(n,t){return n===t||nn(n,t)&&n.children.length===t.children.length&&Wi.compareManyFields(n.children,t.children)}function ou(n,t){return n===t||nn(n,t)&&n.mode===t.mode&&n.typeIds.every((e,i)=>e===t.typeIds[i])&&Wi.compareManyFields(n.children,t.children)}function Fb(n,t){return n===t||nn(n,t)&&n.id===t.id&&n.isOrdered===t.isOrdered&&Wi.visit(n.indices,t.indices)&&Wi.visit(n.dictionary,t.dictionary)}function Na(n,t){return n===t||nn(n,t)&&n.unit===t.unit}function Qr(n,t){return n===t||nn(n,t)&&n.unit===t.unit}function Ob(n,t){return n===t||nn(n,t)&&n.listSize===t.listSize&&n.children.length===t.children.length&&Wi.compareManyFields(n.children,t.children)}function Bb(n,t){return n===t||nn(n,t)&&n.keysSorted===t.keysSorted&&n.children.length===t.children.length&&Wi.compareManyFields(n.children,t.children)}Rt.prototype.visitNull=_s;Rt.prototype.visitBool=_s;Rt.prototype.visitInt=wi;Rt.prototype.visitInt8=wi;Rt.prototype.visitInt16=wi;Rt.prototype.visitInt32=wi;Rt.prototype.visitInt64=wi;Rt.prototype.visitUint8=wi;Rt.prototype.visitUint16=wi;Rt.prototype.visitUint32=wi;Rt.prototype.visitUint64=wi;Rt.prototype.visitFloat=Ua;Rt.prototype.visitFloat16=Ua;Rt.prototype.visitFloat32=Ua;Rt.prototype.visitFloat64=Ua;Rt.prototype.visitUtf8=_s;Rt.prototype.visitLargeUtf8=_s;Rt.prototype.visitBinary=_s;Rt.prototype.visitLargeBinary=_s;Rt.prototype.visitFixedSizeBinary=Lb;Rt.prototype.visitDate=ru;Rt.prototype.visitDateDay=ru;Rt.prototype.visitDateMillisecond=ru;Rt.prototype.visitTimestamp=Zr;Rt.prototype.visitTimestampSecond=Zr;Rt.prototype.visitTimestampMillisecond=Zr;Rt.prototype.visitTimestampMicrosecond=Zr;Rt.prototype.visitTimestampNanosecond=Zr;Rt.prototype.visitTime=Jr;Rt.prototype.visitTimeSecond=Jr;Rt.prototype.visitTimeMillisecond=Jr;Rt.prototype.visitTimeMicrosecond=Jr;Rt.prototype.visitTimeNanosecond=Jr;Rt.prototype.visitDecimal=_s;Rt.prototype.visitList=Ub;Rt.prototype.visitStruct=Nb;Rt.prototype.visitUnion=ou;Rt.prototype.visitDenseUnion=ou;Rt.prototype.visitSparseUnion=ou;Rt.prototype.visitDictionary=Fb;Rt.prototype.visitInterval=Na;Rt.prototype.visitIntervalDayTime=Na;Rt.prototype.visitIntervalYearMonth=Na;Rt.prototype.visitIntervalMonthDayNano=Na;Rt.prototype.visitDuration=Qr;Rt.prototype.visitDurationSecond=Qr;Rt.prototype.visitDurationMillisecond=Qr;Rt.prototype.visitDurationMicrosecond=Qr;Rt.prototype.visitDurationNanosecond=Qr;Rt.prototype.visitFixedSizeList=Ob;Rt.prototype.visitMap=Bb;const Wi=new Rt;function zb(n,t){return Wi.compareSchemas(n,t)}function bc(n,t){return Vb(n,t.map(e=>e.data.concat()))}function Vb(n,t){const e=[...n.fields],i=[],s={numBatches:t.reduce((h,f)=>Math.max(h,f.length),0)};let r=0,o=0,a=-1;const c=t.length;let l,u=[];for(;s.numBatches-- >0;){for(o=Number.POSITIVE_INFINITY,a=-1;++a<c;)u[a]=l=t[a].shift(),o=Math.min(o,l?l.length:o);Number.isFinite(o)&&(u=kb(e,o,u,t,s),o>0&&(i[r++]=Qt({type:new tn(e),length:o,nullCount:0,children:u.slice()})))}return[n=n.assign(e),i.map(h=>new $e(n,h))]}function kb(n,t,e,i,s){var r;const o=(t+63&-64)>>3;for(let a=-1,c=i.length;++a<c;){const l=e[a],u=l?.length;if(u>=t)u===t?e[a]=l:(e[a]=l.slice(0,t),s.numBatches=Math.max(s.numBatches,i[a].unshift(l.slice(t,u-t))));else{const h=n[a];n[a]=h.clone({nullable:!0}),e[a]=(r=l?._changeLengthAndBackfillNullBitmap(t))!==null&&r!==void 0?r:Qt({type:h.type,length:t,nullCount:t,nullBitmap:new Uint8Array(o)})}}return e}var wp;class Rn{constructor(...t){var e,i;if(t.length===0)return this.batches=[],this.schema=new ue([]),this._offsets=[0],this;let s,r;t[0]instanceof ue&&(s=t.shift()),t.at(-1)instanceof Uint32Array&&(r=t.pop());const o=c=>{if(c){if(c instanceof $e)return[c];if(c instanceof Rn)return c.batches;if(c instanceof de){if(c.type instanceof tn)return[new $e(new ue(c.type.children),c)]}else{if(Array.isArray(c))return c.flatMap(l=>o(l));if(typeof c[Symbol.iterator]=="function")return[...c].flatMap(l=>o(l));if(typeof c=="object"){const l=Object.keys(c),u=l.map(p=>new ve([c[p]])),h=s??new ue(l.map((p,g)=>new Te(String(p),u[g].type,u[g].nullable))),[,f]=bc(h,u);return f.length===0?[new $e(c)]:f}}}return[]},a=t.flatMap(c=>o(c));if(s=(i=s??((e=a[0])===null||e===void 0?void 0:e.schema))!==null&&i!==void 0?i:new ue([]),!(s instanceof ue))throw new TypeError("Table constructor expects a [Schema, RecordBatch[]] pair.");for(const c of a){if(!(c instanceof $e))throw new TypeError("Table constructor expects a [Schema, RecordBatch[]] pair.");if(!zb(s,c.schema))throw new TypeError("Table and inner RecordBatch schemas must be equivalent.")}this.schema=s,this.batches=a,this._offsets=r??hp(this.data)}get data(){return this.batches.map(({data:t})=>t)}get numCols(){return this.schema.fields.length}get numRows(){return this.data.reduce((t,e)=>t+e.length,0)}get nullCount(){return this._nullCount===-1&&(this._nullCount=up(this.data)),this._nullCount}isValid(t){return!1}get(t){return null}at(t){return this.get(Kl(t,this.numRows))}set(t,e){}indexOf(t,e){return-1}[Symbol.iterator](){return this.batches.length>0?tu.visit(new ve(this.data)):new Array(0)[Symbol.iterator]()}toArray(){return[...this]}toString(){return`[
  ${this.toArray().join(`,
  `)}
]`}concat(...t){const e=this.schema,i=this.data.concat(t.flatMap(({data:s})=>s));return new Rn(e,i.map(s=>new $e(e,s)))}slice(t,e){const i=this.schema;[t,e]=cp({length:this.numRows},t,e);const s=dp(this.data,this._offsets,t,e);return new Rn(i,s.map(r=>new $e(i,r)))}getChild(t){return this.getChildAt(this.schema.fields.findIndex(e=>e.name===t))}getChildAt(t){if(t>-1&&t<this.schema.fields.length){const e=this.data.map(i=>i.children[t]);if(e.length===0){const{type:i}=this.schema.fields[t],s=Qt({type:i,length:0,nullCount:0});e.push(s._changeLengthAndBackfillNullBitmap(this.numRows))}return new ve(e)}return null}setChild(t,e){var i;return this.setChildAt((i=this.schema.fields)===null||i===void 0?void 0:i.findIndex(s=>s.name===t),e)}setChildAt(t,e){let i=this.schema,s=[...this.batches];if(t>-1&&t<this.numCols){e||(e=new ve([Qt({type:new Gi,length:this.numRows})]));const r=i.fields.slice(),o=r[t].clone({type:e.type}),a=this.schema.fields.map((c,l)=>this.getChildAt(l));[r[t],a[t]]=[o,e],[i,s]=bc(i,a)}return new Rn(i,s)}select(t){const e=this.schema.fields.reduce((i,s,r)=>i.set(s.name,r),new Map);return this.selectAt(t.map(i=>e.get(i)).filter(i=>i>-1))}selectAt(t){const e=this.schema.selectAt(t),i=this.batches.map(s=>s.selectAt(t));return new Rn(e,i)}assign(t){const e=this.schema.fields,[i,s]=t.schema.fields.reduce((a,c,l)=>{const[u,h]=a,f=e.findIndex(p=>p.name===c.name);return~f?h[f]=l:u.push(l),a},[[],[]]),r=this.schema.assign(t.schema),o=[...e.map((a,c)=>[c,s[c]]).map(([a,c])=>c===void 0?this.getChildAt(a):t.getChildAt(c)),...i.map(a=>t.getChildAt(a))].filter(Boolean);return new Rn(...bc(r,o))}}wp=Symbol.toStringTag;Rn[wp]=(n=>(n.schema=null,n.batches=[],n._offsets=new Uint32Array([0]),n._nullCount=-1,n[Symbol.isConcatSpreadable]=!0,n.isValid=_a(Ql),n.get=_a(hn.getVisitFn(I.Struct)),n.set=fp(Dn.getVisitFn(I.Struct)),n.indexOf=pp(ga.getVisitFn(I.Struct)),"Table"))(Rn.prototype);var Ap;class $e{constructor(...t){switch(t.length){case 2:{if([this.schema]=t,!(this.schema instanceof ue))throw new TypeError("RecordBatch constructor expects a [Schema, Data] pair.");if([,this.data=Qt({nullCount:0,type:new tn(this.schema.fields),children:this.schema.fields.map(e=>Qt({type:e.type,nullCount:0}))})]=t,!(this.data instanceof de))throw new TypeError("RecordBatch constructor expects a [Schema, Data] pair.");[this.schema,this.data]=jh(this.schema,this.data.children);break}case 1:{const[e]=t,{fields:i,children:s,length:r}=Object.keys(e).reduce((c,l,u)=>(c.children[u]=e[l],c.length=Math.max(c.length,e[l].length),c.fields[u]=Te.new({name:l,type:e[l].type,nullable:!0}),c),{length:0,fields:new Array,children:new Array}),o=new ue(i),a=Qt({type:new tn(i),length:r,children:s,nullCount:0});[this.schema,this.data]=jh(o,a.children,r);break}default:throw new TypeError("RecordBatch constructor expects an Object mapping names to child Data, or a [Schema, Data] pair.")}}get dictionaries(){return this._dictionaries||(this._dictionaries=Rp(this.schema.fields,this.data.children))}get numCols(){return this.schema.fields.length}get numRows(){return this.data.length}get nullCount(){return this.data.nullCount}isValid(t){return this.data.getValid(t)}get(t){return hn.visit(this.data,t)}at(t){return this.get(Kl(t,this.numRows))}set(t,e){return Dn.visit(this.data,t,e)}indexOf(t,e){return ga.visit(this.data,t,e)}[Symbol.iterator](){return tu.visit(new ve([this.data]))}toArray(){return[...this]}concat(...t){return new Rn(this.schema,[this,...t])}slice(t,e){const[i]=new ve([this.data]).slice(t,e).data;return new $e(this.schema,i)}getChild(t){var e;return this.getChildAt((e=this.schema.fields)===null||e===void 0?void 0:e.findIndex(i=>i.name===t))}getChildAt(t){return t>-1&&t<this.schema.fields.length?new ve([this.data.children[t]]):null}setChild(t,e){var i;return this.setChildAt((i=this.schema.fields)===null||i===void 0?void 0:i.findIndex(s=>s.name===t),e)}setChildAt(t,e){let i=this.schema,s=this.data;if(t>-1&&t<this.numCols){e||(e=new ve([Qt({type:new Gi,length:this.numRows})]));const r=i.fields.slice(),o=s.children.slice(),a=r[t].clone({type:e.type});[r[t],o[t]]=[a,e.data[0]],i=new ue(r,new Map(this.schema.metadata)),s=Qt({type:new tn(r),children:o})}return new $e(i,s)}select(t){const e=this.schema.select(t),i=new tn(e.fields),s=[];for(const r of t){const o=this.schema.fields.findIndex(a=>a.name===r);~o&&(s[o]=this.data.children[o])}return new $e(e,Qt({type:i,length:this.numRows,children:s}))}selectAt(t){const e=this.schema.selectAt(t),i=t.map(r=>this.data.children[r]).filter(Boolean),s=Qt({type:new tn(e.fields),length:this.numRows,children:i});return new $e(e,s)}}Ap=Symbol.toStringTag;$e[Ap]=(n=>(n._nullCount=-1,n[Symbol.isConcatSpreadable]=!0,"RecordBatch"))($e.prototype);function jh(n,t,e=t.reduce((i,s)=>Math.max(i,s.length),0)){var i;const s=[...n.fields],r=[...t],o=(e+63&-64)>>3;for(const[a,c]of n.fields.entries()){const l=t[a];(!l||l.length!==e)&&(s[a]=c.clone({nullable:!0}),r[a]=(i=l?._changeLengthAndBackfillNullBitmap(e))!==null&&i!==void 0?i:Qt({type:c.type,length:e,nullCount:e,nullBitmap:new Uint8Array(o)}))}return[n.assign(s),Qt({type:new tn(s),length:e,children:r})]}function Rp(n,t,e=new Map){var i,s;if(((i=n?.length)!==null&&i!==void 0?i:0)>0&&n?.length===t?.length)for(let r=-1,o=n.length;++r<o;){const{type:a}=n[r],c=t[r];for(const l of[c,...((s=c?.dictionary)===null||s===void 0?void 0:s.data)||[]])Rp(a.children,l?.children,e);if(St.isDictionary(a)){const{id:l}=a;if(!e.has(l))c?.dictionary&&e.set(l,c.dictionary);else if(e.get(l)!==c.dictionary)throw new Error("Cannot create Schema containing two different dictionaries with the same Id")}}return e}class Ip extends $e{constructor(t){const e=t.fields.map(s=>Qt({type:s.type})),i=Qt({type:new tn(t.fields),nullCount:0,children:e});super(t,i)}}const au=n=>`Expected ${le[n]} Message in stream, but was null or length 0.`,cu=n=>`Header pointer of flatbuffer-encoded ${le[n]} Message is null or length 0.`,Cp=(n,t)=>`Expected to read ${n} metadata bytes, but only read ${t}.`,Dp=(n,t)=>`Expected to read ${n} bytes for message body, but only read ${t}.`;class Pp{constructor(t){this.source=t instanceof ya?t:new ya(t)}[Symbol.iterator](){return this}next(){let t;return(t=this.readMetadataLength()).done||t.value===-1&&(t=this.readMetadataLength()).done||(t=this.readMetadata(t.value)).done?De:t}throw(t){return this.source.throw(t)}return(t){return this.source.return(t)}readMessage(t){let e;if((e=this.next()).done)return null;if(t!=null&&e.value.headerType!==t)throw new Error(au(t));return e.value}readMessageBody(t){if(t<=0)return new Uint8Array(0);const e=ne(this.source.read(t));if(e.byteLength<t)throw new Error(Dp(t,e.byteLength));return e.byteOffset%8===0&&e.byteOffset+e.byteLength<=e.buffer.byteLength?e:e.slice()}readSchema(t=!1){const e=le.Schema,i=this.readMessage(e),s=i?.header();if(t&&!s)throw new Error(cu(e));return s}readMetadataLength(){const t=this.source.read(Fa),e=t&&new ds(t),i=e?.readInt32(0)||0;return{done:i===0,value:i}}readMetadata(t){const e=this.source.read(t);if(!e)return De;if(e.byteLength<t)throw new Error(Cp(t,e.byteLength));return{done:!1,value:On.decode(e)}}}class Hb{constructor(t,e){this.source=t instanceof ur?t:Ld(t)?new Sa(t,e):new ur(t)}[Symbol.asyncIterator](){return this}next(){return Ht(this,void 0,void 0,function*(){let t;return(t=yield this.readMetadataLength()).done||t.value===-1&&(t=yield this.readMetadataLength()).done||(t=yield this.readMetadata(t.value)).done?De:t})}throw(t){return Ht(this,void 0,void 0,function*(){return yield this.source.throw(t)})}return(t){return Ht(this,void 0,void 0,function*(){return yield this.source.return(t)})}readMessage(t){return Ht(this,void 0,void 0,function*(){let e;if((e=yield this.next()).done)return null;if(t!=null&&e.value.headerType!==t)throw new Error(au(t));return e.value})}readMessageBody(t){return Ht(this,void 0,void 0,function*(){if(t<=0)return new Uint8Array(0);const e=ne(yield this.source.read(t));if(e.byteLength<t)throw new Error(Dp(t,e.byteLength));return e.byteOffset%8===0&&e.byteOffset+e.byteLength<=e.buffer.byteLength?e:e.slice()})}readSchema(){return Ht(this,arguments,void 0,function*(t=!1){const e=le.Schema,i=yield this.readMessage(e),s=i?.header();if(t&&!s)throw new Error(cu(e));return s})}readMetadataLength(){return Ht(this,void 0,void 0,function*(){const t=yield this.source.read(Fa),e=t&&new ds(t),i=e?.readInt32(0)||0;return{done:i===0,value:i}})}readMetadata(t){return Ht(this,void 0,void 0,function*(){const e=yield this.source.read(t);if(!e)return De;if(e.byteLength<t)throw new Error(Cp(t,e.byteLength));return{done:!1,value:On.decode(e)}})}}class Gb extends Pp{constructor(t){super(new Uint8Array(0)),this._schema=!1,this._body=[],this._batchIndex=0,this._dictionaryIndex=0,this._json=t instanceof Xh?t:new Xh(t)}next(){const{_json:t}=this;if(!this._schema)return this._schema=!0,{done:!1,value:On.fromJSON(t.schema,le.Schema)};if(this._dictionaryIndex<t.dictionaries.length){const e=t.dictionaries[this._dictionaryIndex++];return this._body=e.data.columns,{done:!1,value:On.fromJSON(e,le.DictionaryBatch)}}if(this._batchIndex<t.batches.length){const e=t.batches[this._batchIndex++];return this._body=e.columns,{done:!1,value:On.fromJSON(e,le.RecordBatch)}}return this._body=[],De}readMessageBody(t){return e(this._body);function e(i){return(i||[]).reduce((s,r)=>[...s,...r.VALIDITY&&[r.VALIDITY]||[],...r.TYPE_ID&&[r.TYPE_ID]||[],...r.OFFSET&&[r.OFFSET]||[],...r.DATA&&[r.DATA]||[],...e(r.children)],[])}}readMessage(t){let e;if((e=this.next()).done)return null;if(t!=null&&e.value.headerType!==t)throw new Error(au(t));return e.value}readSchema(){const t=le.Schema,e=this.readMessage(t),i=e?.header();if(!e||!i)throw new Error(cu(t));return i}}const Fa=4,Tl="ARROW1",xa=new Uint8Array(Tl.length);for(let n=0;n<Tl.length;n+=1)xa[n]=Tl.codePointAt(n);function lu(n,t=0){for(let e=-1,i=xa.length;++e<i;)if(xa[e]!==n[t+e])return!1;return!0}const to=xa.length,Lp=to+Fa,Wb=to*2+Fa;class Xb{constructor(){this.LZ4_FRAME_MAGIC=new Uint8Array([4,34,77,24]),this.MIN_HEADER_LENGTH=7}isValidCodecEncode(t){const e=new Uint8Array([1,2,3,4,5,6,7,8]),i=t.encode(e);return this._isValidCompressed(i)}_isValidCompressed(t){return this._hasMinimumLength(t)&&this._hasValidMagicNumber(t)&&this._hasValidVersion(t)}_hasMinimumLength(t){return t.length>=this.MIN_HEADER_LENGTH}_hasValidMagicNumber(t){return this.LZ4_FRAME_MAGIC.every((e,i)=>t[i]===e)}_hasValidVersion(t){return(t[4]&192)>>6===1}}class Yb{constructor(){this.ZSTD_MAGIC=new Uint8Array([40,181,47,253]),this.MIN_HEADER_LENGTH=6}isValidCodecEncode(t){const e=new Uint8Array([1,2,3,4,5,6,7,8]),i=t.encode(e);return this._isValidCompressed(i)}_isValidCompressed(t){return this._hasMinimumLength(t)&&this._hasValidMagicNumber(t)}_hasMinimumLength(t){return t.length>=this.MIN_HEADER_LENGTH}_hasValidMagicNumber(t){return this.ZSTD_MAGIC.every((e,i)=>t[i]===e)}}const jb={[fs.LZ4_FRAME]:new Xb,[fs.ZSTD]:new Yb};class qb{constructor(){this.registry={}}set(t,e){if(e?.encode&&typeof e.encode=="function"&&!jb[t].isValidCodecEncode(e))throw new Error(`Encoder for ${fs[t]} is not valid.`);this.registry[t]=e}get(t){var e;return((e=this.registry)===null||e===void 0?void 0:e[t])||null}}const qh=new qb,$b=-1,Kb=8;class Ei extends Ep{constructor(t){super(),this._impl=t}get closed(){return this._impl.closed}get schema(){return this._impl.schema}get autoDestroy(){return this._impl.autoDestroy}get dictionaries(){return this._impl.dictionaries}get numDictionaries(){return this._impl.numDictionaries}get numRecordBatches(){return this._impl.numRecordBatches}get footer(){return this._impl.isFile()?this._impl.footer:null}isSync(){return this._impl.isSync()}isAsync(){return this._impl.isAsync()}isFile(){return this._impl.isFile()}isStream(){return this._impl.isStream()}next(){return this._impl.next()}throw(t){return this._impl.throw(t)}return(t){return this._impl.return(t)}cancel(){return this._impl.cancel()}reset(t){return this._impl.reset(t),this._DOMStream=void 0,this._nodeStream=void 0,this}open(t){const e=this._impl.open(t);return Vr(e)?e.then(()=>this):this}readRecordBatch(t){return this._impl.isFile()?this._impl.readRecordBatch(t):null}[Symbol.iterator](){return this._impl[Symbol.iterator]()}[Symbol.asyncIterator](){return this._impl[Symbol.asyncIterator]()}toDOMStream(){return En.toDOMStream(this.isSync()?{[Symbol.iterator]:()=>this}:{[Symbol.asyncIterator]:()=>this})}toNodeStream(){return En.toNodeStream(this.isSync()?{[Symbol.iterator]:()=>this}:{[Symbol.asyncIterator]:()=>this},{objectMode:!0})}static throughNode(t){throw new Error('"throughNode" not available in this environment')}static throughDOM(t,e){throw new Error('"throughDOM" not available in this environment')}static from(t){return t instanceof Ei?t:ml(t)?tM(t):Ld(t)?iM(t):Vr(t)?Ht(this,void 0,void 0,function*(){return yield Ei.from(yield t)}):Ud(t)||Wl(t)||Fd(t)||Gl(t)?nM(new ur(t)):eM(new ya(t))}static readAll(t){return t instanceof Ei?t.isSync()?$h(t):Kh(t):ml(t)||ArrayBuffer.isView(t)||Pa(t)||Pd(t)?$h(t):Kh(t)}}class ba extends Ei{constructor(t){super(t),this._impl=t}readAll(){return[...this]}[Symbol.iterator](){return this._impl[Symbol.iterator]()}[Symbol.asyncIterator](){return ni(this,arguments,function*(){yield qt(yield*Vo(Zs(this[Symbol.iterator]())))})}}class Ma extends Ei{constructor(t){super(t),this._impl=t}readAll(){return Ht(this,void 0,void 0,function*(){var t,e,i,s;const r=new Array;try{for(var o=!0,a=Zs(this),c;c=yield a.next(),t=c.done,!t;o=!0){s=c.value,o=!1;const l=s;r.push(l)}}catch(l){e={error:l}}finally{try{!o&&!t&&(i=a.return)&&(yield i.call(a))}finally{if(e)throw e.error}}return r})}[Symbol.iterator](){throw new Error("AsyncRecordBatchStreamReader is not Iterable")}[Symbol.asyncIterator](){return this._impl[Symbol.asyncIterator]()}}class Up extends ba{constructor(t){super(t),this._impl=t}}class Zb extends Ma{constructor(t){super(t),this._impl=t}}class Np{get numDictionaries(){return this._dictionaryIndex}get numRecordBatches(){return this._recordBatchIndex}constructor(t=new Map){this.closed=!1,this.autoDestroy=!0,this._dictionaryIndex=0,this._recordBatchIndex=0,this.dictionaries=t}isSync(){return!1}isAsync(){return!1}isFile(){return!1}isStream(){return!1}reset(t){return this._dictionaryIndex=0,this._recordBatchIndex=0,this.schema=t,this.dictionaries=new Map,this}_loadRecordBatch(t,e){let i;if(t.compression!=null){const r=qh.get(t.compression.type);if(r?.decode&&typeof r.decode=="function"){const{decommpressedBody:o,buffers:a}=this._decompressBuffers(t,e,r);i=this._loadCompressedVectors(t,o,this.schema.fields),t=new vn(t.length,t.nodes,a,null)}else throw new Error("Record batch is compressed but codec not found")}else i=this._loadVectors(t,e,this.schema.fields);const s=Qt({type:new tn(this.schema.fields),length:t.length,children:i});return new $e(this.schema,s)}_loadDictionaryBatch(t,e){const{id:i,isDelta:s}=t,{dictionaries:r,schema:o}=this,a=r.get(i),c=o.dictionaries.get(i);let l;if(t.data.compression!=null){const u=qh.get(t.data.compression.type);if(u?.decode&&typeof u.decode=="function"){const{decommpressedBody:h,buffers:f}=this._decompressBuffers(t.data,e,u);l=this._loadCompressedVectors(t.data,h,[c]),t=new ai(new vn(t.data.length,t.data.nodes,f,null),i,s)}else throw new Error("Dictionary batch is compressed but codec not found")}else l=this._loadVectors(t.data,e,[c]);return(a&&s?a.concat(new ve(l)):new ve(l)).memoize()}_loadVectors(t,e,i){return new su(e,t.nodes,t.buffers,this.dictionaries,this.schema.metadataVersion).visitMany(i)}_loadCompressedVectors(t,e,i){return new Pb(e,t.nodes,t.buffers,this.dictionaries,this.schema.metadataVersion).visitMany(i)}_decompressBuffers(t,e,i){const s=[],r=[];let o=0;for(const{offset:a,length:c}of t.buffers){if(c===0){s.push(new Uint8Array(0)),r.push(new kn(o,0));continue}const l=new ds(e.subarray(a,a+c)),u=Re(l.readInt64(0)),h=l.bytes().subarray(Kb),f=u===$b?h:i.decode(h);s.push(f);const p=(o+7&-8)-o;o+=p,r.push(new kn(o,f.length)),o+=f.length}return{decommpressedBody:s,buffers:r}}}class Ea extends Np{constructor(t,e){super(e),this._reader=ml(t)?new Gb(this._handle=t):new Pp(this._handle=t)}isSync(){return!0}isStream(){return!0}[Symbol.iterator](){return this}cancel(){!this.closed&&(this.closed=!0)&&(this.reset()._reader.return(),this._reader=null,this.dictionaries=null)}open(t){return this.closed||(this.autoDestroy=Op(this,t),this.schema||(this.schema=this._reader.readSchema())||this.cancel()),this}throw(t){return!this.closed&&this.autoDestroy&&(this.closed=!0)?this.reset()._reader.throw(t):De}return(t){return!this.closed&&this.autoDestroy&&(this.closed=!0)?this.reset()._reader.return(t):De}next(){if(this.closed)return De;let t;const{_reader:e}=this;for(;t=this._readNextMessageAndValidate();)if(t.isSchema())this.reset(t.header());else if(t.isRecordBatch()){this._recordBatchIndex++;const i=t.header(),s=e.readMessageBody(t.bodyLength);return{done:!1,value:this._loadRecordBatch(i,s)}}else if(t.isDictionaryBatch()){this._dictionaryIndex++;const i=t.header(),s=e.readMessageBody(t.bodyLength),r=this._loadDictionaryBatch(i,s);this.dictionaries.set(i.id,r)}return this.schema&&this._recordBatchIndex===0?(this._recordBatchIndex++,{done:!1,value:new Ip(this.schema)}):this.return()}_readNextMessageAndValidate(t){return this._reader.readMessage(t)}}class Ta extends Np{constructor(t,e){super(e),this._reader=new Hb(this._handle=t)}isAsync(){return!0}isStream(){return!0}[Symbol.asyncIterator](){return this}cancel(){return Ht(this,void 0,void 0,function*(){!this.closed&&(this.closed=!0)&&(yield this.reset()._reader.return(),this._reader=null,this.dictionaries=null)})}open(t){return Ht(this,void 0,void 0,function*(){return this.closed||(this.autoDestroy=Op(this,t),this.schema||(this.schema=yield this._reader.readSchema())||(yield this.cancel())),this})}throw(t){return Ht(this,void 0,void 0,function*(){return!this.closed&&this.autoDestroy&&(this.closed=!0)?yield this.reset()._reader.throw(t):De})}return(t){return Ht(this,void 0,void 0,function*(){return!this.closed&&this.autoDestroy&&(this.closed=!0)?yield this.reset()._reader.return(t):De})}next(){return Ht(this,void 0,void 0,function*(){if(this.closed)return De;let t;const{_reader:e}=this;for(;t=yield this._readNextMessageAndValidate();)if(t.isSchema())yield this.reset(t.header());else if(t.isRecordBatch()){this._recordBatchIndex++;const i=t.header(),s=yield e.readMessageBody(t.bodyLength);return{done:!1,value:this._loadRecordBatch(i,s)}}else if(t.isDictionaryBatch()){this._dictionaryIndex++;const i=t.header(),s=yield e.readMessageBody(t.bodyLength),r=this._loadDictionaryBatch(i,s);this.dictionaries.set(i.id,r)}return this.schema&&this._recordBatchIndex===0?(this._recordBatchIndex++,{done:!1,value:new Ip(this.schema)}):yield this.return()})}_readNextMessageAndValidate(t){return Ht(this,void 0,void 0,function*(){return yield this._reader.readMessage(t)})}}class Fp extends Ea{get footer(){return this._footer}get numDictionaries(){return this._footer?this._footer.numDictionaries:0}get numRecordBatches(){return this._footer?this._footer.numRecordBatches:0}constructor(t,e){super(t instanceof Yh?t:new Yh(t),e)}isSync(){return!0}isFile(){return!0}open(t){if(!this.closed&&!this._footer){this.schema=(this._footer=this._readFooter()).schema;for(const e of this._footer.dictionaryBatches())e&&this._readDictionaryBatch(this._dictionaryIndex++)}return super.open(t)}readRecordBatch(t){var e;if(this.closed)return null;this._footer||this.open();const i=(e=this._footer)===null||e===void 0?void 0:e.getRecordBatch(t);if(i&&this._handle.seek(i.offset)){const s=this._reader.readMessage(le.RecordBatch);if(s?.isRecordBatch()){const r=s.header(),o=this._reader.readMessageBody(s.bodyLength);return this._loadRecordBatch(r,o)}}return null}_readDictionaryBatch(t){var e;const i=(e=this._footer)===null||e===void 0?void 0:e.getDictionaryBatch(t);if(i&&this._handle.seek(i.offset)){const s=this._reader.readMessage(le.DictionaryBatch);if(s?.isDictionaryBatch()){const r=s.header(),o=this._reader.readMessageBody(s.bodyLength),a=this._loadDictionaryBatch(r,o);this.dictionaries.set(r.id,a)}}}_readFooter(){const{_handle:t}=this,e=t.size-Lp,i=t.readInt32(e),s=t.readAt(e-i,i);return eu.decode(s)}_readNextMessageAndValidate(t){var e;if(this._footer||this.open(),this._footer&&this._recordBatchIndex<this.numRecordBatches){const i=(e=this._footer)===null||e===void 0?void 0:e.getRecordBatch(this._recordBatchIndex);if(i&&this._handle.seek(i.offset))return this._reader.readMessage(t)}return null}}class Jb extends Ta{get footer(){return this._footer}get numDictionaries(){return this._footer?this._footer.numDictionaries:0}get numRecordBatches(){return this._footer?this._footer.numRecordBatches:0}constructor(t,...e){const i=typeof e[0]!="number"?e.shift():void 0,s=e[0]instanceof Map?e.shift():void 0;super(t instanceof Sa?t:new Sa(t,i),s)}isFile(){return!0}isAsync(){return!0}open(t){const e=Object.create(null,{open:{get:()=>super.open}});return Ht(this,void 0,void 0,function*(){if(!this.closed&&!this._footer){this.schema=(this._footer=yield this._readFooter()).schema;for(const i of this._footer.dictionaryBatches())i&&(yield this._readDictionaryBatch(this._dictionaryIndex++))}return yield e.open.call(this,t)})}readRecordBatch(t){return Ht(this,void 0,void 0,function*(){var e;if(this.closed)return null;this._footer||(yield this.open());const i=(e=this._footer)===null||e===void 0?void 0:e.getRecordBatch(t);if(i&&(yield this._handle.seek(i.offset))){const s=yield this._reader.readMessage(le.RecordBatch);if(s?.isRecordBatch()){const r=s.header(),o=yield this._reader.readMessageBody(s.bodyLength);return this._loadRecordBatch(r,o)}}return null})}_readDictionaryBatch(t){return Ht(this,void 0,void 0,function*(){var e;const i=(e=this._footer)===null||e===void 0?void 0:e.getDictionaryBatch(t);if(i&&(yield this._handle.seek(i.offset))){const s=yield this._reader.readMessage(le.DictionaryBatch);if(s?.isDictionaryBatch()){const r=s.header(),o=yield this._reader.readMessageBody(s.bodyLength),a=this._loadDictionaryBatch(r,o);this.dictionaries.set(r.id,a)}}})}_readFooter(){return Ht(this,void 0,void 0,function*(){const{_handle:t}=this;t._pending&&(yield t._pending);const e=t.size-Lp,i=yield t.readInt32(e),s=yield t.readAt(e-i,i);return eu.decode(s)})}_readNextMessageAndValidate(t){return Ht(this,void 0,void 0,function*(){if(this._footer||(yield this.open()),this._footer&&this._recordBatchIndex<this.numRecordBatches){const e=this._footer.getRecordBatch(this._recordBatchIndex);if(e&&(yield this._handle.seek(e.offset)))return yield this._reader.readMessage(t)}return null})}}class Qb extends Ea{constructor(t,e){super(t,e)}_loadVectors(t,e,i){return new Cb(e,t.nodes,t.buffers,this.dictionaries,this.schema.metadataVersion).visitMany(i)}}function Op(n,t){return t&&typeof t.autoDestroy=="boolean"?t.autoDestroy:n.autoDestroy}function*$h(n){const t=Ei.from(n);try{if(!t.open({autoDestroy:!1}).closed)do yield t;while(!t.reset().open().closed)}finally{t.cancel()}}function Kh(n){return ni(this,arguments,function*(){const e=yield qt(Ei.from(n));try{if(!(yield qt(e.open({autoDestroy:!1}))).closed)do yield yield qt(e);while(!(yield qt(e.reset().open())).closed)}finally{yield qt(e.cancel())}})}function tM(n){return new ba(new Qb(n))}function eM(n){const t=n.peek(to+7&-8);return t&&t.byteLength>=4?lu(t)?new Up(new Fp(n.read())):new ba(new Ea(n)):new ba(new Ea((function*(){})()))}function nM(n){return Ht(this,void 0,void 0,function*(){const t=yield n.peek(to+7&-8);return t&&t.byteLength>=4?lu(t)?new Up(new Fp(yield n.read())):new Ma(new Ta(n)):new Ma(new Ta((function(){return ni(this,arguments,function*(){})})()))})}function iM(n){return Ht(this,void 0,void 0,function*(){const{size:t}=yield n.stat(),e=new Sa(n,t);return t>=Wb&&lu(yield e.readAt(0,to+7&-8))?new Zb(new Jb(e)):new Ma(new Ta(e))})}function Bp(n){const t=Ei.from(n);return Vr(t)?t.then(e=>Bp(e)):t.isAsync()?t.readAll().then(e=>new Rn(e)):new Rn(t.readAll())}const wl="/var/moreway_planet_dataset",sM=document.getElementById("status"),Po=document.getElementById("selection"),rM=document.getElementById("scene-root"),oM=document.getElementById("overlay-layer"),_r=new cS({antialias:!0});_r.setSize(window.innerWidth,window.innerHeight);rM.appendChild(_r.domElement);const gs=new h_;gs.background=new ie(330512);const Xi=new Tn(50,window.innerWidth/window.innerHeight,.1,500);Xi.position.set(0,16,28);const gr=new uS(Xi,_r.domElement);gr.enablePan=!1;gr.minDistance=13;gr.maxDistance=60;gr.autoRotate=!1;gr.autoRotateSpeed=0;gs.add(new b_(10141152,1.5));const zp=new x_(13494271,1.1);zp.position.set(18,12,14);gs.add(zp);const aM=new Vn(new Ca(10,96,96),new __({color:1525086,emissive:860720,roughness:.95,metalness:.05}));gs.add(aM);const cM=new Vn(new Ca(10.4,64,64),new Bl({color:5226495,transparent:!0,opacity:.08,side:en}));gs.add(cM);const Zh=new E_,Mc=new Xt;let Bi=null,Ec=new Map,Vp=[],Al=null,Yr=null;const Bn=document.createElement("div");Bn.className="point-label hidden";oM.appendChild(Bn);function kp(n){sM.textContent=n}function Rl(n){if(!n){Al=null,Yr=null,Bn.className="point-label hidden",Bn.textContent="",Po.className="selection empty",Po.textContent="点击星球上的点查看文档。";return}const t=n.title||n.path_in_snapshot||n.doc_id||"Untitled";Al=n,Po.className="selection",Po.innerHTML=`
    <h2>${Tr(t)}</h2>
    <div class="meta">${Tr(n.table||"")} · ${Tr(n.doc_kind||"unknown")} · ${Tr(n.source_type||"unknown")}</div>
    <p class="preview">${Tr(n.text_preview||"")}</p>
  `,Bn.className="point-label",Bn.textContent=t}function Tr(n){return String(n).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}async function Jh(n){const t=await fetch(n);if(!t.ok)throw new Error(`HTTP ${t.status} for ${n}`);return t.json()}async function lM(n){const t=await fetch(n);if(!t.ok)throw new Error(`HTTP ${t.status} for ${n}`);const e=await t.arrayBuffer();return Bp(e)}function uM(){if(!Bi)return[];const n=Xi.position.clone().normalize();return Bi.chunks.filter(t=>{const e=new N(...t.center).normalize();return n.dot(e)>-.2||t.depth<=1})}async function Hp(){for(const n of uM()){if(Ec.has(n.chunk_id))continue;const e=(await lM(`${wl}/builds/${Bi.build_id}/${n.path}`)).toArray().map(s=>s.toJSON()),i=hM(e);gs.add(i),Ec.set(n.chunk_id,{rows:e,mesh:i}),Vp.push(i)}kp(`Build ${Bi.build_id} · ${Ec.size}/${Bi.chunks.length} chunks loaded · ${Bi.document_count} docs`)}function hM(n){const t=new ci,e=[],i=[],s=[],r=new ie;for(const c of n)e.push(c.surface_x,c.surface_y,c.surface_z),c.doc_kind==="asset_card"?r.setRGB(.54,.86,1):r.setRGB(1,.77,.48),i.push(r.r,r.g,r.b),s.push(c);t.setAttribute("position",new In(e,3)),t.setAttribute("color",new In(i,3));const o=new xd({size:.22,vertexColors:!0,transparent:!0,opacity:.9}),a=new m_(t,o);return a.userData.payloads=s,a}function dM(){if(!Al||!Yr){Bn.className="point-label hidden";return}const n=Yr.clone().project(Xi);if(!(n.z>=-1&&n.z<=1)){Bn.className="point-label hidden";return}const e=(n.x+1)/2*window.innerWidth,i=(-n.y+1)/2*window.innerHeight;Bn.className="point-label",Bn.style.left=`${e}px`,Bn.style.top=`${i}px`}async function fM(){try{const n=await Jh(`${wl}/latest.json`);Bi=await Jh(`${wl}/${n.manifest_path}`),await Hp(),Rl(null)}catch(n){kp(`加载失败：${n.message}`)}}window.addEventListener("pointerdown",n=>{const t=_r.domElement.getBoundingClientRect();Mc.x=(n.clientX-t.left)/t.width*2-1,Mc.y=-((n.clientY-t.top)/t.height)*2+1,Zh.setFromCamera(Mc,Xi);const e=Zh.intersectObjects(Vp,!1);if(!e.length){Rl(null);return}const i=e[0],s=i.index,r=i.object.userData.payloads?.[s];if(r&&Number.isInteger(s)){const o=i.object.geometry.getAttribute("position");Yr=new N(o.getX(s),o.getY(s),o.getZ(s))}else Yr=null;Rl(r||null)});window.addEventListener("resize",()=>{Xi.aspect=window.innerWidth/window.innerHeight,Xi.updateProjectionMatrix(),_r.setSize(window.innerWidth,window.innerHeight)});let Qh=0;function Gp(n=0){requestAnimationFrame(Gp),gr.update(),Bi&&n-Qh>1200&&(Qh=n,Hp()),dM(),_r.render(gs,Xi)}fM();Gp();
