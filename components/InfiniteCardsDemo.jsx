"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    (<div>  <InfiniteMovingCards items={testimonials} direction="right" speed="fast" />
    </div>)
  );
}

const testimonials =[
  {
    quote:
      "Prepare smarter, not harder. Our AI-driven mock interviews help you practice, improve, and master your responses for real-world success.",
    name: "AI Interview Platform",
    title: "Maximize Your Interview Performance",
  },
  {
    quote:
      "Unlock the potential of personalized coaching. With instant feedback and tailored simulations, you’re always ready to impress.",
    name: "AI Interview Platform",
    title: "Master Your Interview Skills",
  },
  {
    quote:
      "Get detailed insights and feedback on every answer. Know exactly what to improve and how to stand out to recruiters.",
    name: "AI Interview Platform",
    title: "Optimize Your Interview Strategy",
  },
  {
    quote:
      "No more guesswork. With AI-powered evaluations, you’ll always know how you’re performing and what to improve next.",
    name: "AI Interview Platform",
    title: "Performance Tracking and Feedback",
  },
  {
    quote:
      "Ace your interview with confidence. Our platform prepares you for any question, any role, and any interview scenario.",
    name: "AI Interview Platform",
    title: "Confidence in Every Interview",
  },
];
