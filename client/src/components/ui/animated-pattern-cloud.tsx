"use client";

import React, { useEffect, useRef } from 'react';

/**
 * ProceduralGroundBackground
 * A WebGL 2D background featuring topographic neon lines and sand-ripple movement.
 * Optimized for performance using fragment shaders.
 */
const ProceduralGroundBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // Fractal Brownian Motion for complex, natural waves
      float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p = rot * p * 2.0 + shift;
              a *= 0.5;
          }
          return v;
      }

      void main() {
        // Normalize pixel coordinates (from 0 to 1)
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        // Fix aspect ratio so waves don't stretch
        vec2 aspectUv = vec2(uv.x * (u_resolution.x / u_resolution.y), uv.y);
        
        // Scale the grid pattern
        vec2 p = aspectUv * 3.0;
        
        // Animate the coordinates over time
        p.x -= u_time * 0.05;
        p.y -= u_time * 0.03;
        
        // Create warping effect by feeding noise into noise
        vec2 q = vec2(
            fbm(p + vec2(0.0, 0.0) + u_time * 0.05),
            fbm(p + vec2(5.2, 1.3) + u_time * 0.02)
        );
        
        float n = fbm(p + 4.0 * q);
        
        // Generate topographic lines using fract
        // Multiply by 12.0 to get 12 distinct contour lines
        float lines = fract(n * 12.0);
        
        // Smooth the lines so they look like glowing neon rather than aliased pixels
        float topoLine = smoothstep(0.1, 0.0, lines) + smoothstep(0.9, 1.0, lines);
        
        // Monochrome / 3D theme color palette
        vec3 bgDark = vec3(0.0, 0.0, 0.0);        // Black for deep areas
        vec3 bgLight = vec3(0.25, 0.25, 0.25);    // Grey for raised areas (3D depth)
        vec3 neonColor = vec3(1.0, 1.0, 1.0);     // White for topographic peaks/lines
        
        // Mix background based on noise value to create 3D shading
        vec3 finalColor = mix(bgDark, bgLight, n);
        
        // Add glowing topographic lines on top
        finalColor += topoLine * neonColor * 0.4;
        
        // Subtle vignette to focus the center
        vec2 centerUv = uv - 0.5;
        float vignette = smoothstep(0.8, 0.2, length(centerUv));
        finalColor *= vignette * 0.6 + 0.4; // Darken edges slightly for more 3D depth

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]), gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");

    let animationFrameId: number;
    const render = (time: number) => {
      const { innerWidth: width, innerHeight: height } = window;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, width, height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-zinc-950 z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ filter: 'contrast(1.1) brightness(0.9)' }}
      />
    </div>
  );
};

export default ProceduralGroundBackground;
