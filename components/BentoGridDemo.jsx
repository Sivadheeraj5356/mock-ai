import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";
export default function  BentoGridDemo() {
  return (
    (<BentoGrid className="max-w-6xl mx-auto text-2xl">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""} />
      ))}
    </BentoGrid>)
  );
}
const Skeleton = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      <Image src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.urUQ8BWHnWGTq7CBbW7JtgHaDt%26pid%3DApi&f=1&ipt=7e8cb3ed9ac72612cd8720122dd2bf127ddec09bb31f78e57e3d289fa7df5347&ipo=images'} alt="logo" height={50} width={400}/>
    </div>
);
const Skeleton1 = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      <Image src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.1sIfrB5FpxSuh9q8gs87SQHaEH%26pid%3DApi&f=1&ipt=e65278ec773755f3e0dc4e68dfdadb66343fee4b85fac5dbced4eed3ca41890a&ipo=images'} alt="logo" height={50} width={400}/>
    </div>
);
const Skeleton2 = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      <Image src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.MWZDCarKgtOMuFeZv_ZtpgHaFj%26pid%3DApi&f=1&ipt=4e835bbcc973e181ecf711652189dd56b4cd53d71ba8b0afdc34a97504d9cd29&ipo=images'} alt="logo" height={50} width={400}/>
    </div>
);
const Skeleton3 = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      <Image src={'https://cdn.dribbble.com/userupload/5989095/file/original-46c499923c5871f8de1d73c0b887e487.webp?resize=1024x768&vertical=center'} alt="logo" height={100} width={500}/>
      <Image src={'https://cdn.dribbble.com/userupload/10115885/file/original-7e2f373a5c6595ba8231623749136431.png?resize=752x&vertical=center'} alt="logo" height={100} width={500}/>
    </div>
);
const Skeleton4 = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      <Image src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.uxODC58Z7RCccol-SIqMegHaEK%26pid%3DApi&f=1&ipt=65ca56bca241023c1c94a70030185e65bbf17674bc591f80ffa2235a54fd6842&ipo=images'} alt="logo" height={50} width={400}/>
    </div>
);
const Skeleton5 = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      <Image src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.L57yiGYso0qKY_vOVxifjAHaEa%26pid%3DApi&f=1&ipt=ae53775c4ba7574f2ed12cd3f61d0c5c0e7902f5f1a4b4a0a530e3ea202ab143&ipo=images'} alt="logo" height={50} width={400}/>
    </div>
);
const Skeleton6 = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      <Image src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.HHlLEQdvFruSRPtNqCbmtwHaCx%26pid%3DApi&f=1&ipt=9acc90634693dc1c34e94343038c512b7bf56034763b9b1ebbfeecb7be8d759d&ipo=images'} alt="logo" height={100} width={400}/>
      <Image src={'https://cdn.dribbble.com/userupload/9204274/file/original-3a35cc2e6edf13107f5cef5fc3473512.png?resize=752x&vertical=center'} alt="logo" height={100} width={400}/>
    </div>
);

const items =[
    {
      title: "Master Your Interview Skills",
      description: "Sharpen your responses and build confidence with personalized mock interviews.",
      header: <Skeleton />,
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "AI-Driven Feedback",
      description: "Get real-time, actionable insights on your answers to improve your performance.",
      header: <Skeleton1 />,
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Simulate Real Interviews",
      description: "Practice with AI-generated questions that mirror real-world job interview scenarios.",
      header: <Skeleton2 />,
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Boost Your Confidence",
      description: "Prepare for interviews with feedback that highlights both strengths and areas to improve.",
      header: <Skeleton3 />,
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed performance reports and analytics.",
      header: <Skeleton4 />,
      icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Master Behavioral Interviews",
      description: "Refine your responses to behavioral questions with AI-driven feedback and guidance.",
      header: <Skeleton5 />,
      icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Prepare for Any Job Role",
      description: "Tailor your mock interviews to specific roles and industries for more effective preparation.",
      header: <Skeleton6 />,
      icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
    }
  ]
  