import React from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

interface AboutTeamSectionProps {
  onEmailClick?: () => void;
}

export const AboutTeamSection: React.FC<AboutTeamSectionProps> = ({ onEmailClick }) => {
  return (
    <section className="w-full bg-white text-neutral-900 overflow-hidden border-t border-neutral-100">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[580px]">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: FOUNDER PHOTO, LEADERSHIP BULLETS & EMAIL ME CTA         */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white flex flex-col justify-between">
          
          {/* 1. Founder Photo (Spans the top of left column) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-[250px] sm:h-[280px] md:h-[310px] lg:h-[280px] xl:h-[310px] overflow-hidden bg-neutral-100"
          >
            <img
              src="/images/about/about-team-founder.jpg"
              alt="Iron Lung Founders"
              className="w-full h-full object-cover block select-none pointer-events-none"
              loading="lazy"
            />
          </motion.div>

          {/* 2. Founders Bullet List & Email CTA Button */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 flex flex-col justify-between flex-1">
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 sm:space-y-5 text-neutral-900 font-bold font-sans text-sm sm:text-base md:text-[17px] tracking-wide uppercase select-none"
            >
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                <span>PRIYARANJAN TIWARI , FOUNDER</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                <span>PARIKSHIT HOODA, CO FOUNDER</span>
              </li>
            </motion.ul>

            {/* Email Me Button (Sharp Rectangular Orange Button) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 sm:mt-10"
            >
              <a
                href="mailto:info@ironlung.in"
                onClick={onEmailClick}
                className="inline-flex items-center justify-center px-10 py-3.5 bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] select-none"
              >
                <span>EMAIL ME</span>
              </a>
            </motion.div>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: OUR TEAM SERIF HEADER, MANIFESTO (NORMAL TEXT) & SOCIALS*/}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 xl:col-span-7 bg-[#FFF3E6] p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-between">
          
          <div>
            {/* 1. "OUR TEAM" Heading with Divider Line */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-serif font-normal tracking-wide text-[#FF5500] uppercase select-none">
                OUR TEAM
              </h2>
              <div className="mt-4 sm:mt-5 border-b border-neutral-900/40 w-full" />
            </motion.div>

            {/* 2. Team Story Paragraphs (Normal Font Weight as requested) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="my-7 sm:my-8 md:my-9 space-y-4 sm:space-y-5 text-neutral-900 font-sans font-normal text-base sm:text-[17px] md:text-[18px] leading-[1.6] select-none max-w-2xl"
            >
              <p>
                IRONLUNG was founded by a team of engineers from IIT Kanpur with a shared vision—to bring science-backed respiratory training into everyday fitness and performance.
              </p>
              <p>
                What began as an idea grew through years of research, engineering, and testing, turning respiratory science into a practical, measurable training solution.
              </p>
              <p>
                Today, IRONLUNG is built to help you train your breathing with the same intent you bring to every other part of your performance.
              </p>
              <p className="pt-1 sm:pt-2">
                Years of work. One mission: Train how you breathe.
              </p>
            </motion.div>
          </div>

          {/* 3. Social Media Links in Signature Orange (Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-end gap-5 sm:gap-6 pt-4 select-none"
          >
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#FF5500] hover:text-[#E04B00] hover:scale-115 active:scale-95 transition-all duration-200"
            >
              <Instagram className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-[#FF5500] hover:text-[#E04B00] hover:scale-115 active:scale-95 transition-all duration-200"
            >
              <Twitter className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-[#FF5500] hover:text-[#E04B00] hover:scale-115 active:scale-95 transition-all duration-200"
            >
              <Facebook className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#FF5500] hover:text-[#E04B00] hover:scale-115 active:scale-95 transition-all duration-200"
            >
              <Linkedin className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default AboutTeamSection;
