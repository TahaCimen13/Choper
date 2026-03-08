import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export async function uploadProductImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `products/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(storage, fileName);

  onProgress?.(30);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
  onProgress?.(80);
  const url = await getDownloadURL(snapshot.ref);
  onProgress?.(100);
  return url;
}

export async function deleteProductImage(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // Dosya zaten silinmiş olabilir
  }
}
