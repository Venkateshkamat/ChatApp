import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  // Update these with your actual links
  const githubUrl = "https://github.com/Venkateshkamat/ChatApp";
  const linkedinUrl = "https://www.linkedin.com/in/venkateshkamat/";
  const email = "mailto:venkatesh.kamat07@gmail.com"; 

  return (
    <footer className="bg-base-100 border-t border-base-300 mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright/App Name */}
          <div className="text-sm text-base-content/60">
            <p>© {new Date().getFullYear()} ChatApp. All rights reserved.</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href={email}
              className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;