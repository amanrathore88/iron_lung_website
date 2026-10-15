import React from 'react';
import { motion } from 'framer-motion';

interface AboutWhoWeAreProps {
  onContactUs?: () => void;
}

const ABOUT_DATA = {
  title: 'WHO WE ARE',
  heading: 'We’re IRONLUNG — Building Stronger Breathing for Better Performance',
  content: 'At IRONLUNG, we believe breathing is a trainable part of performance. We’re focused on helping athletes and fitness enthusiasts strengthen their breathing muscles through structured respiratory muscle training and controlled resistance — bringing breathing training into everyday fitness.',
};

const AnimatedBg: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <motion.span
      aria-hidden
      initial={{ opacity: 0, scale: 0.9, x: -80, y: -40 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"
    />
    <motion.span
      aria-hidden
      initial={{ opacity: 0, scale: 0.9, x: 60, y: 80 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
      className="absolute bottom-[-6rem] right-[-6rem] h-96 w-96 rounded-full bg-orange-300/30 blur-3xl"
    />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(249,115,22,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
  </div>
);

interface StatProps {
  value: string;
  label: string;
}

const Stat: React.FC<StatProps> = ({ value, label }) => (
  <div className="flex flex-col">
    <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-orange-600 uppercase leading-snug">
      {value}
    </span>
    <span className="text-xs md:text-sm text-neutral-500 font-medium mt-1">{label}</span>
  </div>
);

export const AboutWhoWeAre: React.FC<AboutWhoWeAreProps> = ({ onContactUs }) => {
  return (
    <section className="relative isolate bg-white">
      <AnimatedBg />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            {ABOUT_DATA.title}
          </div>
          <h2 className="text-3xl md:text-[48px] font-semibold leading-tight text-neutral-900 mt-3">
            {ABOUT_DATA.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <p className="text-base md:text-lg leading-relaxed text-neutral-700">
              {ABOUT_DATA.content}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <Stat value="TRAIN YOUR BREATHING" label="Our Approach" />
              <Stat value="BUILT FOR PERFORMANCE" label="Our Mission" />
              <Stat value="BREATHING STRENGTH" label="Our Focus" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                onClick={(e) => {
                  if (onContactUs) {
                    e.preventDefault();
                    onContactUs();
                  }
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 cursor-pointer"
              >
                Contact Us
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-orange-100 via-transparent to-transparent blur opacity-80" />
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-orange-100 shadow-lg">
                <img
                  src="/images/AboutMultipleai/whoweare.jpg"
                  alt="Medantrik team at work"
                  className="h-[250px] w-full object-cover md:h-[390px]"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutWhoWeAre;
