import ResumeBuilderContainer from "@/components/resume-builder/ResumeBuilderContainer";
import ProceduralGroundBackground from "@/components/ui/animated-pattern-cloud";

export default function ResumeBuilderPage() {
  return (
    <div className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">

      {/* Animated Background */}
      <ProceduralGroundBackground />

      <div className="relative z-10 pt-8 px-4 md:px-8 pb-8 h-full flex flex-col">


        {/* Main Builder Interface */}
        <ResumeBuilderContainer />
      </div>

    </div>
  );
}
