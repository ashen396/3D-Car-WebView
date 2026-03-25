import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Box, CheckCircle2, Rotate3D } from 'lucide-react';
import SceneViewer from './components/SceneViewer';

// Provided examples (using highly reliable GitHub raw links)
const EXAMPLES = [
  {
    id: 'example1',
    name: 'Ferrari (Three.js)',
    description: 'Classic red sports car',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/ferrari.glb',
    type: 'model'
  },
  {
    id: 'example2',
    name: 'Buggy',
    description: 'Off-road sample buggy',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb',
    type: 'model'
  },
  {
    id: 'example3',
    name: 'Milk Truck',
    description: 'Vintage Cesium truck',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
    type: 'model'
  }
];

export default function App() {
  const [activeItem, setActiveItem] = useState<any>(EXAMPLES[0]);
  

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Check if it's a 3D model
    const modelFile = acceptedFiles.find(f => f.name.endsWith('.glb') || f.name.endsWith('.gltf'));
    
    if (modelFile) {
      const url = URL.createObjectURL(modelFile);
      setActiveItem({ id: 'upload-model', name: modelFile.name, url, type: 'model' });
      
      return;
    }

    // Otherwise, assume it's images
    const imageFiles = acceptedFiles.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      // Sort images alphabetically to ensure correct sequence
      const sorted = imageFiles.sort((a, b) => a.name.localeCompare(b.name));
      const urls = sorted.map(f => URL.createObjectURL(f));
      
      setActiveItem({ 
        id: 'upload-images', 
        name: `${imageFiles.length} Images sequence`, 
        urls, 
        type: imageFiles.length > 1 ? 'sequence' : 'panorama' 
      });
      
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  });

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Rotate3D className="icon" size={24} color="var(--accent)" />
          <h1>Vehicle 3D Pro</h1>
        </div>

        <div className="sidebar-content">
          <div className="section">
             <div className="section-title">Upload Viewer</div>
             <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
               <input {...getInputProps()} />
               <UploadCloud className="icon" size={36} />
               <div style={{ marginTop: '8px' }}>
                 <span>Drag & drop</span>
                 <p>Drop .glb/.gltf models<br/>or image sequences</p>
               </div>
             </div>
          </div>

          <div className="section">
            <div className="section-title">Premium Examples</div>
            <div className="examples-grid">
              {EXAMPLES.map((ex) => (
                <div 
                  key={ex.id}
                  className={`example-btn ${activeItem.id === ex.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveItem(ex);
                    
                  }}
                >
                  <div className="example-icon">
                    <Box size={20} />
                  </div>
                  <div className="example-info">
                    <div className="example-name">{ex.name}</div>
                    <div className="example-desc">{ex.description}</div>
                  </div>
                  {activeItem.id === ex.id && <CheckCircle2 size={18} color="var(--accent)" />}
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

      <main className="canvas-container">
        <SceneViewer activeItem={activeItem} />
      </main>
    </div>
  );
}
