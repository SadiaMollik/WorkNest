import {
  Github,
  Linkedin,
  Target,
  Eye,
  User,
  Briefcase,
  Building2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

const developers = [
  {
    name: "Mahmudul Islam Sohan",
    role: "Lead Developer",
    bio: "Led the full-stack development of WorkNest, including authentication, backend architecture, and dashboard layouts. Built admin and employee management features with secure role-based access.",
    github: "https://github.com/hey-its-Sohan",
    linkedin: "https://www.linkedin.com/in/mahmudul-islam-sohan/",
    image: "",
  },
  {
    name: "Izaz Alam",
    role: "UI/UX & Data Visualization",
    bio: "Designed core schemas and implemented workspace analytics with charts and maps. Integrated weather data, booking insights, and real-time usage visualizations.",
    github: "http://github.com/izazalamz",
    linkedin: "https://www.linkedin.com/in/izazalam/",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Saadat S. Rahman",
    role: "Backend & Notification Engineer",
    bio: "Implemented booking notifications, attendance tracking, and in-office status logic. Built alert systems, visitor approvals, and automated email workflows.",
    github: "http://github.com/noxustic",
    linkedin: "https://www.linkedin.com/in/saadat-s-rahman-7634a1277/",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Sadia Hakim Mollik",
    role: "Product & Booking Systems Engineer",
    bio: "Developed desk and meeting room booking flows with real-time availability. Integrated Google Calendar syncing and automated release of unused resources.",
    github: "https://github.com/SadiaMollik",
    linkedin: "https://www.linkedin.com/in/sadia-hakim-mollik-2a197033a/",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

const About = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative fix-alignment space-y-16">
        {/* Header */}
        <header className="mb-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            About WorkNest
          </p>
          <h1 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
            Redefining Hybrid Workspace Management
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-muted-foreground text-lg">
            WorkNest is a modern workspace management platform designed to help
            teams efficiently manage desks, meeting rooms, and office resources
            in a hybrid work environment.
          </p>
        </header>

        {/* About WorkNest */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              What is WorkNest?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              WorkNest helps organizations manage desks, meeting rooms, and
              employee bookings in one centralized system. It is built for
              modern teams who value flexibility, efficiency, and clarity in
              their daily operations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From booking desks to managing workspaces and user roles, WorkNest
              provides a seamless experience for both employees and
              administrators.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Briefcase className="text-primary w-5 h-5" />
                <span className="text-foreground">
                  Desk & meeting room management
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Briefcase className="text-primary w-5 h-5" />
                <span className="text-foreground">
                  Role-based dashboards (Admin & Employee)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Briefcase className="text-primary w-5 h-5" />
                <span className="text-foreground">
                  Smart booking & availability tracking
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mission & Vision */}
        <section>
          <div className="grid gap-8 md:grid-cols-2 mb-24">
            {/* Mission */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Our Mission
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to simplify workspace management by providing
                intuitive tools that improve productivity, reduce operational
                costs, and enhance the employee experience in hybrid workplaces.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-7 h-7 text-secondary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Our Vision
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We envision a future where offices are smarter, more flexible,
                and data-driven — empowering organizations to adapt seamlessly
                to the evolving world of work.
              </p>
            </div>
          </div>
        </section>

        {/* Developers */}
        <section className="py-10">
          <div className="fix-alignment">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Meet Our <span className="text-primary">Team</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                The passionate people building the future of work
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {developers.map((dev, index) => (
                <div key={index} className="group">
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                      {/* <img
                        src={dev.image}
                        alt={dev.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      /> */}
                      <User className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {dev.name}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                        {dev.role}
                      </div>
                      <p className="text-muted-foreground text-sm">{dev.bio}</p>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-4">
                      <a
                        href={dev.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-blue-600 hover:text-white transition-colors duration-300"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10">
          <div className="fix-alignment">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-8">
                  <Building2 className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Ready to Transform Your Workspace?
                </h2>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Join thousands of companies that have already revolutionized
                  their hybrid work environment with WorkNest. Let's build the
                  future of work together.
                </p>

                <Link to={"/signup"}>
                  <button className="btn btn-primary border-none btn-lg rounded-full px-8 group">
                    Join Now
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;
