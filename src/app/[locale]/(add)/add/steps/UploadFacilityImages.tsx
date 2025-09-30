'use client';

import type { ImageCategory } from '@/utils/images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

export type LocalUpload = { file: File; category?: ImageCategory };

type UploadFacilityImagesProps = {
  images: LocalUpload[];
  setImagesAction: (updater: (prev: LocalUpload[]) => LocalUpload[]) => void;
};

const tips: Record<ImageCategory, string> = {
  facility: 'Take a clear photo of the facility interior (e.g., changing table, sink).',
  entrance: 'Capture the entrance, door or signage that helps identify the facility.',
  surroundings: 'Capture surroundings like nearby stores or landmarks to aid navigation.',
};

export default function UploadFacilityImages({ images, setImagesAction }: UploadFacilityImagesProps) {
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const handleFiles = useCallback(
    (files: FileList | null, category: ImageCategory) => {
      if (!files || files.length === 0) {
        return;
      }
      const newUploads: LocalUpload[] = [];
      const newPreviews: Record<string, string> = {};
      Array.from(files).forEach((file) => {
        newUploads.push({ file, category });
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        newPreviews[key] = URL.createObjectURL(file);
      });
      setImagesAction(prev => [...prev, ...newUploads]);
      setPreviews(prev => ({ ...prev, ...newPreviews }));
    },
    [setImagesAction],
  );

  const grouped = useMemo(() => {
    const map: Record<ImageCategory, LocalUpload[]> = { facility: [], entrance: [], surroundings: [] };
    for (const u of images) {
      if (u.category) {
        map[u.category].push(u);
      }
    }
    return map;
  }, [images]);

  const removeImage = (target: LocalUpload) => {
    setImagesAction(prev => prev.filter(u => !(u.file === target.file && u.category === target.category)));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Upload Photos</h2>
      <p className="text-sm text-gray-600">Optional but highly recommended. Photos help users quickly recognize the facility and find it.</p>

      {(['facility', 'entrance', 'surroundings'] as ImageCategory[]).map(category => (
        <section key={category} className="space-y-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold capitalize">{category}</h3>
              {/* Hidden input per category */}
              <Input
                id={`upload-${category}`}
                type="file"
                accept="image/*"
                multiple
                onChange={e => handleFiles(e.target.files, category)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const el = document.getElementById(`upload-${category}`) as HTMLInputElement | null;
                  if (el) {
                    el.click();
                  }
                }}
              >
                Add photos
              </Button>
            </div>
            <p className="text-xs text-gray-500">{tips[category]}</p>
          </div>

          {grouped[category].length > 0
            ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {grouped[category].map((u) => {
                    const key = `${u.file.name}-${u.file.size}-${u.file.lastModified}`;
                    const url = previews[key] ?? URL.createObjectURL(u.file);
                    return (
                      <div key={key} className="relative aspect-square rounded-md overflow-hidden group">
                        <Image src={url} alt={u.file.name} fill className="object-cover" sizes="(max-width:640px) 33vw, (max-width:1024px) 25vw, 160px" />
                        <button
                          type="button"
                          onClick={() => removeImage(u)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-100 hover:bg-black/70"
                          aria-label="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            : (
                <div className="border border-dashed rounded-md p-4 text-center text-sm text-gray-500">No photos added yet.</div>
              )}
        </section>
      ))}
    </div>
  );
}
