import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#E41E26] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-xl">3rd Battalion 1st Marines - Balls Of The Corps</h1>
        <ul className="flex space-x-4">
          <li><Link className="hover:underline" to="/">Home</Link></li>
          <li><Link className="hover:underline" to="/reunion">Reunions</Link></li>
          <li><Link className="hover:underline" to="/gallery">Gallery</Link></li>
          <li><Link className="hover:underline" to="/fallen">Fallen</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
