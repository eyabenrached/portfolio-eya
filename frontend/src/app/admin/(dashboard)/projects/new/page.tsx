import ProjectForm from "@/components/admin/ProjectForm";
import SectionTitle from "@/components/ui/SectionTitle";
import { serverApi } from "@/lib/server-api";

export default async function NewProjectPage() {
  const categories = await serverApi<string[]>("/admin/projects/categories").catch(() => []);
  return (
    <>
      <SectionTitle title="Nouveau projet" description="Il apparaîtra sur le site dès qu'il est publié." />
      <ProjectForm categories={categories} />
    </>
  );
}
