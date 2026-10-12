import { api } from "@/lib/api";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const { url } = await api<{ url: string }>("/uploads", { method: "POST", formData });
  return url;
}
