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
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
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
      header: <Skeleton />,
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Simulate Real Interviews",
      description: "Practice with AI-generated questions that mirror real-world job interview scenarios.",
      header: <Skeleton />,
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Boost Your Confidence",
      description: "Prepare for interviews with feedback that highlights both strengths and areas to improve.",
      header: <Skeleton />,
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed performance reports and analytics.",
      header: <Skeleton />,
      icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Master Behavioral Interviews",
      description: "Refine your responses to behavioral questions with AI-driven feedback and guidance.",
      header: <Skeleton />,
      icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Prepare for Any Job Role",
      description: "Tailor your mock interviews to specific roles and industries for more effective preparation.",
      header: <Skeleton />,
      icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
    }
  ]
  