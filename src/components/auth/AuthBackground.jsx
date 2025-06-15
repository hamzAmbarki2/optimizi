import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from '@mui/material/styles';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShapes() {
  const theme = useTheme();
  const groupRef = useRef();
  
  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, y * 0.1, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.1, 0.1);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <Sphere args={[0.4, 32, 32]} position={[-1, 0, 0]}>
          <meshStandardMaterial
            color={theme.palette.primary.main}
            roughness={0.4}
            metalness={0.8}
            opacity={0.6}
            transparent
          />
        </Sphere>
      </Float>
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.5}>
        <Sphere args={[0.3, 32, 32]} position={[1.5, 0.5, -1]}>
          <meshStandardMaterial
            color={theme.palette.secondary.main}
            roughness={0.4}
            metalness={0.8}
            opacity={0.6}
            transparent
          />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={2.5} floatIntensity={2}>
        <Sphere args={[0.2, 32, 32]} position={[0, 1, -0.5]}>
          <meshStandardMaterial
            color={theme.palette.primary.light}
            roughness={0.4}
            metalness={0.8}
            opacity={0.6}
            transparent
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}