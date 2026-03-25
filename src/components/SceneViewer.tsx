import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PresentationControls, Loader } from '@react-three/drei';
import CarModel from './CarModel';
import ImageSequence from './ImageSequence';

import ErrorBoundary from './ErrorBoundary';

interface SceneViewerProps {
  activeItem: any;
}

export default function SceneViewer({ activeItem }: SceneViewerProps) {
  return (
    <>
      <ErrorBoundary>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 8], fov: 45 }}>
          <color attach="background" args={['#101419']} />

          <Suspense fallback={null}>
            {activeItem.type === 'model' && (
              <PresentationControls
                speed={1.5}
                global
                zoom={0.7}
                polar={[-0.1, Math.PI / 4]}
                rotation={[Math.PI / 8, Math.PI / 4, 0]}
              >
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} castShadow={false} />
                <directionalLight position={[-10, 10, -5]} intensity={1} castShadow={false} />

                <Stage environment="studio" intensity={1} adjustCamera={2}>
                  <CarModel url={activeItem.url} />
                </Stage>
              </PresentationControls>
            )}

            {activeItem.type === 'sequence' && (
              // Render an image sequence player using a cylinder or a plane
              <ImageSequence urls={activeItem.urls} />
            )}

            {activeItem.type === 'panorama' && (
              // Single image panorama fallback
              <ImageSequence urls={activeItem.urls} isPanorama />
            )}
          </Suspense>

          {(activeItem.type === 'model' || activeItem.type === 'panorama') && (
            <OrbitControls
              enablePan={false}
              minDistance={2}
              maxDistance={20}
              maxPolarAngle={Math.PI / 2 + 0.1}
            />
          )}
        </Canvas>
      </ErrorBoundary>
      <Loader />
    </>
  );
}
