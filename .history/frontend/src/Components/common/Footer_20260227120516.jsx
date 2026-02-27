
import {
  IconHome,
  IconTerminal2,
  IconBrandGithub,
} from "@tabler/icons-react";

function Footer() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="w-6 h-6 text-black" />,
      href: "#",
    },
    {
      title: "Products",
      icon: <IconTerminal2 className="w-6 h-6 text-black" />,
      href: "#",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="w-6 h-6 text-black" />,
      href: "#",
    },
  ];

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
      <h1>My App</h1>
      <FloatingDock items={links} />
    </div>
  );
}

export default Footer;