"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.88, 0.98] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      className="h-[34rem] sm:h-[44rem] md:h-[58rem] lg:h-[68rem] 2xl:h-[76rem] 3xl:h-[84rem] 4xl:h-[92rem] flex flex-col items-center justify-start relative px-2 sm:px-4 md:px-8 pt-2 sm:pt-4 md:pt-6 pb-8 sm:pb-12 overflow-hidden"
      ref={containerRef}
    >
      <div
        className="pt-2 sm:pt-4 md:pt-6 pb-6 sm:pb-8 md:pb-12 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: { translate: MotionValue<number>; titleComponent: React.ReactNode }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto text-center mb-6 sm:mb-8 px-3 sm:px-4"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 20px 50px rgba(0, 0, 0, 0.1), 0 10px 25px rgba(255, 105, 0, 0.08)",
      }}
      className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1520px] -mt-4 sm:-mt-8 md:-mt-12 mx-auto h-[19rem] sm:h-[26rem] md:h-[34rem] lg:h-[40rem] 2xl:h-[48rem] 3xl:h-[54rem] 4xl:h-[60rem] w-full border-2 md:border-4 border-border/80 p-1.5 sm:p-3 md:p-5 2xl:p-6 bg-card rounded-[20px] sm:rounded-[26px] md:rounded-[32px] 2xl:rounded-[40px] shadow-2xl relative"
    >
      {/* Sleek top camera / sensor bezel mimicking 22" display */}
      <div className="absolute top-1.5 sm:top-2 md:top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60">
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff6900]/60" />
      </div>

      <div className="h-full w-full overflow-hidden rounded-[15px] sm:rounded-[20px] md:rounded-[24px] bg-[#090b0e] text-white border border-white/5 relative">
        {children}
      </div>
    </motion.div>
  );
};
