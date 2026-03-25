import React, { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ImageSequenceProps {
  urls: string[];
  isPanorama?: boolean;
}

export default function ImageSequence({ urls, isPanorama }: ImageSequenceProps) {
  const { camera } = useThree();
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  // Preload all textures "without gaps between images"
  useEffect(() => {
    let unmounted = false;
    const loader = new THREE.TextureLoader();
    
    // We preload all images
    Promise.all(urls.map(url => loader.loadAsync(url)))
      .then(loadedTextures => {
        if (!unmounted) {
          loadedTextures.forEach(t => {
            t.colorSpace = THREE.SRGBColorSpace;
          });
          setTextures(loadedTextures);
        }
      })
      .catch(console.error);

    return () => {
      unmounted = true;
      textures.forEach(t => t.dispose());
    };
  }, [urls]);

  // For Panoramas (Equirectangular)
  if (isPanorama && textures.length > 0) {
    return (
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial 
          map={textures[0]} 
          side={THREE.BackSide} 
        />
      </mesh>
    );
  }

  // For 360 sequences (Turntable style)
  // We use a plane that always faces the camera, acting as a billboard,
  // and switch its texture based on the camera's Y orbit angle.
  const materialRef = React.useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (textures.length === 0 || isPanorama || !materialRef.current) return;
    
    // Calculate polar angle of camera around the origin (Y-axis)
    // camera.position.x and camera.position.z give us the angle
    const angle = Math.atan2(camera.position.x, camera.position.z);
    
    // Convert angle (-PI to PI) into a 0 to 1 value (flipped to properly spin opposite to angle)
    let normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
    
    // Map the 0-1 value to the number of frames
    const index = Math.floor(normalizedAngle * textures.length) % textures.length;
    
    // Directly mutate the material for supreme performance
    if (materialRef.current.map !== textures[index]) {
      materialRef.current.map = textures[index];
    }
  });

  if (textures.length === 0) return null;

  return (
    <mesh 
      // Billboard that always looks at camera
      onUpdate={(self) => {
        self.lookAt(camera.position);
      }}
    >
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial 
        ref={materialRef}
        map={textures[0]} 
        transparent
        // Avoid depth fighting
        depthWrite={false}
      />
    </mesh>
  );
}
