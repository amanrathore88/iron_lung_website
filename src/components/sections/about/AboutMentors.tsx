import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaFacebookF, FaInstagram } from 'react-icons/fa';

interface Mentor {
  name: string;
  role: string;
  image: string;
  socials: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

const mentorsList: Mentor[] = [
  {
    name: 'Dr. Anand Kumar',
    role: 'Professor & Head of Chest Department (GSVM College) • Respiratory Diseases Expert',
    image: '/images/about/team/dr.anand.png',
    socials: { linkedin: '#', facebook: '#', instagram: '#' },
  },
  {
    name: 'RK Agarwal',
    role: 'Managing Director (Netplast) • 35+ Years • IIT Kanpur Alumni',
    image: '/images/about/team/rkagrwal.png',
    socials: { linkedin: '#', facebook: '#', instagram: '#' },
  },
  {
    name: 'Shikhar Krishn Jha',
    role: 'Assistant Professor, Dept. of Material Science & Engineering • IIT Kanpur',
    image: '/images/about/team/jha.png',
    socials: { linkedin: '#', facebook: '#', instagram: '#' },
  },
  {
    name: 'Dr. Vedprakash Shukla',
    role: 'MBBS, DTCD • 35+ Years of Experience',
    image: '/images/about/team/vedprakash.png',
    socials: { linkedin: '#', facebook: '#', instagram: '#' },
  },
];

const mentorCardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 180, damping: 20 } },
};

const MentorCard: React.FC<{ member: Mentor }> = ({ member }) => {
  return (
    <motion.article
      variants={mentorCardVariants}
      whileHover={{ y: -4 }}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-black/5 shadow-sm"
    >
      <div
        className="pointer-events-none absolute inset-0 w-0 h-full rounded-[24px]
                   shadow-[inset_0_0_25px_rgba(0,0,0,0.30)]
                   bg-gradient-to-r from-[#fe8c00] to-[#f83600]
                   transition-all duration-300 group-hover/card:w-full"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col p-6">
        <div
          className="mx-auto mb-5 w-44 h-44 sm:w-48 sm:h-48 overflow-hidden rounded-full p-3
                     transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.20)] group-hover/card:p-0"
        >
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <div className="text-center transition-colors duration-300 group-hover/card:text-white">
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight min-h-[2.5rem] flex items-center justify-center">
            {member.name}
          </h3>
          <p className="mt-1 text-sm sm:text-base text-slate-600 group-hover/card:text-white/90 min-h-[3.5rem]">
            {member.role}
          </p>
        </div>

        <div className="mt-auto">
          <ul className="mt-4 flex items-center justify-center gap-3">
            {member.socials.facebook && (
              <li>
                <a
                  href={member.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on Facebook`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-300 bg-gradient-to-r from-[#fe8c00] to-[#f83600] group-hover/card:bg-white group-hover/card:text-black group-hover/card:[background-image:none] hover:!bg-[#1d1d1d] hover:!text-white"
                >
                  <FaFacebookF />
                </a>
              </li>
            )}
            {member.socials.instagram && (
              <li>
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on Instagram`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-300 bg-gradient-to-r from-[#fe8c00] to-[#f83600] group-hover/card:bg-white group-hover/card:text-black group-hover/card:[background-image:none] hover:!bg-[#1d1d1d] hover:!text-white"
                >
                  <FaInstagram />
                </a>
              </li>
            )}
            {member.socials.linkedin && (
              <li>
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-300 bg-gradient-to-r from-[#fe8c00] to-[#f83600] group-hover/card:bg-white group-hover/card:text-black group-hover/card:[background-image:none] hover:!bg-[#1d1d1d] hover:!text-white"
                >
                  <FaLinkedin />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.article>
  );
};

export const AboutMentors: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <header className="mx-auto mb-10 sm:mb-14 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-neutral-900">
            Meet the Mentors
          </h2>
          <p className="mt-3 text-slate-600">
            A small crew with big energy—builders, thinkers, and doers.
          </p>
        </header>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch"
        >
          {mentorsList.map((m) => (
            <li key={m.name} className="list-none h-full">
              <MentorCard member={m} />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default AboutMentors;
