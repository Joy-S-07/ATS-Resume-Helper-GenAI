'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const { resolvedTheme } = useTheme();

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const isDark = resolvedTheme === 'dark';
		const fogColor = isDark ? 0x000000 : 0xffffff;

		const SEPARATION = 40;
		const AMOUNTX = 250;
		const AMOUNTY = 250;

		// Scene setup
		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(fogColor, 3000, 8000);

		const camera = new THREE.PerspectiveCamera(
			20,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 800, 4000);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(scene.fog.color, 0);

		containerRef.current.appendChild(renderer.domElement);

		// Create particles
		const particles: THREE.Points[] = [];
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				if (isDark) {
					colors.push(0.8, 0.8, 0.8);
				} else {
					colors.push(0, 0, 0);
				}
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 4,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		const pointer = new THREE.Vector2(-9999, -9999);
		const raycaster = new THREE.Raycaster();
		const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
		const target = new THREE.Vector3();

		const onPointerMove = (event: PointerEvent) => {
			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
		};
		window.addEventListener('pointermove', onPointerMove as EventListener);

		let count = 0;
		let animationId: number;

		// Animation function
		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			raycaster.setFromCamera(pointer, camera);
			const hit = raycaster.ray.intersectPlane(plane, target);
			const radius = 800;
			const radiusSq = radius * radius;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					let x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
					let z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

					if (hit) {
						const dx = x - target.x;
						if (Math.abs(dx) < radius) {
							const dz = z - target.z;
							if (Math.abs(dz) < radius) {
								const distSq = dx * dx + dz * dz;
								if (distSq < radiusSq) {
									const dist = Math.sqrt(distSq) || 0.1;
									const force = (radius - dist) / radius;
									// Scatter outward
									x += (dx / dist) * force * 350;
									z += (dz / dist) * force * 350;
								}
							}
						}
					}

					positions[index] = x;
					// Animate Y position with sine waves
					positions[index + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					positions[index + 2] = z;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;

			renderer.render(scene, camera);
			count += 0.1;
		};

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		animate();

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
		};

		// Cleanup function
		return () => {
			window.removeEventListener('pointermove', onPointerMove as EventListener);
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);

			if (sceneRef.current) {
				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [resolvedTheme]);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none fixed inset-0 z-[-1]', className)}
			{...props}
		/>
	);
}
