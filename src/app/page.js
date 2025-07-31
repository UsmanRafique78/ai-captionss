import DemoSection from "@/components/DemoSection";
import PageHeaders from "@/components/PageHeaders";
import UploadForm from "@/components/UploadForm";



export default function Home() {
  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PageHeaders
          h1Text={"Add epic captions to your videos"}
          h2Text={"Just upload your video and we will do the rest"}
        />
        <div className="text-center mt-8">
          <UploadForm />
        </div>
        <DemoSection />
      </div>
    </>
  )
}
