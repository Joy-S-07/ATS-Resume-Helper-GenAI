'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const { resolvedTheme } = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current || !resolvedTheme) return;

		const container = containerRef.current;
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
		renderer.setClearColor(fogColor, 0);

		container.appendChild(renderer.domElement);

		// Create geometry
		const geometry = new THREE.BufferGeometry();
		const positions: number[] = [];
		const colors: number[] = [];

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions.push(
					ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
					0,
					iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
				);
				colors.push(isDark ? 0.8 : 0, isDark ? 0.8 : 0, isDark ? 0.8 : 0);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 4,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let rafId = 0;
		let disposed = false;

		const animate = () => {
			if (disposed) return;
			rafId = requestAnimationFrame(animate);

			const posArr = geometry.attributes.position.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					posArr[i * 3 + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}

			geometry.attributes.position.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
		};

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		animate();

		// Cleanup — uses only local variables, never stale refs
		return () => {
			disposed = true;
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', handleResize);

			geometry.dispose();
			material.dispose();
			renderer.dispose();

			if (renderer.domElement.parentNode) {
				renderer.domElement.parentNode.removeChild(renderer.domElement);
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

