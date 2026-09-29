"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/*
 * Animated WebGL2 background for the login screen, adapted from omicron-ui's
 * ShaderBackground and recoloured to the F2G palette: navy clouds with orange
 * and cream filaments. Renders a single still frame under reduced motion and
 * pauses while the tab is hidden. Without WebGL2 the canvas stays transparent
 * and the navy page background shows through.
 */
const FRAGMENT = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.3,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  vec3 orange=vec3(.925,.51,.212);
  vec3 cream=vec3(.98,.965,.94);
  vec3 navy=vec3(.07,.13,.25);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.4+.1*uv.x);
    vec2 p=uv;float d=length(p);
    col+=.0022/d*mix(orange,cream,.5+.5*sin(i*1.7));
    float b=noise(i+p+bg*1.731);
    col+=.0016*b/length(max(p,vec2(b*p.x*.02,p.y)))*orange;
    col=mix(col,navy*(.55+bg*.6),d);
  }
  O=vec4(col,1);
}`;

const VERTEX = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

export function LoginShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2");
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");

    // Half device-pixel resolution: the effect is soft, full DPR only costs GPU.
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (seconds: number) => {
      gl.useProgram(program);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, seconds);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    const loop = (now: number) => {
      draw(now * 1e-3);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) draw(12);
      else raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    const onResize = () => {
      resize();
      if (reduce) draw(12);
    };

    resize();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
