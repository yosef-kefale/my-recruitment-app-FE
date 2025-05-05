"use client";
import Image from "next/image";
import Link from "next/link";
import NavBarNotLogged from "../../components/navbar-not-loggedin/navBarNotLogged";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarNotLogged viewType="employer" onViewTypeChange={() => {}} />
      {/* Hero Section */}
      <section className="relative py-20 bg-sky-600">
        <div className="absolute inset-0">
          <Image
            src="/images/placeholders/about-hero.jpg"
            alt="About TalentHub"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About TalentHub
          </h1>
          <p className="text-xl text-sky-100 max-w-3xl mx-auto">
            Connecting Ethiopian talent with opportunities, and helping businesses find their perfect match.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At TalentHub, we're dedicated to transforming the Ethiopian job market by creating meaningful connections between talented professionals and forward-thinking companies.
              </p>
              <p className="text-lg text-gray-600">
                We believe in the power of technology to bridge gaps and create opportunities for growth, both for individuals and organizations.
              </p>
            </div>
            <div className="relative h-96">
              <Image
                src="/images/placeholders/mission.jpg"
                alt="Our Mission"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "We continuously evolve our platform to meet the changing needs of the job market.",
                icon: "💡"
              },
              {
                title: "Integrity",
                description: "We maintain the highest standards of honesty and transparency in all our operations.",
                icon: "🤝"
              },
              {
                title: "Impact",
                description: "We measure our success by the positive impact we create in people's lives and businesses.",
                icon: "✨"
              }
            ].map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: "Alemayehu Bekele",
                role: "CEO & Founder",
                image: "/images/placeholders/team-1.jpg"
              },
              {
                name: "Sara Mohammed",
                role: "Head of Product",
                image: "/images/placeholders/team-2.jpg"
              },
              {
                name: "Yonas Tadesse",
                role: "Technical Lead",
                image: "/images/placeholders/team-3.jpg"
              },
              {
                name: "Meron Abebe",
                role: "Head of Operations",
                image: "/images/placeholders/team-4.jpg"
              }
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sky-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Us in Our Mission</h2>
          <p className="text-xl text-sky-100 mb-8 max-w-3xl mx-auto">
            Whether you're looking for your next career move or searching for top talent, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-sky-600 px-8 py-4 rounded-lg hover:bg-sky-50 transition-colors font-medium shadow-lg"
            >
              Create Account
            </Link>
            <Link
              href="/contact"
              className="bg-sky-700 text-white px-8 py-4 rounded-lg hover:bg-sky-800 transition-colors font-medium shadow-lg border-2 border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 