import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Product } from "@/types/product";

const COL = "products";

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, COL), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(product: Omit<Product, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, COL), product);
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function seedProducts(products: Product[]): Promise<void> {
  const promises = products.map((product) => {
    const { id, ...data } = product;
    return setDoc(doc(db, COL, id), data);
  });
  await Promise.all(promises);
}
